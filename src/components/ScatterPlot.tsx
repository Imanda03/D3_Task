import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ScatterPlotProps } from '../utils/types';
import { linearRegression } from '../utils/dataTransform';

export const ScatterPlot: React.FC<ScatterPlotProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!data || !svgRef.current) return;


        d3.select(svgRef.current).selectAll("*").remove();

        const width = svgRef.current.parentElement?.clientWidth || 600;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 40, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.x) as number * 1.05])
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.y) as number * 1.05])
            .range([innerHeight, 0]);

        g.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .attr("r", 0)
            .attr("fill", "#ff7f0e")
            .attr("opacity", 0.6)
            .transition()
            .duration(1000)
            .attr("r", 5);

        if (data.length > 1) {
            const regressionData = data.map(d => [d.x, d.y] as [number, number]);
            const regression = linearRegression(regressionData);
            const x1 = 0;
            const y1 = regression.intercept;
            const x2 = d3.max(data, d => d.x) as number;
            const y2 = regression.slope * x2 + regression.intercept;

            g.append("line")
                .attr("x1", xScale(x1))
                .attr("y1", yScale(y1))
                .attr("x2", xScale(x2))
                .attr("y2", yScale(y2))
                .attr("stroke", "red")
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "5,5")
                .attr("opacity", 0)
                .transition()
                .duration(1500)
                .attr("opacity", 1);

            g.append("text")
                .attr("x", innerWidth - 120)
                .attr("y", 20)
                .text(`R² = ${regression.r2.toFixed(3)}`)
                .attr("font-size", "12px")
                .attr("fill", "red");
        }

        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale).ticks(5).tickFormat(d => {
                const num = d as number;
                return num >= 1000000 ? `${num / 1000000}M` :
                    num >= 1000 ? `${num / 1000}K` : num.toString();
            }));

        g.append("g")
            .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => {
                const num = d as number;
                return num >= 1000000 ? `${num / 1000000}M` :
                    num >= 1000 ? `${num / 1000}K` : num.toString();
            }));


        g.append("text")
            .attr("transform", `translate(${innerWidth / 2}, ${innerHeight + 35})`)
            .style("text-anchor", "middle")
            .text("Total Cases");


        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -40)
            .attr("x", -innerHeight / 2)
            .style("text-anchor", "middle")
            .text("Total Deaths");

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "1px solid #ddd")
            .style("padding", "10px")
            .style("border-radius", "4px")
            .style("pointer-events", "none")
            .style("opacity", "0");

        g.selectAll(".dot-overlay")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot-overlay")
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .attr("r", 10)
            .attr("fill", "transparent")
            .on("mouseover", (event, d) => {
                const date = d.date.toLocaleDateString();
                const cases = d.x.toLocaleString();
                const deaths = d.y.toLocaleString();

                tooltip.transition()
                    .duration(200)
                    .style("opacity", ".9");
                tooltip.html(`Date: ${date}<br/>Cases: ${cases}<br/>Deaths: ${deaths}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");

                d3.select(event.currentTarget.previousSibling)
                    .transition()
                    .duration(200)
                    .attr("r", 8)
                    .attr("opacity", 1);
            })
            .on("mouseout", (event) => {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", "0");

                d3.select(event.currentTarget.previousSibling)
                    .transition()
                    .duration(200)
                    .attr("r", 5)
                    .attr("opacity", 0.6);
            });

        return () => {
            d3.select("body").selectAll(".tooltip").remove();
        };
    }, [data]);

    return <svg ref={svgRef} className="w-full"></svg>;
};