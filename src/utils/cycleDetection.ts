import { NodeId, NodeMap } from "../types";

/**
 * Detects cycles in the logic node graph using Depth-First Search.
 * Returns the set of node IDs that are part of a cycle.
 *
 * DFS approach:
 * - "visiting" = currently in the recursion stack (gray node)
 * - "visited"  = fully processed (black node)
 * If we reach a node that is already "visiting", we found a back-edge → cycle.
 */
export function detectCycles(nodes: NodeMap, rootId: NodeId): Set<NodeId> {
  const visiting = new Set<NodeId>(); // current DFS path
  const visited = new Set<NodeId>();  // fully processed
  const cycleNodes = new Set<NodeId>();

  function dfs(nodeId: NodeId): boolean {
    if (!nodes[nodeId]) return false;

    visiting.add(nodeId);

    const node = nodes[nodeId];

    // Collect all edges: children + optional linked node
    const neighbors: NodeId[] = [
      ...node.children,
      ...(node.linkedTo ? [node.linkedTo] : []),
    ];

    for (const neighborId of neighbors) {
      if (visiting.has(neighborId)) {
        // Back edge found — cycle detected
        cycleNodes.add(nodeId);
        cycleNodes.add(neighborId);
        return true;
      }
      if (!visited.has(neighborId)) {
        const foundCycle = dfs(neighborId);
        if (foundCycle) {
          // Mark current node as part of cycle path
          cycleNodes.add(nodeId);
        }
      }
    }

    visiting.delete(nodeId);
    visited.add(nodeId);
    return cycleNodes.has(nodeId);
  }

  dfs(rootId);

  // Also check any disconnected nodes (shouldn't happen in tree, but safe)
  for (const id of Object.keys(nodes)) {
    if (!visited.has(id)) {
      dfs(id);
    }
  }

  return cycleNodes;
}
