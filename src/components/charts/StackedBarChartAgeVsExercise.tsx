
import * as d3 from "d3";

import D3StackedBarChart from "./D3StackedBarChart";
import { colorScaleExerciseLevel } from "../marks/Color";

type Group = {
    x: string;
} & { [key: string]: number };

type StackedBarChartAgeVsExerciseProps = {
    height: number;
    data: {
        ageGroup: string;
        groupExerciseLevelNo: number;
        groupExerciseLevelVigorous: number;
        markColorField: string;
    }[];
};
  
const StackedBarChartAgeVsExercise = ({ height, data }: StackedBarChartAgeVsExerciseProps) => {

    // data.map(d => console.log(d));

    const allGroups = ["≤17", "18-34", "35-59", "60 and older"]; // Custom order for age groups
    const allSubgroups = ["No", "Vigorous"]; // Defining the subgroups for separating the series bars.

    const stackedBarChartAgevsExerciseLevel = d3.map(data, (d) => {
        return {
            x: d.ageGroup,
            No: d.groupExerciseLevelNo,
            Vigorous: d.groupExerciseLevelVigorous
        }
    });

    // Calculate the maximum participants across all age groups for x-axis scaling
    const maxParticipants: number = d3.max(data, d => d.groupExerciseLevelNo + d.groupExerciseLevelVigorous) || 0;

    return (
        <>
        <D3StackedBarChart
            height={height}
            allGroups={allGroups}
            allSubgroups={allSubgroups}
            data={stackedBarChartAgevsExerciseLevel as unknown as Group[]}
            domainCountMax={maxParticipants}
            markColorScale={colorScaleExerciseLevel}
            markColorFieldLegendName="Exercise Level"
            xAxisLabel="Participants"
            yAxisLabel="Age Group"
            xAxisTicks={8}
            showXAxis={true}
            showYAxis={true}
        />
        </>
    );
};

export default StackedBarChartAgeVsExercise;
