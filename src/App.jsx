import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useForm, ValidationError } from "@formspree/react";
import sealImg from "./assets/seal.png";
import venue1 from "./assets/videos/Venue_1.mp4";
import venue2 from "./assets/videos/Venue_2.mp4";
import venue3 from "./assets/videos/Venue_3.mp4";
import venue4 from "./assets/videos/Venue_4.mp4";

/* ————————————————————————————————————————————————
   Amr & Noha — Save the Date
   Palette
   ivory   #F6F0EA   (paper)
   blush   #F1E6DF   (envelope)
   rose    #E7D6CE   (embossed lines / borders)
   burgundy#6B2233   (display type)
   wax     #7E2A38   (seal)
   ink     #3A2A2E   (body type)
———————————————————————————————————————————————— */

const C = {
  ivory: "#F6F0EA",
  blush: "#F1E6DF",
  paper: "#FBF7F3",
  rose: "#E7D6CE",
  roseSoft: "#EFE2DA",
  burgundy: "#6B2233",
  wax: "#7E2A38",
  waxDark: "#5C1E2A",
  ink: "#3A2A2E",
  inkSoft: "#7A6A6E",
};

const EVENT_DATE = new Date("2026-08-07T21:00:00+03:00");
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(
    "Kanzel Restaurant and Lounge, Gate 1, Al Fostat St, Ad Deyorah, El Khalifa, Cairo Governorate"
  );

/* ---------- helpers ---------- */

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* Scroll progress (0→1) across a tall hero track, with a gentle spring */
function useScrollProgress(ref, reduced) {
  const [p, setP] = useState(0);
  const target = useRef(0);
  const current = useRef(0);
  const raf = useRef(null);

  const tick = useCallback(() => {
    const t = target.current;
    const c = current.current;
    const next = reduced ? t : c + (t - c) * 0.09; // spring toward target
    current.current = Math.abs(next - t) < 0.0005 ? t : next;
    setP(current.current);
    if (current.current !== t) raf.current = requestAnimationFrame(tick);
    else raf.current = null;
  }, [reduced]);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      target.current = clamp(-rect.top / Math.max(total, 1), 0, 1);
      if (!raf.current) raf.current = requestAnimationFrame(tick);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current) {
        cancelAnimationFrame(raf.current);
        raf.current = null;
      }
    };
  }, [ref, tick]);

  return p;
}

