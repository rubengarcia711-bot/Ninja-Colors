import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Check, Sparkles } from "lucide-react";
import { setPremium } from "@/lib/premium";
import { useToast } from "@/hooks/use-toast";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseComplete?: () => void;
}

export function PremiumModal({ isOpen, onClose, onPurchaseComplete }: PremiumModalProps) {
  const { toast } = useToast();

  if (!isOpen) return null;

  const handlePurchase = () => {
    setPremium(true);
    toast({
      title: "Premium Activated!",
      description: "Ads have been removed. Enjoy your coloring!",
    });
    onPurchaseComplete?.();
    onClose();
  };

  const handleRestore = () => {
    const restored = localStorage.getItem('ninja-coloring-premium') === 'true';
    if (restored) {
      toast({
        title: "Purchase Restored!",
        description: "Your premium status has been restored.",
      });
      onClose();
    } else {
      toast({
        title: "No Purchase Found",
        description: "We couldn't find a previous purchase.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="max-w-sm w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-muted rounded-full"
          data-testid="button-close-premium-modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">Go Premium!</h2>
          <p className="text-muted-foreground text-sm">
            Remove all ads and enjoy uninterrupted coloring
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-sm">No more ads</span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-sm">All 12 ninja characters</span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-sm">Save unlimited artwork</span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-sm">One-time purchase</span>
          </div>
        </div>

        <div className="text-center mb-4">
          <span className="text-3xl font-bold">$0.99</span>
          <span className="text-muted-foreground text-sm ml-1">one time</span>
        </div>

        <Button 
          onClick={handlePurchase} 
          className="w-full mb-3"
          data-testid="button-purchase-premium"
        >
          Upgrade Now
        </Button>

        <button 
          onClick={handleRestore}
          className="w-full text-sm text-muted-foreground hover:text-foreground"
          data-testid="button-restore-purchase"
        >
          Restore Purchase
        </button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Payment handled securely through Google Play
        </p>
      </Card>
    </div>
  );
}
