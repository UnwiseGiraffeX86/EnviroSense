"use client";
import React from "react";

interface AirQualityTrendProps {
  history: { time: string; pm25: number }[];
  currentPm25: number;
}

export const AirQualityTrend = ({ history, currentPm25 }: AirQualityTrendProps) => {
  if (!history || history.length === 0) return null;

  const maxVal = Math.max(...history.map(h => h.pm25), 20);
  const width = 100;
  const height = 40;
  const padding = { top: 4, bottom: 12, left: 0, right: 0 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const WHO_THRESHOLD = 15; // µg/m³

  // Build SVG path
  const points = history.map((h, i) => {
    const x = padding.left + (i / (history.length - 1)) * chartW;
    const y = padding.top + chartH - (h.pm25 / maxVal) * chartH;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${padding.top + chartH} L${points[0].x},${padding.top + chartH} Z`;

  // WHO threshold line Y position
  const whoY = padding.top + chartH - (WHO_THRESHOLD / maxVal) * chartH;

  // Time labels (show every 6th point ~ every 6 hours)
  const labelIndices = [0, 6, 12, 18, 23].filter(i => i < history.length);

  // Gradient ID
  const gradId = "aqTrendGrad";

  // Color based on current PM2.5
  const trendColor = currentPm25 <= 10 ? "#00A36C" : currentPm25 <= 25 ? "#E9C46A" : "#E07A5F";

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={trendColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={trendColor} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* WHO threshold line */}
        <line
          x1={padding.left} y1={whoY}
          x2={padding.left + chartW} y2={whoY}
          stroke="#E07A5F" strokeWidth="0.3" strokeDasharray="1.5,1"
          opacity="0.5"
        />
        <text x={padding.left + 1} y={whoY - 1} fontSize="2.2" fill="#E07A5F" opacity="0.6" fontWeight="600">
          WHO 15µg
        </text>

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradId})`} />

        {/* Line */}
        <path d={linePath} fill="none" stroke={trendColor} strokeWidth="0.6" strokeLinejoin="round" strokeLinecap="round" />

        {/* Current value dot */}
        {points.length > 0 && (
          <>
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="1.2"
              fill={trendColor}
              stroke="white"
              strokeWidth="0.4"
            />
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="2.5"
              fill={trendColor}
              opacity="0.2"
            >
              <animate attributeName="r" values="1.5;3;1.5" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
          </>
        )}

        {/* Time labels */}
        {labelIndices.map(idx => (
          <text
            key={idx}
            x={points[idx]?.x || 0}
            y={height - 1}
            fontSize="2.5"
            fill="#562C2C"
            fillOpacity="0.35"
            textAnchor="middle"
            fontWeight="600"
          >
            {history[idx]?.time || ""}
          </text>
        ))}
      </svg>
    </div>
  );
};
