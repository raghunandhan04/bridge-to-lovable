import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Play, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BarChart3,
  Download,
  RefreshCw,
  TestTube
} from 'lucide-react';

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

interface TestManagerProps {
  userRole: string;
}

const TestManager: React.FC<TestManagerProps> = ({ userRole }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentReport, setCurrentReport] = useState<TestReport | null>(null);
  const [recentReports, setRecentReports] = useState<TestReport[]>([]);
  const { toast } = useToast();

  const runTests = async (type: 'unit' | 'integration' | 'coverage' | 'all') => {
    if (userRole !== 'admin') {
      toast({
        title: "Access Denied",
        description: "Only admins can run tests.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    try {
      toast({
        title: "Getting Instructions",
        description: `Generating setup instructions for ${type} tests...`,
      });

      const { data, error } = await supabase.functions.invoke('run-tests', {
        body: { type }
      });

      if (error) throw error;

      const report: TestReport = data;
      setCurrentReport(report);
      setRecentReports(prev => [report, ...prev.slice(0, 9)]);

      toast({
        title: "Setup Required",
        description: "Please add the test scripts to package.json first, then run tests locally.",
        variant: "default",
      });
    } catch (error) {
      console.error('Test run error:', error);
      toast({
        title: "Error",
        description: "Failed to generate instructions. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const downloadReport = (report: TestReport) => {
    const htmlReport = generateHtmlReport(report);
    const blob = new Blob([htmlReport], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-report-${report.timestamp}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateHtmlReport = (report: TestReport): string => {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Test Report - ${report.timestamp}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .stats { display: flex; gap: 20px; margin: 20px 0; }
        .stat { background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; }
        .passed { color: #22c55e; }
        .failed { color: #ef4444; }
        .suite { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
        .test { margin: 10px 0; padding: 10px; background: #f9f9f9; }
        .error { color: #ef4444; font-family: monospace; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Test Report</h1>
        <p>Generated: ${new Date(report.timestamp).toLocaleString()}</p>
        <p>Duration: ${report.duration}ms</p>
    </div>
    
    <div class="stats">
        <div class="stat">
            <h3>Total Tests</h3>
            <p>${report.totalTests}</p>
        </div>
        <div class="stat">
            <h3 class="passed">Passed</h3>
            <p>${report.passed}</p>
        </div>
        <div class="stat">
            <h3 class="failed">Failed</h3>
            <p>${report.failed}</p>
        </div>
        <div class="stat">
            <h3>Skipped</h3>
            <p>${report.skipped}</p>
        </div>
    </div>

    ${report.coverage ? `
    <div class="suite">
        <h2>Coverage Report</h2>
        <p>Lines: ${report.coverage.lines}%</p>
        <p>Functions: ${report.coverage.functions}%</p>
        <p>Branches: ${report.coverage.branches}%</p>
        <p>Statements: ${report.coverage.statements}%</p>
    </div>
    ` : ''}

    ${report.suites.map(suite => `
    <div class="suite">
        <h2>${suite.name}</h2>
        <p>Duration: ${suite.duration}ms | Passed: ${suite.passed} | Failed: ${suite.failed} | Skipped: ${suite.skipped}</p>
        ${suite.tests.map(test => `
        <div class="test">
            <h4 class="${test.status}">${test.name} (${test.duration}ms)</h4>
            ${test.error ? `<pre class="error">${test.error}</pre>` : ''}
        </div>
        `).join('')}
    </div>
    `).join('')}
</body>
</html>
    `;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Test Setup Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your package.json is missing test scripts. Add these to the "scripts" section:
            </p>
            <div className="bg-muted p-3 rounded-lg font-mono text-sm">
              <pre>{`"test": "vitest",
"test:ui": "vitest --ui",
"test:run": "vitest run",
"test:coverage": "vitest run --coverage",
"test:integration": "vitest run --config vitest.config.integration.ts",
"test:watch": "vitest --watch"`}</pre>
            </div>
            <p className="text-sm text-muted-foreground">
              Then run tests locally using: <code className="bg-muted px-1 rounded">npm run test</code>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Test Runner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => runTests('unit')}
              disabled={isRunning}
              variant="outline"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
              Unit Tests
            </Button>
            <Button
              onClick={() => runTests('integration')}
              disabled={isRunning}
              variant="outline"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
              Integration
            </Button>
            <Button
              onClick={() => runTests('coverage')}
              disabled={isRunning}
              variant="outline"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <BarChart3 className="w-4 h-4 mr-2" />}
              Coverage
            </Button>
            <Button
              onClick={() => runTests('all')}
              disabled={isRunning}
            >
              {isRunning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
              Run All Tests
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Test Report */}
      {currentReport && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Latest Test Report
                <Badge variant={currentReport.failed > 0 ? "destructive" : "default"}>
                  {currentReport.failed > 0 ? "Failed" : "Passed"}
                </Badge>
              </CardTitle>
              <Button
                onClick={() => downloadReport(currentReport)}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{currentReport.totalTests}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{currentReport.passed}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{currentReport.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{currentReport.skipped}</div>
                <div className="text-sm text-muted-foreground">Skipped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{currentReport.duration}ms</div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
            </div>

            {currentReport.coverage && (
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Code Coverage</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>Lines: {currentReport.coverage.lines}%</div>
                  <div>Functions: {currentReport.coverage.functions}%</div>
                  <div>Branches: {currentReport.coverage.branches}%</div>
                  <div>Statements: {currentReport.coverage.statements}%</div>
                </div>
              </div>
            )}

            <Separator className="my-4" />

            <ScrollArea className="h-64">
              {currentReport.suites.map((suite, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">{suite.name}</h4>
                  <div className="text-sm text-muted-foreground mb-2">
                    {suite.passed} passed, {suite.failed} failed, {suite.skipped} skipped ({suite.duration}ms)
                  </div>
                  <div className="space-y-1">
                    {suite.tests.map((test, testIndex) => (
                      <div key={testIndex} className="flex items-center justify-between text-sm p-2 rounded border-l-2 border-l-muted">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(test.status)}
                          <span className={test.status === 'failed' ? 'text-red-500' : 'text-foreground'}>
                            {test.name}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-xs">
                          {test.duration}ms
                        </span>
                        {test.error && (
                          <div className="mt-1 text-xs text-red-500 font-mono bg-red-50 p-1 rounded">
                            {test.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Recent Reports History */}
      {recentReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Test Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentReports.map((report, index) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={report.failed > 0 ? "destructive" : "default"}>
                      {report.failed > 0 ? "Failed" : "Passed"}
                    </Badge>
                    <span className="text-sm">
                      {new Date(report.timestamp).toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {report.passed}/{report.totalTests} passed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setCurrentReport(report)}
                      variant="ghost"
                      size="sm"
                    >
                      View
                    </Button>
                    <Button
                      onClick={() => downloadReport(report)}
                      variant="ghost"
                      size="sm"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestManager;