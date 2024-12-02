import { forwardRef, useImperativeHandle, useState } from "react";

import * as _ from "lodash";
import * as d3 from "d3";

import styles from "./donut-chart.module.css";

import D3DonutChart from "./D3DonutChart";
import { colorScaleGender } from "../marks/Color";

type DataItem = {
    seqnIdentifiers: Set<number>;
    name: string;
    value: number;
    percentage: number;
  };

interface DonutChartGenderProps {
    width: number;
    height: number;
    data: DataItem[];
    onUpdateParticipantCount: Function;
    onFilterByGender: Function;
    onSliceClick: Array<Function> | [];
};

interface DonutChartGenderRef {
    onUpdateGenderOnStackedBarExerciseBarClick: (d: any) => void;
};

const DonutChartGender = forwardRef<DonutChartGenderRef, DonutChartGenderProps>((props, ref) => {

    const [filteredGenderDonutChartData, setFilteredGenderDonutChartData] = useState<Array<DataItem>>(_.cloneDeep(props.data));
    // setGenderDonutChartData(_.cloneDeep(props.data));
    // const [genderDonutChartDataOriginal, setGenderDonutChartDataOriginal] = useState(props.dataOriginal);
    // const [genderDonutChartDataFiltered, setGenderDonutChartDataFiltered] = useState(props.data);

    useImperativeHandle(ref, () => ({

        // @ts-ignore
        onUpdateGenderOnStackedBarExerciseBarClick(toggledExerciseLevelBar: boolean, ageGroup: any, exerciseLevel: any) {
            console.log("Donut updateGenderExerciseClick", toggledExerciseLevelBar, ageGroup, exerciseLevel);

            let dataExerciseLevel = 0;
            let dataExerciseLevelMale = 0;
            let dataExerciseLevelFemale = 0;

            if (exerciseLevel.key === "No") {
                dataExerciseLevel = ageGroup.data.No
                dataExerciseLevelMale = ageGroup.data.NoMale;
                dataExerciseLevelFemale = ageGroup.data.NoFemale;
            } else if (exerciseLevel.key === "Vigorous") {
                dataExerciseLevel = ageGroup.data.Vigorous
                dataExerciseLevelMale = ageGroup.data.VigorousMale;
                dataExerciseLevelFemale = ageGroup.data.VigorousFemale;
            }

            let filteredDonutChartData:Array<DataItem> = _.cloneDeep(props.data);

            if (toggledExerciseLevelBar) {
                filteredDonutChartData.forEach((d) => {
                    switch (d.name) {
                        case "Female":
                            d.value = dataExerciseLevelFemale;
                            d.percentage = (dataExerciseLevelFemale / dataExerciseLevel) * 100;
                            break;
                        case "Male":
                            d.value = dataExerciseLevelMale;
                            d.percentage = (dataExerciseLevelMale / dataExerciseLevel) * 100
                            break;
                    }
                });

                setFilteredGenderDonutChartData(filteredDonutChartData);
            } else {
                let selectedGenderSlice:string | null = "";
                document.querySelectorAll('[class^="donut-chart_slice"]').forEach((slice: any) => {
                    if (slice.dataset.genderSliceSelected !== undefined) {
                        selectedGenderSlice = slice.dataset.genderSliceSelected;

                        slice.removeAttribute("style");
                        slice.setAttribute("style", "filter: saturate(100%); opacity: 1;");
                        slice.setAttribute("data-gender-slice-selected", slice.dataset.genderSliceSelected);
                    } else {
                        slice.removeAttribute("style");
                        slice.removeAttribute("data-gender-slice-selected");

                    }
                });

                setFilteredGenderDonutChartData(filteredDonutChartData);
            }

            // Update participant count based on slice selection.
            let totalParticipantCountSelectedSlice = 0;
            document.querySelectorAll('[class^="donut-chart_slice"]').forEach((slice: any) => {
                const sliceGenderSelected = filteredDonutChartData.filter((d) => d.name === slice.dataset.genderSliceSelected);
                var sliceValue = (sliceGenderSelected.length !== 0 ? sliceGenderSelected[0].value : 0 );
                if (slice.dataset.genderSliceSelected !== undefined) {
                    totalParticipantCountSelectedSlice += sliceValue;
                }
            });

            // Change the number for participants for the whole donut chart values.
            let totalParticipantCountAllSlices = 0;
            filteredDonutChartData.forEach((slice) => {
                totalParticipantCountAllSlices += slice.value
            })

            props.onUpdateParticipantCount(
                totalParticipantCountSelectedSlice !== 0 ? totalParticipantCountSelectedSlice : 
                totalParticipantCountAllSlices
            );
        },
        onUpdateGenderOnStackedBarAgeGroupClick(toggledAgeGroup: boolean, ageGroup: any) {
            console.log("Donut updateGenderAgeGroupClick", toggledAgeGroup, ageGroup);
        }
    }));

    return (
        <>
        <D3DonutChart
            width={props.width}
            height={props.height}
            data={filteredGenderDonutChartData}
            // dataOriginal={props.dataOriginal}
            showPercentages={true}
            markColorScale={colorScaleGender}
            onUpdateParticipantCount={props.onUpdateParticipantCount}
            onFilterByGender={props.onFilterByGender}
            onSliceClick={props.onSliceClick}
        />
        </>
    );
});

export default DonutChartGender;
