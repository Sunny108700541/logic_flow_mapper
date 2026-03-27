export type NodeId = string;

export interface LogicNode {
  id: NodeId;
  condition: string;
  children: NodeId[];    // child node ids (nested branches)
  linkedTo?: NodeId;     // optional: link to another existing node (can create cycles)
}

export interface NodeMap {
  [id: NodeId]: LogicNode;
}

export interface GraphState {
  nodes: NodeMap;
  rootId: NodeId;
  hasCycle: boolean;
  cycleNodeIds: Set<NodeId>;
}
