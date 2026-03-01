"use client";

export function PoweredByFooter() {
  return (
    <div className="py-3 px-6 border-t border-border bg-background/50">
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>Powered by</span>
        <img 
          src="/images/enkash-logo.png" 
          alt="EnKash" 
          className="h-5 object-contain"
        />
      </div>
    </div>
  );
}
