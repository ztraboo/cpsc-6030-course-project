d3.csv("dataset.csv").then(function(dataset) {
    // Prepare data: Group by Age and Exercise Level
    dataset.forEach(element => {
        element.age = +element['Ridageyr'];
        element.exercise = element['Paq605 ( Vigorous Exercise)'];
    });

    // Function to categorize age into groups
    function getAgeGroup(age) {
        if (age <= 17) return "≤17";
        if (age >= 18 && age <= 34) return "18-34";
        if (age >= 35 && age <= 59) return "35-59";
        if (age >= 60) return "60 and older";
    }

    // Aggregate data by age group and exercise level
    const ageGroupExerciseCounts = d3.rollup(
        dataset,
        v => v.length, // Count participants
        d => getAgeGroup(d.age), // Group by Age Group
        d => d.exercise // Group by Exercise Level
    );

    // Convert the data into an array of objects for easy stacking
    const formattedData = Array.from(ageGroupExerciseCounts, ([ageGroup, exerciseMap]) => {
        const entry = { AgeGroup: ageGroup, No: 0, Vigorous: 0 };
        exerciseMap.forEach((count, exercise) => {
            if (exercise === "No") entry.No = count;
            else if (exercise === "Vigorous") entry.Vigorous = count;
        });
        return entry;
    });

    // Calculate the maximum participants across all age groups for x-axis scaling
    const maxParticipants = d3.max(formattedData, d => d.No + d.Vigorous);

    // Dimensions
    const dimensions = {
        width: 900,
        height: 400,
        margin: { top: 20, right: 20, bottom: 100, left: 100 }
    };

    // Create SVG container
    var svg = d3.select("#bar-chart")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        .append("g")
        .attr("transform", `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);
        
    // Update yScale to use age groups as categories
    var yScale = d3.scaleBand()
        .domain(["≤17", "18-34", "35-59", "60 and older"]) // Custom order for age groups
        .range([0, dimensions.height - dimensions.margin.top - dimensions.margin.bottom])
        .padding(0.2);

    // Update xScale to use the maximum participant count
    var xScale = d3.scaleLinear()
        .domain([0, maxParticipants + 10]) // x-axis based on the maximum total count for each age group
        .range([0, dimensions.width - dimensions.margin.left - dimensions.margin.right]);

    var colorScale = d3.scaleOrdinal()
        .domain(["No", "Vigorous"])
        .range(["#377eb8", "#ff7f00"]); // Colors for "No" and "Vigorous" exercise levels

    // Define the stack generator
    var stackGenerator = d3.stack()
        .keys(["No", "Vigorous"]);

    var layers = stackGenerator(formattedData);

    // Append y-axis (age groups)
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("x", -dimensions.margin.left + 40)
        .attr("y", -10)
        .attr("fill", "black")
        .style("text-anchor", "start")
        .text("Age Group");

    // Append x-axis (participant count)
    svg.append("g")
        .attr("transform", `translate(0, ${dimensions.height - dimensions.margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(10)) // Adjust ticks as needed
        .append("text")
        .attr("x", (dimensions.width - dimensions.margin.left - dimensions.margin.right) / 2)
        .attr("y", 35)
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .text("Participants");

    // Render the stacked bars
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
        .attr("y", d => yScale(d.data.AgeGroup)) // Position by age group
        .attr("x", d => xScale(d[0])) // Start of the bar segment
        .attr("width", d => xScale(d[1]) - xScale(d[0])) // Width of the bar segment
        .attr("height", yScale.bandwidth()); // Height based on band scale
        
    // Legend
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
