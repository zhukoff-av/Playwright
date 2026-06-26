#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 <issue-number> [repo]" >&2
  echo "Example: $0 7 zhukoff-av/Playwright" >&2
  echo "Set CODEX_ISSUE_AUTO_CLOSE=false to leave the issue open after a successful run." >&2
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

if [[ ! "$issue_number" =~ ^[0-9]+$ ]]; then
  echo "Issue number must be numeric: $issue_number" >&2
  exit 2
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI is required. Install gh and run: gh auth login" >&2
  exit 1
fi

if [[ -z "$repo" ]]; then
  repo="$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || true)"
fi

if [[ -z "$repo" ]]; then
  remote_url="$(git remote get-url origin 2>/dev/null || true)"
  repo="$(printf '%s' "$remote_url" \
    | sed -E 's#^git@github.com:([^/]+/[^.]+)(\.git)?$#\1#; s#^https://github.com/([^/]+/[^.]+)(\.git)?$#\1#')"
fi

if [[ -z "$repo" || "$repo" == http* || "$repo" == git@* ]]; then
  echo "Could not detect GitHub repo. Pass it explicitly, for example: $0 $issue_number zhukoff-av/Playwright" >&2
  exit 1
fi

codex_bin="${CODEX_BIN:-}"
if [[ -z "$codex_bin" ]]; then
  if command -v codex >/dev/null 2>&1; then
    codex_bin="$(command -v codex)"
  elif [[ -x "/Applications/Codex.app/Contents/Resources/codex" ]]; then
    codex_bin="/Applications/Codex.app/Contents/Resources/codex"
  else
    echo "Could not find Codex CLI. Set CODEX_BIN=/path/to/codex." >&2
    exit 1
  fi
fi

workdir="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
issue_file="${TMPDIR:-/tmp}/codex-issue-${issue_number}.md"

echo "Fetching issue #$issue_number from $repo..."
gh issue view "$issue_number" \
  --repo "$repo" \
  --json number,title,url,state,author,body,comments \
  --template '{{printf "# %s\n\n" .title}}{{printf "- Issue: #%v\n" .number}}{{printf "- State: %s\n" .state}}{{printf "- URL: %s\n" .url}}{{printf "- Author: %s\n\n" .author.login}}{{.body}}{{"\n"}}{{range .comments}}{{printf "\n---\n\n## Comment by %s\n\n%s\n" .author.login .body}}{{end}}' \
  > "$issue_file"

echo "Starting Codex for issue #$issue_number in $workdir..."
{
  echo "Implement this GitHub issue."
  echo
  cat "$issue_file"
} | "$codex_bin" exec -C "$workdir" -

if [[ "${CODEX_ISSUE_AUTO_CLOSE:-true}" == "false" ]]; then
  echo "Codex completed successfully. Leaving issue #$issue_number open because CODEX_ISSUE_AUTO_CLOSE=false."
  exit 0
fi

echo "Codex completed successfully. Closing issue #$issue_number..."
gh issue close "$issue_number" \
  --repo "$repo" \
  --reason completed \
  --comment "Implemented by local Codex agent run from \`$workdir\`."
