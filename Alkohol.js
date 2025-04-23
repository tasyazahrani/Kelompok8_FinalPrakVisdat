const margin = { top: 60, right: 150, bottom: 40, left: 80 },
      width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

const svg = d3.select("#chart2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("padding", "6px 12px")
  .style("background", "#ffffff")
  .style("color", "#000000")
  .style("border", "1px solid #ccc")
  .style("border-radius", "5px")
  .style("box-shadow", "0px 2px 6px rgba(0,0,0,0.15)")
  .style("font-size", "13px")
  .style("pointer-events", "none")
  .style("opacity", 0);

d3.csv("survey lung cancer.csv").then(data => {
    const categories = ["2", "1"]; // 2 = Ya, 1 = Tidak
    const labels = { "2": "Ya", "1": "Tidak" };
    
    const summary = {
      "2": { "YES": 0, "NO": 0 },
      "1": { "YES": 0, "NO": 0 }
    };
    
    data.forEach(d => {
      const alcohol = d["ALCOHOL CONSUMING"];
      const lung = d["LUNG_CANCER"];
      if (summary[alcohol] && summary[alcohol][lung] !== undefined) {
        summary[alcohol][lung] += 1;
      }
    });
    
    const finalData = categories.map(kat => ({
      Kategori: labels[kat],
      "Kanker Paru": summary[kat]["YES"],
      "Sehat": summary[kat]["NO"]
    }));
    
  const x = d3.scaleBand()
    .domain(finalData.map(d => d.Kategori))
    .range([0, width])
    .padding(0.2);

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  const y = d3.scaleLinear()
    .domain([0, d3.max(finalData, d => d["Kanker Paru"] + d["Sehat"])])
    .nice()
    .range([height, 0]);

  svg.append("g")
    .call(d3.axisLeft(y).tickFormat(d3.format("d"))); // ✅ angka bulat

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 50)
    .attr("x", -height / 2)
    .attr("dy", "-1em")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Jumlah Pasien");

  const color = d3.scaleOrdinal()
    .domain(["Kanker Paru", "Sehat"])
    .range(["#e41a1c", "#4daf4a"]);

  const stackedData = d3.stack().keys(["Kanker Paru", "Sehat"])(finalData);

  svg.selectAll("g.layer")
    .data(stackedData)
    .join("g")
    .attr("class", "layer")
    .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(d => d.map(p => ({ ...p, key: d.key })))
    .join("rect")
    .attr("x", d => x(d.data.Kategori))
    .attr("y", d => y(d[1]))
    .attr("height", d => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth())
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip.html(`<strong>${d.key}</strong><br>Konsumsi Alkohol: ${d.data.Kategori}<br>Jumlah: ${d3.format("d")(d[1] - d[0])}`);
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
    .data(["Kanker Paru", "Sehat"])
    .enter().append("g")
    .attr("class", "legend")
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
