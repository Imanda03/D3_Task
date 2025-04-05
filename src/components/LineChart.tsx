import * as d3 from 'd3';

import React, { useEffect, useRef } from 'react'
import { LineChartProps } from '../utils/types';
import { formatNum } from '../utils/helper';

const LineChart: React.FC<LineChartProps> = ({ data, metric }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    const totals = {
        cases: data.reduce((sum, d) => sum + (d.cases ?? 0), 0),
        deaths: data.reduce((sum, d) => sum + (d.deaths ?? 0), 0),
        recovered: data.reduce((sum, d) => sum + (d.recovered ?? 0), 0),
    };

    useEffect(() => {
        if (!data || !svgRef.current) return;

        d3.select(svgRef.current).selectAll('*').remove();

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

        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.date) as [Date, Date])
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[metric]) as number * 1.1])
            .range([innerHeight, 0]);

        const line = d3.line<any>()
            .x(d => xScale(d.date))
            .y(d => yScale(d[metric]))
            .curve(d3.curveMonotoneX);

        const path = g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);

        const pathLength = path.node()?.getTotalLength() || 0;
        path
            .attr("stroke-dasharray", pathLength)
            .attr("stroke-dashoffset", pathLength)
            .transition()
            .duration(1000)
            .attr("stroke-dashoffset", 0);

        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat("%m/%d") as any));

        g.append("g")
            .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => {
                const num = d as number;
                return num >= 1000000 ? `${num / 1000000}M` :
                    num >= 1000 ? `${num / 1000}K` : num.toString();
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

        g.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.date))
            .attr("cy", d => yScale(d[metric]))
            .attr("r", 4)
            .attr("fill", "steelblue")
            .on("mouseover", (event, d) => {
                const date = d.date.toLocaleDateString();
                const value = d[metric].toLocaleString();

                tooltip.transition()
                    .duration(200)
                    .style("opacity", ".9");
                tooltip.html(`Date: ${date}<br/>${metric}: ${value}`)
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
    }, [data, metric])

    return <div>
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
            <div><strong>Total Cases:</strong> {formatNum(totals.cases)}</div>
            <div><strong>Total Deaths:</strong> {formatNum(totals.deaths)}</div>
            <div><strong>Total Recovered:</strong> {formatNum(totals.recovered)}</div>
        </div>
        <svg ref={svgRef}></svg>
    </div>

}

export default LineChart