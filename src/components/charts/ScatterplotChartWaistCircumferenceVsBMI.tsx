
import * as d3 from "d3";

import D3ScatterPlotChart from "./D3ScatterplotChart";
import { colorScaleGender } from "../marks/Color";

type ScatterplotChartWaistCircumferenceVsBMIProps = {
    height: number;
    data: { 
        seqn: number;
        waistCircumference: number;
        bodyMassIndex: number;
        markColorField: string;
        filterGender: string;
    }[];
    hoveredGroup: string | null;
    setHoveredGroup: Function;
    onPointClick: Array<Function> | [];
};

const ScatterplotChartWaistCircumferenceVsBMI = ({ height, data, hoveredGroup, setHoveredGroup, onPointClick }: ScatterplotChartWaistCircumferenceVsBMIProps) => {

    // data.map(d => console.log(d));

    const scatterplotChartData = d3.map(data, (d) => {
        return {
            x: d.waistCircumference,
            y: d.bodyMassIndex,
            markColorField: d.markColorField,
            filterGender: d.filterGender,
            seqn: d.seqn
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
            hoveredGroup={hoveredGroup}
            setHoveredGroup={setHoveredGroup}
            onPointClick={onPointClick}
        />
        </>
    );
};

export default ScatterplotChartWaistCircumferenceVsBMI;
