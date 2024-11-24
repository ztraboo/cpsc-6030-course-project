// @ts-nocheck

import * as d3 from "d3";

import { colorScaleGender } from "../components/marks/Color";

export function onDonutChartGenderSliceClick(toggledSlice: boolean, selectedSeqnIdentifiers: Set<number>, sliceName: string) {
    // console.log("toggledSlice ", toggledSlice);

    // Handle interactions for `Blood Measures vs. BMI` scatterplot chart.
    // ------------------------------------------------------------------------
    if (toggledSlice) {
        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .select(".chart-1")
        .select(".dots")
        .selectAll("circle")
            .filter(function(d: SVGCircleElement) { 
                return !(selectedSeqnIdentifiers.has(this.dataset.seqn));
            })
            .transition().duration(1000)
            .attr("r", 0);

        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .select(".chart-2")
        .select(".dots")
        .selectAll("circle")
            .filter(function(d: SVGCircleElement) { 
                return !(selectedSeqnIdentifiers.has(this.dataset.seqn));
            })
            .transition().duration(1000)
            .attr("r", 0);

        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .select(".chart-3")
        .select(".dots")
        .selectAll("circle")
            .filter(function(d: SVGCircleElement) { 
                return !(selectedSeqnIdentifiers.has(this.dataset.seqn));
            })
            .transition().duration(1000)
            .attr("r", 0);
            
    } else {
        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .select(".chart-1")
        .select(".dots")
        .selectAll("circle")
            .transition().duration(1000)
            .attr("r", 5);

        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .select(".chart-2")
        .select(".dots")
        .selectAll("circle")
            .transition().duration(1000)
            .attr("r", 5);

        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .select(".chart-3")
        .select(".dots")
        .selectAll("circle")
            .transition().duration(1000)
            .attr("r", 5);
    }

    // Handle interactions for `Waist Circumference vs. BMI` scatterplot chart.
    // ------------------------------------------------------------------------
    if (toggledSlice) {
        d3
        .select(".scatterplot-chart-waist-cirumference-vs-bmi")
        .select(".dots")
        .selectAll("circle")
            .filter(function(d: SVGCircleElement) { 
                return !(selectedSeqnIdentifiers.has(this.dataset.seqn));
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


    // Handle interactions for `Physical Workout vs. Age` scatterplot chart.
    // ------------------------------------------------------------------------
    if (toggledSlice) {

        d3
        .select(".bar-chart-age-vs-exercise-level")
        .select("#barSubgroup0")
        .selectAll("rect")
            .transition().duration(1000)
            .attr("width", function(d: SVGRectElement) { 
                let sliceExecLevelXScale: number = 0;
                if (sliceName.toLowerCase() == "male") {
                    sliceExecLevelXScale = this.dataset.execlevelMaleXscale;
                } else if (sliceName.toLowerCase() == "female") {
                    sliceExecLevelXScale = this.dataset.execlevelFemaleXscale;
                }
                return sliceExecLevelXScale;
            });

        d3
        .select(".bar-chart-age-vs-exercise-level")
        .select("#barSubgroup1")
        .selectAll("rect")
            .transition().duration(1000)
            .attr("x", function(d: SVGRectElement) {
                let barSubgroup0X = 
                    d3
                    .select(".bar-chart-age-vs-exercise-level")
                    .select("#barSubgroup0")
                    .select("[data-agegroup='≤17']")
                    .attr("x");
    
                let barSubgroup0Width = 
                    d3
                    .select(".bar-chart-age-vs-exercise-level")
                    .select("#barSubgroup0")
                    .select("[data-agegroup='" + this.dataset.agegroup + "']")
                    .attr("width");
    
                let sliceExecLevelXScale: number = 0;
                if (sliceName.toLowerCase() == "male") {
                    sliceExecLevelXScale = 
                    d3
                    .select(".bar-chart-age-vs-exercise-level")
                    .select("#barSubgroup0")
                    .select("[data-agegroup='" + this.dataset.agegroup + "']")
                    .attr("data-execlevel-male-xscale");
                } else if (sliceName.toLowerCase() == "female") {
                    sliceExecLevelXScale = 
                    d3
                    .select(".bar-chart-age-vs-exercise-level")
                    .select("#barSubgroup0")
                    .select("[data-agegroup='" + this.dataset.agegroup + "']")
                    .attr("data-execlevel-female-xscale");
                }

                return barSubgroup0X + sliceExecLevelXScale;
            })
            .attr("width", function(d: SVGRectElement) { 
                let sliceExecLevelXScale: number = 0;
                if (sliceName.toLowerCase() == "male") {
                    sliceExecLevelXScale = this.dataset.execlevelMaleXscale;
                } else if (sliceName.toLowerCase() == "female") {
                    sliceExecLevelXScale = this.dataset.execlevelFemaleXscale;
                }
                return sliceExecLevelXScale;
            });

    } else {
        d3
        .select(".bar-chart-age-vs-exercise-level")
        .selectAll(".barSubgroup")
        .selectAll("rect")
            .transition().duration(2000)
            .attr("x", function(d: SVGRectElement) { 
                return (this.dataset.x);
            })
            .attr("width", function(d: SVGRectElement) { 
                return (this.dataset.execlevelXscale);
            });
    }
}
