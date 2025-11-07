import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DagData, Node, Edge } from '../types';

interface DagVisualizerProps {
  data: DagData;
}

// Fix: Changed interface to type to resolve issues with extended properties not being recognized by TypeScript.
type GraphNode = d3.SimulationNodeDatum & {
  id: string;
  data: Node;
};

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  data: Edge;
}

const NODE_COLORS: Record<string, string> = {
  Spend: '#3b82f6', // blue-500
  KPI: '#22c55e', // green-500
  Baseline: '#a855f7', // purple-500
  Contextual: '#f97316', // orange-500
  default: '#64748b' // slate-500
};

const DagVisualizer: React.FC<DagVisualizerProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = svg.node()?.getBoundingClientRect().width || 800;
    const height = svg.node()?.getBoundingClientRect().height || 600;

    const nodes: GraphNode[] = data.nodes.map(n => ({ id: n.name, data: n }));
    const links: GraphLink[] = data.edges.map(e => ({
      source: e.sourceNode.name,
      target: e.targetNode.name,
      data: e
    }));

    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(200))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(60));

    const g = svg.append("g");

    // Arrowhead marker
    g.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr('fill', '#9ca3af');

    const link = g.append("g")
      .attr("stroke", "#9ca3af")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");

    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation) as any);

    node.append("circle")
      .attr("r", 20)
      .attr("fill", d => NODE_COLORS[d.data.type] || NODE_COLORS.default)
      .attr("stroke", "#1f2937")
      .attr("stroke-width", 3);

    node.append("text")
      .attr("x", 24)
      .attr("y", "0.31em")
      .text(d => d.id)
      .attr("font-size", "12px")
      .attr("fill", "white")
      .attr("font-weight", "500");

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as GraphNode).x!)
        .attr("y1", d => (d.source as GraphNode).y!)
        .attr("x2", d => (d.target as GraphNode).x!)
        .attr("y2", d => (d.target as GraphNode).y!);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });
    
    svg.call(zoom);

    // Drag behavior
    function drag(simulation: d3.Simulation<GraphNode, undefined>) {
        function dragstarted(event: d3.D3DragEvent<Element, GraphNode, GraphNode>, d: GraphNode) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event: d3.D3DragEvent<Element, GraphNode, GraphNode>, d: GraphNode) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event: d3.D3DragEvent<Element, GraphNode, GraphNode>, d: GraphNode) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag<Element, GraphNode>()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
    
    // Cleanup
    return () => {
        simulation.stop();
    };

  }, [data]);

  return <svg ref={svgRef} className="w-full h-full bg-gray-800 rounded-lg shadow-inner"></svg>;
};

export default DagVisualizer;
