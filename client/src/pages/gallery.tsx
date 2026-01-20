import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Home, Sword, Paintbrush } from "lucide-react";
import { motion } from "framer-motion";

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

const NINJA_PAGES = [
  { id: 0, src: ninjaImage1, name: "Playground Punch" },
  { id: 1, src: ninjaImage2, name: "Power Stance" },
  { id: 2, src: ninjaImage3, name: "Flying Kick" },
  { id: 3, src: ninjaImage4, name: "Stealth Mode" },
  { id: 4, src: ninjaImage5, name: "Nunchuck Master" },
  { id: 5, src: ninjaImage6, name: "Ninja Girl" },
  { id: 6, src: ninjaGirl1, name: "Monkey Bars" },
  { id: 7, src: ninjaGirl2, name: "Slide Adventure" },
  { id: 8, src: ninjaGirl3, name: "Swing Time" },
  { id: 9, src: ninjaGirl4, name: "Rope Climber" },
  { id: 10, src: ninjaGirl5, name: "Balance Master" },
  { id: 11, src: ninjaGirl6, name: "Tunnel Sneak" },
];

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

export default function Gallery() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b-2 border-primary/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
                <Sword className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg hidden sm:block">
                <span className="text-primary">Ninja Kids</span>
                <span className="text-muted-foreground mx-1">Coloring</span>
              </span>
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
            <h1 className="text-3xl md:text-5xl font-black mb-4" data-testid="text-gallery-title">
              Choose Your <span className="text-primary">Ninja</span>
            </h1>
            <p className="text-muted-foreground text-lg" data-testid="text-gallery-description">
              Pick a ninja warrior to start your coloring adventure!
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
          >
            {NINJA_PAGES.map((ninja) => (
              <motion.div key={ninja.id} variants={fadeInUp}>
                <Link href={`/color-ninja/${ninja.id}`}>
                  <Card
                    className="overflow-hidden hover-elevate cursor-pointer group border-2 border-primary/20"
                    data-testid={`card-gallery-ninja-${ninja.id}`}
                  >
                    <div className="aspect-square bg-white flex items-center justify-center relative overflow-hidden">
                      <img
                        src={ninja.src}
                        alt={ninja.name}
                        className="w-full h-full object-cover object-top transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                        <span className="text-white font-bold flex items-center gap-2">
                          <Paintbrush className="w-4 h-4" />
                          Color Now
                        </span>
                      </div>
                    </div>
                    <div className="p-4 text-center bg-card">
                      <span className="font-bold">{ninja.name}</span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="text-center mt-12">
            <Link href="/printable">
              <Button size="lg" variant="outline" className="rounded-full px-10 border-2 font-bold" data-testid="button-printable">
                Want to Print Instead?
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
