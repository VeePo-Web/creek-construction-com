import { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { SECTION_PADDING } from "@/lib/spacing";
import posterImg from "@/assets/hero-architect-color.jpg";

interface VideoShowcaseProps {
  /**
   * MP4 source. Drop your file into /public/videos/ then set:
   *   videoSrc="/videos/creek-build.mp4"
   */
  videoSrc?: string;
  /** WebM source for better compression on modern browsers. */
  videoSrcWebm?: string;
  /** Poster frame — defaults to the hero photo until a dedicated still is ready. */
  posterSrc?: string;
  heading?: string;
  caption?: string;
}

const VideoShowcase = ({
  videoSrc,
  videoSrcWebm,
  posterSrc = posterImg,
  heading = "See how we build.",
  caption = "Cedar deck build · Edmonton, AB",
}: VideoShowcaseProps) => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, cls, style } = useReveal();

  const hasVideo = Boolean(videoSrc || videoSrcWebm);

  // Never autoplay — respect user intent and reduced-motion preference.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches && videoRef.current) {
      videoRef.current.pause();
      setPlaying(false);
    }
  }, []);

  const handlePlay = () => {
    const v = videoRef.current;
    if (!hasVideo || !v) return;
    if (playing) {
      v.pause();
    } else {
      void v.play();
    }
  };

  return (
    <section
      id="section-video"
      className={`${SECTION_PADDING.default} bg-evergreen`}
      aria-label={heading}
    >
      <div className="container-page">
        <div ref={ref} className={cls} style={style}>

          {/* ── Heading ── */}
          <div className="mb-10 md:mb-12">
            <p
              className="eyebrow text-evergreen-foreground/50 mb-3"
            >
              The Work
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-evergreen-foreground leading-[1.05] tracking-[-0.03em]">
              {heading}
            </h2>
          </div>

          {/* ── Video container ── */}
          <div
            className="relative w-full aspect-video overflow-hidden bg-black"
            style={{ borderRadius: "2px" }}
          >
            {/* Poster frame — always rendered, fades behind video on play */}
            <img
              src={posterSrc}
              alt=""
              aria-hidden
              width={1920}
              height={1080}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none ${
                playing ? "opacity-0" : "opacity-100"
              }`}
              style={{ filter: "brightness(0.52)" }}
            />

            {/* Video element — only rendered once user clicks play */}
            {hasVideo && (
              <video
                ref={videoRef}
                playsInline
                preload="none"
                controls={playing}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  playing ? "opacity-100" : "opacity-0"
                }`}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
              >
                {videoSrcWebm && <source src={videoSrcWebm} type="video/webm" />}
                {videoSrc && <source src={videoSrc} type="video/mp4" />}
              </video>
            )}

            {/* ── Play button — hides when video is playing (native controls take over) ── */}
            {!playing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handlePlay}
                  disabled={!hasVideo}
                  aria-label={hasVideo ? "Play video" : "Video coming soon"}
                  className={[
                    "flex items-center justify-center",
                    "w-16 h-16 md:w-20 md:h-20 rounded-full",
                    "border border-white/30 bg-black/25 backdrop-blur-sm",
                    "transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 focus-visible:ring-offset-black/60",
                    hasVideo
                      ? "hover:bg-cedar hover:border-cedar hover:scale-110 active:scale-95 cursor-pointer"
                      : "opacity-40 cursor-default",
                  ].join(" ")}
                >
                  <Play
                    className="h-6 w-6 md:h-7 md:w-7 text-white fill-white ml-0.5"
                    aria-hidden
                  />
                </button>
              </div>
            )}

            {/* "Video coming soon" label — only when no source is wired up */}
            {!hasVideo && (
              <div className="absolute bottom-4 left-4 pointer-events-none">
                <span
                  className="text-[10px] tracking-[0.2em] uppercase text-white/35"
                  style={{ fontFamily: "var(--font-sans, 'DM Sans', system-ui, sans-serif)" }}
                >
                  Video coming soon
                </span>
              </div>
            )}
          </div>

          {/* ── Caption ── */}
          {caption && (
            <p
              className="mt-4 text-[10px] tracking-[0.16em] uppercase text-evergreen-foreground/35"
              style={{ fontFamily: "var(--font-sans, 'DM Sans', system-ui, sans-serif)" }}
            >
              {caption}
            </p>
          )}

        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
