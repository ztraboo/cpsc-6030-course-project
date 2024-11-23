d3.csv("dataset.csv").then(function (dataset) {
    // Prepare dataset
    dataset.forEach(element => {
        element.bmi = +element['Bmxbmi'];
        element.age = +element['Ridageyr'];
        element.vigorous = element['Paq605 ( Vigorous Exercise)'];
        element.fasting = +element['Lbxglu(Glucose fasting)'];
        element.insulin = +element['Insulin'];
        element.after = +element['Lbxglt(Glucose after 2 hr)'];
        element.diabetes = element['Diabetes Diagnosis Status'];
        element.seqn = +element['Seqn'];
    });

    // Function to categorize age into groups
    function getAgeGroup(age) {
        if (age <= 17) return "≤17";
        if (age >= 18 && age <= 34) return "18-34";
        if (age >= 35 && age <= 59) return "35-59";
        if (age >= 60) return "60 and older";
    }

    // Add an `ageGroup` property to each dataset row
    dataset.forEach(d => {
        d.ageGroup = getAgeGroup(d.age);
    });

    // Dimensions
    const dimensions = {
        width: 1200,
        height: 800,
        margin: { top: 10, bottom: 10, right: 10, left: 50 },
        plotHeight: 200,
    };

    const xAccessor = d => d.bmi;
    const yAccessors = {
        insulin: d => d.insulin,
        fasting: d => d.fasting,
        after: d => d.after,
    };

    const colorScale = d3.scaleOrdinal()
        .domain(["Yes", "No", "Borderline"])
        .range(["#e31a1c", "#a6cee3", "#1f78b4"]);

    const xScale = d3.scaleLinear()
        .domain([d3.min(dataset, xAccessor) - 1, d3.max(dataset, xAccessor) + 1])
        .range([dimensions.margin.left, dimensions.width - dimensions.margin.right]);

    const yScales = {
        insulin: d3.scaleLinear()
            .domain([0, d3.max(dataset, yAccessors.insulin) + 5])
            .range([dimensions.plotHeight - dimensions.margin.bottom, dimensions.margin.top]),

        fasting: d3.scaleLinear()
            .domain([0, d3.max(dataset, yAccessors.fasting) + 5])
            .range([dimensions.plotHeight - dimensions.margin.bottom, dimensions.margin.top]),

        after: d3.scaleLinear()
            .domain([0, d3.max(dataset, yAccessors.after) + 5])
            .range([dimensions.plotHeight - dimensions.margin.bottom, dimensions.margin.top]),
    };

    const svg = d3.select("#chart1")
        .style("width", dimensions.width)
        .style("height", dimensions.height);

    function renderScatterPlot(filteredData) {
        // Clear existing points
        svg.selectAll("g").remove();

        // Render scatter plots for each measure
        ["fasting", "after", "insulin"].forEach((measure, index) => {
            const yScale = yScales[measure];
            const yAccessor = yAccessors[measure];

            // Create a group for each scatter plot
            const plotGroup = svg.append("g")
                .attr("transform", `translate(0, ${index * dimensions.plotHeight})`);

            // Add separator line, except after the last plot
            if (index < 2) {
                svg.append("line")
                    .attr("x1", dimensions.margin.left)
                    .attr("x2", dimensions.width - dimensions.margin.right)
                    .attr("y1", (index + 1) * dimensions.plotHeight)
                    .attr("y2", (index + 1) * dimensions.plotHeight)
                    .attr("stroke", "gray")
                    .attr("stroke-width", 1)
                    .attr("stroke-dasharray", "4,4");
            }

            // Add X-axis (only to the bottom plot)
            if (measure === "insulin") {
                plotGroup.append("g")
                    .attr("transform", `translate(0,${dimensions.plotHeight - dimensions.margin.bottom})`)
                    .call(d3.axisBottom(xScale))
                    .append("text")
                    .attr("x", dimensions.width / 2)
                    .attr("y", 35)
                    .attr("fill", "black")
                    .style("text-anchor", "middle")
                    .text("BMI");
            }

            // Add Y-axis
            plotGroup.append("g")
                .attr("transform", `translate(${dimensions.margin.left},0)`)
                .call(d3.axisLeft(yScale))
                .append("text")
                .attr("x", -dimensions.plotHeight / 2)
                .attr("y", -35)
                .attr("fill", "black")
                .attr("transform", "rotate(-90)")
                .style("text-anchor", "middle")
                .text(measure === "insulin" ? "Insulin Level" : (measure === "fasting" ? "Fasting Blood Glucose" : "2-Hour Postprandial Blood Glucose"));

            // Plot data points for each measure with colors based on diabetes status
            plotGroup.selectAll("circle")
                .data(filteredData)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(xAccessor(d)))
                .attr("cy", d => yScale(yAccessor(d)))
                .attr("r", 4)
                .style("fill", d => colorScale(d.diabetes))
                .style("opacity", 0.7)
                .attr("class", d => `point-seqn-${d.seqn}`)
                .on("mouseover", function(event, d) {
                    d3.selectAll(`.point-seqn-${d.seqn}`)
                        .style("stroke", "black")
                        .style("stroke-width", 2)
                        .attr("r", 6);
                })
                .on("mouseout", function(event, d) {
                    d3.selectAll("circle")
                        .style("stroke", "none")
                        .style("fill", d => colorScale(d.diabetes))
                        .attr("r", 4)
                        .style("opacity", 0.7);
                })
                .on("click", function(event, d) {
                    console.log("Clicked seqn:", d.seqn);
                    d3.selectAll("circle")
                        .style("stroke", "none")
                        .style("fill", d => colorScale(d.diabetes))
                        .attr("r", 4)
                        .style("opacity", 0.3);
                    d3.selectAll(`.point-seqn-${d.seqn}`)
                        .style("stroke", "black")
                        .style("stroke-width", 2)
                        .style("opacity", 1)
                        .attr("r", 6);
                });
        });
    }

    // Initial render with all data
    renderScatterPlot(dataset);

    // Listen for age group selection event
    window.addEventListener("ageGroupSelected", function (event) {
        const selectedAgeGroup = event.detail.ageGroup;
        const selectedExercise = event.detail.exerciseType;

        // Filter dataset based on the selected age group and exercise type
        const filteredData = dataset.filter(
            d => d.ageGroup === selectedAgeGroup && d.vigorous.trim().toLowerCase() === selectedExercise.trim().toLowerCase()
        );

        renderScatterPlot(filteredData);
    });
    // Listen for age-only selection event
    window.addEventListener("ageOnlySelected", function (event) {
        const selectedAgeGroup = event.detail.ageGroup;

        // Filter dataset based on the selected age-group
        const filteredData = dataset.filter(
            d => d.ageGroup === selectedAgeGroup
        );

        // Render scatter plots with the filtered data (age-group only)
        renderScatterPlot(filteredData);
    });
});