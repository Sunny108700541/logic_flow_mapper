import { NodeId, NodeMap, LogicNode } from "../types";

export function createNode(id: NodeId): LogicNode {
  return { id, condition: "", children: [] };
}

export function generateId(): NodeId {
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Adds a new child node under a given parent.
 */
export function addChildNode(nodes: NodeMap, parentId: NodeId): NodeMap {
  const newId = generateId();
  const newNode = createNode(newId);

  return {
    ...nodes,
    [newId]: newNode,
    [parentId]: {
      ...nodes[parentId],
      children: [...nodes[parentId].children, newId],
    },
  };
}

/**
 * Deletes a node and all its descendants recursively.
 * Also removes any references to the deleted nodes from other nodes.
 */
export function deleteNode(nodes: NodeMap, targetId: NodeId, _rootId: NodeId): NodeMap {
  // Collect all node ids to remove (target + all descendants)
  const toRemove = new Set<NodeId>();

  function collectDescendants(id: NodeId) {
    if (!nodes[id]) return;
    toRemove.add(id);
    for (const childId of nodes[id].children) {
      collectDescendants(childId);
    }
  }

  collectDescendants(targetId);

  // Build new node map without removed nodes, and clean up references
  const updated: NodeMap = {};
  for (const [id, node] of Object.entries(nodes)) {
    if (toRemove.has(id)) continue;
    updated[id] = {
      ...node,
      children: node.children.filter((c) => !toRemove.has(c)),
      linkedTo: node.linkedTo && toRemove.has(node.linkedTo) ? undefined : node.linkedTo,
    };
  }

  return updated;
}

/**
 * Updates the condition text of a node.
 */
export function updateCondition(nodes: NodeMap, nodeId: NodeId, condition: string): NodeMap {
  return {
    ...nodes,
    [nodeId]: { ...nodes[nodeId], condition },
  };
}

/**
 * Sets or clears the linkedTo field of a node.
 */
export function setLinkedTo(nodes: NodeMap, nodeId: NodeId, linkedTo: NodeId | undefined): NodeMap {
  return {
    ...nodes,
    [nodeId]: { ...nodes[nodeId], linkedTo },
  };
}

/**
 * Returns all node ids that are ancestors of a given node (to prevent invalid links).
 */
export function getAncestors(nodes: NodeMap, targetId: NodeId, rootId: NodeId): Set<NodeId> {
  const ancestors = new Set<NodeId>();

  function dfs(currentId: NodeId, path: NodeId[]) {
    if (currentId === targetId) {
      path.forEach((id) => ancestors.add(id));
      return;
    }
    const node = nodes[currentId];
    if (!node) return;
    for (const childId of node.children) {
      dfs(childId, [...path, currentId]);
    }
  }

  dfs(rootId, []);
  return ancestors;
}
