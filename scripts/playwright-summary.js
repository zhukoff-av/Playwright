#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const mode = args[0] || "topic";

function getArg(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1 || index === args.length - 1) return fallback;
  return args[index + 1];
}

function stripAnsi(value) {
  return String(value || "").replace(/\u001b\[[0-9;]*m/g, "");
}

function oneLine(value, maxLength = 220) {
  const text = stripAnsi(value).replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}...`;
}

function escapeCell(value) {
  return String(value ?? "")
    .replace(/\r?\n/g, "<br>")
    .replace(/\|/g, "\\|");
}

function readReport(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function walkSuites(suites, inheritedFile = "", inheritedTitles = [], specs = []) {
  for (const suite of suites || []) {
    const file = suite.file || inheritedFile;
    const title = suite.title && suite.title !== path.basename(file) ? suite.title : "";
    const titles = title ? [...inheritedTitles, title] : inheritedTitles;

    for (const spec of suite.specs || []) {
      specs.push({
        file,
        titlePath: [...titles, spec.title].filter(Boolean),
        spec,
      });
    }

    walkSuites(suite.suites || [], file, titles, specs);
  }

  return specs;
}

function summarizeReport(report, topic) {
  const stats = report.stats || {};
  const failedTests = [];

  for (const item of walkSuites(report.suites || [])) {
    const tests = item.spec.tests || [];
    const failedRuns = tests.flatMap((test) =>
      (test.results || [])
        .filter((result) => ["failed", "timedOut", "interrupted"].includes(result.status))
        .map((result) => ({ test, result })),
    );

    if (item.spec.ok || failedRuns.length === 0) continue;

    const lastFailure = failedRuns[failedRuns.length - 1];
    const location = item.spec.location || lastFailure.test.location || {};
    const retries = Math.max(0, (lastFailure.test.results || []).length - 1);

    failedTests.push({
      project: lastFailure.test.projectName || lastFailure.test.projectId || "",
      file: item.file || location.file || "",
      line: location.line || "",
      title: item.titlePath.join(" > "),
      retries,
      error: oneLine(lastFailure.result.error?.message || lastFailure.result.error?.stack || "No error message"),
    });
  }

  const passed = Number(stats.expected || 0);
  const failed = Number(stats.unexpected || 0);
  const flaky = Number(stats.flaky || 0);
  const skipped = Number(stats.skipped || 0);

  return {
    topic,
    total: passed + failed + flaky + skipped,
    passed,
    failed,
    flaky,
    skipped,
    durationMs: Number(stats.duration || 0),
    failedTests,
  };
}

function renderTopic(summary, htmlArtifactName) {
  const status = summary.failed > 0 ? "Failed" : "Passed";
  const lines = [
    `## Playwright: ${summary.topic}`,
    "",
    `**Status:** ${status}`,
    "",
    "| Total | Passed | Failed | Flaky | Skipped | Duration |",
    "| ---: | ---: | ---: | ---: | ---: | ---: |",
    `| ${summary.total} | ${summary.passed} | ${summary.failed} | ${summary.flaky} | ${summary.skipped} | ${(summary.durationMs / 1000).toFixed(1)}s |`,
    "",
  ];

  if (summary.failedTests.length) {
    lines.push("### Failed Tests", "");
    lines.push("| Project | Location | Test | Retries | Error |");
    lines.push("| --- | --- | --- | ---: | --- |");
    for (const test of summary.failedTests) {
      const location = test.line ? `${test.file}:${test.line}` : test.file;
      lines.push(
        `| ${escapeCell(test.project)} | ${escapeCell(location)} | ${escapeCell(test.title)} | ${test.retries} | ${escapeCell(test.error)} |`,
      );
    }
    lines.push("");
  } else {
    lines.push("No failed tests in this topic.", "");
  }

  lines.push(`HTML report artifact: \`${htmlArtifactName}\``);
  lines.push("");
  return lines.join("\n");
}

