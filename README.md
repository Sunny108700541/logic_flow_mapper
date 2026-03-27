# Logic Flow Mapper

A React + TypeScript application for building nested If-Then logic conditions with real-time cycle detection.

---

## Data Structure Choice: Normalised Node Map

I chose a **normalised flat map** (`{ [id]: LogicNode }`) over a nested tree structure.

**Why normalised?**
- Updating a deeply nested node in an immutable nested tree requires rewriting the entire path from root to that node. With a flat map, any update is `O(1)` — just update the single entry by id.
- Cycle detection requires graph traversal (DFS), which is simpler to implement on a flat adjacency structure than a deeply nested object tree.
- Each node holds only `children: NodeId[]` and an optional `linkedTo: NodeId`, making the graph edges explicit and easy to traverse.

**Trade-off:** Rendering requires looking up each child by id during recursion, but this is negligible in practice.

---

## Cycle Detection Algorithm (DFS)

The `detectCycles` function in `src/utils/cycleDetection.ts` uses a standard **Depth-First Search with a "visiting" (grey) set**:

1. Start DFS from the root node.
2. Maintain a `visiting` set — nodes currently on the active DFS path (the recursion stack).
3. For each node, visit all its neighbours: `children` + optional `linkedTo` target.
4. If we reach a node already in `visiting`, we've found a **back edge** — this is a cycle.
5. Mark both the current node and the already-visiting node as cycle members.
6. Propagate cycle membership back up the call stack.

This runs in **O(V + E)** time where V = nodes, E = edges.

---

## Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd logic-flow-mapper

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
# Opens at http://localhost:5173
```

---

## Build & Deploy

### Build for production
```bash
npm run build
# Output goes to /dist
```

### Deploy to Vercel
```bash
# Option 1: Vercel CLI
npm install -g vercel
vercel

# Option 2: Push to GitHub and import on vercel.com
# Framework: Vite  |  Build command: npm run build  |  Output dir: dist
```

### Deploy to Netlify
```bash
# Option 1: Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist

# Option 2: Push to GitHub, import on netlify.com
# Build command: npm run build  |  Publish directory: dist
```

---

## Project Structure

```
src/
  types/
    index.ts           # LogicNode, NodeMap, GraphState interfaces
  utils/
    cycleDetection.ts  # DFS cycle detection algorithm
    nodeUtils.ts       # Pure helper functions (add, delete, update nodes)
  hooks/
    useGraphState.ts   # Central state management hook
  components/
    LogicNode.tsx      # Recursive node component
    Toolbar.tsx        # Simulate button + cycle status
  App.tsx              # Root component
  main.tsx             # Entry point
```

---

## Edge Cases Handled

- **Deleting a node**: removes all descendants and cleans up any `linkedTo` references pointing to deleted nodes.
- **Root node**: cannot be deleted.
- **Linking to self**: linking a node to itself creates an immediate cycle — detected and flagged.
- **Simulate button**: disabled whenever any cycle exists in the graph.
