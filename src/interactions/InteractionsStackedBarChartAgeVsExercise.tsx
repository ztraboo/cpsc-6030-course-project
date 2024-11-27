// @ts-nocheck

import * as d3 from "d3";

export function onStackedBarChartAgeVsExerciseClick(toggledBarSubgroup: boolean, group: any, subgroup: any) {

    // console.log("interactive", toggledBarSubgroup, group, subgroup);
    if (toggledBarSubgroup) {
            
        // ----------------------------------------------

        // Hide all exercise level bars not selected in Exercise Level vs. Age Group chart.
        d3
        .select(".bar-chart-age-vs-exercise-level")
        // .select("#barSubgroup0")
        .selectAll("[data-selected-bar='false']")
            .style("filter", "saturate(0)")
            .style("opacity", "0.3")
            .style("transition", "opacity, filter")
            .style("transition-delay", ".5s")
            .style("transition-duration", ".5s");

        // Retransition the dots to make them fade in.
        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .selectAll(".dots")
        .selectAll("circle")
            .style("opacity", 0.2)
            .transition().duration(1500)
            .style("filter", "saturate(0)")
            .style("opacity", 1);

    } else {

        // Show all exercise level bars not selected in Exercise Level vs. Age Group chart.
        d3
        .select(".bar-chart-age-vs-exercise-level")
        // .select("#barSubgroup0")
        .selectAll("[data-selected-bar='false']")
            .style("filter", "saturate(1)")
            .style("opacity", "0.9")
            .style("transition", "opacity, filter")
            .style("transition-delay", ".5s")
            .style("transition-duration", ".5s");

        // Retransition the dots to make them fade in.
        d3
        .select(".scatterplot-chart-blood-measures-vs-bmi")
        .selectAll(".dots")
        .selectAll("circle")
            .style("opacity", 0);
    }

}
