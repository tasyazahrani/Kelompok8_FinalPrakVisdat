const margin = { top: 60, right: 150, bottom: 40, left: 80 },
      width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

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
  .style("background", "#ffffff") // putih
  .style("color", "#000000") // teks hitam
  .style("border", "1px solid #ccc")
  .style("border-radius", "5px")
  .style("box-shadow", "0px 2px 6px rgba(0,0,0,0.15)")
  .style("font-size", "13px")
  .style("pointer-events", "none")
  .style("opacity", 0);

d3.csv("survey lung cancer.csv").then(data => {
  const categories = ["YES", "NO"];
  const subgroups = ["Batuk Kronis", "Sesak Napas"];
  const summary = { YES: { "Batuk Kronis": 0, "Sesak Napas": 0 }, NO: { "Batuk Kronis": 0, "Sesak Napas": 0 } };

  data.forEach(d => {
    const group = d["CHRONIC DISEASE"] === "2" ? "YES" : "NO";
    if (summary[group]) {
      if (d["COUGHING"] === "2") summary[group]["Batuk Kronis"] += 1;
      if (d["SHORTNESS OF BREATH"] === "2") summary[group]["Sesak Napas"] += 1;
    }
  });

  const finalData = categories.map(kat => ({
    Kategori: kat,
    "Batuk Kronis": summary[kat]["Batuk Kronis"],
    "Sesak Napas": summary[kat]["Sesak Napas"]
  }));

  const x = d3.scaleBand()
    .domain(categories)
    .range([0, width])
    .padding(0.2);

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  const y = d3.scaleLinear()
    .domain([0, d3.max(finalData, d => d["Batuk Kronis"] + d["Sesak Napas"])])
    .nice()
    .range([height, 0]);

  svg.append("g")
    .call(d3.axisLeft(y));

  // ✍️ Label sumbu Y
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 30)
    .attr("x", -height / 2)
    .attr("dy", "-1em")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Jumlah Pasien");

  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(["#e41a1c", "#377eb8"]);

  const stackedData = d3.stack().keys(subgroups)(finalData);

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
      tooltip.html(`<strong>${d.key}</strong><br>${d.data.Kategori}: ${d[1] - d[0]}`);
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
    .data(subgroups)
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
