#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat >&2 <<'USAGE'
Usage: scripts/codex-issue.sh <issue-number> [repo]
Example: scripts/codex-issue.sh 7 zhukoff-av/Playwright

Environment:
  CODEX_BIN=/path/to/codex
  CODEX_ISSUE_REPO=owner/repo
  CODEX_ISSUE_MAX_ATTEMPTS=3
  CODEX_ISSUE_VALIDATE_CMD='npm run plan-coverage && pnpm exec playwright test'
  CODEX_ISSUE_AUTO_CLOSE=false   # push and check CI, then leave issue open with a status comment
  CODEX_ISSUE_DRY_RUN=true       # create trace/memory and stop before Codex, git, or GitHub mutation
USAGE
}

if [[ "${1:-}" == "--" ]]; then
  shift
fi

if [[ $# -lt 1 || $# -gt 2 ]]; then
  usage
  exit 2
fi

issue_number="$1"
repo="${2:-${CODEX_ISSUE_REPO:-}}"
workdir="$(git rev-parse --show-toplevel 2>/dev/null || true)"
max_attempts="${CODEX_ISSUE_MAX_ATTEMPTS:-3}"
auto_close="${CODEX_ISSUE_AUTO_CLOSE:-true}"
dry_run="${CODEX_ISSUE_DRY_RUN:-false}"
ci_poll_interval="${CODEX_ISSUE_CI_POLL_INTERVAL_SECONDS:-15}"
ci_timeout_seconds="${CODEX_ISSUE_CI_TIMEOUT_SECONDS:-1800}"

if [[ ! "$issue_number" =~ ^[0-9]+$ ]]; then
  echo "Issue number must be numeric: $issue_number" >&2
  exit 2
fi

if [[ ! "$max_attempts" =~ ^[0-9]+$ || "$max_attempts" -lt 1 ]]; then
  echo "CODEX_ISSUE_MAX_ATTEMPTS must be a positive integer." >&2
  exit 2
fi

if [[ -z "$workdir" ]]; then
  echo "This script must be run from inside a git repository." >&2
  exit 1
fi

cd "$workdir"

if [[ -z "$repo" ]]; then
  remote_url="$(git remote get-url origin 2>/dev/null || true)"
  repo="$(printf '%s' "$remote_url" \
    | sed -E 's#^git@github.com:([^/]+/[^.]+)(\.git)?$#\1#; s#^https://github.com/([^/]+/[^.]+)(\.git)?$#\1#')"
fi

if [[ -z "$repo" || "$repo" == http* || "$repo" == git@* ]]; then
  echo "Could not detect GitHub repo. Pass it explicitly, for example: $0 $issue_number zhukoff-av/Playwright" >&2
  exit 1
fi

run_dir="${TMPDIR:-/tmp}/codex-issue-${issue_number}-$(date +%Y%m%d-%H%M%S)"
memory_file="$run_dir/memory.md"
issue_file="$run_dir/issue.md"
mkdir -p "$run_dir"

append_memory() {
  {
    printf '\n## %s\n\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    printf '%s\n' "$*"
  } >> "$memory_file"
}

run_step() {
  local label="$1"
  local command="$2"
  local log_file="$3"

  append_memory "Eval command: \`$command\`"$'\n'"Trace: \`$log_file\`"
  echo "Running $label: $command"

  set +e
  bash -lc "$command" > "$log_file" 2>&1
  local exit_code=$?
  set -e

  append_memory "Eval result: exit code \`$exit_code\` for \`$command\`"
  return "$exit_code"
}

run_local_evals() {
  local attempt="$1"
  local eval_dir="$run_dir/attempt-${attempt}-evals"
  mkdir -p "$eval_dir"

  if [[ -n "${CODEX_ISSUE_VALIDATE_CMD:-}" ]]; then
    run_step "custom validation" "$CODEX_ISSUE_VALIDATE_CMD" "$eval_dir/custom-validation.log"
    return $?
  fi

  run_step "plan coverage" "npm run plan-coverage" "$eval_dir/plan-coverage.log" || return $?
  run_step "Playwright validation" "pnpm exec playwright test" "$eval_dir/playwright-test.log" || return $?
}

find_codex() {
  if [[ -n "${CODEX_BIN:-}" ]]; then
    printf '%s\n' "$CODEX_BIN"
  elif command -v codex >/dev/null 2>&1; then
    command -v codex
  elif [[ -x "/Applications/Codex.app/Contents/Resources/codex" ]]; then
    printf '%s\n' "/Applications/Codex.app/Contents/Resources/codex"
  else
    return 1
  fi
}

current_branch() {
  git branch --show-current
}

push_current_branch() {
  local branch="$1"
  local push_log="$2"
  local upstream

  upstream="$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"

  if [[ -n "$upstream" ]]; then
    git push > "$push_log" 2>&1
  else
    git push -u origin "$branch" > "$push_log" 2>&1
  fi
}

wait_for_ci() {
  local commit_sha="$1"
  local attempt="$2"
  local ci_log="$run_dir/attempt-${attempt}-ci.log"
  local started_at
  local run_ids

  started_at="$(date +%s)"
  append_memory "CI check started for commit \`$commit_sha\`. Trace: \`$ci_log\`"
  echo "Waiting for GitHub Actions runs for commit $commit_sha..."

  while true; do
    set +e
    run_ids="$(gh run list \
      --repo "$repo" \
      --commit "$commit_sha" \
      --limit 20 \
      --json databaseId \
      --jq '.[].databaseId' 2>> "$ci_log")"
    local list_exit=$?
    set -e

    if [[ "$list_exit" -ne 0 ]]; then
      append_memory "CI discovery failed for commit \`$commit_sha\`. See \`$ci_log\`."
      return 1
    fi

    if [[ -n "$run_ids" ]]; then
      break
    fi

    if (( $(date +%s) - started_at >= ci_timeout_seconds )); then
      append_memory "CI discovery timed out for commit \`$commit_sha\` after ${ci_timeout_seconds}s."
      echo "No GitHub Actions run appeared for commit $commit_sha within ${ci_timeout_seconds}s." >&2
      return 1
    fi

    sleep "$ci_poll_interval"
  done

  local failed=0
  local ci_urls=()
  local run_id

  for run_id in $run_ids; do
    echo "Watching GitHub Actions run $run_id..."
    if ! gh run watch "$run_id" --repo "$repo" --exit-status --interval "$ci_poll_interval" >> "$ci_log" 2>&1; then
      failed=1
      gh run view "$run_id" --repo "$repo" --log-failed > "$run_dir/attempt-${attempt}-ci-${run_id}-failed.log" 2>> "$ci_log" || true
    fi

    local run_url
    run_url="$(gh run view "$run_id" --repo "$repo" --json url --jq '.url' 2>> "$ci_log" || true)"
    if [[ -n "$run_url" ]]; then
      ci_urls+=("$run_url")
    fi
  done

  printf '%s\n' "${ci_urls[@]}" > "$run_dir/attempt-${attempt}-ci-urls.txt"

  if [[ "$failed" -ne 0 ]]; then
    append_memory "CI failed for commit \`$commit_sha\`. Logs: \`$ci_log\`."
    return 1
  fi

  append_memory "CI passed for commit \`$commit_sha\`."$'\n'"Runs: ${ci_urls[*]}"
  return 0
}

write_dry_run_memory() {
  cat > "$issue_file" <<EOF
# Dry run issue

- Issue: #$issue_number
- Repo: $repo
- State: dry-run

CODEX_ISSUE_DRY_RUN=true was set, so no Codex execution, git commit, git push, GitHub Actions watch, issue comment, or
issue close was performed.
EOF

  append_memory "Dry run initialized for issue #$issue_number in \`$workdir\`."
  append_memory "Loop stack: trace every run -> judge with Codex/LLM -> diagnose -> fix -> validate -> commit -> push -> check CI -> repair if needed -> close issue only when CI is green."
  append_memory "Would run local evals: \`${CODEX_ISSUE_VALIDATE_CMD:-npm run plan-coverage && pnpm exec playwright test}\`."
  append_memory "Would push branch: \`$(current_branch || true)\`."
  append_memory "Would leave the issue open until pushed CI is green."

  echo "Dry run complete. Trace directory: $run_dir"
  echo "Memory file: $memory_file"
}

if [[ "$dry_run" == "true" ]]; then
  write_dry_run_memory
  exit 0
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is not clean. Commit, stash, or discard local changes before running this script." >&2
  git status --short >&2
  exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI is required. Install gh and run: gh auth login" >&2
  exit 1
fi

codex_bin="$(find_codex || true)"
if [[ -z "$codex_bin" ]]; then
  echo "Could not find Codex CLI. Set CODEX_BIN=/path/to/codex." >&2
  exit 1
fi

if [[ -z "${2:-${CODEX_ISSUE_REPO:-}}" ]]; then
  repo="$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || printf '%s' "$repo")"
fi

echo "Fetching issue #$issue_number from $repo..."
gh issue view "$issue_number" \
  --repo "$repo" \
  --json number,title,url,state,author,body,comments \
  --template '{{printf "# %s\n\n" .title}}{{printf "- Issue: #%v\n" .number}}{{printf "- State: %s\n" .state}}{{printf "- URL: %s\n" .url}}{{printf "- Author: %s\n\n" .author.login}}{{.body}}{{"\n"}}{{range .comments}}{{printf "\n---\n\n## Comment by %s\n\n%s\n" .author.login .body}}{{end}}' \
  > "$issue_file"

append_memory "Issue #$issue_number fetched from \`$repo\`."$'\n'"Issue trace: \`$issue_file\`"
append_memory "Loop stack: trace every run -> judge with Codex/LLM -> diagnose -> fix -> validate -> commit -> push -> check CI -> repair if needed -> close issue only when CI is green."

branch="$(current_branch)"
if [[ -z "$branch" ]]; then
  echo "Cannot run issue automation from a detached HEAD." >&2
  exit 1
fi

last_commit_hash=""
last_ci_urls_file=""
successful_attempt=""

for attempt in $(seq 1 "$max_attempts"); do
  prompt_file="$run_dir/attempt-${attempt}-codex-prompt.md"
  codex_log="$run_dir/attempt-${attempt}-codex.log"

  {
    if [[ "$attempt" -eq 1 ]]; then
      echo "Implement this GitHub issue."
    else
      echo "Continue the GitHub issue repair loop for attempt $attempt of $max_attempts."
    fi
    echo
    echo "Required loop:"
    echo "1. Trace the previous run."
    echo "2. Judge the evidence with an LLM-quality review."
    echo "3. Diagnose the root cause."
    echo "4. Fix the issue with the smallest safe change."
    echo "5. Leave edits in the working tree for the wrapper harness to evaluate, commit, push, check CI, and close."
    echo
    echo "Do not create git commits, push changes, or close the GitHub issue."
    echo "Never close or report the issue complete before the wrapper has pushed the commit and verified green CI."
    echo
    echo "Run memory:"
    cat "$memory_file"
    echo
    echo "Issue:"
    cat "$issue_file"
  } > "$prompt_file"

  echo "Starting Codex attempt $attempt/$max_attempts for issue #$issue_number..."
  append_memory "Codex attempt $attempt started. Prompt: \`$prompt_file\`. Trace: \`$codex_log\`."

  set +e
  "$codex_bin" exec -C "$workdir" - < "$prompt_file" > "$codex_log" 2>&1
  codex_exit=$?
  set -e

  append_memory "Codex attempt $attempt exited with code \`$codex_exit\`."
  if [[ "$codex_exit" -ne 0 ]]; then
    if [[ "$attempt" -lt "$max_attempts" ]]; then
      append_memory "Judge: Codex attempt failed. Diagnose/fix will continue with the trace log."
      continue
    fi
    echo "Codex failed on final attempt. Leaving issue #$issue_number open. Trace: $codex_log" >&2
    exit 1
  fi

  if [[ -z "$(git status --porcelain)" ]]; then
    append_memory "Judge: no repository changes after attempt $attempt."
    if [[ "$attempt" -lt "$max_attempts" ]]; then
      continue
    fi
    echo "Codex produced no repository changes. Leaving issue #$issue_number open." >&2
    exit 1
  fi

  if ! run_local_evals "$attempt"; then
    append_memory "Judge: local evals failed on attempt $attempt. Diagnose and fix using eval traces."
    if [[ "$attempt" -lt "$max_attempts" ]]; then
      continue
    fi
    echo "Local validation failed on final attempt. Leaving issue #$issue_number open. Trace directory: $run_dir" >&2
    exit 1
  fi

  append_memory "Local evals passed on attempt $attempt. Preparing commit."
  git add -A

  if [[ -z "$(git diff --cached --name-only)" ]]; then
    append_memory "Judge: no staged changes after passing evals."
    echo "No staged changes after validation. Leaving issue #$issue_number open." >&2
    exit 1
  fi

  if [[ "$attempt" -eq 1 ]]; then
    git commit -m "fix: implement issue #$issue_number"
  else
    git commit -m "fix: repair issue #$issue_number after validation"
  fi

  last_commit_hash="$(git rev-parse --short HEAD)"
  full_commit_hash="$(git rev-parse HEAD)"
  append_memory "Committed \`$last_commit_hash\` on branch \`$branch\`."

  push_log="$run_dir/attempt-${attempt}-push.log"
  if ! push_current_branch "$branch" "$push_log"; then
    append_memory "Push failed for commit \`$last_commit_hash\`. Trace: \`$push_log\`."
    echo "Push failed. Leaving issue #$issue_number open. Trace: $push_log" >&2
    exit 1
  fi

  append_memory "Pushed commit \`$last_commit_hash\` on branch \`$branch\`. Trace: \`$push_log\`."

  if wait_for_ci "$full_commit_hash" "$attempt"; then
    last_ci_urls_file="$run_dir/attempt-${attempt}-ci-urls.txt"
    successful_attempt="$attempt"
    echo "CI passed for pushed commit $last_commit_hash."
    break
  fi

  append_memory "Judge: CI failed for pushed commit \`$last_commit_hash\`. Diagnose/fix will continue if attempts remain."
  if [[ "$attempt" -eq "$max_attempts" ]]; then
    echo "CI failed on final attempt. Leaving issue #$issue_number open. Trace directory: $run_dir" >&2
    exit 1
  fi
done

if [[ -z "$last_commit_hash" || -z "$last_ci_urls_file" || ! -s "$last_ci_urls_file" ]]; then
  echo "No verified pushed commit was produced. Leaving issue #$issue_number open." >&2
  exit 1
fi

ci_summary="$(tr '\n' ' ' < "$last_ci_urls_file" | sed 's/[[:space:]]*$//')"
status_comment="Implemented by local Codex issue loop.

- Commit: \`$last_commit_hash\`
- Branch: \`$branch\`
- CI: $ci_summary
- Attempts: $successful_attempt of $max_attempts, completed with green CI
- Local eval traces: \`$run_dir\`

The issue was not considered complete until the fix was committed, pushed, and GitHub Actions passed for the pushed commit."

if [[ "$auto_close" == "false" ]]; then
  echo "CI passed for $last_commit_hash. Leaving issue #$issue_number open because CODEX_ISSUE_AUTO_CLOSE=false."
  gh issue comment "$issue_number" --repo "$repo" --body "$status_comment"
  exit 0
fi

echo "Closing issue #$issue_number after pushed commit $last_commit_hash passed CI..."
gh issue close "$issue_number" \
  --repo "$repo" \
  --reason completed \
  --comment "$status_comment"
