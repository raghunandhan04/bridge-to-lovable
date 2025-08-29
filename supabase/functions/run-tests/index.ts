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
    
    // In a real implementation, you would run the actual tests here
    // For now, we'll simulate test results
    const report = await simulateTestRun(type);
    
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
      JSON.stringify({ error: 'Failed to run tests' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});

async function simulateTestRun(type: string): Promise<TestReport> {
  // Simulate test execution time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const suites: TestSuite[] = [];
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let totalSkipped = 0;
  let totalDuration = 0;

  // Simulate different test suites based on type
  if (type === 'unit' || type === 'all') {
    const unitSuite = createMockSuite('Unit Tests', [
      { name: 'formatDate utility', status: 'passed', duration: 12 },
      { name: 'dateUtils functions', status: 'passed', duration: 8 },
      { name: 'button component', status: 'passed', duration: 15 },
      { name: 'form validation', status: 'failed', duration: 23, error: 'Expected validation to fail but it passed' },
      { name: 'api helpers', status: 'passed', duration: 18 },
    ]);
    suites.push(unitSuite);
    
    totalTests += unitSuite.tests.length;
    totalPassed += unitSuite.passed;
    totalFailed += unitSuite.failed;
    totalSkipped += unitSuite.skipped;
    totalDuration += unitSuite.duration;
  }

  if (type === 'integration' || type === 'all') {
    const integrationSuite = createMockSuite('Integration Tests', [
      { name: 'Blog page renders correctly', status: 'passed', duration: 145 },
      { name: 'Admin dashboard authentication', status: 'passed', duration: 98 },
      { name: 'Blog creation workflow', status: 'passed', duration: 234 },
      { name: 'Content management flow', status: 'skipped', duration: 0 },
      { name: 'User role management', status: 'passed', duration: 187 },
    ]);
    suites.push(integrationSuite);
    
    totalTests += integrationSuite.tests.length;
    totalPassed += integrationSuite.passed;
    totalFailed += integrationSuite.failed;
    totalSkipped += integrationSuite.skipped;
    totalDuration += integrationSuite.duration;
  }

  // Add coverage data if requested
  let coverage;
  if (type === 'coverage' || type === 'all') {
    coverage = {
      lines: Math.floor(Math.random() * 20) + 75, // 75-95%
      functions: Math.floor(Math.random() * 15) + 80, // 80-95%
      branches: Math.floor(Math.random() * 25) + 65, // 65-90%
      statements: Math.floor(Math.random() * 20) + 75, // 75-95%
    };
  }

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    totalTests,
    passed: totalPassed,
    failed: totalFailed,
    skipped: totalSkipped,
    duration: totalDuration,
    coverage,
    suites,
  };
}

function createMockSuite(name: string, testData: Array<{name: string, status: 'passed' | 'failed' | 'skipped', duration: number, error?: string}>): TestSuite {
  const tests: TestResult[] = testData.map(test => ({
    id: crypto.randomUUID(),
    name: test.name,
    status: test.status,
    duration: test.duration,
    error: test.error,
  }));

  const passed = tests.filter(t => t.status === 'passed').length;
  const failed = tests.filter(t => t.status === 'failed').length;
  const skipped = tests.filter(t => t.status === 'skipped').length;
  const duration = tests.reduce((sum, test) => sum + test.duration, 0);

  return {
    name,
    tests,
    passed,
    failed,
    skipped,
    duration,
  };
}