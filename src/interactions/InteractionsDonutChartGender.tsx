// @ts-nocheck

import * as d3 from "d3";

import { colorScaleGender } from "../components/marks/Color";

export function onDonutChartGenderSliceClick(toggledSlice: boolean, selectedColor: string) {
    // console.log("toggledSlice ", toggledSlice);
    if (toggledSlice) {
        d3
        .select(".scatterplot-chart-waist-cirumference-vs-bmi")
        .select(".dots")
        .selectAll("circle")
            .filter(function(d: SVGCircleElement) { 
                return this.attributes.fill.value !== selectedColor;
            })
            .transition().duration(1000)
            .attr("r", 0);
    } else {
        d3
        .select(".scatterplot-chart-waist-cirumference-vs-bmi")
        .select(".dots")
        .selectAll("circle")
            .transition().duration(1000)
            .attr("r", 5);
    }
}
