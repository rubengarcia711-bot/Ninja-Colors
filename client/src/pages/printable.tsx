import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Paintbrush, Home, Download, Printer } from "lucide-react";
import { motion } from "framer-motion";

import ninjaPlayground from "@assets/1768946008623_1768946102237.jpg";
import ninjaPlayground2 from "@assets/generated_images/ninja_kid_playground_coloring_page.png";
import ninjaKicking from "@assets/generated_images/ninja_kid_kicking_pose_coloring.png";
import ninjaCrouching from "@assets/generated_images/ninja_kid_crouching_coloring_page.png";
import ninjaNunchucks from "@assets/generated_images/ninja_kid_nunchucks_coloring_page.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const PRINTABLE_PAGES = [
  { id: "ninja-playground", name: "Playground Punch", image: ninjaPlayground },
  { id: "ninja-playground-2", name: "Power Stance", image: ninjaPlayground2 },
  { id: "ninja-kicking", name: "Flying Kick", image: ninjaKicking },
  { id: "ninja-crouching", name: "Stealth Mode", image: ninjaCrouching },
  { id: "ninja-nunchucks", name: "Nunchuck Master", image: ninjaNunchucks },
];

function downloadImage(url: string, name: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}.png`;
  link.click();
}

function printImage(url: string) {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head><title>Print Coloring Page</title></head>
        <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh;">
          <img src="${url}" style="max-width:100%; max-height:100vh;" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}

export default function Printable() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Paintbrush className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg hidden sm:block">Ninja vs Brainrot</span>
            </div>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" className="rounded-xl" data-testid="link-back-home">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black mb-4" data-testid="text-printable-title">
              <span className="text-primary">Printable</span> Ninja Pages
            </h1>
            <p className="text-muted-foreground text-lg" data-testid="text-printable-description">
              Download or print these awesome ninja coloring pages!
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {PRINTABLE_PAGES.map((page) => (
              <motion.div key={page.id} variants={fadeInUp}>
                <Card
                  className="overflow-hidden"
                  data-testid={`card-printable-${page.id}`}
                >
                  <div className="aspect-[3/4] bg-white flex items-center justify-center">
                    <img
                      src={page.image}
                      alt={page.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-center text-lg" data-testid={`text-printable-name-${page.id}`}>
                      {page.name}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 rounded-xl"
                        onClick={() => downloadImage(page.image, page.name)}
                        data-testid={`button-download-${page.id}`}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="default"
                        className="flex-1 rounded-xl"
                        onClick={() => printImage(page.image)}
                        data-testid={`button-print-${page.id}`}
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
