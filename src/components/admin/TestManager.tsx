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
  TestTube,
  Upload,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const runTests = async (testType: 'unit' | 'integration' | 'coverage' = 'unit') => {
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
      const { data, error } = await supabase.functions.invoke('run-tests', {
        body: { 
          testType,
          runActualTests: true
        }
      });

      if (error) {
        throw error;
      }

      const report: TestReport = data;
      setCurrentReport(report);
      setRecentReports(prev => [report, ...prev.slice(0, 9)]);

      toast({
        title: "Tests completed",
        description: `${report.passed}/${report.totalTests} tests passed`,
        variant: report.failed > 0 ? "destructive" : "default",
      });
    } catch (error) {
      console.error('Test execution error:', error);
      toast({
        title: "Error",
        description: "Failed to run tests. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (userRole !== 'admin') {
      toast({
        title: "Access Denied",
        description: "Only admins can upload test results.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const text = await file.text();
      const vitestOutput = JSON.parse(text);
      
      // Convert Vitest output to our TestReport format
      const report: TestReport = {
        id: `test-${Date.now()}`,
        timestamp: new Date().toISOString(),
        totalTests: vitestOutput.numTotalTests || 0,
        passed: vitestOutput.numPassedTests || 0,
        failed: vitestOutput.numFailedTests || 0,
        skipped: vitestOutput.numPendingTests || 0,
        duration: vitestOutput.perfStats?.end - vitestOutput.perfStats?.start || 0,
        coverage: vitestOutput.coverageMap ? {
          lines: Math.round((vitestOutput.coverageMap.getCoverageSummary?.()?.lines?.pct || 0)),
          functions: Math.round((vitestOutput.coverageMap.getCoverageSummary?.()?.functions?.pct || 0)),
          branches: Math.round((vitestOutput.coverageMap.getCoverageSummary?.()?.branches?.pct || 0)),
          statements: Math.round((vitestOutput.coverageMap.getCoverageSummary?.()?.statements?.pct || 0))
        } : undefined,
        suites: vitestOutput.testResults?.map((suite: any) => ({
          name: suite.name || 'Test Suite',
          tests: suite.assertionResults?.map((test: any) => ({
            id: test.fullName || test.title,
            name: test.title || test.fullName,
            status: test.status === 'passed' ? 'passed' : test.status === 'failed' ? 'failed' : 'skipped',
            duration: test.duration || 0,
            error: test.failureMessages?.[0]
          })) || [],
          passed: suite.numPassingTests || 0,
          failed: suite.numFailingTests || 0,
          skipped: suite.numPendingTests || 0,
          duration: suite.perfStats?.end - suite.perfStats?.start || 0
        })) || []
      };

      setCurrentReport(report);
      setRecentReports(prev => [report, ...prev.slice(0, 9)]);

      toast({
        title: "Success",
        description: `Test results uploaded successfully. ${report.passed}/${report.totalTests} tests passed.`,
        variant: report.failed > 0 ? "destructive" : "default",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to parse test results. Make sure you uploaded a valid JSON file from Vitest.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
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
              To get real test results from your actual test files, run tests locally and upload the JSON output:
            </p>
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Step 1: Run Tests Locally</h4>
              <div className="font-mono text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <code className="bg-background px-2 py-1 rounded">npm run test</code>
                  <span className="text-muted-foreground">- Interactive test runner</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-background px-2 py-1 rounded">vitest run --reporter=json --outputFile=test-results.json</code>
                  <span className="text-muted-foreground">- Generate JSON report</span>
                </div>
              </div>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Step 2: Upload Results</h4>
              <p className="text-xs text-muted-foreground">
                Upload the generated <code>test-results.json</code> file using the form below to view your actual test results in this dashboard.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Current Test Files:</strong> button.test.tsx, Blog.test.tsx, BackButton.test.tsx
              </p>
            </div>
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
          <div className="space-y-4">
            <div className="flex gap-4 mb-6">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Run actual tests from your project or upload test results:
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => runTests('unit')} 
                    disabled={isRunning}
                    className="flex items-center gap-2"
                  >
                    {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    Run Unit Tests
                  </Button>
                  
                  <Button 
                    onClick={() => runTests('integration')} 
                    disabled={isRunning}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    Run Integration Tests
                  </Button>
                  
                  <Button 
                    onClick={() => runTests('coverage')} 
                    disabled={isRunning}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
                    Run Coverage Tests
                  </Button>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <h3 className="text-lg font-semibold mb-4">Upload Real Test Results</h3>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1">
                <label htmlFor="test-results" className="block text-sm font-medium mb-2">
                  Select Vitest JSON Report File
                </label>
                <input
                  id="test-results"
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80 file:cursor-pointer cursor-pointer"
                />
              </div>
              <Button
                disabled={isUploading}
                variant="ghost"
                className="mt-6 sm:mt-0"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload JSON
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Generate JSON with: <code>vitest run --reporter=json --outputFile=test-results.json</code>
            </p>
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