function renderAggregate(summaries) {
  const failedTopics = summaries.filter((summary) => summary.failed > 0);
  const totals = summaries.reduce(
    (acc, summary) => {
      acc.total += summary.total;
      acc.passed += summary.passed;
      acc.failed += summary.failed;
      acc.flaky += summary.flaky;
      acc.skipped += summary.skipped;
      acc.durationMs += summary.durationMs;
      return acc;
    },
    { total: 0, passed: 0, failed: 0, flaky: 0, skipped: 0, durationMs: 0 },
  );

  const lines = [
    "## Playwright Test Summary",
    "",
    failedTopics.length ? `**Failed topics:** ${failedTopics.map((summary) => summary.topic).join(", ")}` : "**All topics passed.**",
    "",
    "| Topic | Status | Total | Passed | Failed | Flaky | Skipped | Duration | HTML Report Artifact |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |",
  ];

  for (const summary of summaries) {
    const status = summary.failed > 0 ? "Failed" : "Passed";
    lines.push(
      `| ${escapeCell(summary.topic)} | ${status} | ${summary.total} | ${summary.passed} | ${summary.failed} | ${summary.flaky} | ${summary.skipped} | ${(summary.durationMs / 1000).toFixed(1)}s | \`playwright-html-report-${escapeCell(summary.topic)}\` |`,
    );
  }

  lines.push(
    `| **Total** | ${totals.failed > 0 ? "Failed" : "Passed"} | **${totals.total}** | **${totals.passed}** | **${totals.failed}** | **${totals.flaky}** | **${totals.skipped}** | **${(totals.durationMs / 1000).toFixed(1)}s** | |`,
  );

  if (failedTopics.length) {
    lines.push("", "### Failed Tests", "");
    lines.push("| Topic | Project | Location | Test | Error |");
    lines.push("| --- | --- | --- | --- | --- |");
    for (const summary of failedTopics) {
      for (const test of summary.failedTests) {
        const location = test.line ? `${test.file}:${test.line}` : test.file;
        lines.push(
          `| ${escapeCell(summary.topic)} | ${escapeCell(test.project)} | ${escapeCell(location)} | ${escapeCell(test.title)} | ${escapeCell(test.error)} |`,
        );
      }
    }
  }

  lines.push("");
  return lines.join("\n");
}

function appendSummary(markdown) {
  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryFile) {
    process.stdout.write(markdown);
    return;
  }

  fs.appendFileSync(summaryFile, markdown);
}

if (mode === "topic") {
  const topic = getArg("--topic", process.env.PW_REPORT_TOPIC || "unknown");
  const reportFile = getArg("--report", `test-results/reports/${topic}.json`);
  const htmlArtifactName = getArg("--html-artifact", `playwright-html-report-${topic}`);

  if (!fs.existsSync(reportFile)) {
    appendSummary(`## Playwright: ${topic}\n\nNo JSON report found at \`${reportFile}\`.\n\n`);
    process.exit(0);
  }

  appendSummary(renderTopic(summarizeReport(readReport(reportFile), topic), htmlArtifactName));
} else if (mode === "aggregate") {
  const reportsDir = getArg("--reports-dir", "test-results/reports");

  if (!fs.existsSync(reportsDir)) {
    appendSummary(`## Playwright Test Summary\n\nNo JSON reports found at \`${reportsDir}\`.\n\n`);
    process.exit(0);
  }

  const summaries = fs
    .readdirSync(reportsDir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => {
      const topic = path.basename(file, ".json");
      return summarizeReport(readReport(path.join(reportsDir, file)), topic);
    });

  appendSummary(summaries.length ? renderAggregate(summaries) : `## Playwright Test Summary\n\nNo JSON reports found at \`${reportsDir}\`.\n\n`);
} else {
  console.error(`Unknown mode: ${mode}`);
  process.exit(1);
}