/* Fade-up on entering viewport */
function Reveal({ children, delay = 0, className = "", style = {} }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setSeen(true),
      { threshold: 0.18 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: seen ? 1 : 0,
        transform: seen ? "translateY(0px)" : "translateY(28px)",
        transition: `opacity 0.9s ease ${delay}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- decorative pieces ---------- */

/* Embossed floral tile, drawn once and repeated as a background */
const floralTile = `
<svg xmlns='http://www.w3.org/2000/svg' width='340' height='340' viewBox='0 0 340 340'>
  <g fill='none' stroke='%23ffffff' stroke-opacity='0.55' stroke-width='2.2' stroke-linecap='round'>
    <path d='M60 60 q18 -34 0 -52 q-18 18 0 52 M60 60 q34 -18 52 0 q-18 18 -52 0 M60 60 q-34 -18 -52 0 q18 18 52 0 M60 60 q-18 34 0 52 q18 -18 0 -52'/>
    <circle cx='60' cy='60' r='7'/>
    <path d='M240 120 q40 -10 60 -46 M240 120 q10 -40 46 -60 M240 120 q46 6 74 -18'/>
    <path d='M252 100 q8 -3 10 -12 M266 88 q8 -3 10 -12 M262 112 q10 -1 16 -8'/>
    <path d='M110 250 q-6 -46 28 -78 M110 250 q-40 -22 -48 -66 M110 250 q30 -32 24 -78'/>
    <path d='M100 214 q-8 -6 -8 -16 M124 196 q-2 -10 4 -18 M88 232 q-10 -4 -14 -14'/>
    <path d='M280 270 q14 -26 0 -40 q-14 14 0 40 M280 270 q26 -14 40 0 q-14 14 -40 0 M280 270 q-26 -14 -40 0 q14 14 40 0'/>
    <circle cx='280' cy='270' r='5'/>
    <circle cx='180' cy='40' r='3'/><circle cx='196' cy='30' r='2.4'/><circle cx='188' cy='52' r='2'/>
    <circle cx='40' cy='300' r='3'/><circle cx='28' cy='288' r='2.2'/><circle cx='52' cy='312' r='2'/>
  </g>
</svg>`;
const floralBg = {
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(floralTile)}")`,
  backgroundSize: "340px 340px",
};

function WaxSeal({ size = 120, style = {} }) {
  return (
    <img
      src={sealImg}
      alt=""
      width={size}
      height={size}
      style={{ ...style, objectFit: "contain" }}
      aria-hidden="true"
    />
  );
}
function Flourish({ flip = false }) {
  return (
    <svg viewBox="0 0 220 24" width="180" height="20" aria-hidden="true"
      style={{ transform: flip ? "scaleY(-1)" : "none", display: "block", margin: "0 auto" }}>
      <g fill="none" stroke={C.burgundy} strokeWidth="1.2" strokeLinecap="round" opacity="0.7">
        <path d="M10 12 h78" />
        <path d="M132 12 h78" />
        <path d="M96 12 q6 -9 14 0 q-8 9 -14 0" />
        <circle cx="110" cy="12" r="1.8" fill={C.burgundy} stroke="none" />
        <path d="M88 12 q-4 -5 -10 -4 M132 12 q4 -5 10 -4" />
      </g>
    </svg>
  );
}

const Label = ({ children }) => (
  <p style={{
    fontFamily: "'Cormorant Garamond', serif",
    letterSpacing: "0.34em",
    textTransform: "uppercase",
    fontSize: 12,
    color: C.inkSoft,
  }}>{children}</p>
);

/* ---------- envelope hero ---------- */

function EnvelopeHero({ reduced }) {
  const trackRef = useRef(null);
  const p = useScrollProgress(trackRef, reduced);

  /* animation timeline */
  const flapT = easeInOutCubic(clamp(p / 0.42, 0, 1)); // flap opens
  const flapAngle = flapT * -180;
  const sealFade = easeInOutCubic(clamp(1 - p / 0.22, 0, 1));
  const cardT = clamp((p - 0.34) / 0.5, 0, 1);         // card rises
  const cardEase = 1 - Math.pow(1 - cardT, 3);
  const cardY = 46 - cardEase * 118;                    // % of envelope height
  const cardScale = 0.86 + cardEase * 0.14;
  const envDrop = clamp((p - 0.62) / 0.38, 0, 1);       // envelope settles away
  const hintFade = clamp(1 - p / 0.1, 0, 1);

  return (
    <section ref={trackRef} style={{ height: "300dvh", position: "relative" }} aria-label="Invitation reveal">
      <div className="sticky top-0 h-dvh w-full overflow-hidden flex items-center justify-center"
        style={{ ...floralBg, backgroundColor: C.ivory }}>

        {/* soft vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0) 55%, rgba(120,80,70,0.10) 100%)" }} />

        <div style={{
          position: "relative",
          width: "min(88vw, 460px)",
          aspectRatio: "10 / 13.2",
          perspective: "1400px",
        }}>

          {/* the card inside — always frontmost, fades in as it rises so it never peeks through the closed envelope */}
          <div style={{
            position: "absolute",
            left: "6%", right: "6%", top: 0, height: "88%",
            transform: `translateY(${cardY}%) scale(${cardScale})`,
            opacity: cardEase,
            zIndex: 5,
            filter: "drop-shadow(0 18px 30px rgba(90,40,45,0.18))",
          }}>
            <div className="w-full h-full flex flex-col items-center justify-center text-center px-6"
              style={{
                backgroundColor: C.paper,
                border: `1px solid ${C.rose}`,
                borderRadius: 6,
                boxShadow: "inset 0 0 0 6px #fff, inset 0 0 0 7px " + C.rose,
              }}>
              <p style={{
                fontFamily: "'MySloop-ScriptThreeFont', cursive",
                fontSize: "clamp(24px, 6vw, 34px)",
                color: C.ink, opacity: 0.85,
              }}>Save the date</p>
              <h1 style={{
                fontFamily: "'MySloop-ScriptThreeFont', cursive",
                fontSize: "clamp(46px, 12vw, 74px)",
                color: C.burgundy,
                lineHeight: 1.1,
                margin: "10px 0 18px",
              }}>Amr &amp; Noha</h1>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(18px, 4.5vw, 24px)",
                color: C.ink,
                letterSpacing: "0.06em",
              }}>Friday, August 7</p>
            </div>
          </div>

          {/* envelope back (behind the card) */}
          <div style={{
            position: "absolute", left: 0, right: 0, top: "18%", bottom: 0,
            transform: `translateY(${envDrop * 26}%)`,
            opacity: 1 - envDrop * 0.35,
            zIndex: 1,
            pointerEvents: "none",
            backgroundColor: C.blush, ...floralBg,
            borderRadius: 8,
            boxShadow: "0 30px 60px rgba(90,40,45,0.22)",
          }} />

          {/* side folds + bottom pocket lip */}
          <div style={{
            position: "absolute", left: 0, right: 0, top: "18%", bottom: 0,
            transform: `translateY(${envDrop * 26}%)`,
            opacity: 1 - envDrop * 0.35,
            zIndex: 2,
            pointerEvents: "none",
            borderRadius: 8, overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(105deg, ${C.roseSoft} 0%, ${C.blush} 30%, transparent 30.5%),
                           linear-gradient(-105deg, ${C.roseSoft} 0%, ${C.blush} 30%, transparent 30.5%)`,
            }} />
            {/* bottom pocket */}
            <div style={{
              position: "absolute", inset: 0,
              clipPath: "polygon(0 100%, 100% 100%, 100% 34%, 50% 78%, 0 34%)",
              backgroundColor: C.blush, ...floralBg,
              boxShadow: "0 -6px 18px rgba(90,40,45,0.10)",
            }} />
            <svg viewBox="0 0 100 100" preserveAspectRatio="none"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <path d="M0 34 L50 78 L100 34" fill="none" stroke={C.rose} strokeWidth="0.7" />
            </svg>
          </div>

          {/* flap — always behind the card; the card fading in as it rises keeps it from ever peeking through */}
          <div style={{
            position: "absolute", left: 0, right: 0, top: "18%", height: "46%",
            transform: `translateY(${envDrop * 26}%)`,
            opacity: 1 - envDrop * 0.35,
            zIndex: 3,
            pointerEvents: "none",
            transformOrigin: "top center",
            perspective: "1400px",
          }}>
            <div style={{
              width: "100%", height: "100%",
              transformOrigin: "top center",
              transform: `rotateX(${flapAngle}deg)`,
              transformStyle: "preserve-3d",
              transition: reduced ? "transform 0.3s ease" : "none",
            }}>
              {/* flap front */}
              <div style={{
                position: "absolute", inset: 0,
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                backgroundColor: C.roseSoft, ...floralBg,
                backfaceVisibility: "hidden",
                borderRadius: "8px 8px 0 0",
                boxShadow: "0 10px 22px rgba(90,40,45,0.16)",
              }} />
              {/* flap back (lining) */}
              <div style={{
                position: "absolute", inset: 0,
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: `linear-gradient(180deg, ${C.burgundy}, ${C.waxDark})`,
                transform: "rotateX(180deg)",
                backfaceVisibility: "hidden",
                borderRadius: "8px 8px 0 0",
              }} />
            </div>
          </div>

          {/* wax seal — in front of the envelope, fades out early before the card ever appears */}
          <div style={{
            position: "absolute", left: "50%", top: "56%",
            transform: `translate(-50%, -50%) translateY(${envDrop * 26}%) scale(${0.9 + sealFade * 0.1})`,
            opacity: sealFade,
            zIndex: 4,
            pointerEvents: "none",
            filter: "drop-shadow(0 6px 10px rgba(60,15,25,0.35))",
          }}>
            <WaxSeal size={Math.min(120, window.innerWidth * 0.26)} />
          </div>

          {/* outer invitation line — printed on the envelope face, fades with the seal as it opens */}
          <div style={{
            position: "absolute", left: "50%", top: "76%",
            transform: `translate(-50%, -50%) translateY(${envDrop * 26}%)`,
            opacity: sealFade,
            zIndex: 4,
            pointerEvents: "none",
            width: "78%",
            textAlign: "center",
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontSize: "clamp(11px, 2.6vw, 13px)",
              color: C.burgundy,
              opacity: 0.8,
            }}>You are warmly invited to our</p>
            <p style={{
              fontFamily: "'MySloop-ScriptThreeFont', cursive",
              fontSize: "clamp(24px, 6.5vw, 34px)",
              color: C.burgundy,
              lineHeight: 1.15,
              marginTop: 4,
            }}>Engagement Outing</p>
          </div>
        </div>

        {/* scroll hint — anchored above any mobile home-indicator / browser-chrome safe area */}
        <div className="absolute left-0 right-0 flex flex-col items-center gap-2"
          style={{
            bottom: "max(1.75rem, calc(env(safe-area-inset-bottom, 0px) + 1.25rem))",
            opacity: hintFade,
            transition: "opacity 0.3s ease",
            animation: reduced ? "none" : "scrollHintBounce 1.8s ease-in-out infinite",
          }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: "0.32em", textTransform: "uppercase",
            fontSize: 13, fontWeight: 600, color: C.burgundy,
          }}>Scroll to open</p>
          <svg width="20" height="28" viewBox="0 0 18 26" aria-hidden="true">
            <rect x="1" y="1" width="16" height="24" rx="8" fill="none" stroke={C.burgundy} strokeWidth="1.4" />
            <circle cx="9" cy="8" r="2" fill={C.burgundy}>
              {!reduced && (
                <animate attributeName="cy" values="8;15;8" dur="1.8s" repeatCount="indefinite" />
              )}
            </circle>
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ---------- countdown ---------- */

function Countdown() {
  const calc = () => {
    const d = EVENT_DATE.getTime() - Date.now();
    if (d <= 0) return null;
    return {
      Days: Math.floor(d / 86400000),
      Hours: Math.floor((d / 3600000) % 24),
      Minutes: Math.floor((d / 60000) % 60),
      Seconds: Math.floor((d / 1000) % 60),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!t) {
    return (
      <p style={{ fontFamily: "'MySloop-ScriptThreeFont', cursive", fontSize: 36, color: C.burgundy }}>
        The celebration has begun!
      </p>
    );
  }
  return (
    <div className="flex justify-center gap-3 sm:gap-6 flex-wrap">
      {Object.entries(t).map(([label, value]) => (
        <div key={label} className="flex flex-col items-center px-4 py-4 sm:px-6"
          style={{
            backgroundColor: C.paper,
            border: `1px solid ${C.rose}`,
            borderRadius: 6,
            minWidth: 82,
            boxShadow: "0 8px 20px rgba(90,40,45,0.08)",
          }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(30px, 7vw, 44px)",
            fontWeight: 600,
            color: C.burgundy,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}>{String(value).padStart(2, "0")}</span>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: "0.26em", textTransform: "uppercase",
            fontSize: 10.5, color: C.inkSoft, marginTop: 8,
          }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- venue reels ---------- */

function VenueReels() {
  const videos = [venue1, venue2, venue3, venue4];
  return (
    <div className="-mx-5 sm:-mx-8">
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-5 sm:px-8 pb-3">
        {videos.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative shrink-0 snap-center overflow-hidden"
            style={{
              width: "min(66vw, 250px)",
              aspectRatio: "9 / 16",
              borderRadius: 14,
              border: `1px solid ${C.rose}`,
              backgroundColor: C.roseSoft,
              boxShadow: "0 16px 34px rgba(90,40,45,0.16)",
            }}
          >
            <video
              src={src}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(59,26,32,0) 60%, rgba(59,26,32,0.38) 100%)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.28)",
                borderRadius: 14,
              }}
            />
            <p
              className="absolute bottom-3 left-0 right-0 text-center pointer-events-none"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontSize: 11,
                color: "#F6EDE8",
              }}
            >
              Kanzel
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------- RSVP ---------- */

function Rsvp() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState(null);
  const [error, setError] = useState("");
  const [state, handleSubmit, resetForm] = useForm("xpqvvzel");

  const onSubmit = (e) => {
    if (!name.trim()) {
      e.preventDefault();
      return setError("Please add your name so we know who's replying.");
    }
    if (attending === null) {
      e.preventDefault();
      return setError("Let us know if you can make it.");
    }
    setError("");
    handleSubmit(e);
  };

  const pill = (selected) => ({
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 17,
    padding: "12px 22px",
    borderRadius: 999,
    cursor: "pointer",
    border: `1.5px solid ${selected ? C.burgundy : C.rose}`,
    backgroundColor: selected ? C.burgundy : "transparent",
    color: selected ? C.paper : C.ink,
    transition: "all 0.25s ease",
  });

  if (state.succeeded) {
    return (
      <div className="text-center px-6 py-10" style={{
        backgroundColor: C.paper, border: `1px solid ${C.rose}`, borderRadius: 8,
      }}>
        <WaxSeal size={64} style={{ margin: "0 auto 14px" }} />
        <p style={{ fontFamily: "'MySloop-ScriptThreeFont', cursive", fontSize: 34, color: C.burgundy }}>
          Thank you, {name.trim()}
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: C.ink, marginTop: 6 }}>
          {attending
            ? "We can't wait to celebrate with you on August 7."
            : "You'll be missed — thank you for letting us know."}
        </p>
        <button onClick={resetForm} className="mt-5"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 12,
            color: C.burgundy, textDecoration: "underline", background: "none",
            border: "none", cursor: "pointer",
          }}>
          Edit reply
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="px-6 py-8 sm:px-10" style={{
      backgroundColor: C.paper, border: `1px solid ${C.rose}`, borderRadius: 8,
      boxShadow: "0 12px 30px rgba(90,40,45,0.08)",
    }}>
      <label htmlFor="rsvp-name" style={{
        fontFamily: "'Cormorant Garamond', serif",
        letterSpacing: "0.24em", textTransform: "uppercase",
        fontSize: 12, color: C.inkSoft, display: "block", marginBottom: 8,
      }}>Your name</label>
      <input
        id="rsvp-name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full name"
        className="w-full outline-none"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 19, color: C.ink,
          padding: "12px 14px",
          backgroundColor: C.ivory,
          border: `1px solid ${C.rose}`,
          borderRadius: 6,
        }}
      />
      <ValidationError prefix="Name" field="name" errors={state.errors} />

      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        letterSpacing: "0.24em", textTransform: "uppercase",
        fontSize: 12, color: C.inkSoft, margin: "22px 0 10px",
      }}>Are you attending?</p>
      <div className="flex gap-3 flex-wrap" role="radiogroup" aria-label="Are you attending?">
        <button type="button" role="radio" aria-checked={attending === true}
          style={pill(attending === true)} onClick={() => setAttending(true)}>
          Yes, I'll be there
        </button>
        <button type="button" role="radio" aria-checked={attending === false}
          style={pill(attending === false)} onClick={() => setAttending(false)}>
          No, I'm sorry
        </button>
      </div>
      <input type="hidden" name="attending" value={attending === true ? "Yes" : attending === false ? "No" : ""} />

      {error && (
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 15, color: C.wax, marginTop: 14,
        }}>{error}</p>
      )}
      <ValidationError errors={state.errors} />

      <button type="submit" disabled={state.submitting} className="w-full mt-7"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          letterSpacing: "0.28em", textTransform: "uppercase",
          fontSize: 13, fontWeight: 600,
          color: C.paper, backgroundColor: C.burgundy,
          padding: "15px 0", borderRadius: 6, border: "none",
          cursor: state.submitting ? "default" : "pointer",
          opacity: state.submitting ? 0.7 : 1,
          transition: "background-color 0.25s ease, opacity 0.25s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.waxDark)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.burgundy)}>
        {state.submitting ? "Sending…" : "Send reply"}
      </button>
    </form>
  );
}

/* ---------- memory box ---------- */

function MemoryBox() {
  const [message, setMessage] = useState("");
  const [author, setAuthor] = useState("");
  const [photo, setPhoto] = useState(null);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  const [state, handleSubmit, resetForm] = useForm("xzdnnbnd");

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(f);
  };

  const onSubmit = (e) => {
    if (!message.trim() && !photo) {
      e.preventDefault();
      return setError("Add a message or a photo before sending.");
    }
    setError("");
    handleSubmit(e);
  };

  useEffect(() => {
    if (!state.succeeded) return;
    setEntries((prev) => [
      { id: Date.now(), author: author.trim() || "A friend", message: message.trim(), photo },
      ...prev,
    ]);
    setMessage("");
    setAuthor("");
    setPhoto(null);
    if (fileRef.current) fileRef.current.value = "";
    resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.succeeded]);

  const inputStyle = {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 18, color: C.ink,
    backgroundColor: C.ivory,
    border: `1px solid ${C.rose}`,
    borderRadius: 6,
    padding: "12px 14px",
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="px-6 py-8 sm:px-10" style={{
        backgroundColor: C.paper, border: `1px solid ${C.rose}`, borderRadius: 8,
        boxShadow: "0 12px 30px rgba(90,40,45,0.08)",
      }}>
        <input
          name="name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full outline-none mb-4"
          style={inputStyle}
          aria-label="Your name"
        />
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a sweet message or a favorite memory with the couple…"
          rows={4}
          className="w-full outline-none resize-none"
          style={inputStyle}
          aria-label="Your message"
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} />

        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <input ref={fileRef} type="file" name="photo" accept="image/*" onChange={onFile} className="hidden" id="memory-photo" />
          <label htmlFor="memory-photo"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 15, letterSpacing: "0.14em", textTransform: "uppercase",
              color: C.burgundy, border: `1.5px solid ${C.burgundy}`,
              borderRadius: 999, padding: "10px 20px", cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.burgundy} strokeWidth="1.8" aria-hidden="true">
              <rect x="3" y="6" width="18" height="14" rx="2" />
              <circle cx="12" cy="13" r="4" />
              <path d="M9 6l1.5-2.5h3L15 6" />
            </svg>
            Upload a photo
          </label>
          {photo && (
            <div className="flex items-center gap-2">
              <img src={photo} alt="Preview of your upload" className="h-14 w-14 object-cover"
                style={{ borderRadius: 6, border: `1px solid ${C.rose}` }} />
              <button type="button" onClick={() => { setPhoto(null); if (fileRef.current) fileRef.current.value = ""; }}
                style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: 13,
                  color: C.inkSoft, textDecoration: "underline",
                  background: "none", border: "none", cursor: "pointer",
                }}>
                Remove
              </button>
            </div>
          )}
        </div>

        {error && (
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 15, color: C.wax, marginTop: 14,
          }}>{error}</p>
        )}
        <ValidationError errors={state.errors} />

        <button type="submit" disabled={state.submitting} className="w-full mt-6"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: "0.28em", textTransform: "uppercase",
            fontSize: 13, fontWeight: 600,
            color: C.paper, backgroundColor: C.burgundy,
            padding: "15px 0", borderRadius: 6, border: "none",
            cursor: state.submitting ? "default" : "pointer",
            opacity: state.submitting ? 0.7 : 1,
            transition: "background-color 0.25s ease, opacity 0.25s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.waxDark)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.burgundy)}>
          {state.submitting ? "Sending…" : "Leave it in the memory box"}
        </button>
      </form>

      {entries.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {entries.map((en) => (
            <div key={en.id} className="px-5 py-5" style={{
              backgroundColor: C.paper, border: `1px solid ${C.rose}`, borderRadius: 8,
              boxShadow: "0 8px 20px rgba(90,40,45,0.07)",
            }}>
              {en.photo && (
                <img src={en.photo} alt={`Photo shared by ${en.author}`}
                  className="w-full h-44 object-cover mb-4"
                  style={{ borderRadius: 6, border: `1px solid ${C.rose}` }} />
              )}
              {en.message && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: C.ink, fontStyle: "italic" }}>
                  “{en.message}”
                </p>
              )}
              <p style={{
                fontFamily: "'MySloop-ScriptThreeFont', cursive", fontSize: 24,
                color: C.burgundy, marginTop: 10,
              }}>— {en.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- section shell ---------- */

function Section({ eyebrow, title, children, alt = false }) {
  return (
    <section className="py-20 px-5 sm:px-8" style={{
      backgroundColor: alt ? C.ivory : "#FDFAF7",
      ...(alt ? floralBg : {}),
    }}>
      <div className="max-w-2xl mx-auto">
        <Reveal className="text-center mb-10">
          <Label>{eyebrow}</Label>
          <h2 style={{
            fontFamily: "'MySloop-ScriptThreeFont', cursive",
            fontSize: "clamp(38px, 9vw, 54px)",
            color: C.burgundy, margin: "10px 0 14px",
          }}>{title}</h2>
          <Flourish />
        </Reveal>
        <Reveal delay={120}>{children}</Reveal>
      </div>
    </section>
  );
}

/* ---------- app ---------- */

export default function Invitation() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", fn);
    return () => mq.removeEventListener?.("change", fn);
  }, []);

  return (
    <div style={{ backgroundColor: C.ivory, color: C.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        html { scroll-behavior: smooth; }
        @keyframes scrollHintBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(7px); }
        }
        ::selection { background: ${C.burgundy}; color: ${C.paper}; }
        input:focus-visible, textarea:focus-visible, button:focus-visible, label:focus-visible, a:focus-visible {
          outline: 2px solid ${C.burgundy}; outline-offset: 2px;
        }
      `}</style>

      <EnvelopeHero reduced={reduced} />

      {/* details */}
      <Section eyebrow="The celebration" title="Join us for an outing">
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { k: "When", lines: ["Friday, August 7, 2026", "9:00 PM"] },
            { k: "Where", lines: ["Kanzel Restaurant and Lounge", "Gate 1, Al Fostat St, Ad Deyorah,", "El Khalifa, Cairo Governorate"] },
          ].map((item) => (
            <div key={item.k} className="text-center px-6 py-8" style={{
              backgroundColor: C.paper, border: `1px solid ${C.rose}`, borderRadius: 8,
              boxShadow: "0 12px 30px rgba(90,40,45,0.08)",
            }}>
              <Label>{item.k}</Label>
              {item.lines.map((l, i) => (
                <p key={l} style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: i === 0 ? 22 : 17,
                  fontWeight: i === 0 ? 600 : 400,
                  color: i === 0 ? C.burgundy : C.ink,
                  marginTop: i === 0 ? 10 : 4,
                }}>{l}</p>
              ))}
              {item.k === "Where" && (
                <a href={MAPS_URL} target="_blank" rel="noreferrer"
                  className="inline-block mt-4"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    fontSize: 12, color: C.burgundy, textDecoration: "underline",
                  }}>
                  Open in Maps
                </a>
              )}
            </div>
          ))}
        </div>
        <p className="text-center mt-8" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 16, fontStyle: "italic", color: C.inkSoft,
        }}>
          Kindly note · 1200 L.E minimum charge per person
        </p>
      </Section>

      {/* venue reels */}
      <Section eyebrow="The venue" title="A glimpse of Kanzel" alt>
        <VenueReels />
      </Section>

      {/* countdown */}
      <Section eyebrow="Counting down" title="Until we celebrate">
        <Countdown />
      </Section>

      {/* rsvp */}
      <Section eyebrow="Kindly reply" title="Will you join us?">
        <Rsvp />
      </Section>

      {/* memory box */}
      <Section eyebrow="Before the day" title="The memory box" alt>
        <p className="text-center -mt-4 mb-8" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18, color: C.ink,
        }}>
          Leave the couple a note, a wish, or a photo you share with them.
        </p>
        <MemoryBox />
      </Section>

      {/* footer */}
      <footer className="py-16 text-center" style={{ backgroundColor: C.burgundy }}>
        <WaxSeal size={72} style={{ margin: "0 auto 14px", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))" }} />
        <p style={{ fontFamily: "'MySloop-ScriptThreeFont', cursive", fontSize: 40, color: C.paper }}>
          Amr &amp; Noha
        </p>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          letterSpacing: "0.3em", textTransform: "uppercase",
          fontSize: 12, color: "#E9D2CE", marginTop: 8,
        }}>
          Friday · August 7 · 2026
        </p>
      </footer>
    </div>
  );
}