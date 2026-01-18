/**
 * Home Page - Numerical Integration Calculator
 * 
 * Modern Scientific Design System:
 * - Deep slate background (oklch(0.15 0.01 260)) with cyan accents
 * - Asymmetric layout: input panel (left 30%) + visualization (right 70%)
 * - Monospace typography for technical credibility
 * - Real-time interactive updates
 */

import { useIntegration } from '@/hooks/useIntegration';
import InputPanel from '@/components/InputPanel';
import VisualizationPanel from '@/components/VisualizationPanel';
import ResultsPanel from '@/components/ResultsPanel';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw, BookOpen } from 'lucide-react';
import { Link } from 'wouter';

export default function Home() {
  const {
    state,
    updateFunctionExpr,
    updateBounds,
    updateIntervals,
    updateSamples,
    toggleMethod,
    calculate,
    analyzeConvergence,
    reset,
  } = useIntegration();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">∫ Integration Calculator</h1>
            <p className="text-sm text-muted-foreground">Numerical approximation methods</p>
          </div>
          <div className="flex gap-2">
            <Link href="/docs">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Docs
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={reset}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {/* Error Display */}
        {state.error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Error</p>
              <p className="text-sm text-destructive/80">{state.error}</p>
            </div>
          </div>
        )}

        {/* Two-Column Layout: Input (30%) + Visualization (70%) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: Input Controls */}
          <div className="lg:col-span-1">
            <InputPanel
              state={state}
              onFunctionChange={updateFunctionExpr}
              onBoundsChange={updateBounds}
              onIntervalsChange={updateIntervals}
              onSamplesChange={updateSamples}
              onMethodToggle={toggleMethod}
              onCalculate={calculate}
              isCalculating={state.isCalculating}
            />
          </div>

          {/* Right Panel: Visualization + Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Visualization */}
            {state.visualizations.size > 0 && (
              <VisualizationPanel
                visualizations={state.visualizations}
                bounds={{ lower: state.lowerBound, upper: state.upperBound }}
              />
            )}

            {/* Results */}
            {state.results.size > 0 && (
              <ResultsPanel
                results={state.results}
                convergenceData={state.convergenceData}
                onAnalyzeConvergence={analyzeConvergence}
              />
            )}

            {/* Empty State */}
            {state.results.size === 0 && (
              <div className="p-12 bg-card border border-border rounded-lg text-center">
                <p className="text-muted-foreground mb-4">
                  Enter a function and click "Calculate" to see results
                </p>
                <div className="inline-block px-4 py-2 bg-primary/10 rounded text-sm text-primary">
                  Try: x**2, sin(x), sqrt(x), exp(x)
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-12">
        <div className="container py-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Numerical Integration Calculator • Supports Trapezoidal Rule, Simpson's Rule, and Monte Carlo Method</p>
          <Link href="/docs">
            <Button variant="ghost" size="sm" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Learn More
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
}
