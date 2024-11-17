d3.csv("dataset.csv").then(
    function(dataset){
        console.log(dataset);
        dataset.forEach(element => {
            element.bmi = +element['Bmxbmi'];
            element.age = +element['Ridageyr'];
            //d.seq= +d['Seqn']
            element.vigorous = element['Paq605 ( Vigorous Exercise)']
            element.fasting = +element['Lbxglu(Glucose fasting)']
            element.insulin = +element['Insulin']
            element.after = +element['Lbxglt(Glucose after 2 hr)']
            element.diabetes = element['Diabetes Diagnosis Status']

        });

        var dimensions = {
            width: 1000,
            height: 600,
            margin:{
                top:10,
                bottom: 50,
                right: 10,
                left: 50
            }
        }

        var xAccessor = d=>d.bmi
        var yAccessor = d=> d.insulin
        console.log(xAccessor)

        var svg = d3.select("#insulin")
                    .style("width",dimensions.width)
                    .style("height",dimensions.height);
        

        // var xScale = d3.scaleLinear()
                        

        // var yScale = d3.scaleLinear()
        //                 .domain(d3.extent(dataset,yAccessor))
        //                 .range([dimensions.height-dimensions.margin.bottom,dimensions.margin.top])
        
        // var dots = svg.append("g")
        //                 .selectAll("circle")
        //                 .data(element)
        //                 .e
        

        var xScale = d3.scaleLinear()
        .domain([d3.min(dataset, xAccessor) - 1, d3.max(dataset, xAccessor) + 1])
        .range([dimensions.margin.left, dimensions.width - dimensions.margin.right]);

        var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, yAccessor) + 10])
        .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top]);

        var colorScale = d3.scaleOrdinal()
        .domain(["Yes", "No", "Borderline"])
        .range(["#e31a1c", "#a6cee3", "#1f78b4"]);
        //.range(["#e41a1c", "#377eb8", "#a6cee3"]);

        svg.append("g")
        .attr("transform", `translate(0,${dimensions.height - dimensions.margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("x", dimensions.width / 2)
        .attr("y", 35)
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .text("BMI");

        svg.append("g")
        .attr("transform", `translate(${dimensions.margin.left},0)`)
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("x", -dimensions.height / 2)
        .attr("y", -35)
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text("Insulin Level");

        svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", d => yScale(yAccessor(d)))
        .attr("r", 4)
        .style("fill", d=>colorScale(d.diabetes))
        .style("opacity", 0.7);
        
        // var xAxis = d3.axisBottom().scale(xScale)
        // var yAxis = d3.axisBottom().scale(yScale)

        var legend = svg.selectAll(".legend")
        .data(colorScale.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${dimensions.width - 100}, ${i * 20 + 20})`);

        legend.append("rect")
        .attr("x", -5)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", colorScale);

        legend.append("text")
        .attr("x", 15)
        .attr("y", 5)
        .attr("dy", ".35em")
        .style("font-size", "12px")
        .text(d => d);
        
    }
)