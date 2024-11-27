import { forwardRef, useImperativeHandle, useRef, useState } from "react";

import * as d3 from "d3";

import D3StackedBarChart from "./D3StackedBarChart";
import { colorScaleExerciseLevel } from "../marks/Color";

type Group = {
    x: string;
} & { [key: string]: number };

interface StackedBarChartAgeVsExerciseProps {
    height: number;
    data: {
        ageGroup: string;
        groupExerciseLevelNo: number;
        groupExerciseLevelNoMale: number;
        groupExerciseLevelNoFemale: number;
        groupExerciseLevelVigorous: number;
        groupExerciseLevelVigorousMale: number;
        groupExerciseLevelVigorousFemale: number;
    }[];
    onExerciseLevelClick: Array<Function> | [];
    onAgeGroupClick: Array<Function> | [];
};

interface StackedBarChartAgeVsExerciseRef {
    onDonutChartGenderSliceClick: (d: any) => void;
};
  
const StackedBarChartAgeVsExercise = forwardRef<StackedBarChartAgeVsExerciseRef, StackedBarChartAgeVsExerciseProps>((props, ref) => {
    const [genderDonutChartSliceName, setGenderDonutChartSliceName] = useState("");

    // data.map(d => console.log(d));

    const allGroups = ["≤17", "18-34", "35-59", "60 and older"]; // Custom order for age groups
    const allSubgroups = ["No", "Vigorous"]; // Defining the subgroups for separating the series bars.

    const stackedBarChartAgevsExerciseLevel = d3.map(props.data, (d) => {
        return {
            x: d.ageGroup,
            No: d.groupExerciseLevelNo,
            NoMale: d.groupExerciseLevelNoMale,
            NoFemale: d.groupExerciseLevelNoFemale,
            Vigorous: d.groupExerciseLevelVigorous,
            VigorousMale: d.groupExerciseLevelVigorousMale,
            VigorousFemale: d.groupExerciseLevelVigorousFemale
        }
    });

    // Calculate the maximum participants across all age groups for x-axis scaling
    const maxParticipants: number = d3.max(props.data, d => d.groupExerciseLevelNo + d.groupExerciseLevelVigorous) || 0;
   
    useImperativeHandle(ref, () => ({
        // @ts-ignore
        onDonutChartGenderSliceClick(toggledSlice: boolean, sliceName: string) {
            if (toggledSlice) {
                setGenderDonutChartSliceName(sliceName);
            } else {
                setGenderDonutChartSliceName("");
            }
        },
    }));    

    const chartRefD3StackedBarChart: any = useRef();

    return (
        <>
        <D3StackedBarChart
            height={props.height}
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
            genderDonutChartSliceName={genderDonutChartSliceName}
            onGroupClick={props.onAgeGroupClick}
            onSubGroupClick={props.onExerciseLevelClick}
            ref={chartRefD3StackedBarChart}
        />
        </>
    );
});

export default StackedBarChartAgeVsExercise;
