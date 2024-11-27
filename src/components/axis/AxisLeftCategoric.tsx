// @ts-nocheck
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
// import { ScaleBand } from 'd3';
import * as d3 from "d3";

interface AxisLeftProps {
  yScale: ScaleBand<string>;
  onLabelClick?: Array<Function> | [];
};

interface AxisLeftPropsRef {
  onDonutChartGenderSliceClick: (d: any) => void;
};

// tick length
const TICK_LENGTH = 6;

export const AxisLeft = forwardRef<AxisLeftPropsRef, AxisLeftProps>((props, ref) => {
  
  const [toggledAxisLabel, setToggledAxisLabel] = useState(false);

  const [min, max] = props.yScale.range();

  const ticks = useMemo(() => {
    return props.yScale.domain().map((value: any) => ({
      value,
      yOffset: props.yScale(value) + props.yScale.bandwidth() / 2,
    }));
  }, [props.yScale]);

  useImperativeHandle(ref, () => ({
      // @ts-ignore
      toggleAxisLabel(toggledSelection: boolean) {
          setToggledAxisLabel(toggledSelection);
      },
  }));  

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
              transform: 'translateX(-10px)',
              cursor: 'pointer'
            }}
            onClick={(x) => {
              setToggledAxisLabel(!toggledAxisLabel);
              // console.log("AxisLeftCategoric selected", !toggledAxisLabel);
                
              if (!toggledAxisLabel) {
                  // Change style for the selected label.
                  x.currentTarget.style.fontWeight = 'bold';
                  x.currentTarget.style.fontSize = '14px';
                  d3
                  .select(x.currentTarget)
                    .attr('fill', '#399D3E');

                  // Enable the currently selected axis label.
                  x.currentTarget.setAttribute("data-selected-axis-label", "true");
              } else {
                  // Disable all previously selected labels.
                  d3
                  .select(x.currentTarget.parentElement?.parentElement)
                  .selectAll("[data-selected-axis-label='true']")
                    .attr('fill', 'black')
                    .style('font-weight', 'normal')
                    .style('font-size', '12px');

                  // Disable the currently selected axis label.
                  x.currentTarget.setAttribute("data-selected-axis-label", "false");
              }

              // Call all functions passed into label click parameter.
              props.onLabelClick?.forEach((func) => {
                func(x.currentTarget.textContent);
              });
          }}
          data-selected-axis-label={false}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
});