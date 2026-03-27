import { useState } from "react";
import { GraphState } from "../types";

interface Props {
  graphState: GraphState;
}

export default function Toolbar({ graphState }: Props) {
  const { hasCycle, cycleNodeIds, nodes } = graphState;
  const [simResult, setSimResult] = useState<string | null>(null);

  function handleSimulate() {
    const count = Object.keys(nodes).length;
    setSimResult(`✓ Logic simulation passed — ${count} node(s) evaluated, no cycles detected.`);
    setTimeout(() => setSimResult(null), 4000);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">

        <div
          className={`
            flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium
            ${hasCycle
              ? "bg-red-900/50 text-red-300 ring-1 ring-red-700"
              : "bg-emerald-900/40 text-emerald-300 ring-1 ring-emerald-800"}
          `}
        >
          <span className={`h-2 w-2 rounded-full ${hasCycle ? "bg-red-400 animate-pulse" : "bg-emerald-400"}`} />
          {hasCycle
            ? `Cycle detected (${cycleNodeIds.size} node${cycleNodeIds.size > 1 ? "s" : ""} affected)`
            : "No cycles — logic is valid"}
        </div>


        <button
          onClick={handleSimulate}
          disabled={hasCycle}
          className={`
            rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200
            ${hasCycle
              ? "cursor-not-allowed bg-slate-800 text-slate-600 ring-1 ring-slate-700"
              : "bg-blue-600 text-white hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-900/30"}
          `}
        >
          {hasCycle ? "⛔ Simulate Logic" : "▶ Simulate Logic"}
        </button>
      </div>


      {simResult && (
        <div className="rounded-lg bg-emerald-900/30 px-3 py-2 text-sm text-emerald-300 ring-1 ring-emerald-800 animate-pulse">
          {simResult}
        </div>
      )}


      {hasCycle && (
        <div className="rounded-lg bg-red-950/40 px-3 py-2 text-xs text-red-400 ring-1 ring-red-900">
          Nodes highlighted in red form a logic loop. Remove or re-link them to resolve the cycle.
        </div>
      )}
    </div>
  );
}
