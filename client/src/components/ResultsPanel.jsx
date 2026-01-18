/**
 * ResultsPanel Component
 * 
 * Displays:
 * - Numerical integration results from different methods
 * - Comparison metrics
 * - Convergence analysis charts
 * - Export options
 * 
 * Design: Card-based layout with metric displays and charts
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingDown } from 'lucide-react';

function getMethodColor(method) {
  if (method.includes('Trapezoidal')) return '#66ccff';
  if (method.includes('Simpson')) return '#66ff99';
  return '#ff9966';
}

export default function ResultsPanel({
  results,
  convergenceData,
  onAnalyzeConvergence,
}) {
  const [selectedMethod, setSelectedMethod] = useState(
    results.size > 0 ? Array.from(results.keys())[0] : null
  );

  const methods = Array.from(results.entries());

  const exportResults = () => {
    const data = {
      timestamp: new Date().toISOString(),
      results: Array.from(results.entries()).map(([key, result]) => ({
        method: result.method,
        result: result.result,
        intervals: result.intervals,
        samples: result.samples,
        executionTime: result.executionTime,
      })),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `integration-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>Numerical integration approximations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {methods.map(([key, result]) => (
              <div
                key={key}
                className="p-4 bg-secondary rounded-lg border border-border cursor-pointer transition-all hover:border-primary"
                onClick={() => setSelectedMethod(key)}
              >
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">{result.method}</p>
                <p className="text-2xl font-bold font-mono text-primary mb-3">{result.result.toFixed(8)}</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {result.intervals && <p>Intervals: {result.intervals}</p>}
                  {result.samples && <p>Samples: {result.samples}</p>}
                  <p>Time: {result.executionTime.toFixed(2)}ms</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      {selectedMethod && results.has(selectedMethod) && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">{results.get(selectedMethod)?.method}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Result</p>
                <p className="text-xl font-mono font-bold text-primary">
                  {results.get(selectedMethod)?.result.toFixed(10)}
                </p>
              </div>
              {results.get(selectedMethod)?.intervals && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Intervals</p>
                  <p className="text-xl font-mono font-bold">{results.get(selectedMethod)?.intervals}</p>
                </div>
              )}
              {results.get(selectedMethod)?.samples && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Samples</p>
                  <p className="text-xl font-mono font-bold">{results.get(selectedMethod)?.samples}</p>
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Execution Time</p>
                <p className="text-xl font-mono font-bold">{results.get(selectedMethod)?.executionTime.toFixed(2)}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Convergence Analysis */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-accent" />
            Convergence Analysis
          </CardTitle>
          <CardDescription>Analyze accuracy as precision increases</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {['trapezoidal', 'simpson', 'monte-carlo'].map((method) => (
              <Button
                key={method}
                variant={convergenceData.has(method) ? 'default' : 'outline'}
                size="sm"
                onClick={() => onAnalyzeConvergence(method)}
              >
                {method === 'trapezoidal' ? 'Trapezoidal' : method === 'simpson' ? "Simpson's" : 'Monte Carlo'}
              </Button>
            ))}
          </div>

          {convergenceData.size > 0 && (
            <Tabs defaultValue={Array.from(convergenceData.keys())[0]} className="w-full">
              <TabsList className="grid w-full gap-2" style={{ gridTemplateColumns: `repeat(${convergenceData.size}, 1fr)` }}>
                {Array.from(convergenceData.keys()).map((method) => (
                  <TabsTrigger key={method} value={method} className="text-xs">
                    {method === 'trapezoidal' ? 'Trapezoidal' : method === 'simpson' ? "Simpson's" : 'Monte Carlo'}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Array.from(convergenceData.entries()).map(([method, data]) => (
                <TabsContent key={method} value={method}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(102, 204, 255, 0.2)" />
                      <XAxis
                        dataKey="iterations"
                        stroke="#b8c5d6"
                        style={{ fontSize: '12px' }}
                        scale="log"
                      />
                      <YAxis stroke="#b8c5d6" style={{ fontSize: '12px' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a2332',
                          border: '1px solid #66ccff',
                          borderRadius: '4px',
                        }}
                        labelStyle={{ color: '#b8c5d6' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="result"
                        stroke={getMethodColor(method)}
                        dot={false}
                        isAnimationActive={true}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Export */}
      <Button
        onClick={exportResults}
        variant="outline"
        className="w-full gap-2"
      >
        <Download className="w-4 h-4" />
        Export Results (JSON)
      </Button>
    </div>
  );
}
