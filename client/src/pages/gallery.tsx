import { useState } from "react";
import { Link, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { Home, Palette, Swords, Shield, Zap, Sword } from "lucide-react";
import type { ColoringPage } from "@shared/schema";
import { motion } from "framer-motion";

type Category = "all" | "ninja" | "brainrot" | "battle";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

function ColoringPageSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square" />
      <div className="p-4">
        <Skeleton className="h-5 w-24 mx-auto" />
      </div>
    </Card>
  );
}

export default function Gallery() {
  const searchParams = new URLSearchParams(useSearch());
  const initialCategory = (searchParams.get("category") as Category) || "all";
  const [category, setCategory] = useState<Category>(initialCategory);

  const { data: coloringPages = [], isLoading } = useQuery<ColoringPage[]>({
    queryKey: ["/api/coloring-pages"],
  });

  const filteredPages = category === "all"
    ? coloringPages
    : coloringPages.filter((p) => p.category === category);

  const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: "All", icon: <Palette className="w-4 h-4" /> },
    { id: "ninja", label: "Ninja", icon: <Shield className="w-4 h-4" /> },
    { id: "brainrot", label: "Brainrot", icon: <Zap className="w-4 h-4" /> },
    { id: "battle", label: "Battles", icon: <Swords className="w-4 h-4" /> },
  ];

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
              Choose Your <span className="text-primary">Battle</span>
            </h1>
            <p className="text-muted-foreground text-lg" data-testid="text-gallery-description">
              Pick a warrior or epic scene to start your coloring adventure!
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={category === cat.id ? "default" : "outline"}
                className="rounded-full px-6 font-bold border-2"
                onClick={() => setCategory(cat.id)}
                data-testid={`button-category-${cat.id}`}
              >
                {cat.icon}
                <span className="ml-2">{cat.label}</span>
              </Button>
            ))}
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <ColoringPageSkeleton key={i} />
              ))
            ) : (
              filteredPages.map((page) => (
                <motion.div key={page.id} variants={fadeInUp}>
                  <Link href={`/color/${page.id}`}>
                    <Card
                      className="overflow-hidden hover-elevate cursor-pointer group border-2 border-primary/10"
                      data-testid={`card-coloring-page-${page.id}`}
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
                        <Badge
                          className="absolute bottom-2 left-2 font-bold"
                          variant="secondary"
                        >
                          {page.category === "ninja" && <Shield className="w-3 h-3 mr-1" />}
                          {page.category === "brainrot" && <Zap className="w-3 h-3 mr-1" />}
                          {page.category === "battle" && <Swords className="w-3 h-3 mr-1" />}
                          {page.category}
                        </Badge>
                      </div>
                      <div className="p-4 bg-card">
                        <h3 className="font-bold text-center" data-testid={`text-page-name-${page.id}`}>{page.name}</h3>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>

          {!isLoading && filteredPages.length === 0 && (
            <motion.div variants={fadeInUp} className="text-center py-12">
              <p className="text-muted-foreground text-lg" data-testid="text-no-pages">No coloring pages found in this category.</p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
