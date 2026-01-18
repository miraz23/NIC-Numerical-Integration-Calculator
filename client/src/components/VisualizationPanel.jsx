/**
 * VisualizationPanel Component
 * 
 * Displays interactive visualizations of:
 * - The function curve
 * - Integration method approximations (trapezoids, Simpson segments, Monte Carlo points)
 * - Area under the curve
 * 
 * Design: Canvas-based rendering with smooth animations
 */

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function getMethodColor(method) {
  switch (method) {
    case 'Trapezoidal Rule':
      return { fill: 'rgba(102, 204, 255, 0.3)', stroke: '#66ccff', text: '#66ccff' };
    case "Simpson's Rule":
      return { fill: 'rgba(102, 255, 153, 0.3)', stroke: '#66ff99', text: '#66ff99' };
    case 'Monte Carlo':
      return { fill: 'rgba(255, 153, 102, 0.3)', stroke: '#ff9966', text: '#ff9966' };
    default:
      return { fill: 'rgba(102, 204, 255, 0.3)', stroke: '#66ccff', text: '#66ccff' };
  }
}

function VisualizationCanvas({
  visualization,
  bounds,
}) {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState({ x: 1, y: 1, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get canvas dimensions
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Set canvas resolution
    canvas.width = width;
    canvas.height = height;

    // Calculate bounds from points
    let minY = Infinity;
    let maxY = -Infinity;

    visualization.points.forEach((p) => {
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    });

    // Add padding
    const yPadding = (maxY - minY) * 0.1 || 1;
    minY -= yPadding;
    maxY += yPadding;

    // Calculate scale
    const xScale = (width - 80) / (bounds.upper - bounds.lower);
    const yScale = (height - 80) / (maxY - minY);

    const offsetX = 40;
    const offsetY = height - 40;

    setScale({ x: xScale, y: yScale, offsetX, offsetY });

    // Clear canvas
    ctx.fillStyle = '#1a2332';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(102, 204, 255, 0.1)';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 10; i++) {
      const x = offsetX + (i / 10) * (width - 80);
      const y = offsetY - (i / 10) * (height - 80);

      ctx.beginPath();
      ctx.moveTo(x, offsetY);
      ctx.lineTo(x, offsetY - (height - 80));
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(offsetX, y);
      ctx.lineTo(offsetX + (width - 80), y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#66ccff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.lineTo(offsetX + (width - 80), offsetY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.lineTo(offsetX, offsetY - (height - 80));
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#b8c5d6';
    ctx.font = '12px \"Roboto Mono\", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(bounds.lower.toFixed(2), offsetX, offsetY + 20);
    ctx.fillText(bounds.upper.toFixed(2), offsetX + (width - 80), offsetY + 20);

    ctx.textAlign = 'right';
    ctx.fillText(minY.toFixed(2), offsetX - 10, offsetY);
    ctx.fillText(maxY.toFixed(2), offsetX - 10, offsetY - (height - 80));

    const colors = getMethodColor(visualization.method);

    // Draw areas (method-specific visualization)
    if (visualization.method === 'Trapezoidal Rule') {
      ctx.fillStyle = colors.fill;
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 1;

      for (let i = 0; i < visualization.areas.length; i++) {
        const area = visualization.areas[i];
        const x1 = offsetX + (area.x1 - bounds.lower) * xScale;
        const x2 = offsetX + (area.x2 - bounds.lower) * xScale;
        const y1 = offsetY - (visualization.points[i]?.y - minY) * yScale;
        const y2 = offsetY - (visualization.points[i + 1]?.y - minY) * yScale;

        ctx.beginPath();
        ctx.moveTo(x1, offsetY);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2, offsetY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    } else if (visualization.method === "Simpson's Rule") {
      ctx.fillStyle = colors.fill;
      ctx.strokeStyle = colors.stroke;
      ctx.lineWidth = 1;

      for (let i = 0; i < visualization.areas.length; i++) {
        const area = visualization.areas[i];
        const x1 = offsetX + (area.x1 - bounds.lower) * xScale;
        const x2 = offsetX + (area.x2 - bounds.lower) * xScale;

        ctx.beginPath();
        ctx.moveTo(x1, offsetY);
        ctx.lineTo(x1, offsetY - (visualization.points[i * 2]?.y - minY) * yScale);
        ctx.quadraticCurveTo(
          (x1 + x2) / 2,
          offsetY - (visualization.points[i * 2 + 1]?.y - minY) * yScale,
          x2,
          offsetY - (visualization.points[i * 2 + 2]?.y - minY) * yScale
        );
        ctx.lineTo(x2, offsetY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    } else if (visualization.method === 'Monte Carlo') {
      // Draw filled area under curve first
      ctx.fillStyle = 'rgba(102, 204, 255, 0.1)';
      ctx.beginPath();
      const firstPoint = visualization.points[0];
      if (firstPoint) {
        ctx.moveTo(offsetX + (firstPoint.x - bounds.lower) * xScale, offsetY);
        visualization.points.forEach((p) => {
          ctx.lineTo(offsetX + (p.x - bounds.lower) * xScale, offsetY - (p.y - minY) * yScale);
        });
        const lastPoint = visualization.points[visualization.points.length - 1];
        if (lastPoint) {
          ctx.lineTo(offsetX + (lastPoint.x - bounds.lower) * xScale, offsetY);
        }
        ctx.closePath();
        ctx.fill();
      }

      // Draw random points
      ctx.fillStyle = colors.stroke;
      visualization.areas.forEach((area) => {
        const x = offsetX + (area.x1 - bounds.lower) * xScale;
        const y = offsetY - (area.y - minY) * yScale;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw function curve
    ctx.strokeStyle = '#ffa500';
    ctx.lineWidth = 2;
    ctx.beginPath();

    visualization.points.forEach((p, i) => {
      const x = offsetX + (p.x - bounds.lower) * xScale;
      const y = offsetY - (p.y - minY) * yScale;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }, [visualization, bounds]);

  return <canvas ref={canvasRef} className="w-full h-96 bg-gradient-to-br from-slate-900 to-slate-800 rounded" />;
}

export default function VisualizationPanel({
  visualizations,
  bounds,
}) {
  const methods = Array.from(visualizations.keys());

  if (methods.length === 0) {
    return null;
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        {methods.length === 1 ? (
          <VisualizationCanvas
            visualization={visualizations.get(methods[0])}
            bounds={bounds}
          />
        ) : (
          <Tabs defaultValue={methods[0]} className="w-full">
            <TabsList className="grid w-full gap-2" style={{ gridTemplateColumns: `repeat(${methods.length}, 1fr)` }}>
              {methods.map((method) => (
                <TabsTrigger key={method} value={method} className="text-xs">
                  {method === 'trapezoidal' ? 'Trapezoidal' : method === 'simpson' ? "Simpson's" : 'Monte Carlo'}
                </TabsTrigger>
              ))}
            </TabsList>
            {methods.map((method) => (
              <TabsContent key={method} value={method}>
                <VisualizationCanvas
                  visualization={visualizations.get(method)}
                  bounds={bounds}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
