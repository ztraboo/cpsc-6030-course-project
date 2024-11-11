d3.csv("dataset.csv").then(function(dataset) {
    // Prepare data: Group by Age and Exercise Level
    dataset.forEach(element => {
        element.age = +element['Ridageyr'];
        element.exercise = element['Paq605 ( Vigorous Exercise)'];
    });

    // Aggregate data by age and exercise level
    const ageExerciseCounts = d3.rollup(
        dataset,
        v => v.length, // Count participants
        d => d.age, // Group by Age
        d => d.exercise // Group by Exercise Level
    );

    // Convert the data into an array of objects for easy stacking
    const formattedData = Array.from(ageExerciseCounts, ([age, exerciseMap]) => {
        const entry = { Age: +age, No: 0, Vigorous: 0 };
        exerciseMap.forEach((count, exercise) => {
            if (exercise === "No") entry.No = count;
            else if (exercise === "Vigorous") entry.Vigorous = count;
        });
        return entry;
    }).sort((a, b) => a.Age - b.Age);;

    var maxParticipants = d3.max(formattedData, d => d.No + d.Vigorous);
    console.log(maxParticipants)
    // Dimensions
    const dimensions = {
        width: 1200,
        height: 400,
        margin: { top: 10, right: 10, bottom: 50, left: 160 }
    };

    // Create SVG container
    var svg = d3.select("#bar-chart")
        .style("width", dimensions.width)
        .style("height", dimensions.height)
        
    var xScale = d3.scaleBand()
        .domain(formattedData.map(d => d.Age))
        .range([0, dimensions.width - dimensions.margin.left - dimensions.margin.right])
        .padding(0.1);

    var yScale = d3.scaleLinear()
        .domain([0, maxParticipants+10]) // y-axis based on the maximum total count for each age
        .range([dimensions.height - dimensions.margin.bottom, 0]);

    var colorScale = d3.scaleOrdinal()
        .domain(["No", "Vigorous"])
        .range(["#377eb8", "#ff7f00"]); // Colors for "No" and "Vigorous" exercise levels

    // Define the stack generator
    var stackGenerator = d3.stack()
        .keys(["No", "Vigorous"]);

    var layers = stackGenerator(formattedData);

    svg.append("g")
    .attr("transform", `translate(0, ${dimensions.height - dimensions.margin.bottom})`)
    .call(d3.axisBottom(xScale))
    .append("text")
    .attr("x", (dimensions.width - dimensions.margin.left - dimensions.margin.right) / 2)
    .attr("y", 35)
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .text("Age");

    // Add y-axis with explicit styling to ensure visibility
    // svg.append("g")
    //     .call(d3.axisLeft(yScale).tickSize(-dimensions.width + dimensions.margin.left + dimensions.margin.right))
    //     .selectAll("text")
    //     .style("fill", "black") // Ensure text color is set to visible
    //     .style("font-size", "12px");

    // Add y-axis label
    svg.select("g")
        .append("text")
        .attr("x", -dimensions.height / 2)
        .attr("y", -50)
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text("No. of Participants");

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
        .attr("x", d => xScale(d.data.Age))
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .attr("width", xScale.bandwidth());

    // Add total count labels above each bar
    svg.selectAll(".bar-label")
        .data(formattedData)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", d => xScale(d.Age) + xScale.bandwidth() / 2) // Center the text on each bar
        .attr("y", d => yScale(d.No + d.Vigorous) - 5) // Position the text above the bar
        .attr("text-anchor", "middle")
        .style("fill", "black")
        .style("font-size", "12px")
        .text(d => d.No + d.Vigorous); // Display the total count for that age

    // Legend
    const legend = svg.selectAll(".legend")
        .data(colorScale.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${dimensions.width - 100}, ${i * 20 + 20})`);

    legend.append("rect")
        .attr("x", -20)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", colorScale);

    legend.append("text")
        .attr("x", -5)
        .attr("y", 10)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(d => d);
});
