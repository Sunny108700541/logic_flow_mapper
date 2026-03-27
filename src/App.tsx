import React from "react";
import LogicNode from "./components/LogicNode";
import Toolbar from "./components/Toolbar";
import { useGraphState } from "./hooks/useGraphState";

export default function App() {
  const {
    graphState,
    handleAddChild,
    handleDelete,
    handleConditionChange,
    handleSetLink,
  } = useGraphState();

  const totalNodes = Object.keys(graphState.nodes).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Logic Flow Mapper
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Build nested If-Then conditions with cycle detection
            </p>
          </div>
          <span className="text-xs text-slate-600 font-mono bg-slate-800 px-2 py-1 rounded">
            {totalNodes} node{totalNodes !== 1 ? "s" : ""}
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-6 py-6 space-y-6">
        {/* Toolbar */}
        <Toolbar graphState={graphState} />

        {/* How to use — quick guide */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3 text-xs text-slate-500 flex flex-wrap gap-x-6 gap-y-1">
          <span>
            <span className="text-slate-400">+ Branch</span> — add a child condition
          </span>
          <span>
            <span className="text-slate-400">🔗 Link</span> — link output to an existing node (can create cycles)
          </span>
          <span>
            <span className="text-slate-400">✕</span> — delete node and all its children
          </span>
          <span>
            <span className="text-red-400">Red highlight</span> — node is part of a cycle
          </span>
        </div>

        {/* Logic tree */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
          <LogicNode
            nodeId={graphState.rootId}
            graphState={graphState}
            depth={0}
            onAddChild={handleAddChild}
            onDelete={handleDelete}
            onConditionChange={handleConditionChange}
            onSetLink={handleSetLink}
          />
        </div>
      </main>
    </div>
  );
}
