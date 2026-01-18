/**
 * InputPanel Component
 * 
 * Handles user input for:
 * - Mathematical function expression
 * - Integration bounds (a, b)
 * - Number of intervals/samples
 * - Method selection
 * 
 * Design: Stacked card layout with monospace input fields
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

export default function InputPanel({
  state,
  onFunctionChange,
  onBoundsChange,
  onIntervalsChange,
  onSamplesChange,
  onMethodToggle,
  onCalculate,
  isCalculating,
}) {
  return (
    <div className="space-y-4">
      {/* Function Input */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Function</CardTitle>
          <CardDescription>Enter the function to integrate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="function" className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
              f(x) =
            </Label>
            <Input
              id="function"
              value={state.functionExpr}
              onChange={(e) => onFunctionChange(e.target.value)}
              placeholder="e.g., x**2, sin(x), sqrt(x)"
              className="font-mono text-sm bg-input border-border"
            />
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Supported: +, -, *, /, ^ (power), sin, cos, tan, sqrt, exp, log, abs</p>
            <p>Constants: π, e</p>
          </div>
        </CardContent>
      </Card>

      {/* Integration Bounds */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Integration Bounds</CardTitle>
          <CardDescription>Define the interval [a, b]</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="lower" className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
                Lower Bound (a)
              </Label>
              <Input
                id="lower"
                type="number"
                value={state.lowerBound}
                onChange={(e) => onBoundsChange(parseFloat(e.target.value), state.upperBound)}
                step="0.1"
                className="font-mono text-sm bg-input border-border"
              />
            </div>
            <div>
              <Label htmlFor="upper" className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
                Upper Bound (b)
              </Label>
              <Input
                id="upper"
                type="number"
                value={state.upperBound}
                onChange={(e) => onBoundsChange(state.lowerBound, parseFloat(e.target.value))}
                step="0.1"
                className="font-mono text-sm bg-input border-border"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Method Selection */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Methods</CardTitle>
          <CardDescription>Select integration methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Checkbox
                id="trapezoidal"
                checked={state.selectedMethods.has('trapezoidal')}
                onCheckedChange={() => onMethodToggle('trapezoidal')}
              />
              <label htmlFor="trapezoidal" className="text-sm cursor-pointer">
                Trapezoidal Rule
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="simpson"
                checked={state.selectedMethods.has('simpson')}
                onCheckedChange={() => onMethodToggle('simpson')}
              />
              <label htmlFor="simpson" className="text-sm cursor-pointer">
                Simpson's Rule
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="monte-carlo"
                checked={state.selectedMethods.has('monte-carlo')}
                onCheckedChange={() => onMethodToggle('monte-carlo')}
              />
              <label htmlFor="monte-carlo" className="text-sm cursor-pointer">
                Monte Carlo
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parameters */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Parameters</CardTitle>
          <CardDescription>Adjust precision settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="intervals" className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
              Intervals (Trapezoidal/Simpson)
            </Label>
            <Input
              id="intervals"
              type="number"
              value={state.intervals}
              onChange={(e) => onIntervalsChange(parseInt(e.target.value) || 2)}
              min="2"
              step="10"
              className="font-mono text-sm bg-input border-border"
            />
            <p className="text-xs text-muted-foreground mt-1">Current: {state.intervals}</p>
          </div>
          <div>
            <Label htmlFor="samples" className="text-xs uppercase tracking-wide text-muted-foreground mb-2 block">
              Samples (Monte Carlo)
            </Label>
            <Input
              id="samples"
              type="number"
              value={state.samples}
              onChange={(e) => onSamplesChange(parseInt(e.target.value) || 10)}
              min="10"
              step="100"
              className="font-mono text-sm bg-input border-border"
            />
            <p className="text-xs text-muted-foreground mt-1">Current: {state.samples}</p>
          </div>
        </CardContent>
      </Card>

      {/* Calculate Button */}
      <Button
        onClick={onCalculate}
        disabled={isCalculating || state.selectedMethods.size === 0}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 gap-2"
      >
        {isCalculating && <Loader2 className="w-4 h-4 animate-spin" />}
        {isCalculating ? 'Calculating...' : 'Calculate'}
      </Button>
    </div>
  );
}
