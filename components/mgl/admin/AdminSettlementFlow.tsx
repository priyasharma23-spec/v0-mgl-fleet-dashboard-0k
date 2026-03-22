"use client"
import { useState } from "react"
import { X, CheckCircle, XCircle, Clock, Play, SkipForward, Download, AlertTriangle } from "lucide-react"

interface Props { onClose: () => void }

export default function AdminSettlementFlow({ onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(-1)
  const [stepStatuses, setStepStatuses] = useState(Array(8).fill('idle'))
  const [logs, setLogs] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [stepData, setStepData] = useState<any>({})

  const steps = [
    { title: "Fetch Transactions", desc: "Fetch all transactions for settlement date" },
    { title: "Group by Dealership", desc: "Aggregate by Dealer ID → compute net payable" },
    { title: "Validate Bank Accounts", desc: "Validate each dealer's bank details" },
    { title: "Sequential Processing", desc: "Process debits one dealer at a time" },
    { title: "Bank API Call", desc: "Send debit request to bank" },
    { title: "Retry Logic", desc: "Retry failed transactions up to 3 times" },
    { title: "Day-end Reconciliation", desc: "Generate summary: debited / failed / pending" },
    { title: "SAP Report", desc: "Feed reconciliation data into SAP report" },
  ]

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])

  const updateStatus = (i: number, status: string) => setStepStatuses(prev => { const n = [...prev]; n[i] = status; return n })

  const runStep = async (i: number) => {
    setIsRunning(true)
    setCurrentStep(i)
    updateStatus(i, 'running')

    await new Promise(r => setTimeout(r, 1500))

    if (i === 0) {
      addLog("Fetching transactions for Mar 23, 2026...")
      await new Promise(r => setTimeout(r, 1000))
      addLog("✓ 156 transactions fetched • ₹45.8L total")
      setStepData((p: any) => ({...p, txnCount: 156, total: '₹45.8L'}))
    } else if (i === 1) {
      addLog("Grouping transactions by Dealer ID...")
      await new Promise(r => setTimeout(r, 800))
      addLog("✓ 12 dealerships identified • Net payable computed")
      setStepData((p: any) => ({...p, dealers: 12}))
    } else if (i === 2) {
      addLog("Validating bank accounts for 12 dealerships...")
      await new Promise(r => setTimeout(r, 1200))
      addLog("✓ 11 valid accounts")
      addLog("⚠ 1 flagged: Elite Autos — invalid IFSC code")
      setStepData((p: any) => ({...p, valid: 11, invalid: 1, flagged: 'Elite Autos'}))
    } else if (i === 3) {
      addLog("Starting sequential debit processing...")
      for (let d = 1; d <= 11; d++) {
        await new Promise(r => setTimeout(r, 300))
        addLog(`Processing dealer ${d}/11...`)
      }
      addLog("✓ All 11 dealers queued for debit")
    } else if (i === 4) {
      addLog("Sending debit requests to bank API...")
      await new Promise(r => setTimeout(r, 1000))
      addLog("✓ 10 debits successful")
      addLog("✗ 1 debit failed: Metro Garage — bank timeout")
      setStepData((p: any) => ({...p, success: 10, failed: 1, failedDealer: 'Metro Garage'}))
    } else if (i === 5) {
      addLog("Retrying Metro Garage — attempt 1/3...")
      await new Promise(r => setTimeout(r, 800))
      addLog("✗ Attempt 1 failed")
      addLog("Retrying Metro Garage — attempt 2/3...")
      await new Promise(r => setTimeout(r, 800))
      addLog("✗ Attempt 2 failed")
      addLog("Retrying Metro Garage — attempt 3/3...")
      await new Promise(r => setTimeout(r, 800))
      addLog("✓ Attempt 3 succeeded — UTR: UTR2026032300089")
      setStepData((p: any) => ({...p, utr: 'UTR2026032300089'}))
    } else if (i === 6) {
      addLog("Generating day-end reconciliation summary...")
      await new Promise(r => setTimeout(r, 1000))
      addLog("✓ Total Debited: ₹43.2L • Failed: ₹0 • Pending: ₹0")
      setStepData((p: any) => ({...p, reconciled: true}))
    } else if (i === 7) {
      addLog("Generating SAP settlement report...")
      await new Promise(r => setTimeout(r, 1000))
      addLog("✓ SAP_SETTLEMENT_20260323.xml generated")
      setStepData((p: any) => ({...p, sapFile: 'SAP_SETTLEMENT_20260323.xml'}))
    }

    updateStatus(i, 'success')
    setIsRunning(false)
  }

  const runAll = async () => {
    for (let i = 0; i < steps.length; i++) {
      if (stepStatuses[i] === 'idle') await runStep(i)
    }
  }

  const statusIcon = (s: string) => {
    if (s === 'running') return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
    if (s === 'success') return <CheckCircle className="w-4 h-4 text-green-500" />
    if (s === 'failed') return <XCircle className="w-4 h-4 text-red-500" />
    if (s === 'skipped') return <SkipForward className="w-4 h-4 text-muted-foreground" />
    return <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
  }

  const nextIdleStep = stepStatuses.findIndex(s => s === 'idle')

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="font-bold text-lg text-foreground">Process Settlement</h2>
            <p className="text-sm text-muted-foreground">Mar 23, 2026 — Dealership-wise daily debit</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 border-r border-border p-4 space-y-2 overflow-y-auto">
            {steps.map((step, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${currentStep === i ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'}`} onClick={() => setCurrentStep(i)}>
                {statusIcon(stepStatuses[i])}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${stepStatuses[i] === 'success' ? 'text-green-700' : stepStatuses[i] === 'running' ? 'text-blue-700' : 'text-foreground'}`}>{step.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-5 overflow-y-auto">
              {currentStep >= 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{steps[currentStep].title}</h3>
                    <p className="text-sm text-muted-foreground">{steps[currentStep].desc}</p>
                  </div>
                  {currentStep === 0 && stepData.txnCount && <div className="bg-green-50 border border-green-200 rounded-lg p-4"><p className="text-sm font-medium text-green-800">✓ {stepData.txnCount} transactions fetched • Total: {stepData.total}</p></div>}
                  {currentStep === 2 && stepData.valid && <div className="space-y-2"><div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">✓ {stepData.valid} valid accounts</div><div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800"><AlertTriangle className="w-4 h-4 inline mr-1" />1 flagged: {stepData.flagged} — invalid IFSC</div></div>}
                  {currentStep === 4 && stepData.success && <div className="space-y-2"><div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">✓ {stepData.success} debits successful</div><div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">✗ 1 failed: {stepData.failedDealer}</div></div>}
                  {currentStep === 5 && stepData.utr && <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">✓ All retries resolved — UTR: <span className="font-mono font-bold">{stepData.utr}</span></div>}
                  {currentStep === 6 && stepData.reconciled && <div className="grid grid-cols-3 gap-3"><div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center"><p className="text-xs text-green-700">Total Debited</p><p className="font-bold text-green-900">₹43.2L</p></div><div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center"><p className="text-xs text-red-700">Failed</p><p className="font-bold text-red-900">₹0</p></div><div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center"><p className="text-xs text-amber-700">Pending</p><p className="font-bold text-amber-900">₹0</p></div></div>}
                  {currentStep === 7 && stepData.sapFile && <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between"><span className="text-sm font-medium text-blue-800 font-mono">{stepData.sapFile}</span><button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium"><Download className="w-3 h-3" /> Download</button></div>}
                </div>
              )}
              {currentStep === -1 && <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Select a step or click "Run Next Step" to begin</div>}
            </div>

            <div className="border-t border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">LIVE LOG</p>
              <div className="bg-muted/30 rounded-lg p-3 h-32 overflow-y-auto font-mono text-xs space-y-1">
                {logs.length === 0 && <p className="text-muted-foreground">Waiting to start...</p>}
                {logs.map((log, i) => <p key={i} className={log.includes('✓') ? 'text-green-600' : log.includes('✗') ? 'text-red-600' : log.includes('⚠') ? 'text-amber-600' : 'text-foreground'}>{log}</p>)}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border p-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{stepStatuses.filter(s => s === 'success').length} of {steps.length} steps completed</p>
          <div className="flex gap-3">
            <button onClick={runAll} disabled={isRunning || nextIdleStep === -1} className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted disabled:opacity-50">Run All</button>
            <button onClick={() => nextIdleStep >= 0 && runStep(nextIdleStep)} disabled={isRunning || nextIdleStep === -1} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"><Play className="w-4 h-4" /> Run Next Step</button>
          </div>
        </div>
      </div>
    </div>
  )
}

