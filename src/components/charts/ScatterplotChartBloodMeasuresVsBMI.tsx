
import * as d3 from "d3";

import D3ScatterPlotChart from "./D3ScatterplotChart";
import { colorScaleGender, colorScaleDiabetesDiagnosisStatus } from "../marks/Color";

type ScatterplotChartBloodMeasuresVsBMIProps = {
    height: number;
    data: { 
        seqn: number;
        insulin: number;
        glucoseAfter2Hour: number;
        glucoseFasting: number;
        bodyMassIndex: number;
        markColorField: string;
        filterGender: string;
    }[];
    hoveredGroup: string | null;
    setHoveredGroup: Function;
    onPointClick: Array<Function> | [];
};

const ScatterplotChartBloodMeasuresVsBMI = ({ height, data, hoveredGroup, setHoveredGroup, onPointClick }: ScatterplotChartBloodMeasuresVsBMIProps) => {

    // data.map(d => console.log(d));

    const scatterplotChartDataGlucoseFastingvsBMI = d3.map(data, (d) => {
        return {
            x: d.bodyMassIndex,
            y: d.glucoseFasting,
            markColorField: d.markColorField,
            filterGender: d.filterGender,
            seqn: d.seqn
        }
    });

    const scatterplotChartDataGluscoseAfter2HourvsBMI = d3.map(data, (d) => {
        return {
            x: d.bodyMassIndex,
            y: d.glucoseAfter2Hour,
            markColorField: d.markColorField,
            filterGender: d.filterGender,
            seqn: d.seqn
        }
    });

    const scatterplotChartDataInsulinvsBMI = d3.map(data, (d) => {
        return {
            x: d.bodyMassIndex,
            y: d.insulin,
            markColorField: d.markColorField,
            filterGender: d.filterGender,
            seqn: d.seqn
        }
    });

    return (
        <>
        <D3ScatterPlotChart
            height={height}
            data={scatterplotChartDataGlucoseFastingvsBMI}
            markColorScale={colorScaleDiabetesDiagnosisStatus}
            markColorFieldLegendName="Diabetes Status"
            xAxisLabel="Body Mass Index (BMI)"
            yAxisLabel="Fasting Blood Glucose"
            yAxisTicks={8}
            showXAxis={false}
            hoveredGroup={hoveredGroup}
            setHoveredGroup={setHoveredGroup}
            interactiveClassName={"chart-1"}
            onPointClick={onPointClick}
        />
        <D3ScatterPlotChart
            height={height}
            data={scatterplotChartDataGluscoseAfter2HourvsBMI}
            markColorScale={colorScaleDiabetesDiagnosisStatus}
            markColorFieldLegendName="Diabetes Status"
            xAxisLabel="Body Mass Index (BMI)"
            yAxisLabel="2-hr Postprandial Blood Glucose"
            yAxisTicks={12}
            showXAxis={false}
            showLegend={false}
            hoveredGroup={hoveredGroup}
            setHoveredGroup={setHoveredGroup}
            interactiveClassName={"chart-2"}
            onPointClick={onPointClick}
        />
        <D3ScatterPlotChart
            height={height+70}
            data={scatterplotChartDataInsulinvsBMI}
            markColorScale={colorScaleDiabetesDiagnosisStatus}
            markColorFieldLegendName="Diabetes Status"
            xAxisLabel="Body Mass Index (BMI)"
            yAxisLabel="Insulin Level"
            xAxisTicks={13}
            yAxisTicks={10}
            showLegend={false}
            hoveredGroup={hoveredGroup}
            setHoveredGroup={setHoveredGroup}
            interactiveClassName={"chart-3"}
            onPointClick={onPointClick}
        />
        </>
    );
};

export default ScatterplotChartBloodMeasuresVsBMI;
