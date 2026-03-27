import { useState, useMemo } from "react";
import { NodeMap, GraphState, NodeId } from "../types";
import { detectCycles } from "../utils/cycleDetection";
import {
  generateId,
  createNode,
  addChildNode,
  deleteNode,
  updateCondition,
  setLinkedTo,
} from "../utils/nodeUtils";

function buildInitialState(): { nodes: NodeMap; rootId: NodeId } {
  const rootId = generateId();
  return {
    rootId,
    nodes: { [rootId]: createNode(rootId) },
  };
}

export function useGraphState() {
  const initial = buildInitialState();
  const [nodes, setNodes] = useState<NodeMap>(initial.nodes);
  const [rootId] = useState<NodeId>(initial.rootId);

  // Recompute cycle detection whenever nodes change
  const { hasCycle, cycleNodeIds } = useMemo(() => {
    const cycleNodeIds = detectCycles(nodes, rootId);
    return { hasCycle: cycleNodeIds.size > 0, cycleNodeIds };
  }, [nodes, rootId]);

  const graphState: GraphState = { nodes, rootId, hasCycle, cycleNodeIds };

  function handleAddChild(parentId: NodeId) {
    setNodes((prev) => addChildNode(prev, parentId));
  }

  function handleDelete(nodeId: NodeId) {
    if (nodeId === rootId) return; // Don't delete root
    setNodes((prev) => deleteNode(prev, nodeId, rootId));
  }

  function handleConditionChange(nodeId: NodeId, condition: string) {
    setNodes((prev) => updateCondition(prev, nodeId, condition));
  }

  function handleSetLink(nodeId: NodeId, linkedTo: NodeId | undefined) {
    setNodes((prev) => setLinkedTo(prev, nodeId, linkedTo));
  }

  return {
    graphState,
    handleAddChild,
    handleDelete,
    handleConditionChange,
    handleSetLink,
  };
}
