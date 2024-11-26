import { useEffect, useMemo, useRef, useState, MutableRefObject, forwardRef, useImperativeHandle } from "react";
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
  xAxisTicks?: number | 30;
  yAxisTicks?: number | 30;
  showXAxis?: boolean | true;
  showYAxis?: boolean | true;
  legendAlign?: string | "right";
  showLegend?: boolean | true;
  genderDonutChartSliceName: string;
};

interface D3StackedBarChartRef {
    onGenderSliceClick: () => void;
};

const D3StackedBarChart = forwardRef<D3StackedBarChartRef, D3StackedBarplotChartProps>((props, ref) => {
    // Set defaults for optional parameters
    let xAxisTicks = props.xAxisTicks ?? 30;
    let yAxisTicks = props.yAxisTicks ?? 30;
    let showXAxis = props.showXAxis ?? true;
    let showYAxis = props.showYAxis ?? true;
    let legendAlign = props.legendAlign ?? "right";
    let showLegend = props.showLegend ?? true;

    const axesRef = useRef(null);

    const [refChart, dms] = useChartDimensions({
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
    const boundsHeight = props.height - MARGIN.top - MARGIN.bottom;

    // Property 'width' does not exist on type 'MutableRefObject<undefined>'.
    // @ts-expect-error
    const width = dms.width;

    // Define the stack generator
    const stackGenerator = d3.stack()
        .keys(props.allSubgroups);

    const series = stackGenerator(props.data);

    // Create the vertical scale and its axis generators.
    const yScale = useMemo(() => {
    return d3
        .scaleBand<string>()
        .domain(props.allGroups)
        .range([0, boundsHeight])
        .padding(0.2);
    }, [props.data, props.height]);

    // Create the horizontal scale and its axis generators.
    const xScale = useMemo(() => {
    return d3
        .scaleLinear()
        .domain([0, props.domainCountMax + 10])
        .range([0, boundsWidth]);
    }, [props.data, width]);

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

                    // Adjust tooltip count values based on gender slice selection.
                    let tooltipExerciseLevelCount: number = 0;
                    switch (props.genderDonutChartSliceName.toLowerCase()) {
                        case "female":
                            tooltipExerciseLevelCount = dataExerciseLevelFemale;
                            break;
                        case "male":
                            tooltipExerciseLevelCount = dataExerciseLevelMale;
                            break;
                        default:
                            tooltipExerciseLevelCount = dataExerciseLevel;
                    }

                    return (
                        <rect
                            key={j}
                            x={xScale(group[0])}
                            y={yScale(group.data.x.toString())}
                            height={yScale.bandwidth()}
                            width={xScale(group[1]) - xScale(group[0])}
                            fill={props.markColorScale(subgroup.key)}
                            opacity={0.9}
                            onMouseOver={() => {
                                setHovered({
                                    xPos: xScale(group[0]),
                                    yPos: yScale(group.data.x.toString()),
                                    markColorScale: props.markColorScale,
                                    markColorFieldLegendName: props.markColorFieldLegendName,
                                    markColorField: subgroup.key,
                                    xAxisLabel: props.xAxisLabel,
                                    xAxisValue: tooltipExerciseLevelCount,
                                    yAxisLabel: props.yAxisLabel,
                                    yAxisValue: group.data.x
                                  });
                            }}
                            onMouseLeave={() => {
                                setHovered(null);
                                
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
            ref={refChart as MutableRefObject<HTMLDivElement>}
            style={{
                height: `${props.height}`, 
                position: "relative"
            }}
            className="container"
        >
            <svg 
                width={width}
                height={props.height}
                viewBox={`0 0 ${width} ${props.height}`}
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
                        <Swatches markColorScale={props.markColorScale} onSelect={handleSwatchSelect} legendOffsetX={legendOffsetX} />
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
                        {props.yAxisLabel}
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
                        {props.xAxisLabel}
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
                top: -50,
                left: -200,
                pointerEvents: "none",
                marginLeft: MARGIN.left,
                marginTop: MARGIN.top,
                }}
            >
                <Tooltip interactionData={hovered} />
            </div>
        </div>
    );
});

export default D3StackedBarChart;
