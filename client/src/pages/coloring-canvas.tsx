import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Undo2,
  Redo2,
  Trash2,
  Download,
  PaintBucket,
  ChevronLeft,
  Sword,
} from "lucide-react";
import { COLOR_PALETTE } from "@shared/coloring-data";
import type { ColoringPage } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

interface HistoryState {
  colorData: Record<string, string>;
}

export default function ColoringCanvas() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  
  const { data: page, isLoading, error } = useQuery<ColoringPage>({
    queryKey: ["/api/coloring-pages", id],
    enabled: !!id,
  });
  
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const [colorData, setColorData] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<HistoryState[]>([{ colorData: {} }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const svgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      setLocation("/gallery");
    }
  }, [error, setLocation]);

  const saveToHistory = useCallback((newColorData: Record<string, string>) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ colorData: newColorData });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setColorData(history[newIndex].colorData);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setColorData(history[newIndex].colorData);
    }
  }, [history, historyIndex]);

  const clearAll = useCallback(() => {
    const newColorData = {};
    setColorData(newColorData);
    saveToHistory(newColorData);
  }, [saveToHistory]);

  const handleSvgClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as SVGElement;
    const region = target.closest("[data-region]");
    
    if (region) {
      const regionId = region.getAttribute("data-region");
      if (regionId) {
        const newColorData = { ...colorData };
        newColorData[regionId] = selectedColor;
        setColorData(newColorData);
        saveToHistory(newColorData);
        
        const coloredRegions = Object.keys(newColorData).length;
        const totalRegions = svgRef.current?.querySelectorAll("[data-region]").length || 0;
        if (coloredRegions >= totalRegions * 0.8) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      }
    }
  }, [colorData, selectedColor, saveToHistory]);

  const applyColorsToSvg = useCallback(() => {
    if (!svgRef.current) return;
    
    const regions = svgRef.current.querySelectorAll("[data-region]");
    regions.forEach((region) => {
      const regionId = region.getAttribute("data-region");
      if (regionId && colorData[regionId]) {
        (region as SVGElement).style.fill = colorData[regionId];
      } else {
        (region as SVGElement).style.fill = "none";
      }
    });
  }, [colorData]);

  useEffect(() => {
    applyColorsToSvg();
  }, [colorData, applyColorsToSvg]);

  const downloadArtwork = useCallback(() => {
    if (!svgRef.current || !page) return;
    
    const svg = svgRef.current.querySelector("svg");
    if (!svg) return;
    
    const clone = svg.cloneNode(true) as SVGElement;
    const regions = clone.querySelectorAll("[data-region]");
    regions.forEach((region) => {
      const regionId = region.getAttribute("data-region");
      if (regionId && colorData[regionId]) {
        (region as SVGElement).style.fill = colorData[regionId];
      }
    });
    
    const svgData = new XMLSerializer().serializeToString(clone);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    canvas.width = 800;
    canvas.height = 800;
    
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const link = document.createElement("a");
        link.download = `${page.name || "artwork"}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  }, [colorData, page]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b-2 border-primary/20">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <Skeleton className="h-6 w-32" />
          </div>
        </header>
        <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-6xl mx-auto w-full">
          <div className="flex-1 flex items-center justify-center">
            <Skeleton className="w-full aspect-square max-w-lg rounded-xl" />
          </div>
          <div className="lg:w-80 space-y-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b-2 border-primary/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/gallery">
              <Button variant="ghost" size="icon" className="rounded-xl" data-testid="button-back">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Sword className="w-5 h-5 text-primary" />
              <h1 className="font-black text-lg truncate" data-testid="text-page-title">{page.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={undo}
              disabled={historyIndex === 0}
              data-testid="button-undo"
            >
              <Undo2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              data-testid="button-redo"
            >
              <Redo2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={clearAll}
              data-testid="button-clear"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={downloadArtwork}
              data-testid="button-download"
            >
              <Download className="w-5 h-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-6xl mx-auto w-full">
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full aspect-square max-w-lg overflow-hidden relative border-2 border-primary/20">
            <div
              ref={svgRef}
              className="w-full h-full p-8 bg-white cursor-pointer"
              onClick={handleSvgClick}
              dangerouslySetInnerHTML={{ __html: page.svgContent }}
              style={{ touchAction: "none" }}
              data-testid="coloring-canvas"
            />
            <AnimatePresence>
              {showConfetti && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                  data-testid="confetti-animation"
                >
                  {[...Array(50)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)],
                        left: `${Math.random() * 100}%`,
                      }}
                      initial={{ y: -20, opacity: 1 }}
                      animate={{
                        y: 600,
                        opacity: 0,
                        rotate: Math.random() * 360,
                      }}
                      transition={{
                        duration: 2 + Math.random(),
                        delay: Math.random() * 0.5,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>

        <div className="lg:w-80 space-y-4">
          <Card className="p-4 border-2 border-primary/10">
            <h3 className="font-black mb-3 text-sm text-muted-foreground uppercase tracking-wide" data-testid="text-tools-label">
              How to Color
            </h3>
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <PaintBucket className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground" data-testid="text-instructions">
                Tap any area to fill it with the selected color!
              </p>
            </div>
          </Card>

          <Card className="p-4 border-2 border-primary/10">
            <h3 className="font-black mb-3 text-sm text-muted-foreground uppercase tracking-wide" data-testid="text-colors-label">
              Colors
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_PALETTE.map((color, index) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-xl transition-all hover:scale-110 shadow-sm ${
                    selectedColor === color
                      ? "ring-2 ring-offset-2 ring-primary ring-offset-background scale-110"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  data-testid={`button-color-${index}`}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </Card>

          <Card className="p-4 border-2 border-primary/10">
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground font-bold" data-testid="text-current-color-label">Current:</div>
              <div
                className="w-10 h-10 rounded-xl border-2 border-border shadow-sm"
                style={{ backgroundColor: selectedColor }}
                data-testid="current-color-preview"
              />
              <span className="font-mono text-sm uppercase font-bold" data-testid="text-current-color-value">{selectedColor}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
