import { useEffect, useLayoutEffect, useMemo, useRef, useState, RefObject, MutableRefObject } from "react";
import * as d3 from "d3";

import styles from "./donut-chart.module.css";

type DataItem = {
  seqnIdentifiers: Set<number>;
  name: string;
  value: number;
  percentage: number;
};
type D3DonutChartProps = {
  width: number;
  height: number;
  data: DataItem[];
  dataOriginal?: DataItem[];
  dataFiltered?: DataItem[];
  showPercentages: boolean;
  markColorScale: d3.ScaleOrdinal<any, any>;
  onUpdateParticipantCount: Function;
  onFilterByGender?: Function;
  onSliceClick: Array<Function> | [];
};

const MARGIN_X = 150;
const MARGIN_Y = 50;
const INFLEXION_PADDING = 20; // space between donut and label inflexion point


const D3DonutChart = ({ width, height, data, showPercentages, markColorScale, onUpdateParticipantCount, onFilterByGender, onSliceClick }: D3DonutChartProps) => {
    const [participantCount, setParticipantCount] = useState(0);
    let [toggledSlice, setToggledSlice] = useState(false);
    
    const ref = useRef<SVGGElement>(null);
    const refParent = useRef<HTMLDivElement>(null); // Todo: Need to revisit this on responsive sizing.

    const radius = Math.min(width - 2 * MARGIN_X, height - 2 * MARGIN_Y) / 2;
    const innerRadius = radius / 2;

    const pie = useMemo(() => {
        const pieGenerator = d3.pie<any, DataItem>().value((d) => d.value);
        return pieGenerator(data);
    }, [data]);

    const arcGenerator = d3.arc();

    const shapes = pie.map((grp, i) => {
        // First arc is for the donut
        const sliceInfo = {
        innerRadius,
        outerRadius: radius,
        startAngle: grp.startAngle,
        endAngle: grp.endAngle,
        };
        const centroid = arcGenerator.centroid(sliceInfo);
        const slicePath = arcGenerator(sliceInfo);

        // Second arc is for the legend inflexion point
        const inflexionInfo = {
        innerRadius: radius + INFLEXION_PADDING,
        outerRadius: radius + INFLEXION_PADDING,
        startAngle: grp.startAngle,
        endAngle: grp.endAngle,
        };
        const inflexionPoint = arcGenerator.centroid(inflexionInfo);

        const isRightLabel = inflexionPoint[0] > 0;
        const labelPosX = inflexionPoint[0] + 25 * (isRightLabel ? 1 : -1);
        const textAnchor = isRightLabel ? "start" : "end";
        const label = 
            grp.data.name + 
            (showPercentages ? 
                " (" + grp.data.percentage.toFixed(2) + "%)" :
                " (" + grp.data.value + ")");

        return (
        <g
            key={i}
            className={styles.slice}
            onMouseEnter={() => {
                // if (ref.current) {
                //     ref.current.classList.add(styles.hasHighlight);
                // }
            }}
            onMouseLeave={() => {
                // if (ref.current) {
                //     ref.current.classList.remove(styles.hasHighlight);
                // }
            }}
            onClick={(s) => {
                // console.log("toggledSlice = " + toggledSlice);
                
                setToggledSlice(!toggledSlice);
                // Need to ensure that the toggledSlice gets applied in this onClick event.
                // Typically the setToggledSlice useState setter update will only be applied in a useEffect call.
                toggledSlice = !toggledSlice;

                // Handle interactions passed for slice click for other charts.
                onSliceClick.forEach((func) => {
                    func(toggledSlice, grp.data.seqnIdentifiers, grp.data.name);
                });

                // Remove all existing inline styling for all slices previously selected. Also remove data attribute signifying selected slice.
                document.querySelectorAll('[class^="donut-chart_slice"]').forEach((slice) => {
                    slice.removeAttribute("style");
                    slice.removeAttribute("data-gender-slice-selected");
                });

                if (toggledSlice) {
                    
                    // Change the number for participants based on the slice selection.
                    onUpdateParticipantCount(grp.data.value);
                    d3.select(".card-participants-container .stat").attr("style", "color: " + markColorScale(grp.data.name));

                    // Desaturate and turn down opacity of all slices using '.hasHighlight .slice' class.
                    if (ref.current) {
                        ref.current.classList.add(styles.hasHighlight);
                    }
                    
                    // Add an inline styling for current selected slice and add data for slice selected.
                    d3.select(s.currentTarget)
                    .attr("style", "filter: saturate(100%); opacity: 1;")
                    .attr("data-gender-slice-selected", grp.data.name);

                    if (onFilterByGender !== undefined) {
                        onFilterByGender(grp.data.name);
                    }
                } else {
                    
                    // Change the number for participants for the whole donut chart values.
                    let totalParticipantCount = 0;
                    data.forEach((slice) => {
                        totalParticipantCount += slice.value
                    })
                    onUpdateParticipantCount(totalParticipantCount);
                    d3.select(".card-participants-container .stat").attr("style", null);

                    // Saturate and enable full opacity of all slices by removing '.hasHighlight .slice' class.
                    if (ref.current) {
                        ref.current.classList.remove(styles.hasHighlight);
                    }

                    // Remove inline style for current selected slice and data selected attribute.
                    // d3.select(s.currentTarget)
                    // .attr("style", null)
                    // .attr("data-gender-slice-selected", null);

                    if (onFilterByGender !== undefined) {
                        onFilterByGender(null);
                    }
                }
            }}
        >
            {slicePath && (
                <path d={slicePath} fill={markColorScale(grp.data.name)} />
            )}
            <circle cx={centroid[0]} cy={centroid[1]} r={2} />
            <line
            x1={centroid[0]}
            y1={centroid[1]}
            x2={inflexionPoint[0]}
            y2={inflexionPoint[1]}
            stroke={"black"}
            fill={"black"}
            />
            <line
            x1={inflexionPoint[0]}
            y1={inflexionPoint[1]}
            x2={labelPosX}
            y2={inflexionPoint[1]}
            stroke={"black"}
            fill={"black"}
            />
            <text
            x={labelPosX + (isRightLabel ? 2 : -2)}
            y={inflexionPoint[1]}
            textAnchor={textAnchor}
            dominantBaseline="middle"
            fontSize={14}
            >
            {label}
            </text>
        </g>
        );
    });

    return (
        <div
            ref={refParent}
            style={{
                height: "100%", 
                position: "relative"
            }}
            className="container"
        >       
            <svg width={width} height={height} style={{ display: "inline-block", margin: "0px 18px" }}>
            <g
                transform={`translate(${width / 2}, ${height / 2})`}
                className={styles.container}
                ref={ref}
            >
                {shapes}
            </g>
            </svg>
        </div>
    );
};

export default D3DonutChart;
