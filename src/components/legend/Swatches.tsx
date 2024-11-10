import React from 'react';
import * as d3 from 'd3';

type SwatchesProps = {
    markColorScale: d3.ScaleOrdinal<any, any>;
    onSelect: Function;
};

export const Swatches = ({ markColorScale, onSelect }:SwatchesProps ) => {
  const swatchWidth = 30;
  const swatchHeight = 30;

  const id: string = `swatches-${Math.random().toString(16).slice(2)}`;
  const margingLeft: number = 0;

  return (
    <svg id="swatches">
        {markColorScale.length && markColorScale.domain().map((label, index) => (
            <g key={label} transform={`translate(${90 * index}, 25)`}>

                {/* swatch color */}
                <rect
                    key={index}
                    x={swatchWidth + 20}
                    y={0}
                    width={swatchWidth}
                    height={swatchHeight}
                    fill={markColorScale(label)}
                    onClick={() => onSelect(label)}
                />

                {/* swatch label */}
                <text
                    key={label}
                    x={swatchWidth + 60}
                    y={swatchHeight - 10}
                    style={{
                        fontSize: "13px",
                        textAnchor: "start"
                    }}
                >
                    {label}
                </text>            
            </g>
        ))}
    </svg>
  );
};
