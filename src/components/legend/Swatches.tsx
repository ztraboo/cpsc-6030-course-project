import React from 'react';
import * as d3 from 'd3';

type SwatchesProps = {
    markColorScale: d3.ScaleOrdinal<any, any>;
    onSelect: Function;
    legendOffsetX: number;
};

export const Swatches = ({ markColorScale, onSelect, legendOffsetX }:SwatchesProps ) => {
  const swatchWidth = 20;
  const swatchHeight = 20;

  const id: string = `swatches-${Math.random().toString(16).slice(2)}`;
  const margingLeft: number = 0;

//   <svg id="swatches">
  return (
    <>
        {markColorScale.length && markColorScale.domain().map((label, index) => (
            <g key={label} transform={`translate(${legendOffsetX}, ${index * 30 + 20})`}>

                {/* swatch color */}
                <rect
                    key={index}
                    x={swatchWidth + 10}
                    y={0}
                    width={swatchWidth}
                    height={swatchHeight}
                    fill={markColorScale(label)}
                    onClick={() => onSelect(label)}
                />

                {/* swatch label */}
                <text
                    key={label}
                    x={swatchWidth + 40}
                    y={swatchHeight - 5}
                    style={{
                        fontSize: "13px",
                        textAnchor: "start"
                    }}
                >
                    {label}
                </text>            
            </g>
        ))}
    </>
  );
};
