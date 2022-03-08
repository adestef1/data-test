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

 // Initiialize the labels
 
 
 // A function that updates the plot for a given variable:

 function update(question, attr_col, attr_val) {
    d3.csv("https://raw.githubusercontent.com/adestef1/data-test/main/poll03_recode.csv").then(function(data) {

        //Make hash of attributes that go in

        attributes = {'Gender': ['Male', 'Female', 'Non-binary'], 'Financial-Aid': ['None', 'Grants covering some costs', 'Grants covering all costs'],
                      'Grad_year_lumped:': [2022, 2023, 2024, 2025], 'int_or_dom': ['Domestic', 'International'], 'c1_field': ['PS', 'LS', 'SS', 'AH', 'U']}

        //Function to filter for all attributes
        function filter_func(attr, val) {
            if (attr === null) {
                return data
            } else {
                return data.filter(function(a) {
                  return a[attr] == val});
            }
        };

        //Function to hash
        function hash_it(fil_data) {        
          let hash = {};
          let total = 0;
          fil_data.forEach(function(a) {
              let cleaned = a[question];
              if (hash[cleaned]) {
                  hash[cleaned] += 1;
                  total += 1;
              }  else {
                  hash[cleaned] = 1;
                  total += 1;
              }
          });
          return [hash, total]
        };

        //Filter for all attributes in crosstab
        let filteredData = filter_func(attr_col, attr_val);
        let returned = hash_it(filteredData)
        let hashed = returned[0]
        let total_at = returned[1]

        //Work into readable for double paragraph
        let readable = []
        for (const [key, value] of Object.entries(hashed)) {
            readable.push({'group': key, 'value': (value/total_at)*100});
          }

        //Debug
        console.log(readable)
        
        //Update this to multi bargraph
 
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

        //Add changeable title and axis changes
   })
 }
 
 // Initialize the plot with the first dataset
 update('us_mil_action', null, null)
 