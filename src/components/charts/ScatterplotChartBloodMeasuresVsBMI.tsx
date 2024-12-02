import { forwardRef, useImperativeHandle, useState } from "react";

import * as d3 from "d3";

import D3ScatterPlotChart from "./D3ScatterplotChart";
import { colorScaleGender, colorScaleDiabetesDiagnosisStatus } from "../marks/Color";

interface ScatterplotChartBloodMeasuresVsBMIProps {
    height: number;
    data: { 
        seqn: number;
        insulin: number;
        glucoseAfter2Hour: number;
        glucoseFasting: number;
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

interface ScatterplotChartBloodMeasuresVsBMIRef {
    onStackedBarExerciseBarClick: (d: any) => void;
};
  
const ScatterplotChartBloodMeasuresVsBMI =forwardRef<ScatterplotChartBloodMeasuresVsBMIRef, ScatterplotChartBloodMeasuresVsBMIProps>((props, ref) => {

    // data.map(d => console.log(d));

    const [scatterplotChartDataGlucoseFastingvsBMI, setScatterplotChartDataGlucoseFastingvsBMI] = useState<any>(d3.map(props.data, (d) => {
        return {
            x: d.bodyMassIndex,
            y: d.glucoseFasting,
            markColorField: d.markColorField,
            filterGender: d.filterGender,
            seqn: d.seqn
        }
    }));

    const [scatterplotChartDataGluscoseAfter2HourvsBMI, setScatterplotChartDataGluscoseAfter2HourvsBMI] = useState<any>(d3.map(props.data, (d) => {
        return {
            x: d.bodyMassIndex,
            y: d.glucoseAfter2Hour,
            markColorField: d.markColorField,
            filterGender: d.filterGender,
            seqn: d.seqn
        }
    }));

    const [scatterplotChartDataInsulinvsBMI, setScatterplotChartDataInsulinvsBMI] = useState<any>(d3.map(props.data, (d) => {
        return {
            x: d.bodyMassIndex,
            y: d.insulin,
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
            setScatterplotChartDataGlucoseFastingvsBMI(d3.map(filteredData, (d) => {
                return {
                    x: d.bodyMassIndex,
                    xScaleMin: Math.max(0.1, (d3.min(props.data, (d) => d.bodyMassIndex) as number) - 1), // Ensure the minimum value > 0
                    xScaleMax: (d3.max(props.data, (d) => d.bodyMassIndex) as number) + 5,
                    y: d.glucoseFasting,
                    yScaleMin: Math.max(0.1, (d3.min(props.data, (d) => d.glucoseFasting) as number) - 1), // Ensure the minimum value > 0
                    yScaleMax: (d3.max(props.data, (d) => d.glucoseFasting) as number) + 5,
                    markColorField: d.markColorField,
                    filterGender: d.filterGender,
                    seqn: d.seqn
                }
            }));

            setScatterplotChartDataGluscoseAfter2HourvsBMI(d3.map(filteredData, (d) => {
                return {
                    x: d.bodyMassIndex,
                    xScaleMin: Math.max(0.1, (d3.min(props.data, (d) => d.bodyMassIndex) as number) - 1), // Ensure the minimum value > 0,
                    xScaleMax: (d3.max(props.data, (d) => d.bodyMassIndex) as number) + 5,
                    y: d.glucoseAfter2Hour,
                    yScaleMin: Math.max(0.1, (d3.min(props.data, (d) => d.glucoseAfter2Hour) as number) - 1), // Ensure the minimum value > 0
                    yScaleMax: (d3.max(props.data, (d) => d.glucoseAfter2Hour) as number) + 5,
                    markColorField: d.markColorField,
                    filterGender: d.filterGender,
                    seqn: d.seqn
                }
            }));

            setScatterplotChartDataInsulinvsBMI(d3.map(filteredData, (d) => {
                return {
                    x: d.bodyMassIndex,
                    xScaleMin: Math.max(0.1, (d3.min(props.data, (d) => d.bodyMassIndex) as number) - 1), // Ensure the minimum value > 0
                    xScaleMax: (d3.max(props.data, (d) => d.bodyMassIndex) as number) + 5,
                    y: d.insulin,
                    yScaleMin: Math.max(0.1, (d3.min(props.data, (d) => d.insulin) as number) - 1), // Ensure the minimum value > 0
                    yScaleMax: (d3.max(props.data, (d) => d.insulin) as number) + 5,
                    markColorField: d.markColorField,
                    filterGender: d.filterGender,
                    seqn: d.seqn
                }
            }));
        },
        // @ts-ignore
        onStackedBarExerciseBarClick(toggledExerciseLevelBar: boolean, ageGroup: string, exerciseBarLevel: string) {
            // console.log("onStackedBarExerciseBarClick", toggledExerciseLevelBar, ageGroup, exerciseBarLevel);

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
            
            setScatterplotChartDataGlucoseFastingvsBMI(d3.map(filteredData, (d) => {
                return {
                    x: d.bodyMassIndex,
                    xScaleMin: Math.max(0.1, (d3.min(props.data, (d) => d.bodyMassIndex) as number) - 1), // Ensure the minimum value > 0
                    xScaleMax: (d3.max(props.data, (d) => d.bodyMassIndex) as number) + 5,
                    y: d.glucoseFasting,
                    yScaleMin: Math.max(0.1, (d3.min(props.data, (d) => d.glucoseFasting) as number) - 1), // Ensure the minimum value > 0
                    yScaleMax: (d3.max(props.data, (d) => d.glucoseFasting) as number) + 5,
                    markColorField: d.markColorField,
                    filterGender: d.filterGender,
                    seqn: d.seqn
                }
            }));

            setScatterplotChartDataGluscoseAfter2HourvsBMI(d3.map(filteredData, (d) => {
                return {
                    x: d.bodyMassIndex,
                    xScaleMin: Math.max(0.1, (d3.min(props.data, (d) => d.bodyMassIndex) as number) - 1), // Ensure the minimum value > 0,
                    xScaleMax: (d3.max(props.data, (d) => d.bodyMassIndex) as number) + 5,
                    y: d.glucoseAfter2Hour,
                    yScaleMin: Math.max(0.1, (d3.min(props.data, (d) => d.glucoseAfter2Hour) as number) - 1), // Ensure the minimum value > 0
                    yScaleMax: (d3.max(props.data, (d) => d.glucoseAfter2Hour) as number) + 5,
                    markColorField: d.markColorField,
                    filterGender: d.filterGender,
                    seqn: d.seqn
                }
            }));

            setScatterplotChartDataInsulinvsBMI(d3.map(filteredData, (d) => {
                return {
                    x: d.bodyMassIndex,
                    xScaleMin: Math.max(0.1, (d3.min(props.data, (d) => d.bodyMassIndex) as number) - 1), // Ensure the minimum value > 0
                    xScaleMax: (d3.max(props.data, (d) => d.bodyMassIndex) as number) + 5,
                    y: d.insulin,
                    yScaleMin: Math.max(0.1, (d3.min(props.data, (d) => d.insulin) as number) - 1), // Ensure the minimum value > 0
                    yScaleMax: (d3.max(props.data, (d) => d.insulin) as number) + 5,
                    markColorField: d.markColorField,
                    filterGender: d.filterGender,
                    seqn: d.seqn
                }
            }));
        },
    }));  

    return (
        <>
        <D3ScatterPlotChart
            height={props.height}
            data={scatterplotChartDataGlucoseFastingvsBMI}
            markColorScale={colorScaleDiabetesDiagnosisStatus}
            markColorFieldLegendName="Diabetes Status"
            xAxisLabel="Body Mass Index (BMI)"
            yAxisLabel="Fasting Blood Glucose"
            yAxisTicks={8}
            showXAxis={false}
            // legendAlign="left"
            hoveredGroup={props.hoveredGroup}
            setHoveredGroup={props.setHoveredGroup}
            interactiveClassName={"chart-1"}
            onPointClick={props.onPointClick}
        />
        <D3ScatterPlotChart
            height={props.height}
            data={scatterplotChartDataGluscoseAfter2HourvsBMI}
            markColorScale={colorScaleDiabetesDiagnosisStatus}
            markColorFieldLegendName="Diabetes Status"
            xAxisLabel="Body Mass Index (BMI)"
            yAxisLabel="2-hr Postprandial Blood Glucose"
            yAxisTicks={12}
            showXAxis={false}
            showLegend={false}
            hoveredGroup={props.hoveredGroup}
            setHoveredGroup={props.setHoveredGroup}
            interactiveClassName={"chart-2"}
            onPointClick={props.onPointClick}
        />
        <D3ScatterPlotChart
            height={props.height+70}
            data={scatterplotChartDataInsulinvsBMI}
            markColorScale={colorScaleDiabetesDiagnosisStatus}
            markColorFieldLegendName="Diabetes Status"
            xAxisLabel="Body Mass Index (BMI)"
            yAxisLabel="Insulin Level"
            xAxisTicks={13}
            yAxisTicks={10}
            showLegend={false}
            hoveredGroup={props.hoveredGroup}
            setHoveredGroup={props.setHoveredGroup}
            interactiveClassName={"chart-3"}
            onPointClick={props.onPointClick}
        />
        </>
    );
});

export default ScatterplotChartBloodMeasuresVsBMI;
