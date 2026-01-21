import { isPremium } from "@/lib/premium";
import { X } from "lucide-react";

interface AdBannerProps {
  position?: "top" | "bottom";
  onUpgrade?: () => void;
}

export function AdBanner({ position = "bottom", onUpgrade }: AdBannerProps) {
  if (isPremium()) {
    return null;
  }

  return (
    <div 
      className={`w-full bg-muted/80 border-t border-border py-2 px-4 flex items-center justify-center gap-3 ${
        position === "top" ? "border-t-0 border-b" : ""
      }`}
      data-testid="ad-banner"
      data-ad-slot="ninja-coloring-banner"
    >
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-card border border-dashed border-muted-foreground/30 rounded-md px-4 py-2 text-center">
          <span className="text-xs text-muted-foreground">
            Ad Space - Remove ads for $0.99
          </span>
        </div>
      </div>
      {onUpgrade && (
        <button 
          onClick={onUpgrade}
          className="text-xs text-primary hover:underline whitespace-nowrap"
          data-testid="button-remove-ads"
        >
          Remove Ads
        </button>
      )}
    </div>
  );
}

export function AdInterstitial({ onClose, onUpgrade }: { onClose: () => void; onUpgrade?: () => void }) {
  if (isPremium()) {
    onClose();
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl p-6 max-w-sm w-full text-center relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full"
          data-testid="button-close-ad"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="bg-muted border border-dashed border-muted-foreground/30 rounded-lg p-8 mb-4">
          <span className="text-sm text-muted-foreground">
            Ad Content Here
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          Enjoying Ninja Coloring?
        </p>
        
        {onUpgrade && (
          <button
            onClick={onUpgrade}
            className="w-full bg-primary text-primary-foreground rounded-lg py-2 font-medium hover:bg-primary/90"
            data-testid="button-upgrade-premium"
          >
            Remove Ads - $0.99
          </button>
        )}
      </div>
    </div>
  );
}
