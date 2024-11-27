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
        ageGroup: string,
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
        // @ts-ignore
        onStackedBarExerciseBarClick(toggledExerciseLevelBar: boolean, ageGroup: string, exerciseBarLevel: string) {
            // console.log("onStackedBarExerciseBarClick", ageGroup, exerciseBarLevel);
            if (toggledExerciseLevelBar) {

                // Filter original values by ageGroup and exercise level and re-render.
                const filteredData = props.data.filter((d) => 
                    d.ageGroup === ageGroup && 
                    d.exerciseLevel.trim().toLowerCase() === exerciseBarLevel.trim().toLowerCase()
                );

                setScatterplotChartDataGlucoseFastingvsBMI(d3.map(filteredData, (d) => {
                    return {
                        x: d.bodyMassIndex,
                        y: d.glucoseFasting,
                        markColorField: d.markColorField,
                        filterGender: d.filterGender,
                        seqn: d.seqn
                    }
                }));

                setScatterplotChartDataGluscoseAfter2HourvsBMI(d3.map(filteredData, (d) => {
                    return {
                        x: d.bodyMassIndex,
                        y: d.glucoseAfter2Hour,
                        markColorField: d.markColorField,
                        filterGender: d.filterGender,
                        seqn: d.seqn
                    }
                }));

                setScatterplotChartDataInsulinvsBMI(d3.map(filteredData, (d) => {
                    return {
                        x: d.bodyMassIndex,
                        y: d.insulin,
                        markColorField: d.markColorField,
                        filterGender: d.filterGender,
                        seqn: d.seqn
                    }
                }));
            } else {

                // Reset data back to original values and re-render.
                setScatterplotChartDataGlucoseFastingvsBMI(d3.map(props.data, (d) => {
                    return {
                        x: d.bodyMassIndex,
                        y: d.glucoseFasting,
                        markColorField: d.markColorField,
                        filterGender: d.filterGender,
                        seqn: d.seqn
                    }
                }));

                setScatterplotChartDataGluscoseAfter2HourvsBMI(d3.map(props.data, (d) => {
                    return {
                        x: d.bodyMassIndex,
                        y: d.glucoseAfter2Hour,
                        markColorField: d.markColorField,
                        filterGender: d.filterGender,
                        seqn: d.seqn
                    }
                }));

                setScatterplotChartDataInsulinvsBMI(d3.map(props.data, (d) => {
                    return {
                        x: d.bodyMassIndex,
                        y: d.insulin,
                        markColorField: d.markColorField,
                        filterGender: d.filterGender,
                        seqn: d.seqn
                    }
                }));
            }
                     
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
