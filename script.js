
function evaluateFunction(expression, x) {
    try {
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
 * Trapezoidal Rule implementation.
 */
function trapezoidalRule(func, a, b, n) {
    const startTime = performance.now();
    const h = (b - a) / n;
    let sum = func(a) + func(b);
    for (let i = 1; i < n; i++) {
        sum += 2 * func(a + i * h);
    }
    const result = (h / 2) * sum;
    return { 
        method: 'Trapezoidal Rule', 
        result, 
        intervals: n, 
        executionTime: performance.now() - startTime 
    };
}

/**
 * Simpson's Rule implementation.
 */
function simpsonsRule(func, a, b, n) {
    const startTime = performance.now();
    const intervals = n % 2 === 0 ? n : n + 1;
    const h = (b - a) / intervals;
    let sum = func(a) + func(b);
    for (let i = 1; i < intervals; i++) {
        const x = a + i * h;
        sum += (i % 2 === 0 ? 2 : 4) * func(x);
    }
    const result = (h / 3) * sum;
    return { 
        method: "Simpson's Rule", 
        result, 
        intervals, 
        executionTime: performance.now() - startTime 
    };
}

/**
 * Monte Carlo Integration implementation.
 */
function monteCarloIntegration(func, a, b, samples) {
    const startTime = performance.now();
    let sum = 0;
    for (let i = 0; i < samples; i++) {
        sum += func(a + Math.random() * (b - a));
    }
    const result = ((b - a) / samples) * sum;
    return { 
        method: 'Monte Carlo', 
        result, 
        samples, 
        executionTime: performance.now() - startTime 
    };
}

// --- Visualization Data Generators ---

function getTrapezoidalViz(func, a, b, n) {
    const h = (b - a) / n;
    const areas = [];
    const points = [];
    for (let i = 0; i <= n; i++) {
        const x = a + i * h;
        const y = func(x);
        points.push({ x, y });
        if (i < n) {
            areas.push({ x1: x, x2: a + (i + 1) * h, y: (y + func(a + (i + 1) * h)) / 2, type: 'trapezoid' });
        }
    }
    return { method: 'Trapezoidal Rule', points, areas };
}

function getSimpsonsViz(func, a, b, n) {
    const intervals = n % 2 === 0 ? n : n + 1;
    const h = (b - a) / intervals;
    const areas = [];
    const points = [];
    for (let i = 0; i <= intervals; i++) {
        const x = a + i * h;
        points.push({ x, y: func(x) });
        if (i < intervals && i % 2 === 0) {
            const x1 = x;
            const x2 = a + (i + 2) * h;
            const xm = a + (i + 1) * h;
            areas.push({ x1, x2, y: (func(x1) + 4 * func(xm) + func(x2)) / 6, type: 'simpson' });
        }
    }
    return { method: "Simpson's Rule", points, areas };
}

function getMonteCarloViz(func, a, b, samples) {
    const points = [];
    const areas = [];
    const curvePoints = [];
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
        const x = a + (i / steps) * (b - a);
        curvePoints.push({ x, y: func(x) });
    }
    for (let i = 0; i < Math.min(samples, 500); i++) {
        const x = a + Math.random() * (b - a);
        const y = func(x);
        areas.push({ x1: x, x2: x, y, type: 'monte-carlo' });
    }
    return { method: 'Monte Carlo', points: curvePoints, areas };
}

// --- UI State & Elements ---

let state = {
    functionExpr: 'x**2',
    lowerBound: 0,
    upperBound: 1,
    intervals: 10,
    samples: 1000,
    results: new Map(),
    visualizations: new Map(),
    activeVizMethod: null
};

const elements = {
    functionInput: document.getElementById('functionInput'),
    lowerBound: document.getElementById('lowerBound'),
    upperBound: document.getElementById('upperBound'),
    intervalsInput: document.getElementById('intervalsInput'),
    samplesInput: document.getElementById('samplesInput'),
    methodTrapezoidal: document.getElementById('methodTrapezoidal'),
    methodSimpson: document.getElementById('methodSimpson'),
    methodMonteCarlo: document.getElementById('methodMonteCarlo'),
    calculateBtn: document.getElementById('calculateBtn'),
    resetBtn: document.getElementById('resetBtn'),
    errorDisplay: document.getElementById('errorDisplay'),
    errorMessage: document.getElementById('errorMessage'),
    emptyState: document.getElementById('emptyState'),
    visualizationCard: document.getElementById('visualizationCard'),
    resultsCard: document.getElementById('resultsCard'),
    vizTabs: document.getElementById('vizTabs'),
    vizCanvas: document.getElementById('vizCanvas'),
    resultsSummary: document.getElementById('resultsSummary'),
    detailedResultCard: document.getElementById('detailedResultCard'),
    detailedResultTitle: document.getElementById('detailedResultTitle'),
    detailedResultValue: document.getElementById('detailedResultValue'),
    detailedIntervalsBox: document.getElementById('detailedIntervalsBox'),
    detailedIntervalsValue: document.getElementById('detailedIntervalsValue'),
    detailedSamplesBox: document.getElementById('detailedSamplesBox'),
    detailedSamplesValue: document.getElementById('detailedSamplesValue'),
    detailedTimeValue: document.getElementById('detailedTimeValue'),
    exportBtn: document.getElementById('exportBtn')
};

// --- Rendering ---

function drawVisualization(method) {
    const viz = state.visualizations.get(method);
    if (!viz) return;

    const canvas = elements.vizCanvas;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    let minY = Infinity, maxY = -Infinity;
    viz.points.forEach(p => {
        minY = Math.min(minY, p.y);
        maxY = Math.max(maxY, p.y);
    });
    const yRange = maxY - minY || 1;
    minY -= yRange * 0.1;
    maxY += yRange * 0.1;

    const xScale = (width - 2 * padding) / (state.upperBound - state.lowerBound);
    const yScale = (height - 2 * padding) / (maxY - minY);
    const offsetX = padding;
    const offsetY = height - padding;

    // Background
    ctx.fillStyle = '#1a2332';
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = 'rgba(102, 204, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
        const x = offsetX + (i / 10) * (width - 2 * padding);
        const y = offsetY - (i / 10) * (height - 2 * padding);
        ctx.beginPath(); ctx.moveTo(x, offsetY); ctx.lineTo(x, offsetY - (height - 2 * padding)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(offsetX, y); ctx.lineTo(offsetX + (width - 2 * padding), y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#66ccff';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(offsetX, offsetY); ctx.lineTo(width - padding, offsetY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(offsetX, offsetY); ctx.lineTo(offsetX, padding); ctx.stroke();

    // Labels
    ctx.fillStyle = '#b8c5d6';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(state.lowerBound.toFixed(2), offsetX, offsetY + 20);
    ctx.fillText(state.upperBound.toFixed(2), width - padding, offsetY + 20);
    ctx.textAlign = 'right';
    ctx.fillText(minY.toFixed(2), offsetX - 10, offsetY);
    ctx.fillText(maxY.toFixed(2), offsetX - 10, padding);

    const colors = {
        'trapezoidal': { fill: 'rgba(102, 204, 255, 0.3)', stroke: '#66ccff' },
        'simpson': { fill: 'rgba(102, 255, 153, 0.3)', stroke: '#66ff99' },
        'monte-carlo': { fill: 'rgba(255, 153, 102, 0.3)', stroke: '#ff9966' }
    }[method];

    // Areas
    ctx.fillStyle = colors.fill;
    ctx.strokeStyle = colors.stroke;
    ctx.lineWidth = 1;

    if (method === 'trapezoidal') {
        for (let i = 0; i < viz.areas.length; i++) {
            const a = viz.areas[i];
            const x1 = offsetX + (a.x1 - state.lowerBound) * xScale;
            const x2 = offsetX + (a.x2 - state.lowerBound) * xScale;
            const y1 = offsetY - (viz.points[i].y - minY) * yScale;
            const y2 = offsetY - (viz.points[i+1].y - minY) * yScale;
            ctx.beginPath(); ctx.moveTo(x1, offsetY); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x2, offsetY); ctx.closePath(); ctx.fill(); ctx.stroke();
        }
    } else if (method === 'simpson') {
        for (let i = 0; i < viz.areas.length; i++) {
            const a = viz.areas[i];
            const x1 = offsetX + (a.x1 - state.lowerBound) * xScale;
            const x2 = offsetX + (a.x2 - state.lowerBound) * xScale;
            const y1 = offsetY - (viz.points[i*2].y - minY) * yScale;
            const ym = offsetY - (viz.points[i*2+1].y - minY) * yScale;
            const y2 = offsetY - (viz.points[i*2+2].y - minY) * yScale;
            ctx.beginPath(); ctx.moveTo(x1, offsetY); ctx.lineTo(x1, y1);
            ctx.quadraticCurveTo((x1 + x2) / 2, ym, x2, y2);
            ctx.lineTo(x2, offsetY); ctx.closePath(); ctx.fill(); ctx.stroke();
        }
    } else if (method === 'monte-carlo') {
        ctx.fillStyle = 'rgba(102, 204, 255, 0.1)';
        ctx.beginPath();
        ctx.moveTo(offsetX + (viz.points[0].x - state.lowerBound) * xScale, offsetY);
        viz.points.forEach(p => ctx.lineTo(offsetX + (p.x - state.lowerBound) * xScale, offsetY - (p.y - minY) * yScale));
        ctx.lineTo(offsetX + (viz.points[viz.points.length-1].x - state.lowerBound) * xScale, offsetY);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = colors.stroke;
        viz.areas.forEach(a => {
            const x = offsetX + (a.x1 - state.lowerBound) * xScale;
            const y = offsetY - (a.y - minY) * yScale;
            ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
        });
    }

    // Function Curve
    ctx.strokeStyle = '#ffa500';
    ctx.lineWidth = 2;
    ctx.beginPath();
    viz.points.forEach((p, i) => {
        const x = offsetX + (p.x - state.lowerBound) * xScale;
        const y = offsetY - (p.y - minY) * yScale;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
}

function updateUI() {
    if (state.results.size > 0) {
        elements.emptyState.classList.add('hidden');
        elements.visualizationCard.classList.remove('hidden');
        elements.resultsCard.classList.remove('hidden');

        elements.vizTabs.innerHTML = '';
        state.visualizations.forEach((viz, method) => {
            const btn = document.createElement('button');
            btn.className = `px-4 py-2 text-sm font-medium transition-colors ${state.activeVizMethod === method ? 'tab-active' : 'text-muted-foreground hover:text-foreground'}`;
            btn.textContent = method === 'trapezoidal' ? 'Trapezoidal' : method === 'simpson' ? "Simpson's" : 'Monte Carlo';
            btn.onclick = () => {
                state.activeVizMethod = method;
                updateUI();
            };
            elements.vizTabs.appendChild(btn);
        });

        drawVisualization(state.activeVizMethod);

        elements.resultsSummary.innerHTML = '';
        state.results.forEach((res, method) => {
            const div = document.createElement('div');
            div.className = 'p-4 bg-secondary rounded-lg border border-border cursor-pointer transition-all hover:border-primary';
            div.onclick = () => showDetailedResult(method);
            div.innerHTML = `
                <p class="text-xs uppercase tracking-wide text-muted-foreground mb-2">${res.method}</p>
                <p class="text-2xl font-bold font-mono text-primary mb-3">${res.result.toFixed(8)}</p>
                <div class="space-y-1 text-xs text-muted-foreground">
                    ${res.intervals ? `<p>Intervals: ${res.intervals}</p>` : ''}
                    ${res.samples ? `<p>Samples: ${res.samples}</p>` : ''}
                    <p>Time: ${res.executionTime.toFixed(2)}ms</p>
                </div>
            `;
            elements.resultsSummary.appendChild(div);
        });
    } else {
        elements.emptyState.classList.remove('hidden');
        elements.visualizationCard.classList.add('hidden');
        elements.resultsCard.classList.add('hidden');
    }
}

function showDetailedResult(method) {
    const res = state.results.get(method);
    if (!res) return;
    elements.detailedResultCard.classList.remove('hidden');
    elements.detailedResultTitle.textContent = res.method;
    elements.detailedResultValue.textContent = res.result.toFixed(10);
    if (res.intervals) {
        elements.detailedIntervalsBox.classList.remove('hidden');
        elements.detailedIntervalsValue.textContent = res.intervals;
    } else {
        elements.detailedIntervalsBox.classList.add('hidden');
    }
    if (res.samples) {
        elements.detailedSamplesBox.classList.remove('hidden');
        elements.detailedSamplesValue.textContent = res.samples;
    } else {
        elements.detailedSamplesBox.classList.add('hidden');
    }
    elements.detailedTimeValue.textContent = res.executionTime.toFixed(2) + 'ms';
}

// --- Actions ---

function calculate() {
    elements.errorDisplay.classList.add('hidden');
    state.results.clear();
    state.visualizations.clear();

    const expr = elements.functionInput.value;
    const a = parseFloat(elements.lowerBound.value);
    const b = parseFloat(elements.upperBound.value);
    const n = parseInt(elements.intervalsInput.value);
    const s = parseInt(elements.samplesInput.value);

    state.functionExpr = expr;
    state.lowerBound = a;
    state.upperBound = b;
    state.intervals = n;
    state.samples = s;

    try {
        const f = (x) => evaluateFunction(expr, x);
        f(a); // Test evaluation

        if (elements.methodTrapezoidal.checked) {
            state.results.set('trapezoidal', trapezoidalRule(f, a, b, n));
            state.visualizations.set('trapezoidal', getTrapezoidalViz(f, a, b, n));
        }
        if (elements.methodSimpson.checked) {
            state.results.set('simpson', simpsonsRule(f, a, b, n));
            state.visualizations.set('simpson', getSimpsonsViz(f, a, b, n));
        }
        if (elements.methodMonteCarlo.checked) {
            state.results.set('monte-carlo', monteCarloIntegration(f, a, b, s));
            state.visualizations.set('monte-carlo', getMonteCarloViz(f, a, b, s));
        }

        if (state.results.size === 0) {
            throw new Error('Please select at least one method');
        }

        state.activeVizMethod = Array.from(state.visualizations.keys())[0];
        updateUI();
    } catch (error) {
        elements.errorMessage.textContent = error.message;
        elements.errorDisplay.classList.remove('hidden');
    }
}

function reset() {
    elements.functionInput.value = 'x**2';
    elements.lowerBound.value = '0';
    elements.upperBound.value = '1';
    elements.intervalsInput.value = '10';
    elements.samplesInput.value = '1000';
    elements.methodTrapezoidal.checked = true;
    elements.methodSimpson.checked = true;
    elements.methodMonteCarlo.checked = false;
    state.results.clear();
    state.visualizations.clear();
    elements.detailedResultCard.classList.add('hidden');
    elements.errorDisplay.classList.add('hidden');
    updateUI();
}

window.analyzeConvergence = function(method) {
    const container = document.getElementById('convergenceChartContainer');
    container.classList.remove('hidden');
    const canvas = document.getElementById('convergenceCanvas');
    const ctx = canvas.getContext('2d');
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 256;

    const expr = state.functionExpr;
    const a = state.lowerBound;
    const b = state.upperBound;
    const f = (x) => evaluateFunction(expr, x);

    const data = [];
    for (let i = 1; i <= 8; i++) {
        const iter = Math.pow(2, i + 2);
        let res;
        if (method === 'trapezoidal') res = trapezoidalRule(f, a, b, iter).result;
        else if (method === 'simpson') res = simpsonsRule(f, a, b, iter).result;
        else res = monteCarloIntegration(f, a, b, iter * 10).result;
        data.push({ x: iter, y: res });
    }

    ctx.fillStyle = '#1a2332';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let minY = Math.min(...data.map(d => d.y));
    let maxY = Math.max(...data.map(d => d.y));
    const yRange = maxY - minY || 1;
    minY -= yRange * 0.1;
    maxY += yRange * 0.1;

    const padding = 40;
    const xScale = (canvas.width - 2 * padding) / (data.length - 1);
    const yScale = (canvas.height - 2 * padding) / (maxY - minY);

    ctx.strokeStyle = method === 'trapezoidal' ? '#66ccff' : method === 'simpson' ? '#66ff99' : '#ff9966';
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((d, i) => {
        const x = padding + i * xScale;
        const y = canvas.height - padding - (d.y - minY) * yScale;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    ctx.fillStyle = ctx.strokeStyle;
    data.forEach((d, i) => {
        const x = padding + i * xScale;
        const y = canvas.height - padding - (d.y - minY) * yScale;
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
    });
};

function exportResults() {
    const data = {
        timestamp: new Date().toISOString(),
        results: Array.from(state.results.entries()).map(([key, res]) => ({
            method: res.method,
            result: res.result,
            intervals: res.intervals,
            samples: res.samples,
            executionTime: res.executionTime
        }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `integration-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// --- Event Listeners ---

elements.calculateBtn.onclick = calculate;
elements.resetBtn.onclick = reset;
elements.exportBtn.onclick = exportResults;

// Initial UI
updateUI();
