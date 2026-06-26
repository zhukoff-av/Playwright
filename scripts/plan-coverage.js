const fs = require('fs');
const path = require('path');

const root = process.cwd();
const specsDir = path.join(root, 'specs');
const testsDir = path.join(root, 'tests');

function walk(dir, predicate, result = []) {
  if (!fs.existsSync(dir)) {
    return result;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, predicate, result);
      continue;
    }

    if (predicate(fullPath)) {
      result.push(fullPath);
    }
  }

  return result.sort();
}

function toRelative(filePath) {
  return path.relative(root, filePath).split(path.sep).join('/');
}

function parsePlan(filePath) {
  const spec = toRelative(filePath);
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  const scenarios = [];
  let currentHeading = path.basename(filePath);
  let inCodeFence = false;

  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].startsWith('```')) {
      inCodeFence = !inCodeFence;
      continue;
    }

    if (inCodeFence) {
      continue;
    }

    const heading = lines[index].match(/^#{2,6}\s+(.+)$/);
    if (heading) {
      currentHeading = heading[1].trim();
    }

    const idMatch = lines[index].match(/\*\*Plan ID:\*\*\s*`([^`]+)`/);
    if (!idMatch) {
      continue;
    }

    let automation = 'Missing Automation line';
    for (let next = index + 1; next < Math.min(index + 8, lines.length); next += 1) {
      const automationMatch = lines[next].match(/\*\*Automation:\*\*\s*(.+)$/);
      if (automationMatch) {
        automation = automationMatch[1].trim();
        break;
      }
    }

    scenarios.push({
      id: idMatch[1],
      spec,
      title: currentHeading,
      automation,
    });
  }

  return scenarios;
}

function parseTest(filePath) {
  const file = toRelative(filePath);
  const text = fs.readFileSync(filePath, 'utf8');
  const specMatches = [...text.matchAll(/^\/\/ spec:\s*(.+)$/gm)].map((match) => match[1].trim());
  const planIds = [...text.matchAll(/^\/\/ plan-id:\s*(.+)$/gm)].map((match) => match[1].trim());

  return {
    file,
    specs: specMatches,
    planIds,
  };
}

const planScenarios = walk(specsDir, (file) => file.endsWith('.md')).flatMap(parsePlan);
const tests = walk(testsDir, (file) => file.endsWith('.spec.ts')).map(parseTest);

const scenariosById = new Map();
const duplicatePlanIds = [];
for (const scenario of planScenarios) {
  if (scenariosById.has(scenario.id)) {
    duplicatePlanIds.push(scenario.id);
  }
  scenariosById.set(scenario.id, scenario);
}

const testsByPlanId = new Map();
const testsWithoutPlanId = [];
for (const test of tests) {
  if (test.planIds.length === 0) {
    testsWithoutPlanId.push(test.file);
    continue;
  }

  for (const planId of test.planIds) {
    const files = testsByPlanId.get(planId) ?? [];
    files.push(test.file);
    testsByPlanId.set(planId, files);
  }
}

const automated = [];
const notAutomated = [];
const mismatches = [];
const orphanTests = [];

for (const scenario of planScenarios) {
  const linkedFiles = testsByPlanId.get(scenario.id) ?? [];
  const automationFileMatch = scenario.automation.match(/`([^`]+\.spec\.ts)`/);
  const automationFile = automationFileMatch?.[1];

  if (scenario.automation === 'Not automated') {
    if (linkedFiles.length > 0) {
      mismatches.push(`${scenario.id}: plan says Not automated, but test metadata exists in ${linkedFiles.join(', ')}`);
    }
    notAutomated.push(scenario);
    continue;
  }

  if (!automationFile) {
    mismatches.push(`${scenario.id}: ${scenario.automation}`);
    notAutomated.push(scenario);
    continue;
  }

  if (!linkedFiles.includes(automationFile)) {
    mismatches.push(
      `${scenario.id}: plan links ${automationFile}, but test metadata points to ${linkedFiles.join(', ') || 'nothing'}`,
    );
  }

  automated.push({ ...scenario, file: automationFile });
}

for (const [planId, files] of testsByPlanId) {
  if (!scenariosById.has(planId)) {
    orphanTests.push(`${planId}: ${files.join(', ')}`);
  }
}

const coveredPercent = planScenarios.length === 0 ? 0 : Math.round((automated.length / planScenarios.length) * 100);

console.log(`Plan scenarios: ${planScenarios.length}`);
console.log(`Automated: ${automated.length}`);
console.log(`Not automated: ${notAutomated.length}`);
console.log(`Coverage: ${coveredPercent}%`);

if (automated.length > 0) {
  console.log('\nAutomated scenarios:');
  for (const scenario of automated) {
    console.log(`- ${scenario.id} | ${scenario.title} | ${scenario.file}`);
  }
}

if (notAutomated.length > 0) {
  console.log('\nNot automated scenarios:');
  for (const scenario of notAutomated) {
    console.log(`- ${scenario.id} | ${scenario.title} | ${scenario.spec}`);
  }
}

if (testsWithoutPlanId.length > 0) {
  console.log('\nTests without plan-id metadata:');
  for (const file of testsWithoutPlanId) {
    console.log(`- ${file}`);
  }
}

if (duplicatePlanIds.length > 0) {
  console.log('\nDuplicate Plan IDs:');
  for (const id of duplicatePlanIds) {
    console.log(`- ${id}`);
  }
}

if (orphanTests.length > 0) {
  console.log('\nTests referencing missing Plan IDs:');
  for (const item of orphanTests) {
    console.log(`- ${item}`);
  }
}

if (mismatches.length > 0) {
  console.log('\nPlan/test link mismatches:');
  for (const mismatch of mismatches) {
    console.log(`- ${mismatch}`);
  }
}

if (duplicatePlanIds.length > 0 || orphanTests.length > 0 || mismatches.length > 0) {
  process.exitCode = 1;
}
