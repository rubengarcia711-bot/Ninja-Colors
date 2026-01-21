import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Download, 
  Undo2, 
  Redo2, 
  Eraser, 
  Paintbrush, 
  Trash2,
  Home,
  PaintBucket,
  Save
} from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { AdBanner } from "@/components/ad-banner";
import { PremiumModal } from "@/components/premium-modal";

import ninjaImage1 from "@assets/1768946008623_1768946102237.jpg";
import ninjaImage2 from "@assets/generated_images/ninja_kid_playground_coloring_page.png";
import ninjaImage3 from "@assets/generated_images/ninja_kid_kicking_pose_coloring.png";
import ninjaImage4 from "@assets/generated_images/ninja_kid_crouching_coloring_page.png";
import ninjaImage5 from "@assets/generated_images/ninja_kid_nunchucks_coloring_page.png";
import ninjaImage6 from "@assets/generated_images/female_ninja_girl_coloring_page.png";
import ninjaGirl1 from "@assets/generated_images/ninja_girl_monkey_bars.png";
import ninjaGirl2 from "@assets/generated_images/ninja_girl_playground_slide.png";
import ninjaGirl3 from "@assets/generated_images/ninja_girl_on_swings.png";
import ninjaGirl4 from "@assets/generated_images/ninja_girl_rope_climbing.png";
import ninjaGirl5 from "@assets/generated_images/ninja_girl_balance_beam.png";
import ninjaGirl6 from "@assets/generated_images/ninja_girl_playground_tunnel.png";

const NINJA_IMAGES = [
  { src: ninjaImage1, name: "Playground Punch" },
  { src: ninjaImage2, name: "Power Stance" },
  { src: ninjaImage3, name: "Flying Kick" },
  { src: ninjaImage4, name: "Stealth Mode" },
  { src: ninjaImage5, name: "Nunchuck Master" },
  { src: ninjaImage6, name: "Ninja Girl" },
  { src: ninjaGirl1, name: "Monkey Bars" },
  { src: ninjaGirl2, name: "Slide Adventure" },
  { src: ninjaGirl3, name: "Swing Time" },
  { src: ninjaGirl4, name: "Rope Climber" },
  { src: ninjaGirl5, name: "Balance Master" },
  { src: ninjaGirl6, name: "Tunnel Sneak" },
];

const COLOR_PALETTE = [
  "#E74C3C", "#F39C12", "#F1C40F", "#2ECC71", "#1ABC9C",
  "#3498DB", "#9B59B6", "#E91E63", "#FF5722", "#795548",
  "#607D8B", "#000000", "#FFFFFF", "#FFB6C1", "#87CEEB",
  "#98FB98", "#DDA0DD", "#F0E68C", "#FFA07A", "#20B2AA",
];

