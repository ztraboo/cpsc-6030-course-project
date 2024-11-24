import { useEffect, useMemo, useRef, useState, MutableRefObject } from "react";
import * as d3 from "d3";

import useChartDimensions from "../../hooks/useChartDimensions";
import { StripGenerator } from "./StripGenerator";
import { AxisBottom } from "../axis/AxisBottom";
import { AxisLeft } from "../axis/AxisLeftCategoric";
import { InteractionData, Tooltip } from "../marks/Tooltip";
import { Swatches } from "../legend/Swatches";

const MARGIN: {
    top: number,
    right: number,
    bottom: number,
    left: number
} = { 
    top: 40,
    right: 30,
    bottom: 90,
    left: 100 
};

type Group = {
  x: string;
} & { [key: string]: number };

type D3StackedBarplotChartProps = {
  height: number;
  allGroups: string[];
  allSubgroups: string[];
  data: Group[];
  domainCountMax: number;
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
};

const D3StackedBarChart = ({
  height,
  allGroups,
  allSubgroups,
  data,
  domainCountMax,
  markColorFieldLegendName,
  markColorScale,
  xAxisLabel,
  yAxisLabel,
  xAxisTicks=30,
  yAxisTicks=30,
  showXAxis=true,
  showYAxis=true,
  legendAlign="right",
  showLegend=true 
}: D3StackedBarplotChartProps) => {
    const axesRef = useRef(null);

    const [ref, dms] = useChartDimensions({
    marginTop: MARGIN.top,
    marginBottom: MARGIN.bottom,
    marginLeft: MARGIN.left,
    marginRight: MARGIN.right
    });

    // Remove the margin spacing when the axis labels are missing to save on space.
    MARGIN.left = (showYAxis === false) ? 40 : 100;
    MARGIN.bottom = (showXAxis === false) ? 10 : 80;

    const [hovered, setHovered] = useState<InteractionData | null>(null);

    // Layout. The div size is set by the given props.
    // The bounds (=area inside the axis) is calculated by substracting the margins
    // @ts-expect-error
    const boundsWidth = dms.width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    // Property 'width' does not exist on type 'MutableRefObject<undefined>'.
    // @ts-expect-error
    const width = dms.width;

    // Define the stack generator
    const stackGenerator = d3.stack()
        .keys(allSubgroups);

    const series = stackGenerator(data);

    // // Y axis
    // const max = 900; // todo
    // const yScale = useMemo(() => {
    // return d3
    //     .scaleLinear()
    //     .domain([0, max || 0])
    //     .range([boundsHeight, 0]);
    // }, [data, height]);

    // // X axis
    // const xScale = useMemo(() => {
    // return d3
    //     .scaleBand<string>()
    //     .domain(allGroups)
    //     .range([0, boundsWidth])
    //     .padding(0.05);
    // }, [data, width]);

    // Create the vertical scale and its axis generators.
    const yScale = useMemo(() => {
    return d3
        .scaleBand<string>()
        .domain(allGroups)
        .range([0, boundsHeight])
        .padding(0.2);
    }, [data, height]);

    // Create the horizontal scale and its axis generators.
    const xScale = useMemo(() => {
    return d3
        .scaleLinear()
        .domain([0, domainCountMax + 10])
        .range([0, boundsWidth]);
    }, [data, width]);

    // ref={ref as MutableRefObject<HTMLDivElement>}
    const rectangles = series.map((subgroup, i) => {
        return (
            <g id={"barSubgroup" + i} className={["barSubgroup"].join(" ")} key={i}>
                {subgroup.map((group, j) => {
                    let dataExerciseLevel = 0;
                    let dataExerciseLevelMale = 0;
                    let dataExerciseLevelFemale = 0;

                    if (subgroup.key === "No") {
                        dataExerciseLevel = group.data.No
                        dataExerciseLevelMale = group.data.NoMale;
                        dataExerciseLevelFemale = group.data.NoFemale;
                    } else if (subgroup.key === "Vigorous") {
                        dataExerciseLevel = group.data.Vigorous
                        dataExerciseLevelMale = group.data.VigorousMale;
                        dataExerciseLevelFemale = group.data.VigorousFemale;
                    }

                    return (
                        <rect
                            key={j}
                            x={xScale(group[0])}
                            y={yScale(group.data.x.toString())}
                            height={yScale.bandwidth()}
                            width={xScale(group[1]) - xScale(group[0])}
                            fill={markColorScale(subgroup.key)}
                            opacity={0.9}
                            onMouseOver={() => {
                                // setHovered(null);
                            }}
                            onMouseLeave={() => {
                                // setHovered(null);
                            }}
                            data-x={xScale(group[0])}
                            data-agegroup={group.data.x.toString()}
                            data-execlevel={dataExerciseLevel}
                            data-execlevel-xscale={xScale(dataExerciseLevel)}
                            data-execlevel-male={dataExerciseLevelMale}
                            data-execlevel-male-xscale={xScale(dataExerciseLevelMale)}
                            data-execlevel-female={dataExerciseLevelFemale}
                            data-execlevel-female-xscale={xScale(dataExerciseLevelFemale)}
                        ></rect>
                    );
                })}
            </g>
        );
    });

    const handleSwatchSelect = (label: string) => {
        return null;
    };
    
    const legendOffsetX = (legendAlign === "right" ? boundsWidth - 115 : 0 );

    const xAxisPixelsPerTick = boundsWidth / xAxisTicks;
    const yAxisPixelsPerTick = boundsHeight / yAxisTicks;

    return (
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
                <StripGenerator width={boundsWidth} height={boundsHeight + 20} />

                {/* legend */}
                {showLegend && (
                    <svg className="legend" overflow={"visible"}>
                        <Swatches markColorScale={markColorScale} onSelect={handleSwatchSelect} legendOffsetX={legendOffsetX} />
                    </svg>
                )}

                {/* bars */}
                {rectangles}
            </g>

            {/* Y axis */}
            {showYAxis && (
                <>
                {/* Axis line and markers. Use an additional translation to appear at the left */}
                <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
                    <AxisLeft yScale={yScale} />
                </g>

                {/* Text label for Y axis. */}
                <g>
                    <text 
                        x={MARGIN.left - 80}
                        y={MARGIN.top - 10}
                        fill="black"
                        style={{textAnchor: "start", fontWeight: "normal"}}
                        transform={"rotate(0)"}
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
                <g transform={`translate(${MARGIN.left}, ${boundsHeight + MARGIN.top + 20})`}>
                    <AxisBottom xScale={xScale} pixelsPerTick={xAxisPixelsPerTick} />
                </g>

                {/* Text label for X axis. */}
                <g transform={`translate(80, ${boundsHeight + 110})`}>
                    <text 
                        x={boundsWidth / 2}
                        style={{textAnchor: "middle", fontWeight: "normal"}}
                    >
                        {xAxisLabel}
                    </text>
                </g>
                </>
            )}
            
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

export default D3StackedBarChart;
