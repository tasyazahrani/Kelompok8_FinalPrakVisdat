// Fungsi untuk memuat dan memproses data
async function loadData() {
    try {
        // Memuat data CSV
        const data = await d3.csv("survey lung cancer.csv", d => {
            return {
                gender: d.GENDER,
                age: +d.AGE,
                smoking: +d.SMOKING,
                lungCancer: d.LUNG_CANCER
            };
        });
        
        // Kelompokkan data berdasarkan merokok dan status kanker
        const groupedData = [
            { category: 'Tidak Merokok (1)', yes: 2, no: 1 },
            { category: 'Merokok (2)', yes: 2, no: 1 }
        ];
        
        data.forEach(d => {
            const index = d.smoking - 1; // Mengkonversi smoking 1/2 ke indeks array 0/1
            if (d.lungCancer === 'YES') {
                groupedData[index].yes++;
            } else {
                groupedData[index].no++;
            }
        });
        
        // Hitung total untuk setiap kategori
        groupedData.forEach(d => {
            d.total = d.yes + d.no;
            d.yesPercent = (d.yes / d.total) * 100;
            d.noPercent = (d.no / d.total) * 100;
        });
        
        // Buat visualisasi stacked bar chart
        createStackedBarChart(groupedData);
        
    } catch (error) {
        console.error("Error loading data:", error);
        document.getElementById('chart').innerHTML = `
            <div style="color: red; text-align: center; padding: 20px;">
                Error loading data. Please make sure the file "survey_lung_cancer.csv" is in the correct location.
            </div>
        `;
    }
}

// Fungsi untuk membuat stacked bar chart
function createStackedBarChart(data) {
    // Dimensi chart
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Skala untuk sumbu x
    const x = d3.scaleBand()
        .domain(data.map(d => d.category))
        .range([0, width])
        .padding(0.3);
    
    // Skala untuk sumbu y
    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);
    
    // Membuat SVG
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Membuat sumbu x
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "middle");
    
    // Membuat sumbu y
    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(d => d + "%"));
    
    // Label sumbu y
    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .text("Persentase (%)");
    
    // Label sumbu x
    svg.append("text")
        .attr("class", "axis-label")
        .attr("y", height + margin.bottom - 15)
        .attr("x", width / 2)
        .attr("text-anchor", "middle")
        .text("Status Merokok");
    
    // Membuat bar untuk status "NO" (tidak kanker)
    svg.selectAll(".bar-no")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar bar-no")
        .attr("x", d => x(d.category))
        .attr("y", d => y(d.noPercent))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.noPercent))
        .attr("fill", "#4ecdc4")
        .on("mouseover", function(event, d) {
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background", "white")
                .style("padding", "10px")
                .style("border", "1px solid #ddd")
                .style("border-radius", "4px")
                .style("pointer-events", "none")
                .style("opacity", 0);
            
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            
            tooltip.html(`<strong>Tidak Kanker:</strong> ${d.no} orang (${d.noPercent.toFixed(1)}%)`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
                
            d3.select(this).attr("fill", "#3db3ab");
        })
        .on("mouseout", function() {
            d3.select("body").selectAll(".tooltip").remove();
            d3.select(this).attr("fill", "#4ecdc4");
        });
    
    // Membuat bar untuk status "YES" (kanker)
    svg.selectAll(".bar-yes")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar bar-yes")
        .attr("x", d => x(d.category))
        .attr("y", d => y(d.noPercent + d.yesPercent))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.yesPercent))
        .attr("fill", "#ff6b6b")
        .on("mouseover", function(event, d) {
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background", "white")
                .style("padding", "10px")
                .style("border", "1px solid #ddd")
                .style("border-radius", "4px")
                .style("pointer-events", "none")
                .style("opacity", 0);
            
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            
            tooltip.html(`<strong>Kanker:</strong> ${d.yes} orang (${d.yesPercent.toFixed(1)}%)`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
                
            d3.select(this).attr("fill", "#ff5252");
        })
        .on("mouseout", function() {
            d3.select("body").selectAll(".tooltip").remove();
            d3.select(this).attr("fill", "#ff6b6b");
        });
    
    // Menambahkan judul
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Status Merokok vs Kanker Paru-paru");
        
    // Menambahkan label jumlah dan persentase di atas bar
    data.forEach(d => {
        // Label untuk 'YES'
        svg.append("text")
            .attr("class", "bar-label")
            .attr("x", x(d.category) + x.bandwidth() / 2)
            .attr("y", y(d.noPercent + d.yesPercent) - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text(`${d.yes} (${d.yesPercent.toFixed(1)}%)`);
        
        // Label untuk 'NO'
        svg.append("text")
            .attr("class", "bar-label")
            .attr("x", x(d.category) + x.bandwidth() / 2)
            .attr("y", y(d.noPercent) - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text(`${d.no} (${d.noPercent.toFixed(1)}%)`);
    });
}

// Jalankan visualisasi
document.addEventListener('DOMContentLoaded', loadData);