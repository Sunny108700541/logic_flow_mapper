import React, { useState } from "react";
import { NodeId, GraphState } from "../types";

interface Props {
  nodeId: NodeId;
  graphState: GraphState;
  depth: number;
  onAddChild: (parentId: NodeId) => void;
  onDelete: (nodeId: NodeId) => void;
  onConditionChange: (nodeId: NodeId, value: string) => void;
  onSetLink: (nodeId: NodeId, linkedTo: NodeId | undefined) => void;
}

export default function LogicNode({
  nodeId,
  graphState,
  depth,
  onAddChild,
  onDelete,
  onConditionChange,
  onSetLink,
}: Props) {
  const { nodes, rootId, cycleNodeIds } = graphState;
  const node = nodes[nodeId];
  const [showLinkMenu, setShowLinkMenu] = useState(false);

  if (!node) return null;

  const isCycleNode = cycleNodeIds.has(nodeId);
  const isRoot = nodeId === rootId;


  const linkableNodes = Object.values(nodes).filter((n) => n.id !== nodeId);

  // Indent color classes per depth level
  const depthColors = [
    "border-blue-500",
    "border-violet-500",
    "border-emerald-500",
    "border-amber-500",
    "border-rose-500",
  ];
  const borderColor = depthColors[depth % depthColors.length];

  return (
    <div className="relative">
      {/* Vertical connector line from parent */}
      {!isRoot && (
        <div className="absolute left-0 top-0 -translate-x-px w-px h-4 bg-slate-600" />
      )}

      <div
        className={`
          relative ml-0 mt-2 rounded-lg border-l-4 bg-slate-800 px-4 py-3 shadow-md
          transition-all duration-200
          ${isCycleNode ? "border-red-500 bg-red-950/30 ring-1 ring-red-500/50" : borderColor}
        `}
      >
        {/* Cycle warning logo */}
        {isCycleNode && (
          <span className="absolute -top-2 right-3 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
            ⚠ Cycle
          </span>
        )}

        {/* header node */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 select-none w-16 shrink-0">
            {isRoot ? "ROOT" : `depth ${depth}`}
          </span>

          {/* Condition input */}
          <input
            type="text"
            value={node.condition}
            onChange={(e) => onConditionChange(nodeId, e.target.value)}
            placeholder="Enter condition… (e.g. age > 18)"
            className={`
              flex-1 rounded-md bg-slate-900 px-3 py-1.5 text-sm text-slate-100
              placeholder-slate-600 outline-none ring-1
              focus:ring-blue-500 transition-all
              ${isCycleNode ? "ring-red-700" : "ring-slate-700"}
            `}
          />

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onAddChild(nodeId)}
              title="Add child branch"
              className="rounded-md bg-slate-700 px-2 py-1.5 text-xs text-blue-400 hover:bg-blue-900/40 hover:text-blue-300 transition-colors"
            >
              + Branch
            </button>

            <button
              onClick={() => setShowLinkMenu((v) => !v)}
              title="Link to another node"
              className={`
                rounded-md px-2 py-1.5 text-xs transition-colors
                ${node.linkedTo
                  ? "bg-violet-900/50 text-violet-300 hover:bg-violet-900"
                  : "bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-slate-200"}
              `}
            >
              🔗 {node.linkedTo ? "Linked" : "Link"}
            </button>

            {!isRoot && (
              <button
                onClick={() => onDelete(nodeId)}
                title="Delete node"
                className="rounded-md bg-slate-700 px-2 py-1.5 text-xs text-red-400 hover:bg-red-900/40 hover:text-red-300 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>


        {showLinkMenu && (
          <div className="mt-2 rounded-md border border-slate-700 bg-slate-900 p-2">
            <p className="mb-1.5 text-xs text-slate-400">Link this node's output to:</p>
            <div className="flex flex-wrap gap-1.5">
              {node.linkedTo && (
                <button
                  onClick={() => {
                    onSetLink(nodeId, undefined);
                    setShowLinkMenu(false);
                  }}
                  className="rounded bg-red-900/40 px-2 py-1 text-xs text-red-300 hover:bg-red-900/60"
                >
                  ✕ Remove link
                </button>
              )}
              {linkableNodes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    onSetLink(nodeId, n.id);
                    setShowLinkMenu(false);
                  }}
                  className={`
                    rounded px-2 py-1 text-xs transition-colors
                    ${n.id === node.linkedTo
                      ? "bg-violet-700 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-violet-900/40 hover:text-violet-200"}
                  `}
                >
                  {n.condition ? `"${n.condition.slice(0, 20)}…"` : `Node (${n.id.slice(-5)})`}
                </button>
              ))}
              {linkableNodes.length === 0 && (
                <span className="text-xs text-slate-600">No other nodes to link to.</span>
              )}
            </div>
          </div>
        )}


        {node.linkedTo && nodes[node.linkedTo] && (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-violet-400">
            <span>→ Linked to:</span>
            <span className="rounded bg-violet-900/30 px-1.5 py-0.5 font-mono">
              {nodes[node.linkedTo].condition || `Node (${node.linkedTo.slice(-5)})`}
            </span>
          </div>
        )}
      </div>

      {/* Render children recursively */}
      {node.children.length > 0 && (
        <div className="relative ml-6 border-l border-slate-700 pl-4">
          {node.children.map((childId) => (
            <LogicNode
              key={childId}
              nodeId={childId}
              graphState={graphState}
              depth={depth + 1}
              onAddChild={onAddChild}
              onDelete={onDelete}
              onConditionChange={onConditionChange}
              onSetLink={onSetLink}
            />
          ))}
        </div>
      )}
    </div>
  );
}
