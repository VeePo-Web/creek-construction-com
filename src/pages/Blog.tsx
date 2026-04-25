import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import CedarCTA from "@/components/CedarCTA";
import Footer from "@/components/Footer";
import SubPageHero from "@/components/SubPageHero";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import ProgressiveImage from "@/components/ProgressiveImage";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { blogPosts } from "@/data/blogPosts";
import blogHeroLoyly from "@/assets/blog-hero-loyly.jpg";

/* Premium tilt card for blog articles */
const BlogCard = ({ post, index, total }: { post: typeof blogPosts[0]; index: number; total: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const rafId = useRef(0);
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(rafId.current);
    const clientX = e.clientX, clientY = e.clientY;
    rafId.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) scale(1.01)`;
    });
  }, []);

  // Cleanup rAF on unmount to prevent memory leaks
  useEffect(() => {
    return () => cancelAnimationFrame(rafId.current);
  }, []);


  return (
    <article 
      ref={cardRef} 
      role="listitem" 
      className="group grain-texture rounded-sm shadow-contact hover:shadow-elevated transition-all duration-500" 
      style={{ 
        transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        border: '1px solid hsl(25 12% 88% / 0.6)',
      }} 
      onPointerMove={handlePointerMove} 
      onPointerEnter={() => { if (cardRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) cardRef.current.style.willChange = 'transform'; }} 
      onPointerLeave={() => { const el = cardRef.current; if (el) { if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) el.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)"; el.style.willChange = 'auto'; } }}
    >
      <Link to={`/resources/${post.id}`} className="block focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-4 rounded-sm" aria-label={`${post.title} — ${post.category}, ${post.readTime}`}>
        <div className="relative mb-0 overflow-hidden rounded-t-sm">
          <div className="absolute inset-0 z-[1] pointer-events-none rounded-t-sm" style={{ boxShadow: 'inset 0 0 0 1px hsl(28 50% 52% / 0.08)' }} />
          <ProgressiveImage
            src={post.image}
            alt={post.title}
            className="h-64"
            cedarHover={true}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-md rounded-sm px-3 py-1.5 z-10 shadow-elevated">
            <span className="text-xs text-foreground font-medium">{post.category}</span>
          </div>
          <div className="absolute bottom-4 right-4 z-10 bg-black/20 backdrop-blur-sm rounded-sm px-2 py-1 group-hover:bg-cedar/80 transition-colors duration-500">
            <span className="text-[11px] tracking-[0.2em] text-white/80 font-light tabular-nums group-hover:text-white transition-colors duration-500" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
              {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-1 group-hover:translate-y-0 z-10">
            <span className="text-[10px] tracking-[0.15em] uppercase text-white/80 bg-black/40 backdrop-blur-md rounded-sm px-3 py-1.5 shadow-elevated">{post.readTime}</span>
          </div>
        </div>
        <div 
          className="space-y-4 p-6 rounded-b-sm transition-all duration-500 group-hover:bg-cedar/[0.02]" 
          style={{ 
            borderLeft: `3px solid hsl(28 50% 52% / ${0.15 + (index / Math.max(total - 1, 1)) * 0.65})`,
            background: 'linear-gradient(135deg, hsl(30 20% 97% / 0.5) 0%, hsl(30 15% 96% / 0.3) 100%)',
          }}
        >
          <div className="flex items-center text-xs text-muted-foreground space-x-4">
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
            <span aria-hidden="true" className="text-cedar/30">•</span>
            <span>{post.readTime}</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-light text-architectural-premium group-hover:text-cedar transition-colors duration-500">{post.title}</h2>
          <p className="text-muted-foreground leading-relaxed line-clamp-3">{post.excerpt}</p>
          <div className="pt-4 flex items-center gap-2 min-h-[44px]">
            <span className="text-minimal text-cedar group-hover:tracking-[0.18em] transition-all duration-300">READ MORE</span>
            <ArrowRight className="h-3 w-3 text-cedar opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0" aria-hidden="true" />
          </div>
        </div>
      </Link>
    </article>
  );
};

const Blog = () => {
  useDocumentTitle("Resources", "Plain-English guides on outdoor sauna winter performance, electrical prep, and planning for Alberta homeowners.");
  const [activeCategory, setActiveCategory] = useState("ALL");
  
  const categories = ["ALL", "WINTER PREP", "ELECTRICAL", "PLANNING", "LIFESTYLE"];
  
  const filteredPosts = activeCategory === "ALL" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <main className="min-h-screen bg-background" aria-label="Resources — B&P Sauna">
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://bpsauna.ca/" },
        { name: "Resources", url: "https://bpsauna.ca/resources" },
      ]} />
      <Navigation transparent />

      <SubPageHero
        image={blogHeroLoyly}
        imageAlt="Wooden ladle pouring water over hot volcanic sauna stones creating löyly steam in warm amber light"
        breadcrumbLabel="Resources"
        sectionLabel="KNOWLEDGE BASE"
        title="Resources"
        subtitle="Plain-English guides for informed decisions."
        height="65vh"
        minHeight="480px"
        skipToId="resources-content"
      >
        <div className="flex items-center gap-3 mt-6">
          <div className="w-12 h-px bg-cedar/30" />
          <span className="text-[10px] tracking-[0.25em] text-white/30 uppercase">
            {String(blogPosts.length).padStart(2, '0')} Articles · {categories.length - 1} Categories
          </span>
        </div>
      </SubPageHero>

      {/* Category filter */}
      <section id="resources-content" className="pt-16 pb-16 relative grain-overlay" aria-labelledby="filter-heading">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollRevealMotion>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[11px] tracking-[0.2em] text-cedar/40 font-light tabular-nums">II</span>
                <div className="w-8 h-px bg-cedar/20" />
                <h2 id="filter-heading" className="text-minimal text-muted-foreground">FILTER</h2>
              </div>
            </ScrollRevealMotion>
            <ScrollRevealMotion delay={0.1}>
              <div className="flex flex-wrap gap-8 justify-start">
                {categories.map((category, ci) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={activeCategory === category}
                    className={`text-minimal transition-all duration-500 relative group py-3 px-1 min-h-[44px] focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 rounded-sm ${
                      activeCategory === category 
                        ? "text-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={{ transitionDelay: `${ci * 30}ms` }}
                  >
                    {category}
                    <span className={`absolute bottom-0 left-0 w-full h-px transition-all duration-500 origin-left ${
                      activeCategory === category 
                        ? "scale-x-100 bg-cedar shadow-[0_0_6px_hsl(28_50%_52%/0.3)]" 
                        : "scale-x-0 bg-cedar/60 group-hover:scale-x-100"
                    }`} />
                  </button>
                ))}
              </div>
            </ScrollRevealMotion>
          </div>
        </div>
      </section>

      {/* Articles grid — enhanced with card-glass on hover */}
      <section className="pb-20 relative grain-overlay" aria-label="Resource articles" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 800px' }}>
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div aria-live="polite" className="sr-only">{filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found</div>
            {filteredPosts.length === 0 ? (
              <div className="col-span-full text-center py-24">
                <div className="flex items-center justify-center gap-3 mb-6">
                  {[0.15, 0.35, 0.6].map((o, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `hsl(28 50% 52% / ${o})` }} />
                  ))}
                </div>
                <p className="text-lg font-serif italic text-foreground/40 mb-2">Nothing here yet.</p>
                <p className="text-sm text-muted-foreground/50">New articles are on their way. Check back soon.</p>
              </div>
            ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16" role="list" aria-label="Resource articles">
              {filteredPosts.map((post, i) => (
                <ScrollRevealMotion key={post.id} delay={0.08 + i * 0.1}>
                  <BlogCard post={post} index={i} total={filteredPosts.length} />
                </ScrollRevealMotion>
              ))}
            </div>
            )}
          </div>
        </div>
      </section>

      {/* Editorial closing CTA */}
      <section className="pb-32 bg-secondary relative grain-overlay" aria-label="Call to action">
        <div className="absolute top-0 inset-x-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(180deg, hsl(var(--background)) 0%, transparent 100%)' }} />
        <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-[1]" style={{ background: 'linear-gradient(180deg, transparent 0%, hsl(var(--primary) / 0.06) 100%)' }} />
        <div className="container mx-auto px-6 pt-20">
          <div className="max-w-7xl mx-auto">
            <ScrollRevealMotion>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[11px] tracking-[0.2em] text-cedar/40 font-light tabular-nums">III</span>
                <div className="w-8 h-px bg-cedar/20" />
                <span className="text-minimal text-muted-foreground">EDITORIAL CLOSE</span>
              </div>
            </ScrollRevealMotion>

            <ScrollRevealMotion delay={0.05}>
              <div className="flex justify-center mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px bg-cedar/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cedar/40" />
                  <div className="w-12 h-px bg-cedar/20" />
                </div>
              </div>
            </ScrollRevealMotion>

            <ScrollRevealMotion delay={0.15}>
              <div className="max-w-2xl mx-auto grain-texture shadow-contact border border-border/40 rounded-sm p-10 text-center">
                <p className="text-xl font-serif italic text-foreground/40 leading-relaxed mb-8">
                  {"\u201C"}Knowledge before commitment. That{"\u2019"}s how we operate.{"\u201D"}
                </p>
                <p className="text-sm text-muted-foreground/60 mb-10">— The B&P Standard · Knowledge Before Commitment</p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <CedarCTA to="/plan">GET MY SAUNA PLAN</CedarCTA>
                  <CedarCTA to="/standard" variant="secondary">OUR STANDARD</CedarCTA>
                </div>
              </div>
            </ScrollRevealMotion>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Blog;