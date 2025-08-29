import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
}

interface TestReport {
  id: string;
  timestamp: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  coverage?: {
    lines: number;
    functions: number;
    branches: number;
    statements: number;
  };
  suites: TestSuite[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, results } = await req.json();
    
    let report: TestReport;
    
    if (results) {
      // If test results are provided, use them
      console.log('Processing provided test results...');
      report = convertVitestResults(results, results.coverage, Date.now());
    } else {
      // Generate a mock report that indicates tests need to be run locally
      console.log(`Generating instructions for ${type} test run...`);
      report = generateInstructionReport(type);
    }
    
    return new Response(
      JSON.stringify(report),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error processing tests:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process tests' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});

function generateInstructionReport(type: string): TestReport {
  const commands = {
    unit: 'npm run test',
    integration: 'npm run test:integration', 
    coverage: 'npm run test:coverage',
    all: 'npm run test'
  };

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    totalTests: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration: 0,
    coverage: null,
    suites: [{
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Test Instructions`,
      tests: [{
        id: crypto.randomUUID(),
        name: `Run ${type} tests locally`,
        status: 'skipped',
        duration: 0,
        error: `To run ${type} tests, execute: ${commands[type as keyof typeof commands] || commands.all}\n\nThen upload the results using the API or run tests locally to see actual results.`
      }],
      passed: 0,
      failed: 0,
      skipped: 1,
      duration: 0
    }]
  };
}

function convertVitestResults(vitestResults: any, coverage: any, startTime: number): TestReport {
  const endTime = Date.now();
  const duration = endTime - startTime;

  const suites: TestSuite[] = [];
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  // Parse Vitest test files/suites
  if (vitestResults.testResults) {
    vitestResults.testResults.forEach((fileResult: any) => {
      const tests: TestResult[] = [];

      if (fileResult.assertionResults) {
        fileResult.assertionResults.forEach((test: any) => {
          tests.push({
            id: crypto.randomUUID(),
            name: test.title || test.fullName || 'Unnamed test',
            status: test.status === 'passed' ? 'passed' : 
                   test.status === 'failed' ? 'failed' : 'skipped',
            duration: test.duration || 0,
            error: test.failureMessages?.join('\n') || undefined
          });
        });
      }

      const suitePassed = tests.filter(t => t.status === 'passed').length;
      const suiteFailed = tests.filter(t => t.status === 'failed').length;
      const suiteSkipped = tests.filter(t => t.status === 'skipped').length;
      const suiteDuration = tests.reduce((sum, test) => sum + test.duration, 0);

      suites.push({
        name: fileResult.name || fileResult.testFilePath?.split('/').pop() || 'Unknown Suite',
        tests,
        passed: suitePassed,
        failed: suiteFailed,
        skipped: suiteSkipped,
        duration: suiteDuration
      });

      totalTests += tests.length;
      totalPassed += suitePassed;
      totalFailed += suiteFailed;
      totalSkipped += suiteSkipped;
    });
  }

  // If no testResults, try to parse from other formats
  if (suites.length === 0 && vitestResults.numTotalTests) {
    // Fallback parsing for different Vitest output formats
    totalTests = vitestResults.numTotalTests || 0;
    totalPassed = vitestResults.numPassedTests || 0;
    totalFailed = vitestResults.numFailedTests || 0;
    totalSkipped = vitestResults.numPendingTests || 0;
  }

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    totalTests,
    passed: totalPassed,
    failed: totalFailed,
    skipped: totalSkipped,
    duration,
    coverage,
    suites
  };
}

function createErrorReport(type: string, stdout: string, stderr: string, startTime: number): TestReport {
  const duration = Date.now() - startTime;
  
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    totalTests: 0,
    passed: 0,
    failed: 1,
    skipped: 0,
    duration,
    coverage: null,
    suites: [{
      name: 'Test Execution Error',
      tests: [{
        id: crypto.randomUUID(),
        name: `Failed to run ${type} tests`,
        status: 'failed',
        duration,
        error: `STDOUT: ${stdout}\nSTDERR: ${stderr}`
      }],
      passed: 0,
      failed: 1,
      skipped: 0,
      duration
    }]
  };
}