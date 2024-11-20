
import * as d3 from "d3";

import D3DonutChart from "./D3DonutChart";
import { colorScaleGender } from "../marks/Color";

type DataItem = {
    name: string;
    value: number;
    percentage: number;
  };

type DonutChartGenderProps = {
    width: number;
    height: number;
    data: DataItem[];
    onClickPieSlice: Function;
};

const DonutChartGender = ({ width, height, data, onClickPieSlice }: DonutChartGenderProps) => {

    return (
        <>
        <D3DonutChart
            width={width}
            height={height}
            data={data}
            showPercentages={true}
            markColorScale={colorScaleGender}
            onClickPieSlice={onClickPieSlice}
        />
        </>
    );
};

export default DonutChartGender;
