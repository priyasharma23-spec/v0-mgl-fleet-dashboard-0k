"use client"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{padding:"40px",fontFamily:"monospace"}}>
      <h2 style={{color:"red",fontSize:"20px"}}>
        Runtime Error
      </h2>
      <pre style={{
        background:"#fee",
        border:"1px solid red",
        padding:"16px",
        borderRadius:"8px",
        fontSize:"13px",
        whiteSpace:"pre-wrap",
        marginTop:"16px"
      }}>
        {error.message}
      </pre>
      <pre style={{
        background:"#f5f5f5",
        border:"1px solid #ccc",
        padding:"16px",
        borderRadius:"8px",
        fontSize:"11px",
        whiteSpace:"pre-wrap",
        marginTop:"16px",
        color:"#666"
      }}>
        {error.stack}
      </pre>
      <button
        onClick={reset}
        style={{
          marginTop:"16px",
          padding:"8px 24px",
          background:"#2EAD4B",
          color:"white",
          border:"none",
          borderRadius:"8px",
          cursor:"pointer",
          fontSize:"14px"
        }}
      >
        Try again
      </button>
    </div>
  )
}
