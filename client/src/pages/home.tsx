import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { Paintbrush, Palette, Sparkles, Zap, Shield, Printer, Sword } from "lucide-react";
import { NINJA_CHARACTERS, BRAINROT_CHARACTERS } from "@shared/coloring-data";
import type { ColoringPage } from "@shared/schema";
import { motion } from "framer-motion";

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

function SakuraPetal({ delay, left }: { delay: number; left: string }) {
  return (
    <motion.div
      className="absolute w-3 h-3 rounded-full bg-secondary/60"
      style={{ left }}
      initial={{ y: -20, x: 0, rotate: 0, opacity: 0.8 }}
      animate={{
        y: 500,
        x: [0, 30, -20, 40, 0],
        rotate: [0, 180, 360],
        opacity: [0.8, 0.8, 0.6, 0.4, 0],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

function CharacterCard({ name, color, type, index }: { name: string; color: string; type: "ninja" | "brainrot"; index: number }) {
  return (
    <motion.div variants={fadeInUp}>
      <Card 
        className="p-4 min-w-[140px] flex flex-col items-center gap-3 hover-elevate cursor-pointer border-2 border-primary/20"
        data-testid={`card-character-${type}-${index}`}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
          style={{ backgroundColor: color }}
        >
          {type === "ninja" ? <Shield className="w-8 h-8" /> : <Zap className="w-8 h-8" />}
        </div>
        <span className="text-sm font-bold text-center" data-testid={`text-character-name-${type}-${index}`}>{name}</span>
      </Card>
    </motion.div>
  );
}

function ColoringPageSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square" />
      <div className="p-3">
        <Skeleton className="h-4 w-20 mx-auto" />
      </div>
    </Card>
  );
}

export default function Home() {
  const { data: coloringPages = [], isLoading } = useQuery<ColoringPage[]>({
    queryKey: ["/api/coloring-pages"],
  });

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
                <span className="text-primary">Ninja</span>
                <span className="text-muted-foreground mx-1">vs</span>
                <span className="text-accent">Brainrot</span>
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/gallery">
              <Button variant="ghost" className="rounded-xl" data-testid="link-gallery">
                <Palette className="w-4 h-4 mr-2" />
                Gallery
              </Button>
            </Link>
            <Link href="/printable">
              <Button variant="ghost" className="rounded-xl" data-testid="link-printable">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
          <div className="absolute inset-0 sakura-pattern" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <SakuraPetal key={i} delay={i * 0.5} left={`${5 + i * 6}%`} />
            ))}
          </div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="relative max-w-6xl mx-auto px-4 text-center"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 px-5 py-2 text-sm font-bold border-2 border-accent/50" variant="secondary">
                <Sparkles className="w-4 h-4 mr-2" />
                Free Coloring Adventure!
              </Badge>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight"
              data-testid="text-hero-title"
            >
              <span className="text-primary anime-title">Ninja Kids</span>
              <br className="md:hidden" />
              <span className="text-muted-foreground mx-3 text-3xl md:text-5xl">VS</span>
              <br className="md:hidden" />
              <span className="text-accent">Brainrot</span>
            </motion.h1>
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="text-2xl md:text-3xl font-bold text-secondary brush-stroke inline-block">
                Coloring Adventure
              </span>
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
              data-testid="text-hero-description"
            >
              Join the ultimate battle! Color epic ninja warriors fighting hilarious brainrot villains.
              Unleash your inner artist!
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              <Link href="/gallery">
                <Button size="lg" className="rounded-full px-10 text-lg font-bold shadow-lg" data-testid="button-start-coloring">
                  <Paintbrush className="w-5 h-5 mr-2" />
                  Start Coloring!
                </Button>
              </Link>
              <Link href="/gallery?category=battle">
                <Button size="lg" variant="outline" className="rounded-full px-10 text-lg font-bold border-2" data-testid="button-view-battles">
                  <Zap className="w-5 h-5 mr-2" />
                  Epic Battles
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <section className="py-16 bg-gradient-to-b from-card/80 to-card/40 border-y-2 border-primary/10">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-black text-center mb-2">
                Meet the <span className="text-primary">Ninja Warriors</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground text-center mb-8 text-lg">
                Brave heroes defending against the brainrot invasion!
              </motion.p>
              <motion.div
                variants={staggerContainer}
                className="flex gap-4 overflow-x-auto pb-4 px-4 -mx-4 snap-x snap-mandatory"
              >
                {NINJA_CHARACTERS.map((char, index) => (
                  <div key={char.id} className="snap-start">
                    <CharacterCard name={char.name} color={char.color} type="ninja" index={index} />
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-black text-center mb-2">
                The <span className="text-accent">Brainrot</span> Villains
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground text-center mb-8 text-lg">
                Wacky internet creatures causing chaos everywhere!
              </motion.p>
              <motion.div
                variants={staggerContainer}
                className="flex gap-4 overflow-x-auto pb-4 px-4 -mx-4 snap-x snap-mandatory"
              >
                {BRAINROT_CHARACTERS.map((char, index) => (
                  <div key={char.id} className="snap-start">
                    <CharacterCard name={char.name} color={char.color} type="brainrot" index={index} />
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-muted/30 to-muted/10">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-black text-center mb-12">
                How It Works
              </motion.h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: Palette, title: "Choose", desc: "Pick your favorite ninja or battle scene", color: "bg-primary/10 text-primary" },
                  { icon: Paintbrush, title: "Color", desc: "Use our fun tools to bring it to life", color: "bg-accent/10 text-accent" },
                  { icon: Sparkles, title: "Share", desc: "Save and show off your masterpiece", color: "bg-secondary/10 text-secondary" },
                ].map((step, i) => (
                  <motion.div key={i} variants={fadeInUp}>
                    <Card className="p-6 text-center h-full border-2 border-primary/10" data-testid={`card-step-${i + 1}`}>
                      <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4`}>
                        <step.icon className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-black mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-black text-center mb-8">
                Featured Coloring Pages
              </motion.h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {isLoading ? (
                  [...Array(8)].map((_, i) => (
                    <ColoringPageSkeleton key={i} />
                  ))
                ) : (
                  coloringPages.slice(0, 8).map((page) => (
                    <motion.div key={page.id} variants={fadeInUp}>
                      <Link href={`/color/${page.id}`}>
                        <Card 
                          className="overflow-hidden hover-elevate cursor-pointer group border-2 border-primary/10"
                          data-testid={`card-featured-${page.id}`}
                        >
                          <div className="aspect-square bg-white flex items-center justify-center relative">
                            <div
                              className="w-full h-full p-4 transition-transform group-hover:scale-105"
                              dangerouslySetInnerHTML={{ __html: page.svgContent }}
                            />
                            {page.isNew && (
                              <Badge className="absolute top-2 right-2 font-bold" variant="default">
                                NEW
                              </Badge>
                            )}
                          </div>
                          <div className="p-3 text-center bg-card">
                            <span className="font-bold text-sm">{page.name}</span>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>
              <motion.div variants={fadeInUp} className="text-center mt-10">
                <Link href="/gallery">
                  <Button size="lg" variant="outline" className="rounded-full px-10 border-2 font-bold" data-testid="button-view-all">
                    View All Pages
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-10 border-t-2 border-primary/10 bg-card/50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Sword className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">Ninja vs Brainrot</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Made with love for creative kids everywhere!
          </p>
        </div>
      </footer>
    </div>
  );
}
