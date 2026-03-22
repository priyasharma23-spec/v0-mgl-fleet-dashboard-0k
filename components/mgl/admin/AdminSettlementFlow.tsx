"use client"

import { useState } from "react"
import { X, ChevronDown } from "lucide-react"

interface FlowNode {
  id: string
  title: string
  description: string
  type: "process" | "decision" | "success" | "failure"
  inputs?: string[]
  outputs?: string[]
  branches?: Array<{ label: string; condition: string; target: string }>
}

const flowNodes: FlowNode[] = [
  {
    id: "node1",
    title: "Fetch Transactions",
    description: "Fetch all transactions for settlement date",
    type: "process",
    outputs: ["All transactions retrieved"],
  },
  {
    id: "node2",
    title: "Group by Dealership",
    description: "Aggregate by Dealer ID → compute net payable",
    type: "process",
    inputs: ["All transactions"],
    outputs: ["Dealership groups with net amounts"],
  },
  {
    id: "node3",
    title: "Validate Bank Accounts",
    description: "Validate each dealer's bank details",
    type: "decision",
    inputs: ["Dealership groups"],
    branches: [
      { label: "✓ Valid", condition: "Bank details verified", target: "node4" },
      { label: "✗ Invalid", condition: "Invalid bank details", target: "flagged" },
    ],
    outputs: ["Valid dealers", "Flagged for manual review"],
  },
  {
    id: "node4",
    title: "Sequential Processing",
    description: "Process debits one dealer at a time",
    type: "process",
    inputs: ["Valid dealers"],
    outputs: ["Processing initiated"],
  },
  {
    id: "node5",
    title: "Bank API Call",
    description: "Send debit request to bank",
    type: "decision",
    inputs: ["Debit request"],
    branches: [
      { label: "✓ Success", condition: "Debit successful", target: "node6" },
      { label: "✗ Fail", condition: "Debit failed", target: "retry" },
    ],
    outputs: ["UTR received", "Retry initiated"],
  },
  {
    id: "node6",
    title: "Retry Logic",
    description: "Retry up to 3 times on failure",
    type: "process",
    inputs: ["Failed debit request"],
    branches: [
      { label: "Success", condition: "Debit successful within 3 retries", target: "node7" },
      { label: "Failed", condition: "All 3 retries exhausted", target: "node8" },
    ],
    outputs: ["UTR stored", "Marked as failed"],
  },
  {
    id: "node7",
    title: "Day-end Reconciliation",
    description: "Generate summary: debited / failed / pending",
    type: "process",
    inputs: ["All settlement results"],
    outputs: ["Reconciliation report"],
  },
  {
    id: "node8",
    title: "SAP Report",
    description: "Feed reconciliation data into SAP report",
    type: "success",
    inputs: ["Reconciliation report"],
    outputs: ["Data synced to SAP"],
  },
]

const nodeColors = {
  process: "bg-blue-50 border-blue-200 text-blue-900",
  decision: "bg-amber-50 border-amber-200 text-amber-900",
  success: "bg-green-50 border-green-200 text-green-900",
  failure: "bg-red-50 border-red-200 text-red-900",
}

const nodeIconBg = {
  process: "bg-blue-100",
  decision: "bg-amber-100",
  success: "bg-green-100",
  failure: "bg-red-100",
}

export default function AdminSettlementFlow({ onClose }: { onClose: () => void }) {
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null)

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-bold text-lg text-foreground">Settlement Processing Flow</h2>
            <p className="text-xs text-muted-foreground mt-1">Interactive flow diagram showing dealership-wise daily debit settlement process</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Flow Diagram */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4 pb-4">
              {flowNodes.map((node, idx) => (
                <div key={node.id}>
                  <button
                    onClick={() => setSelectedNode(node)}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                      nodeColors[node.type]
                    } ${selectedNode?.id === node.id ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full ${nodeIconBg[node.type]} flex items-center justify-center text-sm font-bold shrink-0 mt-0.5`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{node.title}</p>
                        <p className="text-xs opacity-75 mt-1">{node.description}</p>
                      </div>
                    </div>

                    {/* Branch indicators */}
                    {node.branches && (
                      <div className="flex gap-2 mt-2 ml-11">
                        {node.branches.map((branch, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-black/10 rounded-full">
                            {branch.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>

                  {/* Arrow connector */}
                  {idx < flowNodes.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ChevronDown className="w-5 h-5 text-border animate-bounce" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Side Panel */}
          <div className="w-80 border-l border-border bg-muted/30 overflow-y-auto shrink-0">
            {selectedNode ? (
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-foreground">{selectedNode.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedNode.description}</p>
                </div>

                <div className={`p-3 rounded-lg border-2 ${nodeColors[selectedNode.type]}`}>
                  <p className="text-xs font-semibold mb-1">Type</p>
                  <p className="text-sm font-medium capitalize">{selectedNode.type}</p>
                </div>

                {selectedNode.inputs && selectedNode.inputs.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Input</p>
                    <ul className="space-y-1">
                      {selectedNode.inputs.map((input, i) => (
                        <li key={i} className="text-sm px-3 py-2 bg-blue-50 text-blue-900 rounded-lg border border-blue-200">
                          • {input}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedNode.outputs && selectedNode.outputs.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Output</p>
                    <ul className="space-y-1">
                      {selectedNode.outputs.map((output, i) => (
                        <li key={i} className="text-sm px-3 py-2 bg-green-50 text-green-900 rounded-lg border border-green-200">
                          ✓ {output}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedNode.branches && selectedNode.branches.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Branches</p>
                    <ul className="space-y-2">
                      {selectedNode.branches.map((branch, i) => (
                        <li key={i} className="text-sm p-2 bg-amber-50 rounded-lg border border-amber-200">
                          <p className="font-semibold text-amber-900">{branch.label}</p>
                          <p className="text-xs text-amber-700 mt-1">{branch.condition}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-3 border-t border-border">
                  <p className="text-xs font-mono text-muted-foreground">ID: {selectedNode.id}</p>
                </div>
              </div>
            ) : (
              <div className="p-5 h-full flex items-center justify-center text-center">
                <div>
                  <p className="text-sm font-medium text-foreground">Click a node to view details</p>
                  <p className="text-xs text-muted-foreground mt-2">View inputs, outputs, branching logic, and status indicators for each settlement step</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