interface HistoryState {
  imageData: ImageData;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function colorsMatch(
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number,
  tolerance: number = 32
): boolean {
  return (
    Math.abs(r1 - r2) <= tolerance &&
    Math.abs(g1 - g2) <= tolerance &&
    Math.abs(b1 - b2) <= tolerance
  );
}

export default function NinjaColoring() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const ninjaIndex = parseInt(params.id || "0", 10);
  const ninja = NINJA_IMAGES[ninjaIndex] || NINJA_IMAGES[0];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#E74C3C");
  const [brushSize, setBrushSize] = useState(15);
  const [tool, setTool] = useState<"brush" | "eraser" | "bucket">("brush");
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const getStorageKey = () => `ninja-coloring-${ninjaIndex}`;

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ imageData });
    
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const loadSavedProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    const saved = localStorage.getItem(getStorageKey());
    if (saved) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([{ imageData }]);
        setHistoryIndex(0);
      };
      img.src = saved;
      return true;
    }
    return false;
  }, [ninjaIndex]);

  const loadNinjaImage = useCallback((checkSaved: boolean = true) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      const scale = Math.min(
        containerWidth / img.width,
        containerHeight / img.height,
        1
      );
      
      const width = img.width * scale;
      const height = img.height * scale;
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      
      setImageLoaded(true);
      
      const hasSaved = localStorage.getItem(getStorageKey());
      setHasSavedProgress(!!hasSaved);
      
      if (checkSaved && hasSaved) {
        loadSavedProgress();
      } else {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([{ imageData }]);
        setHistoryIndex(0);
      }
    };
    img.src = ninja.src;
  }, [ninja.src, loadSavedProgress, ninjaIndex]);

  useEffect(() => {
    loadNinjaImage();
  }, [loadNinjaImage]);

  useEffect(() => {
    const hasSaved = localStorage.getItem(getStorageKey());
    setHasSavedProgress(!!hasSaved);
  }, [ninjaIndex]);

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const floodFill = (startX: number, startY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const x = Math.floor(startX);
    const y = Math.floor(startY);

    if (x < 0 || x >= width || y < 0 || y >= height) return;

    const startIdx = (y * width + x) * 4;
    const startR = data[startIdx];
    const startG = data[startIdx + 1];
    const startB = data[startIdx + 2];

    const fillColor = hexToRgb(selectedColor);

    if (colorsMatch(startR, startG, startB, fillColor.r, fillColor.g, fillColor.b, 10)) {
      return;
    }

    const visited = new Uint8Array(width * height);
    const stack: number[] = [y * width + x];

    while (stack.length > 0) {
      const pixelIdx = stack.pop()!;
      
      if (visited[pixelIdx]) continue;
      
      const cy = Math.floor(pixelIdx / width);
      const cx = pixelIdx % width;
      
      if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;

      const idx = pixelIdx * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      if (!colorsMatch(r, g, b, startR, startG, startB, 32)) continue;

      visited[pixelIdx] = 1;
      data[idx] = fillColor.r;
      data[idx + 1] = fillColor.g;
      data[idx + 2] = fillColor.b;
      data[idx + 3] = 255;

      if (cx + 1 < width) stack.push(pixelIdx + 1);
      if (cx - 1 >= 0) stack.push(pixelIdx - 1);
      if (cy + 1 < height) stack.push(pixelIdx + width);
      if (cy - 1 >= 0) stack.push(pixelIdx - width);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const draw = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = selectedColor;
    }

    if (lastPosRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = tool === "eraser" ? "rgba(0,0,0,1)" : selectedColor;
      ctx.fill();
    }

    lastPosRef.current = { x, y };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);

    if (tool === "bucket") {
      floodFill(x, y);
      saveToHistory();
      return;
    }

    setIsDrawing(true);
    lastPosRef.current = null;
    draw(x, y);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || tool === "bucket") return;
    e.preventDefault();
    const { x, y } = getCanvasCoords(e);
    draw(x, y);
  };

  const handleEnd = () => {
    if (isDrawing) {
      setIsDrawing(false);
      lastPosRef.current = null;
      saveToHistory();
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.putImageData(history[newIndex].imageData, 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.putImageData(history[newIndex].imageData, 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const clearCanvas = () => {
    localStorage.removeItem(getStorageKey());
    setHasSavedProgress(false);
    loadNinjaImage(false);
  };

  const saveProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    localStorage.setItem(getStorageKey(), dataUrl);
    setHasSavedProgress(true);
    
    toast({
      title: "Progress Saved!",
      description: "Your coloring has been saved. Come back anytime to continue!",
    });
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${ninja.name.replace(/\s+/g, "-").toLowerCase()}-colored.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#E74C3C", "#FFB7C5", "#FFD700"],
    });
  };

  const navigateNinja = (direction: "prev" | "next") => {
    const newIndex = direction === "prev" 
      ? (ninjaIndex - 1 + NINJA_IMAGES.length) % NINJA_IMAGES.length
      : (ninjaIndex + 1) % NINJA_IMAGES.length;
    setLocation(`/color-ninja/${newIndex}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b-2 border-primary/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-xl" data-testid="button-back-home">
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            <span className="font-bold text-lg">
              <span className="text-primary">{ninja.name}</span>
            </span>
            {hasSavedProgress && (
              <span className="text-xs text-muted-foreground bg-secondary/20 px-2 py-1 rounded-full">
                Saved
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateNinja("prev")}
              className="rounded-xl"
              data-testid="button-prev-ninja"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {ninjaIndex + 1} / {NINJA_IMAGES.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateNinja("next")}
              className="rounded-xl rotate-180"
              data-testid="button-next-ninja"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex items-center justify-center"
        >
          <Card className="p-4 w-full h-full flex items-center justify-center bg-white dark:bg-gray-100">
            <div
              ref={containerRef}
              className="w-full h-full flex items-center justify-center"
              style={{ minHeight: "400px", maxHeight: "70vh" }}
            >
              <canvas
                ref={canvasRef}
                className={`border-2 border-primary/20 rounded-lg touch-none ${
                  tool === "bucket" ? "cursor-cell" : "cursor-crosshair"
                }`}
                style={{ maxWidth: "100%", maxHeight: "100%" }}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
                data-testid="canvas-coloring"
              />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-72 space-y-4"
        >
          <Card className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={tool === "brush" ? "default" : "outline"}
                className="rounded-xl"
                onClick={() => setTool("brush")}
                data-testid="button-tool-brush"
              >
                <Paintbrush className="w-4 h-4" />
              </Button>
              <Button
                variant={tool === "bucket" ? "default" : "outline"}
                className="rounded-xl"
                onClick={() => setTool("bucket")}
                data-testid="button-tool-bucket"
              >
                <PaintBucket className="w-4 h-4" />
              </Button>
              <Button
                variant={tool === "eraser" ? "default" : "outline"}
                className="rounded-xl"
                onClick={() => setTool("eraser")}
                data-testid="button-tool-eraser"
              >
                <Eraser className="w-4 h-4" />
              </Button>
            </div>

            {tool !== "bucket" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {tool === "brush" ? "Brush" : "Eraser"} Size
                  </span>
                  <span className="text-sm text-muted-foreground">{brushSize}px</span>
                </div>
                <Slider
                  value={[brushSize]}
                  onValueChange={(v) => setBrushSize(v[0])}
                  min={2}
                  max={50}
                  step={1}
                  className="w-full"
                  data-testid="slider-brush-size"
                />
              </div>
            )}

            <div className="space-y-2">
              <span className="text-sm font-medium">Colors</span>
              <div className="grid grid-cols-5 gap-2">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      selectedColor === color
                        ? "border-primary scale-110 shadow-lg"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setSelectedColor(color);
                      if (tool === "eraser") setTool("brush");
                    }}
                    data-testid={`button-color-${color.replace("#", "")}`}
                  />
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={undo}
                disabled={historyIndex <= 0}
                className="rounded-xl"
                data-testid="button-undo"
              >
                <Undo2 className="w-4 h-4 mr-2" />
                Undo
              </Button>
              <Button
                variant="outline"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="rounded-xl"
                data-testid="button-redo"
              >
                <Redo2 className="w-4 h-4 mr-2" />
                Redo
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={saveProgress}
              className="w-full rounded-xl"
              data-testid="button-save"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Progress
            </Button>
            <Button
              variant="outline"
              onClick={clearCanvas}
              className="w-full rounded-xl"
              data-testid="button-clear"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Start Over
            </Button>
            <Button
              onClick={downloadImage}
              className="w-full rounded-xl"
              data-testid="button-download"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </Card>
        </motion.div>
      </div>

      <AdBanner 
        position="bottom" 
        onUpgrade={() => setShowPremiumModal(true)} 
      />

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </div>
  );
}
