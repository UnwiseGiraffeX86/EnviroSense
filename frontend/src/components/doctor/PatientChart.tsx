"use client";

import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Dot
} from 'recharts';

type ChartData = {
  date: string;
  focus_level: number;
  pollution_exposure: number;
  breathing_status: string;
};

interface PatientChartProps {
  data: ChartData[];
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (payload.breathing_status === 'Severe' || payload.breathing_status === 'Wheezing') {
    return (
      <svg x={cx - 6} y={cy - 6} width={12} height={12} fill="red" viewBox="0 0 1024 1024">
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
        <path d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z" />
      </svg>
    );
  }
  return <Dot {...props} r={4} fill="#0077B6" />;
};

export default function PatientChart({ data }: PatientChartProps) {
  return (
    <div className="h-[400px] w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-[#1E293B] mb-4">30-Day Health & Environmental Correlation</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            scale="point" 
            padding={{ left: 10, right: 10 }} 
            tick={{ fontSize: 12, fill: '#64748B' }}
          />
          <YAxis 
            yAxisId="left" 
            label={{ value: 'Focus Level (1-10)', angle: -90, position: 'insideLeft', fill: '#0077B6' }}
            domain={[0, 10]}
            tick={{ fontSize: 12, fill: '#64748B' }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            label={{ value: 'PM2.5 (µg/m³)', angle: 90, position: 'insideRight', fill: '#E07A5F' }}
            domain={[0, 100]} // Adjust based on expected PM2.5 range
            tick={{ fontSize: 12, fill: '#64748B' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            itemStyle={{ fontSize: '12px' }}
          />
          <Legend />
          
          {/* Pollution Bars */}
          <Bar 
            yAxisId="right" 
            dataKey="pollution_exposure" 
            name="PM2.5 Exposure" 
            barSize={20} 
            fill="#E07A5F" 
            opacity={0.6}
            radius={[4, 4, 0, 0]}
          />
          
          {/* Focus Level Line */}
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="focus_level" 
            name="Brain Fog (Focus)" 
            stroke="#0077B6" 
            strokeWidth={3}
            dot={<CustomDot />}
            activeDot={{ r: 8 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
