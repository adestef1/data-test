 // set the dimensions and margins of the graph
 const margin = {top: 30, right: 30, bottom: 70, left: 60},
     width = 1000 - margin.left - margin.right,
     height = 400 - margin.top - margin.bottom;
 
 // append the svg object to the body of the page
 const svg = d3.select("#graph")
   .append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
   .append("g")
     .attr("transform", `translate(${margin.left},${margin.top})`);
 
 // Initialize the X axis
 const x = d3.scaleBand()
   .range([ 0, width ])
   .padding(0.2);
 const xAxis = svg.append("g")
   .attr("transform", `translate(0,${height})`)
 
 // Initialize the Y axis
 const y = d3.scaleLinear()
   .range([ height, 0]);
 const yAxis = svg.append("g")
   .attr("class", "myYaxis")
 
 
 // A function that create / update the plot for a given variable:

 function update(question, attr_col, attr_val) {
    d3.csv("poll03_recode.csv").then(function(data) {
        // Data is array
        let filteredData = data.filter(function(a) {
            return a[attr_col] == attr_val;
        });
        let hash = {};
        let total = 0;
        filteredData.forEach(function(a) {
            let cleaned = a[question];
            if (hash[cleaned]) {
                hash[cleaned] += 1;
                total += 1;
            }  else {
                hash[cleaned] = 1;
                total += 1;
            }
        });
        let readable = []
        for (const [key, value] of Object.entries(hash)) {
            readable.push({'group': key, 'value': value/total});
          }
        console.log(readable)
        console.log("HELLO")

        //Get hash in readable format to than replace data with new thing, than should be easy hopefully?
 
        // Update the X axis
        x.domain(readable.map(d => d.group))
        xAxis.call(d3.axisBottom(x))

        // Update the Y axis
        y.domain([0, d3.max(readable, d => d.value) ]);
        yAxis.transition().duration(1000).call(d3.axisLeft(y));

        // Create the u variable
        var u = svg.selectAll("rect")
            .data(readable)

        u
            .join("rect") // Add a new rect for each new elements
            .transition() 
            .duration(1000)
            .attr("x", d => x(d.group))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", "#69b3a2")
   })
 }
 
 // Initialize the plot with the first dataset
 update('last_had_sex', 'grad_year', 2023)
 