import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { Paintbrush, Palette, Sparkles, Star, Zap, Shield } from "lucide-react";
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

function CharacterCard({ name, color, type, index }: { name: string; color: string; type: "ninja" | "brainrot"; index: number }) {
  return (
    <motion.div variants={fadeInUp}>
      <Card 
        className="p-4 min-w-[140px] flex flex-col items-center gap-3 hover-elevate cursor-pointer"
        data-testid={`card-character-${type}-${index}`}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
          style={{ backgroundColor: color }}
        >
          {type === "ninja" ? <Shield className="w-8 h-8" /> : <Zap className="w-8 h-8" />}
        </div>
        <span className="text-sm font-semibold text-center" data-testid={`text-character-name-${type}-${index}`}>{name}</span>
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
            <Link href="/gallery">
              <Button variant="ghost" className="rounded-xl" data-testid="link-gallery">
                <Palette className="w-4 h-4 mr-2" />
                Gallery
              </Button>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <Star
                key={i}
                className="absolute text-primary animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${8 + Math.random() * 16}px`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="relative max-w-6xl mx-auto px-4 text-center"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-4 px-4 py-2 text-sm" variant="secondary">
                <Sparkles className="w-4 h-4 mr-2" />
                Free Coloring Fun!
              </Badge>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-black mb-6 leading-tight"
              data-testid="text-hero-title"
            >
              <span className="text-primary">Ninja Kids</span>
              <span className="text-muted-foreground mx-3">vs</span>
              <span className="text-accent">Brainrot</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
              data-testid="text-hero-description"
            >
              Color epic battles between awesome ninja kids and hilarious brainrot characters!
              Unleash your creativity with our fun coloring pages.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              <Link href="/gallery">
                <Button size="lg" className="rounded-full px-8 text-lg font-bold" data-testid="button-start-coloring">
                  <Paintbrush className="w-5 h-5 mr-2" />
                  Start Coloring!
                </Button>
              </Link>
              <Link href="/gallery?category=battle">
                <Button size="lg" variant="outline" className="rounded-full px-8 text-lg font-bold" data-testid="button-view-battles">
                  <Zap className="w-5 h-5 mr-2" />
                  View Battles
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <section className="py-16 bg-card/50">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold text-center mb-4">
                Meet the <span className="text-primary">Ninja Kids</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground text-center mb-8">
                Brave warriors ready to defend against the brainrot invasion!
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
              <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold text-center mb-4">
                The <span className="text-accent">Brainrot</span> Villains
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted-foreground text-center mb-8">
                Wacky internet characters causing chaos everywhere!
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

        <section className="py-16 bg-card/50">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold text-center mb-12">
                How It Works
              </motion.h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: Palette, title: "1. Choose", desc: "Pick your favorite character or battle scene" },
                  { icon: Paintbrush, title: "2. Color", desc: "Use our fun tools to bring it to life" },
                  { icon: Sparkles, title: "3. Share", desc: "Save and show off your masterpiece" },
                ].map((step, i) => (
                  <motion.div key={i} variants={fadeInUp}>
                    <Card className="p-6 text-center h-full" data-testid={`card-step-${i + 1}`}>
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <step.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
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
              <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold text-center mb-8">
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
                          className="overflow-hidden hover-elevate cursor-pointer group"
                          data-testid={`card-featured-${page.id}`}
                        >
                          <div className="aspect-square bg-muted/30 flex items-center justify-center relative">
                            <div
                              className="w-full h-full p-4"
                              dangerouslySetInnerHTML={{ __html: page.svgContent }}
                            />
                            {page.isNew && (
                              <Badge className="absolute top-2 right-2" variant="default">
                                NEW
                              </Badge>
                            )}
                          </div>
                          <div className="p-3 text-center">
                            <span className="font-semibold text-sm">{page.name}</span>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>
              <motion.div variants={fadeInUp} className="text-center mt-8">
                <Link href="/gallery">
                  <Button size="lg" variant="outline" className="rounded-full px-8" data-testid="button-view-all">
                    View All Pages
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            Made with love for creative kids everywhere!
          </p>
        </div>
      </footer>
    </div>
  );
}
