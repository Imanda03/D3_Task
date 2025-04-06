import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BarChartProps } from '../utils/types';

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!data || !svgRef.current) return;


        d3.select(svgRef.current).selectAll("*").remove();


        const width = svgRef.current.parentElement?.clientWidth || 600;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 30, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;


        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);


        const xScale = d3.scaleBand()
            .domain(data.map((d: any) => d.date))
            .range([0, innerWidth])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.value, 0)) as number * 1.1])
            .range([innerHeight, 0]);


        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", (d: any) => xScale(d.date) || 0)
            .attr("y", d => yScale(Math.max(0, d.value)))
            .attr("width", xScale.bandwidth())
            .attr("height", d => innerHeight - yScale(Math.max(0, d.value)))
            .attr("fill", d => d.value >= 0 ? "#4CAF50" : "#F44336")
            .attr("opacity", 0)
            .transition()
            .duration(800)
            .delay((_d, i) => i * 50)
            .attr("opacity", 0.8);


        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale)
                .tickFormat((d: any) => d3.timeFormat("%m/%d")(d as Date))
                .tickValues(xScale.domain().filter((_d, i) => i % Math.ceil(data.length / 5) === 0))
            );

        g.append("g")
            .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => {
                const num = d as number;
                const absValue = Math.abs(num);
                return absValue >= 1000000 ? `${num / 1000000}M` :
                    absValue >= 1000 ? `${num / 1000}K` : num.toString();
            }));


        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "1px solid #ddd")
            .style("padding", "10px")
            .style("border-radius", "4px")
            .style("pointer-events", "none")
            .style("opacity", "0");

        g.selectAll(".bar-overlay")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-overlay")
            .attr("x", (d: any) => xScale(d.date) || 0)
            .attr("y", 0)
            .attr("width", xScale.bandwidth())
            .attr("height", innerHeight)
            .attr("fill", "transparent")
            .on("mouseover", (event, d) => {
                const date = d.date.toLocaleDateString();
                const value = d.value.toLocaleString();

                tooltip.transition()
                    .duration(200)
                    .style("opacity", ".9");
                tooltip.html(`Date: ${date}<br/>Daily change: ${value}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", "0");
            });


        return () => {
            d3.select("body").selectAll(".tooltip").remove();
        };
    }, [data]);

    return <svg ref={svgRef} className="w-full"></svg>;
};