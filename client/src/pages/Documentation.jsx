/**
 * Documentation Page - Numerical Integration Calculator
 * 
 * Provides tutorials, method explanations, and usage examples
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-primary">Documentation & Tutorials</h1>
          <p className="text-sm text-muted-foreground">Learn about numerical integration methods</p>
        </div>
      </header>

      {/* Content */}
      <main className="container py-8 space-y-8">
        {/* Getting Started */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Quick start guide for the calculator</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Step 1: Enter Your Function</h3>
              <p className="text-muted-foreground mb-3">
                In the "Function" field, enter the mathematical expression you want to integrate. The calculator supports:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
                <li>Basic operations: +, -, *, /, ^ (power)</li>
                <li>Trigonometric: sin(x), cos(x), tan(x)</li>
                <li>Other functions: sqrt(x), exp(x), log(x), abs(x)</li>
                <li>Constants: π, e</li>
              </ul>
              <div className="mt-3 p-3 bg-secondary rounded text-sm font-mono">
                Examples: x**2, sin(x), sqrt(x), exp(-x), 1/(1+x**2)
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Step 2: Set Integration Bounds</h3>
              <p className="text-muted-foreground">
                Define the lower bound (a) and upper bound (b) for your integration interval [a, b].
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Step 3: Choose Methods</h3>
              <p className="text-muted-foreground mb-2">
                Select which numerical integration methods to use:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Trapezoidal Rule:</strong> Basic method, good for smooth functions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span><strong>Simpson's Rule:</strong> More accurate, uses quadratic approximations</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive">•</span>
                  <span><strong>Monte Carlo:</strong> Random sampling, good for high-dimensional problems</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Step 4: Adjust Parameters</h3>
              <p className="text-muted-foreground mb-2">
                Set the precision for your calculations:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li><strong>Intervals:</strong> Number of subdivisions (higher = more accurate but slower)</li>
                <li><strong>Samples:</strong> Number of random points for Monte Carlo (higher = more accurate)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Step 5: Calculate & Analyze</h3>
              <p className="text-muted-foreground">
                Click "Calculate" to compute the integral. View results, visualizations, and run convergence analysis
                to understand how accuracy improves with increased precision.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Methods Explanation */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Numerical Integration Methods</CardTitle>
            <CardDescription>Detailed explanations of each method</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="trapezoidal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="trapezoidal">Trapezoidal</TabsTrigger>
                <TabsTrigger value="simpson">Simpson's</TabsTrigger>
                <TabsTrigger value="monte-carlo">Monte Carlo</TabsTrigger>
              </TabsList>

              <TabsContent value="trapezoidal" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Trapezoidal Rule</h3>
                  <p className="text-muted-foreground mb-3">
                    The simplest numerical integration method. It approximates the area under a curve by dividing it
                    into trapezoids.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Formula</h4>
                  <div className="p-3 bg-secondary rounded font-mono text-sm">
                    ∫f(x)dx ≈ (h/2) × [f(x₀) + 2f(x₁) + 2f(x₂) + ... + f(xₙ)]
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">where h = (b - a) / n</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Characteristics</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• <strong>Accuracy:</strong> O(h²) - linear convergence</li>
                    <li>• <strong>Pros:</strong> Simple, fast, good for smooth functions</li>
                    <li>• <strong>Cons:</strong> Less accurate than Simpson's Rule</li>
                    <li>• <strong>Best for:</strong> Quick approximations, smooth curves</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Example</h4>
                  <p className="text-sm text-muted-foreground">
                    For ∫x² dx from 0 to 1 with n=100, the trapezoidal rule gives approximately 0.3333
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="simpson" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Simpson's Rule</h3>
                  <p className="text-muted-foreground mb-3">
                    A more accurate method that uses quadratic polynomials to approximate the curve. It typically
                    requires fewer intervals than the trapezoidal rule for the same accuracy.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Formula</h4>
                  <div className="p-3 bg-secondary rounded font-mono text-sm">
                    ∫f(x)dx ≈ (h/3) × [f(x₀) + 4f(x₁) + 2f(x₂) + 4f(x₃) + ... + f(xₙ)]
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">where h = (b - a) / n (n must be even)</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Characteristics</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• <strong>Accuracy:</strong> O(h⁴) - quadratic convergence</li>
                    <li>• <strong>Pros:</strong> Much more accurate than trapezoidal, still efficient</li>
                    <li>• <strong>Cons:</strong> Requires even number of intervals</li>
                    <li>• <strong>Best for:</strong> Most practical applications, good balance of speed and accuracy</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Example</h4>
                  <p className="text-sm text-muted-foreground">
                    For ∫x² dx from 0 to 1 with n=100, Simpson's rule gives approximately 0.33333333
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="monte-carlo" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Monte Carlo Integration</h3>
                  <p className="text-muted-foreground mb-3">
                    A probabilistic method that uses random sampling to estimate the integral. Particularly useful for
                    high-dimensional problems.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Formula</h4>
                  <div className="p-3 bg-secondary rounded font-mono text-sm">
                    ∫f(x)dx ≈ (b - a) × (1/N) × Σf(xᵢ)
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">where xᵢ are random points in [a, b]</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Characteristics</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• <strong>Accuracy:</strong> O(1/√N) - slower convergence</li>
                    <li>• <strong>Pros:</strong> Works in any dimension, handles discontinuities</li>
                    <li>• <strong>Cons:</strong> Slower convergence, probabilistic results</li>
                    <li>• <strong>Best for:</strong> High-dimensional integrals, complex domains</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Example</h4>
                  <p className="text-sm text-muted-foreground">
                    For ∫x² dx from 0 to 1 with N=10000 samples, Monte Carlo gives approximately 0.333 (varies due to
                    randomness)
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Real-World Applications */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Real-World Applications</CardTitle>
            <CardDescription>Where numerical integration is used</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Physics & Engineering</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Calculating work done by a variable force: W = ∫F(x)dx</li>
                <li>• Finding center of mass: x̄ = ∫x·ρ(x)dx / ∫ρ(x)dx</li>
                <li>• Computing moments of inertia in structural analysis</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Probability & Statistics</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Computing cumulative distribution functions (CDFs)</li>
                <li>• Calculating expected values: E[X] = ∫x·p(x)dx</li>
                <li>• Bayesian inference and posterior distributions</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Economics & Finance</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Computing present value of continuous cash flows</li>
                <li>• Calculating area under demand/supply curves</li>
                <li>• Option pricing models (Black-Scholes)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Environmental Science</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Computing total pollution from emission rates</li>
                <li>• Calculating water flow in rivers</li>
                <li>• Estimating area under concentration curves</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tips & Best Practices */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Tips & Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Choosing the Right Method</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong>Start with Simpson's Rule:</strong> It's usually the best balance of accuracy and speed for
                  most applications.
                </li>
                <li>
                  <strong>Use Trapezoidal for quick estimates:</strong> When you just need a rough approximation
                  quickly.
                </li>
                <li>
                  <strong>Use Monte Carlo for high dimensions:</strong> When dealing with integrals in 3+ dimensions.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Improving Accuracy</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong>Increase intervals/samples:</strong> More subdivisions generally lead to better accuracy.
                </li>
                <li>
                  <strong>Use convergence analysis:</strong> Run the analysis to see how accuracy improves and find the
                  sweet spot.
                </li>
                <li>
                  <strong>Avoid discontinuities:</strong> If your function has jumps, split the integral at those
                  points.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Common Pitfalls</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong>Too few intervals:</strong> May give inaccurate results. Use convergence analysis to find
                  adequate precision.
                </li>
                <li>
                  <strong>Discontinuous functions:</strong> Split the integral at discontinuities for better accuracy.
                </li>
                <li>
                  <strong>Unbounded functions:</strong> The calculator works best with bounded functions on finite
                  intervals.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>Numerical Integration Calculator • Educational Tool for Numerical Analysis</p>
        </div>
      </footer>
    </div>
  );
}
