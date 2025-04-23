// Fungsi untuk memuat dan memproses data CSV
async function loadData() {
    try {
        const response = await fetch('survey lung cancer.csv');
        const csvData = await response.text();
        
        // Parse data CSV
        const data = d3.csvParse(csvData);
        
        // Filter data untuk pasien yang menderita kanker paru
        const cancerPatients = data.filter(d => d.LUNG_CANCER === "YES");
        
        // Konversi usia menjadi angka
        cancerPatients.forEach(d => {
            d.AGE = +d.AGE;
        });
        
        // Hapus pesan loading
        document.getElementById('loading').style.display = 'none';
        
        // Buat histogram
        createHistogram(cancerPatients);
        
    } catch (error) {
        console.error('Terjadi kesalahan saat memuat atau memproses data:', error);
        document.getElementById('loading').textContent = 'Gagal memuat data. Silakan coba lagi.';
    }
}

// Fungsi untuk membuat histogram
function createHistogram(data) {
    // Atur dimensi dan margin
    const margin = {top: 40, right: 30, bottom: 60, left: 60};
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Buat elemen SVG
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Buat tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");
    
    // Hitung bin histogram
    const x = d3.scaleLinear()
        .domain([d3.min(data, d => d.AGE) - 2, d3.max(data, d => d.AGE) + 2])
        .range([0, width]);
    
    // Buat histogram
    const histogram = d3.histogram()
        .value(d => d.AGE)
        .domain(x.domain())
        .thresholds(x.ticks(10));
    
    const bins = histogram(data);
    
    // Skala Y
    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .nice()
        .range([height, 0]);
    
    // Tambahkan sumbu X
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    // Tambahkan sumbu Y
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));
    
    // Tambahkan label sumbu X
    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Usia");
    
    // Tambahkan label sumbu Y
    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .text("Frekuensi");
    
    // Tambahkan judul
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Distribusi Usia Pasien Kanker Paru");
    
    // Tambahkan bar dengan warna pink
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.x0) + 1)
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("y", d => y(d.length))
        .attr("height", d => height - y(d.length))
        .attr("fill", "#ff6b6b") // Warna pink eksplisit
        .on("mouseover", function(event, d) {
            const [x, y] = d3.pointer(event);
            tooltip.style("opacity", 1)
                .html(`Rentang usia: ${Math.round(d.x0)}-${Math.round(d.x1)}<br>Jumlah: ${d.length}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            d3.select(this).attr("fill", "#ff9e9e");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
            d3.select(this).attr("fill", "#ff6b6b");
        });
}

// Muat data saat halaman selesai dimuat
window.addEventListener('DOMContentLoaded', loadData);