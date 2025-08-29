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
    const { type } = await req.json();
    console.log(`Starting ${type} test run...`);
    
    const report = await runActualTests(type);
    
    return new Response(
      JSON.stringify(report),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error running tests:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to run tests' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});

async function runActualTests(type: string): Promise<TestReport> {
  const startTime = Date.now();
  
  try {
    // Determine which command to run based on test type
    let command: string[];
    switch (type) {
      case 'unit':
        command = ['npm', 'run', 'test', '--', '--run', '--reporter=json'];
        break;
      case 'integration':
        command = ['npm', 'run', 'test:integration', '--', '--run', '--reporter=json'];
        break;
      case 'coverage':
        command = ['npm', 'run', 'test:coverage', '--', '--run', '--reporter=json'];
        break;
      case 'all':
        command = ['npm', 'run', 'test', '--', '--run', '--reporter=json'];
        break;
      default:
        throw new Error(`Unknown test type: ${type}`);
    }

    console.log(`Running command: ${command.join(' ')}`);

    // Execute the test command
    const process = new Deno.Command(command[0], {
      args: command.slice(1),
      stdout: 'piped',
      stderr: 'piped',
      cwd: '/tmp' // This might need to be adjusted based on your setup
    });

    const { code, stdout, stderr } = await process.output();
    
    const stdoutText = new TextDecoder().decode(stdout);
    const stderrText = new TextDecoder().decode(stderr);
    
    console.log('Test output:', stdoutText);
    if (stderrText) console.error('Test errors:', stderrText);

    // Parse the JSON output from Vitest
    let testResults;
    try {
      // Vitest JSON output might be on multiple lines, get the last valid JSON
      const lines = stdoutText.trim().split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        try {
          testResults = JSON.parse(lines[i]);
          break;
        } catch (e) {
          continue;
        }
      }
      
      if (!testResults) {
        throw new Error('No valid JSON found in test output');
      }
    } catch (parseError) {
      console.error('Failed to parse test output:', parseError);
      // Return a fallback report with error information
      return createErrorReport(type, stdoutText, stderrText, startTime);
    }

    // Parse coverage data if available and requested
    let coverage;
    if (type === 'coverage' || type === 'all') {
      coverage = await parseCoverageReport();
    }

    // Convert Vitest results to our format
    return convertVitestResults(testResults, coverage, startTime);

  } catch (error) {
    console.error('Test execution failed:', error);
    return createErrorReport(type, '', error.message, startTime);
  }
}

async function parseCoverageReport() {
  try {
    // Try to read coverage summary from the coverage directory
    const coveragePath = '/tmp/coverage/coverage-summary.json';
    let coverageData;
    
    try {
      const coverageText = await Deno.readTextFile(coveragePath);
      coverageData = JSON.parse(coverageText);
    } catch {
      // If coverage file doesn't exist, return null
      return null;
    }

    // Extract total coverage percentages
    const total = coverageData.total;
    return {
      lines: total?.lines?.pct || 0,
      functions: total?.functions?.pct || 0,
      branches: total?.branches?.pct || 0,
      statements: total?.statements?.pct || 0,
    };
  } catch (error) {
    console.error('Failed to parse coverage report:', error);
    return null;
  }
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