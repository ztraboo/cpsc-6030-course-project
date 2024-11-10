// https://javascript.plainenglish.io/a-simple-guide-to-using-typescript-with-d3js-f0757993b968
// https://legacy.reactjs.org/docs/composition-vs-inheritance.html
// https://www.react-graph-gallery.com/scatter-plot
// https://d3-graph-gallery.com/scatter.html

import { useEffect, useState, MutableRefObject } from "react";
import * as d3 from "d3";

import styles from "./scatterplot.module.css";
import useChartDimensions from "../../hooks/useChartDimensions";
import { StripGenerator } from "./StripGenerator";
import { AxisBottom } from "../axis/AxisBottom";
import { AxisLeft } from "../axis/AxisLeft";
import { InteractionData, Tooltip } from "../marks/Tooltip";
import { Swatches } from "../legend/Swatches";

// const oneMillion = 1_000_000;
const MARGIN: {
        top: number,
        right: number,
        bottom: number,
        left: number
    } = { 
        top: 30,
        right: 25,
        bottom: 80,
        left: 70 
    };

type D3ScatterplotChartProps = {
    height: number;
    data: { 
        x: number;
        y: number;
        markColorField: string;
    }[];
    markColorScale: d3.ScaleOrdinal<any, any>;
    xAxisLabel: string;
    yAxisLabel: string;
};

const D3ScatterplotChart = ({ height, data, markColorScale, xAxisLabel, yAxisLabel }: D3ScatterplotChartProps) => {

    const [hovered, setHovered] = useState<InteractionData | null>(null);
    const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

    const [ref, dms] = useChartDimensions({
        marginTop: MARGIN.top,
        marginBottom: MARGIN.bottom,
        marginLeft: MARGIN.left,
        marginRight: MARGIN.right
    });

    // Layout. The div size is set by the given props.
    // The bounds (=area inside the axis) is calculated by substracting the margins
    // @ts-expect-error
    const boundsWidth = dms.width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    // Property 'width' does not exist on type 'MutableRefObject<undefined>'.
    // @ts-expect-error
    const width = dms.width;
    
    // Create the horizontal scale and its axis generator.
    const xScale = d3
    .scaleLinear()
    .domain([
        d3.min(data, (d) => d.x) as number,
        d3.max(data, (d) => d.x) as number
    ]) // data points for x
    .range([0, boundsWidth]); // axis x dimensions

    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

    // Create the vertical scale and its axis generator.
    const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.y) as number]) // data points for y
    .nice()
    .range([boundsHeight, 0]); // axis y dimensions

    const yAxis = d3.axisLeft(yScale);
  
    // Build the shapes (dots)
    const allShapes = data.map((d, i) => {

        const className = // class if the circle depends on the hover state
            hoveredGroup && d.markColorField !== hoveredGroup
            ? styles.scatterplotCircle + " " + styles.dimmed
            : styles.scatterplotCircle;

      return (
        <circle
          key={i}
          r={5}
          cx={xScale(d.x)}
          cy={yScale(d.y)}
          className={className}
          stroke={markColorScale(d.markColorField)}
          fill={markColorScale(d.markColorField)}
          fillOpacity={0.6}
          onMouseOver={() => {            
            setHoveredGroup(d.markColorField);

            setHovered({
                xPos: xScale(d.x),
                yPos: yScale(d.y),
                markColorScale: markColorScale,
                markColorFieldLegendName: "Gender",
                markColorField: d.markColorField,
                xAxisLabel: xAxisLabel,
                xAxisValue: d.x,
                yAxisLabel: yAxisLabel,
                yAxisValue: d.y
              });
          }}
          onMouseLeave={() => { 
            setHoveredGroup(null)
            setHovered(null)
          }}
        />
      );
    });

    const handleSwatchSelect = (label: string) => {
        (hoveredGroup === null) ? setHoveredGroup(label) : setHoveredGroup(null);
    };

    return(
        <div
            ref={ref as MutableRefObject<HTMLDivElement>}
            style={{
                height, 
                position: "relative"
            }}
            className="container"
        >                    
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className="viz"
                shapeRendering={"crispEdges"}
            >
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
                    overflow={"visible"}
                >

                    {/* graph content */}
                    <StripGenerator width={boundsWidth} height={boundsHeight} />

                    {/* legend */}
                    <g className="legend" overflow={"visible"} transform={`translate(-10, 0)`}>
                        <Swatches markColorScale={markColorScale} onSelect={handleSwatchSelect} />
                    </g>

                    {/* dots */}
                    <g className="dots" overflow={"visible"}>
                        {allShapes}
                    </g>

                    {/* Y axis */}
                    <AxisLeft yScale={yScale} pixelsPerTick={30} />

                    {/* Text label for Y axis. */}
                    <g transform={`translate(0, ${boundsHeight / 2})`}>
                        <text 
                            y={-50}
                            style={{textAnchor: "middle", fontWeight: "normal"}}
                            transform={"rotate(-90)"}
                        >
                            {yAxisLabel}
                        </text>
                    </g>

                    {/* X axis, use an additional translation to appear at the bottom */}
                    <g transform={`translate(0, ${boundsHeight})`}>
                        <AxisBottom xScale={xScale} pixelsPerTick={60} />
                    </g>

                    {/* Text label for X axis. */}
                    <g transform={`translate(0, ${boundsHeight + 60})`}>
                        <text 
                            x={boundsWidth / 2}
                            style={{textAnchor: "middle", fontWeight: "normal"}}
                        >
                            {xAxisLabel}
                        </text>
                    </g>
                </g>
            </svg>

            {/* Tooltip */}
            <div
                style={{
                width: boundsWidth,
                height: boundsHeight,
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                marginLeft: MARGIN.left,
                marginTop: MARGIN.top,
                }}
            >
                <Tooltip interactionData={hovered} />
            </div>
        </div>
    );
};

export default D3ScatterplotChart;
