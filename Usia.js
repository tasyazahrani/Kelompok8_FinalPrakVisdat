// Function to load and process the CSV data
async function loadData() {
    try {
        const response = await fetch('survey lung cancer.csv');
        const csvData = await response.text();
        
        // Parse CSV data
        const data = d3.csvParse(csvData);
        
        // Filter data for patients with lung cancer
        const cancerPatients = data.filter(d => d.LUNG_CANCER === "YES");
        
        // Convert age to number
        cancerPatients.forEach(d => {
            d.AGE = +d.AGE;
        });
        
        // Remove loading message
        document.getElementById('loading').style.display = 'none';
        
        // Create histogram
        createHistogram(cancerPatients);
        
    } catch (error) {
        console.error('Error loading or processing data:', error);
        document.getElementById('loading').textContent = 'Error loading data. Please try again.';
    }
}

// Function to create the histogram
function createHistogram(data) {
    // Set dimensions and margins
    const margin = {top: 40, right: 30, bottom: 60, left: 60};
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Create SVG element
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Create tooltip div
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");
    
    // Calculate histogram bins
    const x = d3.scaleLinear()
        .domain([d3.min(data, d => d.AGE) - 2, d3.max(data, d => d.AGE) + 2])
        .range([0, width]);
    
    // Generate histogram
    const histogram = d3.histogram()
        .value(d => d.AGE)
        .domain(x.domain())
        .thresholds(x.ticks(10));
    
    const bins = histogram(data);
    
    // Y scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .nice()
        .range([height, 0]);
    
    // Add X axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    // Add Y axis
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));
    
    // Add X axis label
    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Age");
    
    // Add Y axis label
    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .text("Frequency");
    
    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Distribusi Usia Pasien Kanker Paru");
    
    // Add bars dengan warna pink yang eksplisit
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.x0) + 1)
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("y", d => y(d.length))
        .attr("height", d => height - y(d.length))
        .attr("fill", "#ff6b6b") // Memastikan semua bar berwarna pink
        .on("mouseover", function(event, d) {
            const [x, y] = d3.pointer(event);
            tooltip.style("opacity", 1)
                .html(`Age range: ${Math.round(d.x0)}-${Math.round(d.x1)}<br>Count: ${d.length}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            d3.select(this).attr("fill", "#ff9e9e");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
            d3.select(this).attr("fill", "#ff6b6b");
        });
}

// Load data when the page is loaded
window.addEventListener('DOMContentLoaded', loadData);