d3.csv("dataset.csv").then(function (dataset) {
    dataset.forEach(element => {
        element.age = +element['Ridageyr'];
        element.exercise = element['Paq605 ( Vigorous Exercise)'];
    });

    function getAgeGroup(age) {
        if (age <= 17) return "≤17";
        if (age >= 18 && age <= 34) return "18-34";
        if (age >= 35 && age <= 59) return "35-59";
        if (age >= 60) return "60 and older";
    }

    const ageGroupExerciseCounts = d3.rollup(
        dataset,
        v => v.length,
        d => getAgeGroup(d.age),
        d => d.exercise
    );

    const formattedData = Array.from(ageGroupExerciseCounts, ([ageGroup, exerciseMap]) => {
        const entry = { AgeGroup: ageGroup, No: 0, Vigorous: 0 };
        exerciseMap.forEach((count, exercise) => {
            if (exercise === "No") entry.No = count;
            else if (exercise === "Vigorous") entry.Vigorous = count;
        });
        return entry;
    });

    const maxParticipants = d3.max(formattedData, d => d.No + d.Vigorous);

    const dimensions = {
        width: 900,
        height: 400,
        margin: { top: 20, right: 20, bottom: 100, left: 100 }
    };

    var svg = d3.select("#bar-chart")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        .append("g")
        .attr("transform", `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);

    var yScale = d3.scaleBand()
        .domain(["≤17", "18-34", "35-59", "60 and older"])
        .range([0, dimensions.height - dimensions.margin.top - dimensions.margin.bottom])
        .padding(0.2);

    var xScale = d3.scaleLinear()
        .domain([0, maxParticipants + 10])
        .range([0, dimensions.width - dimensions.margin.left - dimensions.margin.right]);

    var colorScale = d3.scaleOrdinal()
        .domain(["No", "Vigorous"])
        .range(["#377eb8", "#ff7f00"]);

    var stackGenerator = d3.stack().keys(["No", "Vigorous"]);
    var layers = stackGenerator(formattedData);

    // Append y-axis (age groups)
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll(".tick text") 
        .style("cursor", "pointer")
        .on("click", function (event, d) {
            // Dispatch a custom event for age-only selection
            const eventDetail = {
                detail: { ageGroup: d }
            };
            window.dispatchEvent(new CustomEvent("ageOnlySelected", eventDetail));
            console.log(`Age Group Selected: ${d}`);

            // Highlight the selected age-group by reducing dimming the rest
            svg.selectAll("rect").style("opacity", 0.2);
            svg.selectAll(`rect[y="${yScale(d)}"]`).style("opacity", 1);

            // Change selected age-group text color
            svg.selectAll(".tick text").style("fill", "black").style("background-color", "transparent");
            d3.select(this).style("fill", "red").style("background-color", "transparent");
        });

    svg.append("g")
        .attr("transform", `translate(0, ${dimensions.height - dimensions.margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(10))
        .append("text")
        .attr("x", (dimensions.width - dimensions.margin.left - dimensions.margin.right) / 2)
        .attr("y", 35)
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .text("Participants");

    svg.selectAll(".layer")
        .data(layers)
        .enter()
        .append("g")
        .attr("class", "layer")
        .attr("fill", d => colorScale(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("y", d => yScale(d.data.AgeGroup))
        .attr("x", d => xScale(d[0]))
        .attr("width", d => xScale(d[1]) - xScale(d[0]))
        .attr("height", yScale.bandwidth())
        .on("mouseover", function () {
            d3.select(this).style("stroke", "black").style("stroke-width", 2);
        })
        .on("mouseout", function () {
            d3.select(this).style("stroke", "none");
        })
        .on("click", function (event, d) {
            d3.selectAll("rect").style("opacity", 0.5);
            d3.select(this).style("opacity", 1);

            const selectedAgeGroup = d.data.AgeGroup;
            const selectedExercise = d3.select(this.parentNode).datum().key;
            const eventDetail = {
                detail: {
                    ageGroup: selectedAgeGroup,
                    exerciseType: selectedExercise
                }
            };
            window.dispatchEvent(new CustomEvent("ageGroupSelected", eventDetail));
        });

    const legend = svg.selectAll(".legend")
        .data(colorScale.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${dimensions.width - dimensions.margin.right - 100}, ${i * 20 + 20})`);

    legend.append("rect")
        .attr("x", -80)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", colorScale);

    legend.append("text")
        .attr("x", -50)
        .attr("y", 10)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(d => d);
});
