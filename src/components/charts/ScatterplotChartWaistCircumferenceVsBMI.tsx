import { forwardRef, useImperativeHandle, useState } from "react";

import * as d3 from "d3";

import D3ScatterPlotChart from "./D3ScatterplotChart";
import { colorScaleGender } from "../marks/Color";

interface ScatterplotChartWaistCircumferenceVsBMIProps {
    height: number;
    data: { 
        seqn: number;
        waistCircumference: number;
        bodyMassIndex: number;
        markColorField: string;
        filterGender: string;
        ageGroup: string;
        exerciseLevel: string;
    }[];
    hoveredGroup: string | null;
    setHoveredGroup: Function;
    onPointClick: Array<Function> | [];
};

interface ScatterplotChartWaistCircumferenceVsBMIRef {
    onStackedBarExerciseBarClick: (d: any) => void;
}
const ScatterplotChartWaistCircumferenceVsBMI = forwardRef<ScatterplotChartWaistCircumferenceVsBMIRef, ScatterplotChartWaistCircumferenceVsBMIProps>((props, ref) => {

    // data.map(d => console.log(d));

    const [scatterplotChartData, setScatterplotChartData] = useState<any>(d3.map(props.data, (d) => {
        return {
            x: d.waistCircumference,
            y: d.bodyMassIndex,
            markColorField: d.markColorField,
            filterGender: d.filterGender,
            seqn: d.seqn
        }
    }));

    useImperativeHandle(ref, () => ({
        onStackedBarAgeGroupClick(toggledAgeGroup: boolean, ageGroup: string) {
            // console.log("onStackedBarAgeGroupClick", toggledAgeGroup, ageGroup);

            let filteredData:Array<any> = [];

            if (toggledAgeGroup) {
                // Filter original values by ageGroup and exercise level and re-render.
                filteredData = props.data.filter((d) => 
                    d.ageGroup === ageGroup
                );

            } else {
                // Reset data back to original values and re-render.
                filteredData = props.data;
            }

            // Render the charts with filtered data.
            setScatterplotChartData(d3.map(filteredData, (d) => {
                return {
                    x: d.waistCircumference,
                    xScaleMin: Math.max(0.1, (d3.min(props.data, (d) => d.waistCircumference) as number) - 1), // Ensure the minimum value > 0
                    xScaleMax: (d3.max(props.data, (d) => d.waistCircumference) as number) + 5,
                    y: d.bodyMassIndex,
                    yScaleMin: Math.max(0.1, (d3.min(props.data, (d) => d.bodyMassIndex) as number) - 1), // Ensure the minimum value > 0
                    yScaleMax: (d3.max(props.data, (d) => d.bodyMassIndex) as number) + 5,
                    markColorField: d.markColorField,
                    filterGender: d.filterGender,
                    seqn: d.seqn
                }
            }));
        },
        // @ts-ignore
        onStackedBarExerciseBarClick(toggledExerciseLevelBar: boolean, ageGroup: string, exerciseBarLevel: string) {
            console.log("onStackedBarExerciseBarClick", toggledExerciseLevelBar, ageGroup, exerciseBarLevel);

            let filteredData:Array<any> = [];

            if (toggledExerciseLevelBar) {

                // Filter original values by ageGroup and exercise level and re-render.
                filteredData = props.data.filter((d) => 
                    d.ageGroup === ageGroup && 
                    d.exerciseLevel.trim().toLowerCase() === exerciseBarLevel.trim().toLowerCase()
                );
            } else {

                // Reset data back to original values and re-render.
                filteredData = props.data;
            }

            setScatterplotChartData(d3.map(filteredData, (d) => {
                return {
                    x: d.waistCircumference,
                    xScaleMin: Math.max(0.1, (d3.min(props.data, (d) => d.waistCircumference) as number) - 1), // Ensure the minimum value > 0
                    xScaleMax: (d3.max(props.data, (d) => d.waistCircumference) as number) + 5,
                    y: d.bodyMassIndex,
                    yScaleMin: Math.max(0.1, (d3.min(props.data, (d) => d.bodyMassIndex) as number) - 1), // Ensure the minimum value > 0
                    yScaleMax: (d3.max(props.data, (d) => d.bodyMassIndex) as number) + 5,
                    markColorField: d.markColorField,
                    filterGender: d.filterGender,
                    seqn: d.seqn
                }
            }));
        }
    }));

    return (
        <>
        <D3ScatterPlotChart
            height={props.height}
            data={scatterplotChartData}
            markColorScale={colorScaleGender}
            markColorFieldLegendName="Gender"
            xAxisLabel="Waist Circumference (cm)"
            yAxisLabel="Body Mass Index (BMI)"
            xAxisTicks={20}
            yAxisTicks={10}
            legendAlign="left"
            hoveredGroup={props.hoveredGroup}
            setHoveredGroup={props.setHoveredGroup}
            onPointClick={props.onPointClick}
        />
        </>
    );
});

export default ScatterplotChartWaistCircumferenceVsBMI;
