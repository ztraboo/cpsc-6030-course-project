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

let MARGIN: {
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
        filterGender: string;
        seqn: number;
    }[];
    markColorFieldLegendName: string,
    markColorScale: d3.ScaleOrdinal<any, any>;
    xAxisLabel: string;
    yAxisLabel: string;
    xAxisTicks?: number;
    yAxisTicks?: number;
    showXAxis?: boolean;
    showYAxis?: boolean;
    legendAlign?: string;
    showLegend?: boolean;
    hoveredGroup: string | null;
    setHoveredGroup: Function;
};

const D3ScatterplotChart = ({ height, data, markColorFieldLegendName, markColorScale, xAxisLabel, yAxisLabel, xAxisTicks=30, yAxisTicks=30, showXAxis=true, showYAxis=true, legendAlign="right", showLegend=true, hoveredGroup, setHoveredGroup }: D3ScatterplotChartProps) => {

    // Remove the margin spacing when the axis labels are missing to save on space.
    MARGIN.left = (showYAxis === false) ? 0 : 70;
    MARGIN.bottom = (showXAxis === false) ? 0 : 80;

    const [hovered, setHovered] = useState<InteractionData | null>(null);
    // const [hoveredGroup, setHoveredGroup] = useState<string | null>(null); 

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
        (d3.min(data, (d) => d.x) as number) - 1,
        (d3.max(data, (d) => d.x) as number) + 5
    ]) // data points for x
    .range([0, boundsWidth]); // axis x dimensions

    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

    // Create the vertical scale and its axis generator.
    const yScale = d3
    .scaleLinear()
    .domain([0, (d3.max(data, (d) => d.y) as number) + 5]) // data points for y
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
                markColorFieldLegendName: markColorFieldLegendName,
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
          data-seqn={d.seqn}
        />
      );
    });

    const handleSwatchSelect = (label: string) => {
        (hoveredGroup === null) ? setHoveredGroup(label) : setHoveredGroup(null);
    };

    const legendOffsetX = (legendAlign === "right" ? boundsWidth - 140 : 0 );

    const xAxisPixelsPerTick = boundsWidth / xAxisTicks;
    const yAxisPixelsPerTick = boundsHeight / yAxisTicks;

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
                    {showLegend && (
                        <svg className="legend" overflow={"visible"}>
                            <Swatches markColorScale={markColorScale} onSelect={handleSwatchSelect} legendOffsetX={legendOffsetX} />
                        </svg>
                    )}

                    {/* dots */}
                    <g className="dots" overflow={"visible"}>
                        {allShapes}
                    </g>

                    {/* Y axis */}
                    {showYAxis && (
                        <>
                        {/* Axis line and markers. Use an additional translation to appear at the left */}
                        <AxisLeft yScale={yScale} pixelsPerTick={yAxisPixelsPerTick} />

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
                        </>
                    )}

                    {/* X axis */}
                    {showXAxis && (
                        <>
                        {/* Axis line and markers. Use an additional translation to appear at the bottom */}
                        <g transform={`translate(0, ${boundsHeight})`}>
                            <AxisBottom xScale={xScale} pixelsPerTick={xAxisPixelsPerTick} />
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
                        </>
                    )}

                    {/* X axis - Add separator line, except after the last plot (*/}
                    {!showXAxis && (
                        <>
                            <line x1={0} x2={boundsWidth} y1={boundsHeight} y2={boundsHeight} stroke={"gray"} strokeWidth={"4"}  strokeDasharray={"4, 4"} />
                        </>
                    )}
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
