import { useState, useCallback } from 'react';
import {
  evaluateFunction,
  trapezoidalRule,
  simpsonsRule,
  monteCarloIntegration,
  generateTrapezoidalVisualization,
  generateSimpsonsVisualization,
  generateMonteCarloVisualization,
  convergenceAnalysis,
} from '@/lib/integration';

const DEFAULT_STATE = {
  functionExpr: 'x**2',
  lowerBound: 0,
  upperBound: 1,
  intervals: 100,
  samples: 1000,
  selectedMethods: new Set(['trapezoidal', 'simpson']),
  results: new Map(),
  visualizations: new Map(),
  convergenceData: new Map(),
  error: null,
  isCalculating: false,
};

export function useIntegration() {
  const [state, setState] = useState(DEFAULT_STATE);

  const updateFunctionExpr = useCallback((expr) => {
    setState((prev) => ({
      ...prev,
      functionExpr: expr,
      error: null,
    }));
  }, []);

  const updateBounds = useCallback((lower, upper) => {
    if (lower >= upper) {
      setState((prev) => ({
        ...prev,
        error: 'Lower bound must be less than upper bound',
      }));
      return;
    }
    setState((prev) => ({
      ...prev,
      lowerBound: lower,
      upperBound: upper,
      error: null,
    }));
  }, []);

  const updateIntervals = useCallback((intervals) => {
    if (intervals < 2) {
      setState((prev) => ({
        ...prev,
        error: 'Intervals must be at least 2',
      }));
      return;
    }
    setState((prev) => ({
      ...prev,
      intervals,
      error: null,
    }));
  }, []);

  const updateSamples = useCallback((samples) => {
    if (samples < 10) {
      setState((prev) => ({
        ...prev,
        error: 'Samples must be at least 10',
      }));
      return;
    }
    setState((prev) => ({
      ...prev,
      samples,
      error: null,
    }));
  }, []);

  const toggleMethod = useCallback((method) => {
    setState((prev) => {
      const newMethods = new Set(prev.selectedMethods);
      if (newMethods.has(method)) {
        newMethods.delete(method);
      } else {
        newMethods.add(method);
      }
      return {
        ...prev,
        selectedMethods: newMethods,
      };
    });
  }, []);

  const calculate = useCallback(() => {
    setState((prev) => ({ ...prev, isCalculating: true, error: null }));

    try {
      // Create function from expression
      const func = (x) => evaluateFunction(state.functionExpr, x);

      // Validate bounds
      if (state.lowerBound >= state.upperBound) {
        throw new Error('Lower bound must be less than upper bound');
      }

      const results = new Map();
      const visualizations = new Map();

      // Calculate selected methods
      if (state.selectedMethods.has('trapezoidal')) {
        const result = trapezoidalRule(
          func,
          state.lowerBound,
          state.upperBound,
          state.intervals
        );
        results.set('trapezoidal', result);
        visualizations.set(
          'trapezoidal',
          generateTrapezoidalVisualization(
            func,
            state.lowerBound,
            state.upperBound,
            state.intervals
          )
        );
      }

      if (state.selectedMethods.has('simpson')) {
        const result = simpsonsRule(
          func,
          state.lowerBound,
          state.upperBound,
          state.intervals
        );
        results.set('simpson', result);
        visualizations.set(
          'simpson',
          generateSimpsonsVisualization(
            func,
            state.lowerBound,
            state.upperBound,
            state.intervals
          )
        );
      }

      if (state.selectedMethods.has('monte-carlo')) {
        const result = monteCarloIntegration(
          func,
          state.lowerBound,
          state.upperBound,
          state.samples
        );
        results.set('monte-carlo', result);
        visualizations.set(
          'monte-carlo',
          generateMonteCarloVisualization(
            func,
            state.lowerBound,
            state.upperBound,
            Math.min(state.samples, 500) // Limit visualization points
          )
        );
      }

      setState((prev) => ({
        ...prev,
        results,
        visualizations,
        isCalculating: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Calculation failed',
        isCalculating: false,
      }));
    }
  }, [state.functionExpr, state.lowerBound, state.upperBound, state.intervals, state.samples, state.selectedMethods]);

  const analyzeConvergence = useCallback((method) => {
    try {
      const func = (x) => evaluateFunction(state.functionExpr, x);
      const data = convergenceAnalysis(
        func,
        state.lowerBound,
        state.upperBound,
        method,
        8
      );
      setState((prev) => ({
        ...prev,
        convergenceData: new Map(prev.convergenceData).set(method, data),
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Convergence analysis failed',
      }));
    }
  }, [state.functionExpr, state.lowerBound, state.upperBound]);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return {
    state,
    updateFunctionExpr,
    updateBounds,
    updateIntervals,
    updateSamples,
    toggleMethod,
    calculate,
    analyzeConvergence,
    reset,
  };
}
