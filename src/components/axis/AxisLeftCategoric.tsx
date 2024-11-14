// @ts-nocheck
import { useMemo, useState } from 'react';
import { ScaleBand } from 'd3';

type AxisLeftProps = {
  yScale: ScaleBand<string>;
};

// tick length
const TICK_LENGTH = 6;

export const AxisLeft = ({ yScale }: AxisLeftProps) => {
  const [min, max] = yScale.range();

  const ticks = useMemo(() => {
    return yScale.domain().map((value: any) => ({
      value,
      yOffset: yScale(value) + yScale.bandwidth() / 2,
    }));
  }, [yScale]);

  // d={["M", range[0], 0, "L", range[1], 0].join(" ")}
  return (
    <>
      {/* Main vertical line */}
      <path
        d={['M', 0, min, 'L', 0, max].join(' ')}
        fill="none"
        stroke="currentColor"
      />

      {/* Ticks and labels */}
      {ticks.map(({ value, yOffset }) => (
        <g key={value} transform={`translate(0, ${yOffset})`}>
          <line x2={-TICK_LENGTH} stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: '12px',
              textAnchor: 'end',
              alignmentBaseline: 'middle',
              transform: 'translateX(-10px)'
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
};