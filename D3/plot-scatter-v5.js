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
        width: 1800,
        height: 500,
        margin: { top: 10, bottom: 10, right: 10, left: 100 },
        panelSpacing: 20, // Space between panels
        panelWidth: 400, // Individual panel width
        panelHeight: 450, // Individual panel height
    };

    const yAccessor = d => d.bmi;
    const xAccessors = {
        insulin: d => d.insulin,
        fasting: d => d.fasting,
        after: d => d.after,
    };

    const measures = ["fasting", "after", "insulin"];
    const xLabels = {
        fasting: "Fasting Blood Glucose (mg/dL)",
        after: "2-Hour Postprandial Glucose (mg/dL)",
        insulin: "Insulin Level (µIU/mL)",
    };

    const colorScale = d3.scaleOrdinal()
        .domain(["Yes", "No", "Borderline"])
        .range(["#e31a1c", "#a6cee3", "#1f78b4"]);
    
 
    // Update xScale to use logarithmic scaling
    const yScale = d3.scaleLinear()
        .domain([d3.min(dataset, yAccessor) - 1, d3.max(dataset, yAccessor) + 1])
        .range([dimensions.panelHeight - dimensions.margin.bottom, dimensions.margin.top]);

    // Update yScales to use logarithmic scaling
    const xScales = {
        fasting: d3.scaleLog()
            .domain([d3.min(dataset, xAccessors.fasting), d3.max(dataset, xAccessors.fasting) + 10])
            .range([dimensions.margin.left, dimensions.panelWidth + dimensions.margin.left]),
    
        after: d3.scaleLog()
            .domain([d3.min(dataset, xAccessors.after), d3.max(dataset, xAccessors.after) + 10])
            .range([dimensions.margin.left, dimensions.panelWidth + dimensions.margin.left]),
    
        insulin: d3.scaleLog()
            .domain([d3.min(dataset, xAccessors.insulin), d3.max(dataset, xAccessors.insulin) + 10])
            .range([dimensions.margin.left, dimensions.panelWidth + dimensions.margin.left]),
    };
    

    const svg = d3.select("#chart1")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);

    function renderScatterPlot(filteredData) {
        // Clear existing points
        svg.selectAll("g").remove();

        // Render scatter plots for each measure
        measures.forEach((measure, index) => {
            const xScale = xScales[measure];
            const xAccessor = xAccessors[measure];
        
            // Create a group for each scatter plot
            const plotGroup = svg.append("g")
                .attr("transform", `translate(${index * (dimensions.panelWidth + dimensions.panelSpacing)}, ${dimensions.margin.top})`);
                if (index < measures.length - 1) {
                    // svg.append("line")
                    //     .attr("x1", (index + 1) * (dimensions.panelWidth + dimensions.panelSpacing/2) + dimensions.margin.left)
                    //     .attr("x2", (index + 1) * (dimensions.panelWidth + dimensions.panelSpacing/2) + dimensions.margin.left)
                    //     .attr("y1", dimensions.margin.top)
                    //     .attr("y2", dimensions.height - dimensions.margin.bottom)
                    //     .attr("stroke", "black") // Line color
                    //     .attr("stroke-width", 1) // Line thickness
                    //     //.attr("stroke-dasharray", "4,4"); // Optional: make it dashed for visual clarity
                }
            // Add X-axis
            plotGroup.append("g")
                .attr("transform", `translate(0,${dimensions.panelHeight - dimensions.margin.bottom})`)
                .call(d3.axisBottom(xScale).ticks(5, "~s")) // Custom ticks for log scale
                .append("text")
                .style("font-size", "12px")
                .style("font-family", "Arial")
                .attr("x", dimensions.panelWidth /2 + 80) // Centered within each panel
                .attr("y", 35)
                .attr("fill", "black")
                .style("text-anchor", "middle")
                .text(xLabels[measure]);
        
            // Add Y-axis for BMI (shared)
            if (index === 0) {

                plotGroup.append("g")
                        .attr("transform", `translate(${dimensions.margin.left}, 0)`)
                        .call(d3.axisLeft(yScale).ticks(5)) // Adjust number of ticks
                        .selectAll("text") // Style Y-axis labels for better readability
                        .style("font-size", "12px")
                        .style("font-family", "Arial");


                plotGroup.append("g")
                    .attr("transform", `translate(${dimensions.margin.left}, 0)`)
                    
                    .append("text")
                    .attr("x", -dimensions.panelHeight / 2)
                    .attr("y", -35)
                    .attr("fill", "black")
                    .attr("transform", "rotate(-90)")
                    .style("text-anchor", "middle")
                    .text("Body Mass Index (BMI)");
            } else {
                plotGroup.append("g")
                .attr("transform", `translate(${dimensions.margin.left - dimensions.panelSpacing/2}, 0)`)
                .call(d3.axisLeft(yScale).tickValues([])); 
            }
        
            // Plot data points for each measure
            plotGroup.selectAll("circle")
                .data(filteredData)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(xAccessor(d)))
                .attr("cy", d => yScale(d.bmi)) // Y-axis corresponds to BMI
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
    const legend = svg.append("g")
    .attr("transform", `translate(${dimensions.width - 150}, ${dimensions.margin.top})`);


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
