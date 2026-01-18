/**
 * Numerical Integration Methods
 * 
 * This module provides implementations of various numerical integration techniques
 * for approximating definite integrals of functions.
 */

/**
 * Parse and evaluate a mathematical expression
 * Supports basic operations: +, -, *, /, ^, sin, cos, tan, sqrt, exp, log, abs
 */
export function evaluateFunction(expression, x) {
  try {
    // Replace common mathematical functions and constants
    let expr = expression
      .replace(/π/g, Math.PI.toString())
      .replace(/e/g, Math.E.toString())
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/exp/g, 'Math.exp')
      .replace(/log/g, 'Math.log')
      .replace(/ln/g, 'Math.log')
      .replace(/abs/g, 'Math.abs')
      .replace(/\^/g, '**')
      .replace(/x/g, `(${x})`);

    // Use Function constructor for safe evaluation
    const func = new Function('Math', `return ${expr}`);
    const result = func(Math);
    
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Invalid result');
    }
    
    return result;
  } catch (error) {
    throw new Error(`Invalid function expression: ${expression}`);
  }
}

/**
 * Trapezoidal Rule
 * Approximates the integral by dividing the area into trapezoids
 * Formula: ∫f(x)dx ≈ (h/2) * [f(x₀) + 2f(x₁) + 2f(x₂) + ... + f(xₙ)]
 */
export function trapezoidalRule(func, a, b, n) {
  const startTime = performance.now();
  
  const h = (b - a) / n;
  let sum = 0;

  // Evaluate function at endpoints
  sum += func(a) + func(b);

  // Evaluate function at interior points
  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    sum += 2 * func(x);
  }

  const result = (h / 2) * sum;
  const executionTime = performance.now() - startTime;

  return {
    method: 'Trapezoidal Rule',
    result,
    intervals: n,
    executionTime,
  };
}

/**
 * Simpson's Rule
 * Uses quadratic polynomials to approximate the integral
 * Formula: ∫f(x)dx ≈ (h/3) * [f(x₀) + 4f(x₁) + 2f(x₂) + 4f(x₃) + ... + f(xₙ)]
 * Note: n must be even
 */
export function simpsonsRule(func, a, b, n) {
  const startTime = performance.now();
  
  // Ensure n is even
  const intervals = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / intervals;
  let sum = 0;

  // Evaluate function at endpoints
  sum += func(a) + func(b);

  // Evaluate function at interior points
  for (let i = 1; i < intervals; i++) {
    const x = a + i * h;
    const coefficient = i % 2 === 0 ? 2 : 4;
    sum += coefficient * func(x);
  }

  const result = (h / 3) * sum;
  const executionTime = performance.now() - startTime;

  return {
    method: "Simpson's Rule",
    result,
    intervals,
    executionTime,
  };
}

/**
 * Monte Carlo Integration
 * Uses random sampling to estimate the integral
 * Formula: ∫f(x)dx ≈ (b-a) * (1/N) * Σf(xᵢ) where xᵢ are random points
 */
export function monteCarloIntegration(func, a, b, samples) {
  const startTime = performance.now();
  
  let sum = 0;

  for (let i = 0; i < samples; i++) {
    // Generate random point in [a, b]
    const x = a + Math.random() * (b - a);
    sum += func(x);
  }

  const result = ((b - a) / samples) * sum;
  const executionTime = performance.now() - startTime;

  return {
    method: 'Monte Carlo',
    result,
    samples,
    executionTime,
  };
}

/**
 * Generate visualization data for Trapezoidal Rule
 */
export function generateTrapezoidalVisualization(func, a, b, n) {
  const h = (b - a) / n;
  const areas = [];

  for (let i = 0; i < n; i++) {
    const x1 = a + i * h;
    const x2 = a + (i + 1) * h;
    const y1 = func(x1);
    const y2 = func(x2);
    const avgY = (y1 + y2) / 2;

    areas.push({
      x1,
      x2,
      y: avgY,
      type: 'trapezoid',
    });
  }

  // Generate curve points
  const points = [];
  for (let i = 0; i <= n; i++) {
    const x = a + i * h;
    points.push({ x, y: func(x) });
  }

  return {
    method: 'Trapezoidal Rule',
    points,
    areas,
  };
}

/**
 * Generate visualization data for Simpson's Rule
 */
export function generateSimpsonsVisualization(func, a, b, n) {
  const intervals = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / intervals;
  const areas = [];

  for (let i = 0; i < intervals; i += 2) {
    const x1 = a + i * h;
    const x2 = a + (i + 2) * h;
    const xm = a + (i + 1) * h;
    const y1 = func(x1);
    const ym = func(xm);
    const y2 = func(x2);

    areas.push({
      x1,
      x2,
      y: (y1 + 4 * ym + y2) / 6,
      type: 'simpson',
    });
  }

  // Generate curve points
  const points = [];
  for (let i = 0; i <= intervals; i++) {
    const x = a + i * h;
    points.push({ x, y: func(x) });
  }

  return {
    method: "Simpson's Rule",
    points,
    areas,
  };
}

/**
 * Generate visualization data for Monte Carlo Integration
 */
export function generateMonteCarloVisualization(func, a, b, samples) {
  const points = [];
  const areas = [];

  // Generate random sample points
  for (let i = 0; i < samples; i++) {
    const x = a + Math.random() * (b - a);
    const y = func(x);
    points.push({ x, y });
    areas.push({
      x1: x,
      x2: x,
      y,
      type: 'monte-carlo',
    });
  }

  return {
    method: 'Monte Carlo',
    points,
    areas,
  };
}

/**
 * Calculate error between numerical and analytical results
 */
export function calculateError(numerical, analytical) {
  if (analytical === 0) {
    return Math.abs(numerical);
  }
  return Math.abs((numerical - analytical) / analytical) * 100;
}

/**
 * Perform convergence analysis by varying the number of intervals/samples
 */
export function convergenceAnalysis(func, a, b, method, maxIterations = 10) {
  const results = [];

  for (let i = 1; i <= maxIterations; i++) {
    const iterations = Math.pow(2, i);
    let integrationResult;

    if (method === 'trapezoidal') {
      integrationResult = trapezoidalRule(func, a, b, iterations);
    } else if (method === 'simpson') {
      integrationResult = simpsonsRule(func, a, b, iterations);
    } else {
      integrationResult = monteCarloIntegration(func, a, b, iterations * 100);
    }

    results.push({
      iterations,
      result: integrationResult.result,
    });
  }

  return results;
}
