import { useParams, Link } from "react-router-dom";
import { useEffect, useRef, useCallback } from "react";
import { ArrowRight, ArrowUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import CedarCTA from "@/components/CedarCTA";
import Footer from "@/components/Footer";
import SubPageHero from "@/components/SubPageHero";
import ScrollRevealMotion from "@/components/ScrollRevealMotion";
import ProgressiveImage from "@/components/ProgressiveImage";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { ArticleJsonLd } from "@/components/JsonLd";
import { blogPosts } from "@/data/blogPosts";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find(p => p.id === id);
  useDocumentTitle(post?.title || "Article", post?.excerpt);
  const articleRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrollTopBtnRef = useRef<HTMLButtonElement>(null);
  const remainingRef = useRef<HTMLSpanElement>(null);
  const readBadgeRef = useRef<HTMLSpanElement>(null);
  // Hero parallax — inline to avoid SubPageHero (custom breadcrumb needed)
  const heroImgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = heroImgRef.current;
    if (!img || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    img.style.willChange = 'transform';
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxTravel = window.innerHeight * 0.25;
          const offset = Math.min(scrollY * 0.25, maxTravel);
          img.style.transform = `scale(1.12) translateY(${offset}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (img) img.style.willChange = 'auto';
    };
  }, []);

  // Reading progress — ref-driven to avoid re-renders
  useEffect(() => {
    if (!articleRef.current || !post) return;
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / total, 0), 1);

      if (progressBarRef.current) {
        const pct = Math.round(progress * 100);
        progressBarRef.current.style.width = `${pct}%`;
        progressBarRef.current.style.backgroundColor = `hsl(28 50% 52% / ${0.4 + progress * 0.5})`;
        progressBarRef.current.style.boxShadow = progress > 0.5
          ? `0 0 ${4 + progress * 8}px hsl(28 50% 52% / ${progress * 0.3})`
          : 'none';
        // Update ARIA on the wrapper
        const wrapper = progressBarRef.current.parentElement;
        if (wrapper) wrapper.setAttribute('aria-valuenow', String(pct));
      }

      if (scrollTopBtnRef.current) {
        const show = window.scrollY > window.innerHeight * 0.5;
        scrollTopBtnRef.current.style.opacity = show ? '1' : '0';
        scrollTopBtnRef.current.style.transform = show ? 'translateY(0)' : 'translateY(16px)';
        scrollTopBtnRef.current.style.pointerEvents = show ? 'auto' : 'none';
      }

      const readTime = parseInt(post.readTime) || 5;
      const remaining = Math.max(0, Math.ceil(readTime * (1 - progress)));
      if (remainingRef.current) {
        remainingRef.current.style.display = (progress > 0.05 && progress < 0.95) ? 'inline' : 'none';
        remainingRef.current.textContent = `• ${remaining} min left`;
      }
      if (readBadgeRef.current) {
        readBadgeRef.current.style.display = progress >= 0.95 ? 'inline' : 'none';
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [id, post]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-32">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-headline text-foreground mb-4">
                Article Not Found
              </h1>
              <p className="text-lg text-foreground/60 italic font-serif mb-8">
                This page may have moved or no longer exists.
              </p>
              <CedarCTA to="/resources" variant="secondary">BACK TO RESOURCES</CedarCTA>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const currentIndex = blogPosts.findIndex(p => p.id === post.id);

  return (
    <main className="min-h-screen bg-background" aria-label={`${post.title} — B&P Sauna Resources`}>
      <a href="#article-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-cedar focus:text-cedar-foreground focus:px-6 focus:py-3 focus:text-minimal focus:rounded-sm focus:shadow-lg">Skip to content</a>
      <ArticleJsonLd title={post.title} excerpt={post.excerpt} date={post.date} image={post.image} id={post.id} />
      <Navigation transparent />

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none" role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
        <div
          ref={progressBarRef}
          className="h-full transition-[width] duration-100 ease-out"
          style={{ width: 0 }}
        />
      </div>

      {/* Scroll to top */}
      <button
        ref={scrollTopBtnRef}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full bg-cedar/10 border border-cedar/20 flex items-center justify-center text-cedar hover:bg-cedar hover:text-cedar-foreground transition-all duration-500 hover:shadow-[0_0_16px_hsl(28_50%_52%/0.25)] opacity-0 translate-y-4 pointer-events-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-4 w-4" />
      </button>

      {/* ─── Cinematic Full-Bleed Hero ─── */}
      <section className="relative h-[65vh] min-h-[480px] overflow-hidden flex items-end">
        <img
          ref={heroImgRef}
          src={post.image}
          alt={post.title}
          width="1920"
          height="1080"
          className="absolute inset-0 w-full h-full object-cover hero-image-entrance"
          style={{ transform: 'scale(1.12)' }}
          fetchPriority="high"
          decoding="sync"
          sizes="100vw"
        />
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, hsl(20 10% 8% / 0.35) 0%, hsl(20 10% 8% / 0.1) 30%, hsl(20 10% 8% / 0.5) 65%, hsl(20 10% 8% / 0.9) 100%)',
        }} />
        {/* Radial vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, hsl(20 10% 8% / 0.2) 100%)',
        }} />

        <div className="container mx-auto px-6 relative z-10 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 flex-wrap">
              <Link to="/" className="text-[10px] tracking-[0.2em] text-white/40 uppercase hover:text-cedar transition-colors duration-300 min-h-[44px] flex items-center">Home</Link>
              <span className="text-white/20">·</span>
              <Link to="/resources" className="text-[10px] tracking-[0.2em] text-white/40 uppercase hover:text-cedar transition-colors duration-300 min-h-[44px] flex items-center">Resources</Link>
              <span className="text-white/20">·</span>
              <span className="text-[10px] tracking-[0.2em] text-cedar/80 uppercase min-h-[44px] flex items-center" aria-current="page">{post.category}</span>
            </nav>

            {/* Section marker + meta */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[11px] tracking-[0.2em] text-cedar/60 font-light tabular-nums">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <div className="w-8 h-px bg-cedar/40" />
              <span className="text-minimal text-cedar">{post.category}</span>
            </div>

            <h1
              className="text-headline text-white mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, letterSpacing: '-0.015em' }}
            >
              <span
                className="block"
                style={{
                  clipPath: 'inset(100% 0 0 0)',
                  animation: 'clip-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
                }}
              >
                {post.title}
              </span>
            </h1>

            <p className="text-lg text-white/50 italic font-serif mb-4 max-w-xl">
              {post.excerpt}
            </p>

            <div className="flex items-center text-minimal text-white/40 space-x-4 mt-4">
              <time dateTime={post.date}>{post.date}</time>
              <span>•</span>
              <span>{post.readTime}</span>
              <span ref={remainingRef} className="text-cedar/60" style={{ display: 'none' }} />
              <span ref={readBadgeRef} className="text-cedar" style={{ display: 'none' }}>• ✓ Read</span>
            </div>
          </div>
        </div>
      </section>
      
      <article id="article-content" ref={articleRef} className="pb-32 relative grain-overlay" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 1500px' }}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Decorative divider after hero */}
            <ScrollRevealMotion>
              <div className="flex items-center gap-4 py-16">
                <div className="w-12 h-px bg-cedar/15" />
                <div className="w-1 h-1 rounded-full bg-cedar/30" />
                <div className="flex-1 h-px bg-border/30" />
              </div>
            </ScrollRevealMotion>
            
            {/* Article body — enhanced typography */}
            <ScrollRevealMotion delay={0.1}>
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-muted-foreground leading-[1.85] space-y-6 text-[1.05rem] article-body-editorial"
                  dangerouslySetInnerHTML={{ 
                    __html: (() => {
                      const lines = post.content.split('\n');
                      const result: string[] = [];
                      let inList = false;
                      let firstParagraph = true;
                      
                      for (const line of lines) {
                        const isListItem = line.startsWith('- ');
                        
                        // Close list if we were in one and this isn't a list item
                        if (inList && !isListItem) {
                          result.push('</ul>');
                          inList = false;
                        }
                        
                        if (line.startsWith('## ')) {
                          result.push(`<h2 class="text-2xl md:text-3xl font-light text-architectural text-foreground mb-6 mt-14 pt-6" style="border-top: 1px solid hsl(28 50% 52% / 0.12);">${line.substring(3)}</h2>`);
                        } else if (line.startsWith('### ')) {
                          result.push(`<h3 class="text-xl md:text-2xl font-medium text-foreground mb-4 mt-10">${line.substring(4)}</h3>`);
                        } else if (isListItem) {
                          // Open list if not already in one
                          if (!inList) {
                            result.push('<ul class="list-none space-y-1 mb-6" role="list">');
                            inList = true;
                          }
                          const boldMatch = line.match(/- \*\*(.*?)\*\*(.*)/);
                          if (boldMatch) {
                            result.push(`<li class="ml-6 mb-3 pl-2" style="border-left: 2px solid hsl(28 50% 52% / 0.15); padding-left: 12px;"><strong class="text-foreground">${boldMatch[1]}</strong>${boldMatch[2]}</li>`);
                          } else {
                            result.push(`<li class="ml-6 mb-3 pl-2" style="border-left: 2px solid hsl(28 50% 52% / 0.1); padding-left: 12px;">${line.substring(2)}</li>`);
                          }
                        } else if (line.trim() === '') {
                          // skip
                        } else {
                          const processed = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-medium">$1</strong>');
                          if (firstParagraph) {
                            result.push(`<p class="mb-5 first-letter:text-5xl first-letter:font-serif first-letter:text-cedar first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.8]">${processed}</p>`);
                            firstParagraph = false;
                          } else {
                            result.push(`<p class="mb-5">${processed}</p>`);
                          }
                        }
                      }
                      if (inList) result.push('</ul>');
                      return result.join('');
                    })()
                  }}
                />
              </div>
            </ScrollRevealMotion>
            
            {/* CTA */}
            <ScrollRevealMotion delay={0.1}>
              <div className="mt-24 pt-12 border-t border-border text-center">
                <div className="flex justify-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-px bg-cedar/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cedar/40" />
                    <div className="w-12 h-px bg-cedar/20" />
                  </div>
                </div>
                <p className="text-xl font-serif italic text-foreground/40 leading-relaxed mb-2">
                  {"\u201C"}Your ritual is one conversation away.{"\u201D"}
                </p>
                <p className="text-sm text-muted-foreground/60 mb-8 tracking-wide">— The B&P Standard · Cedar & Intention</p>
                <CedarCTA to="/plan">GET MY SAUNA PLAN</CedarCTA>
              </div>
            </ScrollRevealMotion>
            
            {/* Related posts */}
            <div className="mt-24">
              <ScrollRevealMotion>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-[11px] tracking-[0.2em] text-cedar/40 font-light tabular-nums">II</span>
                  <div className="w-8 h-px bg-cedar/20" />
                  <span className="text-minimal text-muted-foreground">CONTINUE READING</span>
                </div>
              </ScrollRevealMotion>

              <div className="grid md:grid-cols-2 gap-8" role="list" aria-label="Related articles">
                {(() => {
                  // Prefer same-category posts, then fall back to others
                  const sameCat = blogPosts.filter(p => p.id !== post.id && p.category === post.category);
                  const others = blogPosts.filter(p => p.id !== post.id && p.category !== post.category);
                  const related = [...sameCat, ...others].slice(0, 2);
                  return related;
                })().map((relatedPost, i) => (
                    <ScrollRevealMotion key={relatedPost.id} delay={0.1 + i * 0.12}>
                      <Link to={`/resources/${relatedPost.id}`} className="group block min-h-[44px]" role="listitem" aria-label={`Read: ${relatedPost.title}`}>
                        <ProgressiveImage
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="h-48 mb-4"
                          sizes="(min-width: 768px) 50vw, 100vw"
                        />
                        <div
                          className="pl-4 py-3 -ml-2 grain-texture shadow-contact border border-border/40 rounded-sm transition-all duration-500 group-hover:pl-6 group-hover:bg-cedar/[0.03] hover:shadow-elevated"
                          style={{ borderLeft: `2px solid hsl(28 50% 52% / ${[0.25, 0.6][i]})` }}
                        >
                          <h3 className="text-lg font-light text-architectural group-hover:text-cedar transition-colors duration-500 mb-2">
                            {relatedPost.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <p className="text-minimal text-muted-foreground">{relatedPost.date} • {relatedPost.readTime}</p>
                            <ArrowRight className="h-3 w-3 text-cedar opacity-0 group-hover:opacity-100 transition-all duration-300" aria-hidden="true" />
                          </div>
                        </div>
                      </Link>
                    </ScrollRevealMotion>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
};

export default BlogPost;
