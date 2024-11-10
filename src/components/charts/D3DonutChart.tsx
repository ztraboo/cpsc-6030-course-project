import { useEffect, useLayoutEffect, useMemo, useRef, useState, RefObject, MutableRefObject } from "react";
import * as d3 from "d3";

import styles from "./donut-chart.module.css";

type DataItem = {
  name: string;
  value: number;
  percentage: number;
};
type D3DonutChartProps = {
  width: number;
  height: number;
  data: DataItem[];
  showPercentages: boolean;
  markColorScale: d3.ScaleOrdinal<any, any>;
};

const MARGIN_X = 150;
const MARGIN_Y = 50;
const INFLEXION_PADDING = 20; // space between donut and label inflexion point


const D3DonutChart = ({ width, height, data, showPercentages, markColorScale }: D3DonutChartProps) => {
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
        const labelPosX = inflexionPoint[0] + 50 * (isRightLabel ? 1 : -1);
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
            if (ref.current) {
                ref.current.classList.add(styles.hasHighlight);
            }
            }}
            onMouseLeave={() => {
            if (ref.current) {
                ref.current.classList.remove(styles.hasHighlight);
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
                height, 
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
