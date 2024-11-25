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

    // Dimensions and panel settings
    const dimensions = {
        width: 1200,
        height: 800,
        margin: { top: 50, bottom: 50, right: 30, left: 70 },
        panelSpacing: 20, // Space between panels
        panelWidth: 300, // Individual panel width
        panelHeight: 500, // Individual panel height
    };

    const xAccessors = {
        fasting: d => d.fasting,
        after: d => d.after,
        insulin: d => d.insulin,
    };

    const yAccessor = d => d.bmi;

    const measures = ["fasting", "after", "insulin"];
    const xLabels = {
        fasting: "Fasting Blood Glucose (mg/dL)",
        after: "2-Hour Postprandial Glucose (mg/dL)",
        insulin: "Insulin Level (µIU/mL)",
    };

    // Define color scale
    const colorScale = d3.scaleOrdinal()
        .domain(["Yes", "No", "Borderline"])
        .range(["#e31a1c", "#a6cee3", "#1f78b4"]);

    // Main SVG container
    const svg = d3.select("#chart1")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);

    // Scales
    const yScale = d3.scaleLinear()
        .domain([d3.min(dataset, yAccessor) - 1, d3.max(dataset, yAccessor) + 1])
        .range([dimensions.panelHeight - dimensions.margin.bottom, dimensions.margin.top]);

    const xScales = {
        fasting: d3.scaleLog()
            .domain([1, d3.max(dataset, xAccessors.fasting) + 10])
            .range([0, dimensions.panelWidth]),

        after: d3.scaleLog()
            .domain([1, d3.max(dataset, xAccessors.after) + 10])
            .range([0, dimensions.panelWidth]),

        insulin: d3.scaleLog()
            .domain([1, d3.max(dataset, xAccessors.insulin) + 10])
            .range([0, dimensions.panelWidth]),
    };

    // Render scatter plot panels
    measures.forEach((measure, index) => {
        const xScale = xScales[measure];
        const xAccessor = xAccessors[measure];

        // Create panel group
        const plotGroup = svg.append("g")
            .attr("transform", `translate(${index * (dimensions.panelWidth + dimensions.panelSpacing)}, ${dimensions.margin.top})`);

        // X-axis
        plotGroup.append("g")
            .attr("transform", `translate(0,${dimensions.panelHeight - dimensions.margin.bottom})`)
            .call(d3.axisBottom(xScale).ticks(5, "~s"))
            .append("text")
            .attr("x", dimensions.panelWidth )
            .attr("y", 40)
            .attr("fill", "black")
            .style("text-anchor", "middle")
            .text(xLabels[measure]);

        // Y-axis
        if (index === 0) { // Add Y-axis only for the first panel
            plotGroup.append("g")
                .call(d3.axisLeft(yScale))
                .append("text")
                .attr("x", -dimensions.panelHeight / 2)
                .attr("y", -40)
                .attr("fill", "black")
                .attr("transform", "rotate(-90)")
                .style("text-anchor", "middle")
                .text("Body Mass Index (BMI)");
        } else {
            plotGroup.append("g").call(d3.axisLeft(yScale).tickValues([])); // No ticks for subsequent panels
        }

        // Data points
        plotGroup.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(xAccessor(d)))
            .attr("cy", d => yScale(yAccessor(d)))
            .attr("r", 4)
            .style("fill", d => colorScale(d.diabetes))
            .style("opacity", 0.5) // Adjust opacity to manage overlaps
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .style("stroke", "black")
                    .style("stroke-width", 2)
                    .attr("r", 6);
            })
            .on("mouseout", function() {
                d3.select(this)
                    .style("stroke", "none")
                    .attr("r", 4);
            });
    });

    // Legend
    const legend = svg.append("g")
        .attr("transform", `translate(${dimensions.width - 150}, 50)`);

    colorScale.domain().forEach((category, i) => {
        legend.append("rect")
            .attr("x", 0)
            .attr("y", i * 20)
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", colorScale(category));

        legend.append("text")
            .attr("x", 20)
            .attr("y", i * 20 + 12)
            .style("font-size", "12px")
            .text(category);
    });
});
