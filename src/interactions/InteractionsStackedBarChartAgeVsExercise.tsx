// @ts-nocheck

import * as d3 from "d3";

export function onStackedBarChartAgeVsExerciseClickAgeGroup(toggledBarGroup: boolean, groupName: string) {

    // console.log("AgeGroup interactive", toggledBarGroup);

    // ----------------------------------------------
    // Bar Groups
    if (toggledBarGroup) {
        // Hide all exercise level bars not selected in Exercise Level vs. Age Group chart.
        d3
        .select(".bar-chart-age-vs-exercise-level")
        // .select("#barSubgroup0")
        .selectAll("[data-selected-group='false']")
            .style("filter", "saturate(0)")
            .style("opacity", "0.3")
            .style("transition", "opacity, filter")
            .style("transition-delay", ".5s")
            .style("transition-duration", ".5s");
            
    } else {

        // Disable any selected age groups.
        d3
        .select(".bar-chart-age-vs-exercise-level")
        // .select("#barSubgroup0")
        .selectAll("[data-selected-axis-label='true']")
            .attr("data-selected-axis-label", "false")
            .attr("fill", "black")
            .style("font-size", "12px")
            .style("font-weight", "normal");

        // Show all exercise level bars not selected in Exercise Level vs. Age Group chart.
        d3
        .select(".bar-chart-age-vs-exercise-level")
        // .select("#barSubgroup0")
        .selectAll("[data-selected-group='false']")
            .style("filter", "saturate(1)")
            .style("opacity", "0.9")
            .style("transition", "opacity, filter")
            .style("transition-delay", ".5s")
            .style("transition-duration", ".5s");

    }
}

export function onStackedBarChartAgeVsExerciseClickExerciseLevel(toggledBarSubgroup: boolean, group?: any, subgroup?: any) {

    // console.log("ExerciseLevel interactive", toggledBarSubgroup, group, subgroup);

    // ----------------------------------------------
    // Bar Subgroups
    if (toggledBarSubgroup) {
            
        // ----------------------------------------------

        // Disable any selected age groups.
        d3
        .select(".bar-chart-age-vs-exercise-level")
        // .select("#barSubgroup0")
        .selectAll("[data-selected-axis-label='true']")
            .attr("data-selected-axis-label", "false")
            .attr("fill", "black")
            .style("font-size", "12px")
            .style("font-weight", "normal");

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

        // Make sure to enable the exercise subgroup selected.
        d3
        .select(".bar-chart-age-vs-exercise-level")
        // .select("#barSubgroup0")
        .selectAll("[data-selected-bar='true']")
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
            .style("opacity", 0.2)
            .transition().duration(1500)
            .style("opacity", 1);

        // Retransition the dots to make them fade in.
        d3
        .select(".scatterplot-chart-waist-cirumference-vs-bmi")
        .selectAll(".dots")
        .selectAll("circle")
            .style("opacity", 0.2)
            .transition().duration(1500)
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

        // Retransition the dots to make them fade in.
        d3
        .select(".scatterplot-chart-waist-cirumference-vs-bmi")
        .selectAll(".dots")
        .selectAll("circle")
            .style("opacity", 0);
    }

}
