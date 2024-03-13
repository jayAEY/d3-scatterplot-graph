document.addEventListener("DOMContentLoaded", () => {
  let m = 30,
    w = 860,
    h = 540;

  d3.json(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((data) => {
      console.log(data);

      data.forEach((d) => {
        d.Time = new Date(
          1,
          1,
          1,
          0,
          d.Time.split(":")[0],
          d.Time.split(":")[1]
        );
      });

      const svg = d3
        .select(".chart")
        .append("svg")
        .attr("viewBox", `0 0 ${w} ${h}`);

      const minDate = d3.min(data, (d) => d.Year - 1);
      const maxDate = d3.max(data, (d) => d.Year + 1);
      const xScale = d3
        .scaleLinear()
        .domain([minDate, maxDate])
        .range([m, w - m]);

      const minTime = d3.min(data, (d) => d.Time);
      const maxTime = d3.max(data, (d) => d.Time);
      const yScale = d3
        .scaleTime()
        .range([m, h - m])
        .domain([minTime, maxTime]);

      const timeFormat = d3.timeFormat("%M:%S");

      let tooltip = d3
        .select(".chartHolder")
        .append("div")
        .attr("id", "tooltip")
        .style("visibility", "hidden");

      const mouseOver = (e, d) => {
        tooltip
          .transition()
          .style("visibility", "visible")
          .style("left", `${e.pageX + 20}px`)
          .style("top", `${e.pageY + 20}px`)
          .style("background-color", `${d.Doping ? "red" : "#0ead6d"}`)
          .style("color", `${d.Doping ? "white" : "white"}`);

        tooltip
          .text(`${d.Name} ${d.Doping ? d.Year + ": " : d.Year} ${d.Doping} `)
          .attr("data-year", d.Year);
      };

      const mouseOut = () => {
        tooltip.transition().style("visibility", "hidden");
      };

      svg
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d) => xScale(d.Year))
        .attr("cy", (d) => yScale(d.Time) + 10)
        .attr("r", "7")
        .attr("stroke", "white")
        .attr("opacity", "0.7")
        .attr("data-xvalue", (d) => d.Year)
        .attr("data-yvalue", (d) => d.Time)
        .attr("fill", (d) => (d.Doping ? "red" : "#0ead6d"))
        .on("mouseover", mouseOver)
        .on("mouseout", mouseOut);

      const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

      const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

      svg
        .append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", `translate(15 ,${h - 20})`);

      svg
        .append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", `translate(45,10)`);

      svg
        .append("g")
        .attr("id", "legend")
        .append("rect")
        .attr("width", "150px")
        .attr("height", "35px")
        .attr("x", "680px")
        .attr("y", "56px")
        .attr("fill", "rgba(255,255,255,0.9)");

      svg
        .select("#legend")
        .append("text")
        .attr("x", "690px")
        .attr("y", "70px")
        .attr("fill", "#0ead6d")
        .text("No Doping Allegations");

      svg
        .select("#legend")
        .append("text")
        .attr("x", "690px")
        .attr("y", "84px")
        .attr("fill", "red")
        .attr("cx", "10px")
        .attr("cy", "0")
        .text("Doping Allegations");
    })
    .catch((e) => console.log(e));
});
