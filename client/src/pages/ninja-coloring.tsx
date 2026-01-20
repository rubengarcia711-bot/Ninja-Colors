import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { 
  ArrowLeft, 
  Download, 
  Undo2, 
  Redo2, 
  Eraser, 
  Paintbrush, 
  Trash2,
  Home
} from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

import ninjaImage1 from "@assets/1768946008623_1768946102237.jpg";
import ninjaImage2 from "@assets/generated_images/ninja_kid_playground_coloring_page.png";
import ninjaImage3 from "@assets/generated_images/ninja_kid_kicking_pose_coloring.png";
import ninjaImage4 from "@assets/generated_images/ninja_kid_crouching_coloring_page.png";
import ninjaImage5 from "@assets/generated_images/ninja_kid_nunchucks_coloring_page.png";

const NINJA_IMAGES = [
  { src: ninjaImage1, name: "Playground Punch" },
  { src: ninjaImage2, name: "Power Stance" },
  { src: ninjaImage3, name: "Flying Kick" },
  { src: ninjaImage4, name: "Stealth Mode" },
  { src: ninjaImage5, name: "Nunchuck Master" },
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

export default function NinjaColoring() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const ninjaIndex = parseInt(params.id || "0", 10);
  const ninja = NINJA_IMAGES[ninjaIndex] || NINJA_IMAGES[0];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#E74C3C");
  const [brushSize, setBrushSize] = useState(15);
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

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

  const loadNinjaImage = useCallback(() => {
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
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([{ imageData }]);
      setHistoryIndex(0);
    };
    img.src = ninja.src;
  }, [ninja.src]);

  useEffect(() => {
    loadNinjaImage();
  }, [loadNinjaImage]);

  useEffect(() => {
    const handleResize = () => {
      if (imageLoaded) {
        loadNinjaImage();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imageLoaded, loadNinjaImage]);

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
    setIsDrawing(true);
    const { x, y } = getCanvasCoords(e);
    lastPosRef.current = null;
    draw(x, y);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
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
    loadNinjaImage();
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
                className="border-2 border-primary/20 rounded-lg cursor-crosshair touch-none"
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
            <div className="flex gap-2">
              <Button
                variant={tool === "brush" ? "default" : "outline"}
                className="flex-1 rounded-xl"
                onClick={() => setTool("brush")}
                data-testid="button-tool-brush"
              >
                <Paintbrush className="w-4 h-4 mr-2" />
                Brush
              </Button>
              <Button
                variant={tool === "eraser" ? "default" : "outline"}
                className="flex-1 rounded-xl"
                onClick={() => setTool("eraser")}
                data-testid="button-tool-eraser"
              >
                <Eraser className="w-4 h-4 mr-2" />
                Eraser
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Brush Size</span>
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
                      setTool("brush");
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
    </div>
  );
}
