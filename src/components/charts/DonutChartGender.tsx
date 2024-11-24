
import * as d3 from "d3";

import D3DonutChart from "./D3DonutChart";
import { colorScaleGender } from "../marks/Color";

type DataItem = {
    seqnIdentifiers: Set<number>;
    name: string;
    value: number;
    percentage: number;
  };

type DonutChartGenderProps = {
    width: number;
    height: number;
    data: DataItem[];
    onUpdateParticipantCount: Function;
    onFilterByGender: Function;
    onSliceClick: Array<Function> | [];
};

const DonutChartGender = ({ width, height, data, onUpdateParticipantCount, onFilterByGender, onSliceClick }: DonutChartGenderProps) => {

    return (
        <>
        <D3DonutChart
            width={width}
            height={height}
            data={data}
            showPercentages={true}
            markColorScale={colorScaleGender}
            onUpdateParticipantCount={onUpdateParticipantCount}
            onFilterByGender={onFilterByGender}
            onSliceClick={onSliceClick}
        />
        </>
    );
};

export default DonutChartGender;
