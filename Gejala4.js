const margin = { top: 50, right: 150, bottom: 150, left: 60 },
  width = 900 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("padding", "6px 12px")
  .style("background", "#fff")
  .style("border", "1px solid #ccc")
  .style("border-radius", "5px")
  .style("font-size", "13px")
  .style("pointer-events", "none")
  .style("opacity", 0);

d3.csv("Data/survey_lung_cancer.csv").then(data => {
  const symptoms = [
    "SMOKING", "YELLOW_FINGERS", "ANXIETY", "PEER_PRESSURE",
    "CHRONIC DISEASE", "FATIGUE ", "ALLERGY ", "WHEEZING",
    "ALCOHOL CONSUMING", "COUGHING", "SHORTNESS OF BREATH",
    "SWALLOWING DIFFICULTY", "CHEST PAIN"
  ];

  const cleanedData = symptoms.map(symptom => {
    const key = symptom.trim();
    return {
      gejala: key,
      Pria: data.filter(d => d.GENDER === 'M' && d[key] === '2').length,
      Wanita: data.filter(d => d.GENDER === 'F' && d[key] === '2').length
    };
  });

  const x0 = d3.scaleBand()
    .domain(cleanedData.map(d => d.gejala))
    .range([0, width])
    .padding(0.3);

  const x1 = d3.scaleBand()
    .domain(["Pria", "Wanita"])
    .range([0, x0.bandwidth()])
    .padding(0.05);

  const y = d3.scaleLinear()
    .domain([0, d3.max(cleanedData, d => Math.max(d.Pria, d.Wanita))])
    .nice()
    .range([height, 0]);

  const color = d3.scaleOrdinal()
    .domain(["Pria", "Wanita"])
    .range(["#1f77b4", "#e377c2"]);

    svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x0))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.8em")
    .attr("dy", "0.15em")
    .attr("transform", "rotate(-40)") // miring 40 derajat, lebih rapi
    .style("font-size", "12px");
  

  svg.append("g")
    .call(d3.axisLeft(y).ticks(null, "d"));

  svg.append("g")
    .selectAll("g")
    .data(cleanedData)
    .join("g")
    .attr("transform", d => `translate(${x0(d.gejala)},0)`)
    .selectAll("rect")
    .data(d => ["Pria", "Wanita"].map(key => ({ key, value: d[key], gejala: d.gejala })))
    .join("rect")
    .attr("x", d => x1(d.key))
    .attr("y", d => y(d.value))
    .attr("width", x1.bandwidth())
    .attr("height", d => height - y(d.value))
    .attr("fill", d => color(d.key))
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip.html(`<strong>${d.key}</strong><br>Gejala: ${d.gejala}<br>Jumlah: ${d.value}`);
    })
    .on("mousemove", event => {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 30 + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(300).style("opacity", 0);
    });

  // Legend
  const legend = svg.selectAll(".legend")
    .data(["Pria", "Wanita"])
    .enter().append("g")
    .attr("transform", (d, i) => `translate(${width + 20}, ${i * 25})`);

  legend.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", d => color(d));

  legend.append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(d => d);
});

// Label sumbu Y
svg.append("text")
  .attr("text-anchor", "middle")
  .attr("transform", `translate(${-50},${height / 2})rotate(-90)`)
  .style("font-size", "13px")
  .text("Jumlah Pasien");

// Label sumbu X
svg.append("text")
  .attr("text-anchor", "middle")
  .attr("x", width / 2)
  .attr("y", height + 130)
  .style("font-size", "13px")
  .text("Jenis Gejala");
