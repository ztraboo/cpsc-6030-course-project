
import * as d3 from "d3";

import D3ScatterPlotChart from "./D3ScatterplotChart";
import { colorScaleGender } from "../marks/Color";

type ScatterplotChartWaistCircumferenceVsBMIProps = {
    height: number;
    data: { 
        waistCircumference: number,
        bodyMassIndex: number,
        markColorField: string
    }[];
};

const ScatterplotChartWaistCircumferenceVsBMI = ({ height, data }: ScatterplotChartWaistCircumferenceVsBMIProps) => {

    // data.map(d => console.log(d));

    const scatterplotChartData = d3.map(data, (d) => {
        return {
            x: d.waistCircumference,
            y: d.bodyMassIndex,
            markColorField: d.markColorField
        }
    });

    return (
        <>
        <D3ScatterPlotChart
            height={height}
            data={scatterplotChartData}
            markColorScale={colorScaleGender}
            markColorFieldLegendName="Gender"
            xAxisLabel="Waist Circumference (cm)"
            yAxisLabel="Body Mass Index (BMI)"
            xAxisTicks={20}
            yAxisTicks={10}
            legendAlign="left"
        />
        </>
    );
};

export default ScatterplotChartWaistCircumferenceVsBMI;
