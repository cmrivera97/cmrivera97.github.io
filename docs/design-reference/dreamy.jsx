// dreamy.jsx — Carolina Rivera portfolio
//
// Routing: home, design (overview), art (overview), contact, plus
// per-category subpages under design/art (Branding template).
//
// Selection on bubbles drives: eyebrow text and the meta strip below
// the showcase (Studio · Role · Sectors · Year).

const dreamyStyles = `
  .dreamy-root{
    --d-bg: #f4f6fc;
    --d-bg2: #e7ecfa;
    --d-ink: #34363f;
    --d-ink-soft: rgba(52,54,63,.7);
    --d-ink-faint: rgba(52,54,63,.45);
    --d-line: rgba(52,54,63,.12);
    --d-glass: rgba(255,255,255,.5);
    --d-accent: var(--accent, #7A8FF7);
    color: var(--d-ink);
    font-family: 'Montserrat', 'Helvetica Neue', system-ui, sans-serif;
    background: var(--d-bg);
    position: relative;
    min-height: 100vh;
    container-type: inline-size;
  }
  .dreamy-root.is-dark{
    --d-bg: #0c0e1c;
    --d-bg2: #14172a;
    --d-ink: #f0f2fc;
    --d-ink-soft: rgba(240,242,252,.7);
    --d-ink-faint: rgba(240,242,252,.45);
    --d-line: rgba(240,242,252,.12);
    --d-glass: rgba(255,255,255,.06);
  }
  .d-display{ font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif; font-weight: 400; }
  .d-script { font-family: 'Caveat', cursive; }
  .d-kollektif{ font-family: 'Jost', 'Kollektif', 'Helvetica Neue', system-ui, sans-serif; }
  .d-italianno{ font-family: 'Italianno', 'Allura', cursive; }

  /* Header / nav */
  .nav-bar{ position: fixed; top: 0; left: 0; right: 0; z-index: 90;
    padding: 18px clamp(20px, 4vw, 60px);
    display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
    background: linear-gradient(180deg, rgba(244,246,252,.85), rgba(244,246,252,0));
    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
    transition: background .3s; }
  .is-dark .nav-bar{ background: linear-gradient(180deg, rgba(12,14,28,.85), rgba(12,14,28,0)); }
  .logo{ font-family: 'Fraunces', serif; font-style: italic; font-size: 22px;
    letter-spacing: -.01em; color: var(--d-ink); cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px; }
  .logo .dot{ width: 6px; height: 6px; border-radius: 999px; background: var(--d-accent);
    display: inline-block; transform: translateY(-8px); }
  .nav-center{ display: flex; gap: 4px; align-items: center;
    background: rgba(255,255,255,.6); backdrop-filter: blur(28px) saturate(160%);
    -webkit-backdrop-filter: blur(28px) saturate(160%);
    border: .5px solid rgba(255,255,255,.7); border-radius: 999px; padding: 5px;
    box-shadow: 0 1px 0 rgba(255,255,255,.7) inset, 0 8px 30px -8px rgba(80,100,180,.18); }
  .is-dark .nav-center{ background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.12); }
  .nav-link{ position: relative; padding: 9px 16px; border-radius: 999px;
    cursor: pointer; font-size: 13px; font-weight: 500; letter-spacing: .01em;
    color: var(--d-ink-soft); transition: all .25s; background: transparent;
    border: 0; font-family: inherit; }
  .nav-link:hover{ color: var(--d-ink); }
  .nav-link.active{ background: var(--d-ink); color: var(--d-bg); }
  .nav-right{ display: flex; gap: 8px; justify-content: flex-end; align-items: center; }

  /* Mega menu */
  .mega{ position: fixed; left: 0; right: 0; top: 70px; z-index: 89;
    padding: 22px clamp(20px, 4vw, 60px) 28px;
    background: rgba(255,255,255,.65);
    backdrop-filter: blur(28px) saturate(160%); -webkit-backdrop-filter: blur(28px) saturate(160%);
    border-bottom: .5px solid var(--d-line);
    box-shadow: 0 30px 60px -30px rgba(80,100,180,.2); }
  .is-dark .mega{ background: rgba(20,23,42,.85); }
  .mega-grid{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px 24px; max-width: 920px; margin: 0 auto; }
  .mega-item{ padding: 14px 16px; border-radius: 14px; cursor: pointer;
    transition: all .2s; display: flex; flex-direction: column; gap: 4px;
    border: .5px solid transparent; background: transparent; text-align: left; font-family: inherit; }
  .mega-item:hover{ background: rgba(255,255,255,.6); border-color: rgba(255,255,255,.7); }
  .is-dark .mega-item:hover{ background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.12); }
  .mega-num{ font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--d-ink-faint); font-weight: 600; }
  .mega-label{ font-family: 'Fraunces', serif; font-style: italic; font-size: 22px;
    color: var(--d-ink); letter-spacing: -.01em; }
  .mega-label .num{ font-family: 'Montserrat', sans-serif; font-style: normal;
    font-size: 11px; color: var(--d-accent); margin-right: 8px; vertical-align: top;
    letter-spacing: .08em; font-weight: 600; }
  .mega-blurb{ font-size: 12px; color: var(--d-ink-soft); }

  /* Page transition: each page has its own opacity + slide */
  .page{ opacity: 0; transform: translateY(16px);
    transition: opacity .55s ease, transform .55s cubic-bezier(.2,.8,.2,1); }
  .page.in{ opacity: 1; transform: translateY(0); }

  /* Hero stage */
  .hero-stage{
    position: relative; min-height: 100vh; display: grid; align-items: center;
    padding: 120px clamp(20px, 5vw, 70px) 60px;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,.9), transparent 70%),
      radial-gradient(ellipse 60% 60% at 18% 80%, oklch(94% .04 250), transparent 60%),
      radial-gradient(ellipse 70% 70% at 82% 70%, oklch(92% .05 270), transparent 60%),
      linear-gradient(180deg, #f8faff 0%, #e9eefb 100%);
    overflow: hidden;
  }
  .is-dark .hero-stage{
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(150,170,255,.18), transparent 70%),
      radial-gradient(ellipse 70% 70% at 80% 70%, oklch(35% .12 260 / .4), transparent 60%),
      linear-gradient(180deg, #0c0e1c 0%, #1a1d34 100%);
  }
  .sparkles{ position:absolute; inset:0; pointer-events:none; }
  .sparkle{ position:absolute; width: 3px; height: 3px; border-radius: 999px;
    background: rgba(255,255,255,.95); box-shadow: 0 0 8px rgba(255,255,255,.8);
    animation: twinkle 4s ease-in-out infinite; }
  .is-dark .sparkle{ background: rgba(180,200,255,1); box-shadow: 0 0 10px rgba(180,200,255,.7); }
  @keyframes twinkle{ 0%,100%{opacity:.2;transform:scale(.8);} 50%{opacity:1;transform:scale(1.2);} }
  .caustic{ position:absolute; inset:0; pointer-events:none; opacity: .45;
    background:
      linear-gradient(115deg, transparent 30%, rgba(255,255,255,.45) 38%, transparent 46%),
      linear-gradient(115deg, transparent 50%, rgba(255,255,255,.25) 56%, transparent 62%);
    mix-blend-mode: soft-light; animation: caustic-drift 14s ease-in-out infinite alternate; }
  @keyframes caustic-drift{ 0%{transform:translate(0,0) scale(1);} 100%{transform:translate(-3%,2%) scale(1.04);} }

  /* Jellyfish stage */
  .jelly-stage{ position:absolute; inset: 0; pointer-events:none; z-index:1; }
  .jelly{ position:absolute; will-change: transform; }
  .jelly .bell-grp{ animation: bell-pulse 5s ease-in-out infinite; }
  .jelly .oral, .jelly .tentacles{ animation: sway 7s ease-in-out infinite; }
  .jelly .oral{ animation-duration: 5s; }
  /* Independent 3D drift — each jelly gets its own keyframe sequence and depth */
  .jelly{ transform-style: preserve-3d; }
  .jelly.j1{ animation: drift-1 17s ease-in-out infinite; perspective: 800px; }
  .jelly.j2{ animation: drift-2 23s ease-in-out infinite; perspective: 1000px; }
  .jelly.j3{ animation: drift-3 19s ease-in-out infinite; perspective: 800px; }
  @keyframes drift-1{
    0%{transform: translate3d(0,0,0) rotate(-1deg) scale(1);}
    33%{transform: translate3d(-22px,-30px,40px) rotate(1.5deg) scale(1.03);}
    66%{transform: translate3d(14px,-50px,-30px) rotate(-2deg) scale(.97);}
    100%{transform: translate3d(0,0,0) rotate(-1deg) scale(1);}
  }
  @keyframes drift-2{
    0%{transform: translate3d(0,0,0) rotate(.5deg) scale(1);}
    25%{transform: translate3d(28px,-40px,-50px) rotate(-1.5deg) scale(.95);}
    55%{transform: translate3d(-18px,-70px,30px) rotate(2deg) scale(1.04);}
    80%{transform: translate3d(12px,-40px,-20px) rotate(-.5deg) scale(.99);}
    100%{transform: translate3d(0,0,0) rotate(.5deg) scale(1);}
  }
  @keyframes drift-3{
    0%{transform: translate3d(0,0,0) rotate(2deg) scale(1);}
    40%{transform: translate3d(-30px,-22px,60px) rotate(-1deg) scale(1.05);}
    75%{transform: translate3d(20px,-44px,-40px) rotate(1.5deg) scale(.96);}
    100%{transform: translate3d(0,0,0) rotate(2deg) scale(1);}
  }
  /* Sway only on tendrils/oral arms — NEVER on bell. Each jelly different cadence. */
  .jelly.j1 .oral{ animation: sway-a 6.5s ease-in-out infinite; }
  .jelly.j1 .tentacles.front{ animation: sway-b 8.2s ease-in-out infinite; }
  .jelly.j1 .tentacles.back{ animation: sway-c 10s ease-in-out infinite; }
  .jelly.j2 .oral{ animation: sway-b 7.8s ease-in-out infinite; }
  .jelly.j2 .tentacles.front{ animation: sway-c 9.4s ease-in-out infinite; }
  .jelly.j2 .tentacles.back{ animation: sway-a 11.6s ease-in-out infinite; }
  .jelly.j3 .oral{ animation: sway-c 5.8s ease-in-out infinite; }
  .jelly.j3 .tentacles.front{ animation: sway-a 7.4s ease-in-out infinite; }
  .jelly.j3 .tentacles.back{ animation: sway-b 9s ease-in-out infinite; }
  @keyframes sway-a{ 0%,100%{transform:rotate(-1.8deg);} 50%{transform:rotate(1.8deg);} }
  @keyframes sway-b{ 0%,100%{transform:rotate(2deg) translateX(-2px);} 50%{transform:rotate(-1.4deg) translateX(2px);} }
  @keyframes sway-c{ 0%,100%{transform:rotate(-1.2deg) translateX(3px);} 50%{transform:rotate(2.2deg) translateX(-3px);} }
  /* Beads twinkle on each jelly with its own offset */
  .jelly.j1 .beads{ animation: twinkle-beads 4s ease-in-out infinite; }
  .jelly.j2 .beads{ animation: twinkle-beads 5.4s ease-in-out infinite -1.5s; }
  .jelly.j3 .beads{ animation: twinkle-beads 4.6s ease-in-out infinite -2.5s; }
  @keyframes twinkle-beads{ 0%,100%{opacity:.7;} 50%{opacity:1;} }

  @keyframes fadeUpHero { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  /* Hero entrance — minimal, elegant. Carolina rises softly as a single block; Rivera follows with a gentle fade-up. */
  .hero-letters{ display: inline-block; opacity: 0; transform: translateY(.35em);
    animation: heroIn 1.1s .15s cubic-bezier(.22,.9,.28,1) forwards; }
  .hero-letter{ display: inline-block; }
  @keyframes heroIn{
    0%   { opacity: 0; transform: translateY(.35em); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .hero-rivera-wrap{ overflow: visible; padding: .05em .2em .25em; opacity: 0; transform: translateY(.3em);
    animation: riveraIn 1.1s .85s cubic-bezier(.22,.9,.28,1) forwards; }
  @keyframes riveraIn{
    0%   { opacity: 0; transform: translateY(.3em); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .hero-rivera-anim{ display: inline-block; }
  /* Hero title — Carolina (serif italic) / Rivera (sans light) */
  .hero-title{ display: flex; flex-direction: column; align-items: center;
    line-height: .92; letter-spacing: -.025em; margin-top: 14vh; gap: 0; }
  .hero-first{ font-family: 'Jost', 'Kollektif', 'Helvetica Neue', sans-serif; font-weight: 500;
    font-size: clamp(72px, 14cqw, 200px); color: var(--d-ink);
    letter-spacing: -.02em; line-height: .9; }
  .hero-last{ font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif; font-weight: 300;
    font-size: clamp(40px, 7cqw, 96px); letter-spacing: -.01em;
    color: var(--d-accent); line-height: 1.05; margin-top: -.15em; padding-bottom: .18em; font-style: italic;
    background: linear-gradient(180deg, var(--d-accent) 0%, oklch(58% .22 280) 60%, oklch(48% .25 290) 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent; }

  .hero-rule{ width: 220px; max-width: 60%; height: 1px; background: var(--d-line);
    margin: 18px auto; }

  /* Buttons */
  .btn{ display: inline-flex; align-items: center; gap: 10px; padding: 14px 24px;
    border-radius: 999px; font-size: 13.5px; font-weight: 500; letter-spacing: .01em;
    cursor: pointer; transition: all .25s; border: 0; font-family: inherit; }
  .btn-primary{ background: var(--d-ink); color: var(--d-bg); }
  .btn-primary:hover{ background: var(--d-accent); color: #fff; transform: translateY(-2px);
    box-shadow: 0 12px 30px -8px var(--d-accent); }
  .btn-glass{ background: rgba(255,255,255,.55); color: var(--d-ink);
    border: .5px solid rgba(255,255,255,.7);
    backdrop-filter: blur(20px) saturate(140%); -webkit-backdrop-filter: blur(20px) saturate(140%);
    box-shadow: 0 1px 0 rgba(255,255,255,.7) inset, 0 6px 18px -6px rgba(80,100,180,.18); }
  .btn-glass:hover{ background: rgba(255,255,255,.75); transform: translateY(-2px); }
  .is-dark .btn-glass{ background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.12); }
  .icon-btn{ width: 38px; height: 38px; border-radius: 999px; padding: 0;
    background: rgba(255,255,255,.6); border: .5px solid rgba(255,255,255,.7);
    backdrop-filter: blur(20px); display: inline-flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .2s; color: var(--d-ink); font-family: inherit; }
  .icon-btn:hover{ background: rgba(255,255,255,.85); }
  .is-dark .icon-btn{ background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.12); color: var(--d-ink); }

  /* Eyebrow */
  .eyebrow{ font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
    color: var(--d-ink-faint); font-weight: 600;
    display: inline-flex; align-items: center; gap: 10px; }
  .eyebrow::before{ content:''; width: 24px; height: 1px; background: currentColor; }

  /* Section title */
  .sec-title{ font-family: 'Montserrat', sans-serif; font-weight: 300;
    font-size: clamp(40px, 6cqw, 92px); line-height: .98; letter-spacing: -.035em; }
  .sec-title .it{ font-family: 'Fraunces', serif; font-weight: 400; font-style: italic;
    color: var(--d-accent); letter-spacing: -.02em; }

  /* Glass card */
  .glass-card{ background: rgba(255,255,255,.5);
    backdrop-filter: blur(28px) saturate(160%); -webkit-backdrop-filter: blur(28px) saturate(160%);
    border: .5px solid rgba(255,255,255,.7); border-radius: 22px;
    box-shadow: 0 1px 0 rgba(255,255,255,.8) inset, 0 18px 50px -12px rgba(80,100,180,.22); }
  .is-dark .glass-card{ background: rgba(255,255,255,.05); border-color: rgba(255,255,255,.1);
    box-shadow: 0 1px 0 rgba(255,255,255,.08) inset, 0 18px 50px -12px rgba(0,0,0,.5); }

  /* Bubble (category selector) */
  .bubble{ position: relative; padding: 12px 22px; border-radius: 999px; cursor: pointer;
    font-size: 13.5px; font-weight: 500; transition: all .3s;
    color: var(--d-ink-soft); background: rgba(255,255,255,.55); border: .5px solid rgba(255,255,255,.7);
    backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%);
    box-shadow: 0 1px 0 rgba(255,255,255,.7) inset, 0 8px 22px -8px rgba(80,100,180,.18);
    font-family: inherit; }
  .bubble:hover{ color: var(--d-ink); transform: translateY(-2px); }
  .bubble.active{
    background: linear-gradient(135deg, var(--d-accent) 0%, oklch(60% .2 280) 100%);
    color: #fff; border-color: rgba(255,255,255,.5);
    box-shadow: 0 1px 0 rgba(255,255,255,.5) inset, 0 12px 30px -8px var(--d-accent); }
  .is-dark .bubble{ background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.12); }

  /* Showcase carousel */
  .showcase-track{ display: flex; gap: 24px; overflow-x: auto; padding: 30px 6vw 30px;
    scroll-snap-type: x mandatory; scrollbar-width: none; cursor: grab; }
  .showcase-track::-webkit-scrollbar{ display: none; }
  .showcase-card{ flex: 0 0 clamp(360px, 50cqw, 600px); scroll-snap-align: center;
    aspect-ratio: 16/11; position: relative; }
  .showcase-frame{ position: absolute; inset: 0; padding: 14px;
    background: rgba(255,255,255,.45);
    backdrop-filter: blur(30px) saturate(170%); -webkit-backdrop-filter: blur(30px) saturate(170%);
    border: .5px solid rgba(255,255,255,.75); border-radius: 26px;
    box-shadow: 0 1px 0 rgba(255,255,255,.85) inset, 0 28px 60px -18px rgba(80,100,180,.3);
    overflow: hidden; transition: transform .5s cubic-bezier(.2,.8,.2,1); }
  .is-dark .showcase-frame{ background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.12);
    box-shadow: 0 1px 0 rgba(255,255,255,.08) inset, 0 28px 60px -18px rgba(0,0,0,.6); }
  .showcase-card:hover .showcase-frame{ transform: translateY(-6px); }
  .showcase-screen{ position: absolute; inset: 14px; border-radius: 16px; overflow: hidden; }
  .showcase-meta{ position: absolute; left: 22px; right: 22px; bottom: 22px; z-index: 2;
    display: flex; justify-content: space-between; align-items: end; gap: 14px;
    padding-right: 12px; }
  .showcase-tag{ position: absolute; top: 22px; left: 22px; z-index: 2;
    padding: 6px 12px; border-radius: 999px; background: rgba(255,255,255,.78);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: .5px solid rgba(255,255,255,.95);
    font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
    font-weight: 600; color: #1a1c2e; }

  /* Subpage grid (Branding template) */
  .sub-grid{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
  .sub-card{ aspect-ratio: 4/3; border-radius: 18px; overflow: hidden;
    position: relative; cursor: pointer; transition: transform .35s; }
  .sub-card:nth-child(2n){ transform: rotate(.8deg); }
  .sub-card:nth-child(3n){ transform: rotate(-.6deg); }
  .sub-card:hover{ transform: translateY(-4px) rotate(0deg) !important; }
  .sub-card .sub-tag{ position: absolute; left: 14px; bottom: 12px; z-index: 2;
    font-size: 11px; letter-spacing: .06em; color: rgba(255,255,255,.95); font-weight: 600; }
  .ph-stripes{ background-image: repeating-linear-gradient(135deg,
      currentColor 0 1px, transparent 1px 9px); }
  .ph-glyph{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
    font-family: 'Fraunces', serif; font-style: italic; color: rgba(255,255,255,.7);
    text-shadow: 0 2px 18px rgba(0,0,0,.18); }

  /* Inputs */
  .glass-input{ width: 100%; padding: 16px 18px; background: rgba(255,255,255,.5);
    border: .5px solid rgba(255,255,255,.7); border-radius: 14px;
    font-size: 14px; color: var(--d-ink); outline: none; transition: all .2s;
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
    font-family: inherit; }
  .glass-input:focus{ border-color: var(--d-accent); background: rgba(255,255,255,.75);
    box-shadow: 0 0 0 3px rgba(122,143,247,.18); }
  .glass-input::placeholder{ color: var(--d-ink-faint); }
  .is-dark .glass-input{ background: rgba(255,255,255,.05); border-color: rgba(255,255,255,.12); }

  /* Marquee */
  .marquee{ font-family: 'Fraunces', serif; font-style: italic; font-weight: 300;
    font-size: clamp(40px, 7cqw, 110px); line-height: 1; padding: 28px 0;
    border-top: .5px solid var(--d-line); border-bottom: .5px solid var(--d-line);
    background: rgba(255,255,255,.3);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    color: var(--d-ink); }
  .is-dark .marquee{ background: rgba(255,255,255,.03); }
`;

// ─────────────────────────────────────────────────────────────
// Sparkles
// ─────────────────────────────────────────────────────────────
function Sparkles({ count = 28 }) {
  const items = React.useMemo(() => Array.from({ length: count }).map((_, i) => ({
    left: Math.random() * 100, top: Math.random() * 90,
    delay: Math.random() * 4, size: 2 + Math.random() * 3,
  })), [count]);
  return (
    <div className="sparkles">
      {items.map((s, i) => (
        <span key={i} className="sparkle" style={{
          left: s.left + "%", top: s.top + "%",
          width: s.size, height: s.size, animationDelay: s.delay + "s",
        }} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Showcase placeholder (faux website screenshot)
// ─────────────────────────────────────────────────────────────
function Placeholder({ p }) {
  const bg = `linear-gradient(135deg, oklch(82% .12 ${p.hue}) 0%, oklch(62% .15 ${p.hue + 30}) 100%)`;
  return (
    <div style={{ position: "absolute", inset: 0, background: bg, color: `oklch(38% .14 ${p.hue})`, overflow: "hidden" }}>
      <div className="ph-stripes" style={{ position: "absolute", inset: 0, opacity: 0.18 }} />
      {/* Faux browser */}
      <div style={{ position: "absolute", top: 14, left: 14, right: 14, height: 28,
        background: "rgba(255,255,255,.55)", backdropFilter: "blur(20px)",
        borderRadius: 8, border: ".5px solid rgba(255,255,255,.7)",
        display: "flex", alignItems: "center", gap: 8, padding: "0 10px" }}>
        {[1,2,3].map(i => <span key={i} style={{ width: 8, height: 8, borderRadius: 999, background: "rgba(255,255,255,.7)" }} />)}
        <div style={{ flex: 1, marginLeft: 8, height: 14, background: "rgba(255,255,255,.4)", borderRadius: 4 }} />
      </div>
      {/* Body */}
      <div style={{ position: "absolute", inset: "60px 30px 70px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ height: 28, width: "60%", background: "rgba(255,255,255,.7)", borderRadius: 6 }} />
        <div style={{ height: 12, width: "90%", background: "rgba(255,255,255,.4)", borderRadius: 4 }} />
        <div style={{ height: 12, width: "75%", background: "rgba(255,255,255,.4)", borderRadius: 4 }} />
        <div style={{ display: "flex", gap: 12, marginTop: 18, flex: 1 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,.3)", borderRadius: 12, position: "relative" }}>
            <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Fraunces, serif", fontStyle: "italic", color: "rgba(255,255,255,.8)", fontSize: 64 }}>{p.glyph}</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,.5)", borderRadius: 10 }} />
            <div style={{ flex: 1, background: "rgba(255,255,255,.35)", borderRadius: 10 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CardPlaceholder({ hue, glyph, label }) {
  const bg = `linear-gradient(135deg, oklch(78% .14 ${hue}) 0%, oklch(58% .17 ${hue + 25}) 100%)`;
  return (
    <div style={{ position: "absolute", inset: 0, background: bg, color: `oklch(38% .14 ${hue})` }}>
      <div className="ph-stripes" style={{ position: "absolute", inset: 0, opacity: 0.18 }} />
      <div className="ph-glyph" style={{ fontSize: "42%" }}>{glyph}</div>
      {label && <div className="sub-tag">{label}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────
function Hero({ t, accent, scrollY, onCTA }) {
  const py1 = scrollY * 0.16;
  const py2 = scrollY * 0.30;
  const py3 = scrollY * 0.22;
  const fade = Math.max(0, 1 - scrollY / 700);
  const titleY = scrollY * -0.06;

  return (
    <section className="hero-stage">
      <div className="caustic" />
      <Sparkles count={36} />
      <div className="jelly-stage" style={{ opacity: fade }}>
        <div className="jelly j2" style={{ top: "6%", left: "50%", transform: `translate(-50%, ${-py2}px)` }}>
          <Jellyfish size={420} hue={250} accent={accent} seed={2} />
        </div>
        <div className="jelly j1" style={{ top: "20%", left: "10%", transform: `translateY(${-py1}px)` }}>
          <Jellyfish size={240} hue={238} accent={accent} seed={1} />
        </div>
        <div className="jelly j3" style={{ top: "32%", right: "8%", transform: `translateY(${-py3}px)` }}>
          <Jellyfish size={220} hue={262} accent={accent} seed={3} />
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2, transform: `translateY(${titleY}px)`, textAlign: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "center", marginBottom: 30 }}>
          <Reveal style={{ textAlign: "left" }}>
            <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--d-ink-faint)", fontWeight: 600 }}>
              {t.hero.since}
            </div>
          </Reveal>
          <Reveal>
            <div className="eyebrow" style={{ justifyContent: "center" }}>{t.hero.eyebrow}</div>
          </Reveal>
          <Reveal style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--d-ink-faint)", fontWeight: 600 }}>
              Bogotá · COL
            </div>
          </Reveal>
        </div>

        <h1 className="hero-title">
          <span className="hero-first hero-letters">{t.hero.first}</span>
          <span className="hero-rivera-wrap">
            <span className="hero-last hero-rivera-anim">{t.hero.last}</span>
          </span>
        </h1>

        <Reveal delay={650}>
          <p style={{ maxWidth: 520, margin: "30px auto 0", fontSize: 16, lineHeight: 1.55, color: "var(--d-ink-soft)" }}>
            {t.hero.lede}
          </p>
        </Reveal>
        <Reveal delay={800}>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 36 }}>
            <button className="btn btn-primary" data-cursor="link" onClick={() => onCTA("design")}>{t.hero.cta1} →</button>
            <button className="btn btn-glass" data-cursor="link" onClick={() => onCTA("contact")}>{t.hero.cta2}</button>
          </div>
        </Reveal>
      </div>

      {/* Scroll hint */}
      <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
        fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--d-ink-faint)",
        display: "flex", alignItems: "center", gap: 10, fontWeight: 600, zIndex: 3 }}>
        <span style={{ width: 1, height: 28, background: "var(--d-ink-faint)" }} />
        {t.hero.scrollHint}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Showcase Carousel + bubble category selector
// ─────────────────────────────────────────────────────────────
function Showcase({ items, onOpen, label }) {
  const trackRef = React.useRef(null);
  const [active, setActive] = React.useState(0);
  const [drag, setDrag] = React.useState({ active: false, x: 0, scrollX: 0 });

  React.useEffect(() => {
    const track = trackRef.current; if (!track) return;
    const onScroll = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      const cards = [...track.querySelectorAll(".showcase-card")];
      let best = 0, bestD = Infinity;
      cards.forEach((c, i) => {
        const cx = c.offsetLeft + c.offsetWidth / 2;
        const d = Math.abs(cx - center);
        if (d < bestD) { bestD = d; best = i; }
      });
      setActive(best);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => track.removeEventListener("scroll", onScroll);
  }, [items.length]);

  const scrollTo = (i) => {
    const cards = [...trackRef.current.querySelectorAll(".showcase-card")];
    const c = cards[i]; if (!c) return;
    const left = c.offsetLeft - (trackRef.current.clientWidth - c.offsetWidth) / 2;
    trackRef.current.scrollTo({ left, behavior: "smooth" });
  };

  return (
    <React.Fragment>
      <div ref={trackRef} className="showcase-track"
        onMouseDown={(e) => setDrag({ active: true, x: e.clientX, scrollX: trackRef.current.scrollLeft })}
        onMouseMove={(e) => { if (drag.active) trackRef.current.scrollLeft = drag.scrollX - (e.clientX - drag.x); }}
        onMouseUp={() => setDrag({ ...drag, active: false })}
        onMouseLeave={() => setDrag({ ...drag, active: false })}
        style={{ cursor: drag.active ? "grabbing" : "grab" }}
        data-cursor="drag" data-cursor-label={label}>
        {items.map((p, i) => {
          const distance = Math.abs(i - active);
          const scale = 1 - Math.min(distance, 2) * 0.06;
          const opacity = 1 - Math.min(distance, 3) * 0.18;
          return (
            <div key={p.id} className="showcase-card"
              style={{ transform: `scale(${scale})`, opacity, transition: "transform .5s cubic-bezier(.2,.8,.2,1), opacity .5s" }}>
              <div className="showcase-frame" data-cursor="media" data-cursor-label={label} onClick={() => onOpen?.(p)}>
                <div className="showcase-tag">{label}</div>
                <div className="showcase-screen"><Placeholder p={p} /></div>
                <div className="showcase-meta">
                  <div style={{
                    background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.35) 100%)",
                    padding: "30px 18px 14px", margin: "-30px -18px -14px",
                    borderRadius: "0 0 14px 14px", width: "calc(100% + 36px)",
                  }}>
                    <div className="d-display" style={{ fontSize: 22, lineHeight: 1.1, color: "#fff", textShadow: "0 2px 20px rgba(0,0,0,.4)", fontStyle: "italic", letterSpacing: "-.01em" }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.92)", marginTop: 6, fontWeight: 500, letterSpacing: ".04em", textShadow: "0 1px 8px rgba(0,0,0,.5)" }}>
                      {p.client} · {p.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, padding: "8px 0 0" }}>
        <button className="btn btn-glass" data-no-splash data-cursor="link"
          style={{ padding: "10px 14px", fontSize: 13 }}
          onClick={() => scrollTo(Math.max(0, active - 1))}>←</button>
        <div style={{ display: "flex", gap: 8 }}>
          {items.map((_, i) => (
            <button key={i} onClick={() => scrollTo(i)} data-no-splash data-cursor="link"
              style={{ width: i === active ? 28 : 8, height: 8, borderRadius: 999,
                background: i === active ? "var(--d-ink)" : "var(--d-line)",
                border: 0, cursor: "pointer", transition: "all .3s" }} />
          ))}
        </div>
        <button className="btn btn-glass" data-no-splash data-cursor="link"
          style={{ padding: "10px 14px", fontSize: 13 }}
          onClick={() => scrollTo(Math.min(items.length - 1, active + 1))}>→</button>
      </div>
      {/* Return active project for parent meta strip */}
      <ActiveSync index={active} items={items} />
    </React.Fragment>
  );
}
function ActiveSync({ index, items }) {
  // tiny helper that doesn't render anything but lets parent observe via window event
  React.useEffect(() => {
    const p = items[index];
    if (p) window.dispatchEvent(new CustomEvent("__showcase_active", { detail: p }));
  }, [index, items]);
  return null;
}

// ─────────────────────────────────────────────────────────────
// Section: Design Portfolio (with bubble selector)
// ─────────────────────────────────────────────────────────────
function PortfolioSection({ t, kind /* "design"|"art" */, accent, onOpen, onCategory, sectionId }) {
  const cats = kind === "design" ? t.designCats : t.artCats;
  const keys = Object.keys(cats);
  const [cat, setCat] = React.useState(keys[2] || keys[0]); // default branding/photo-ish
  const [activeProj, setActiveProj] = React.useState(PROJECTS[cat][0]);

  React.useEffect(() => {
    setActiveProj(PROJECTS[cat][0]);
    const handler = (e) => setActiveProj(e.detail);
    window.addEventListener("__showcase_active", handler);
    return () => window.removeEventListener("__showcase_active", handler);
  }, [cat]);

  const eyebrowTitle = kind === "design"
    ? t.sections.designEyebrow + " · " + cats[cat].label
    : t.sections.artEyebrow + " · " + cats[cat].label;

  const items = PROJECTS[cat];

  return (
    <section id={sectionId} style={{ padding: "100px 0 60px", position: "relative", scrollMarginTop: 80 }}>
      <div style={{ padding: "0 6vw" }}>
        <div style={{ marginBottom: 30 }}>
          <Reveal><div className="eyebrow">{eyebrowTitle}</div></Reveal>
          <Reveal delay={120}>
            <h2 className="sec-title" style={{ marginTop: 14 }}>
              {kind === "design" ? t.sections.designTitle1 : t.sections.artTitle1}{" "}
              <span className="it">{kind === "design" ? t.sections.designTitle2 : t.sections.artTitle2}</span>
            </h2>
          </Reveal>
          <Reveal delay={300}>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--d-ink-soft)", maxWidth: 540, marginTop: 16 }}>{cats[cat].blurb}</p>
          </Reveal>
        </div>

        {/* Category bubbles */}
        <Reveal>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {keys.map((k) => (
              <button key={k} className={"bubble" + (cat === k ? " active" : "")}
                onClick={() => setCat(k)} data-cursor="link">
                {cats[k].label}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <Showcase items={items} onOpen={onOpen} label={cats[cat].label} />

      {/* Meta strip */}
      <div style={{ padding: "20px 6vw 0" }}>
        <Reveal>
          <div className="glass-card" style={{ padding: 22, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
            {[
              [t.meta.studio, activeProj?.client || "—"],
              [t.meta.role, activeProj?.role || "—"],
              [t.meta.sectors, activeProj?.sector || "—"],
              [t.meta.year, activeProj?.year || "—"],
            ].map(([k, v], i) => (
              <div key={i}>
                <div style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--d-ink-faint)", fontWeight: 600 }}>{k}</div>
                <div style={{ fontSize: 14, marginTop: 6, color: "var(--d-ink)", fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <button className="btn btn-glass" data-cursor="link" onClick={() => onCategory(cat)}>
            {t.explore} — {cats[cat].label} →
          </button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Subpage (Branding template)
// ─────────────────────────────────────────────────────────────
function Subpage({ t, kind, catKey, onBack }) {
  const cats = kind === "design" ? t.designCats : t.artCats;
  const cat = cats[catKey];
  const items = PROJECTS[catKey];

  return (
    <section style={{ padding: "120px clamp(20px, 5vw, 70px) 80px", minHeight: "100vh",
      background:
        "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,255,255,.7), transparent 70%)," +
        "linear-gradient(180deg, var(--d-bg) 0%, var(--d-bg2) 100%)" }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 30 }}>
        <button className="btn btn-glass" data-cursor="link" onClick={onBack}>← {t.back}</button>
        <div className="eyebrow">{kind === "design" ? t.sections.designEyebrow : t.sections.artEyebrow}</div>
        <div style={{ width: 80 }} />
      </div>

      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <Reveal>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(64px, 10cqw, 160px)", lineHeight: 1, letterSpacing: "-.02em",
            color: "var(--d-ink)" }}>
            {cat.label}
          </h1>
        </Reveal>
        <Reveal delay={150}>
          <div style={{ width: 120, height: 1, background: "var(--d-ink)", margin: "20px auto" }} />
        </Reveal>
        <Reveal delay={250}>
          <div style={{ width: 60, height: 1, background: "var(--d-ink-faint)", margin: "0 auto 30px" }} />
        </Reveal>
        <Reveal delay={350}>
          <p style={{ fontSize: 16, color: "var(--d-ink-soft)", maxWidth: 540, margin: "0 auto" }}>
            {cat.blurb}
          </p>
        </Reveal>
      </div>

      {/* 4-col case grid */}
      <div className="sub-grid">
        {items.map((p, i) => (
          <Reveal key={p.id} delay={i * 60}>
            <div className="sub-card" data-cursor="media" data-cursor-label={t.meta.open}>
              <CardPlaceholder hue={p.hue} glyph={p.glyph} label={p.title} />
            </div>
          </Reveal>
        ))}
        {/* Pad to 8 with light variants if fewer */}
        {items.length < 8 && Array.from({ length: 8 - items.length }).map((_, i) => {
          const ref = items[i % items.length];
          return (
            <Reveal key={"p" + i} delay={(items.length + i) * 60}>
              <div className="sub-card" data-cursor="media" data-cursor-label={t.meta.open}>
                <CardPlaceholder hue={(ref.hue + 30) % 360} glyph={ref.glyph} label={ref.title + " — alt"} />
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Pagination */}
      <Reveal>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 18, marginTop: 50 }}>
          <button className="btn btn-glass" data-cursor="link" data-no-splash style={{ padding: "10px 14px" }}>←</button>
          <span style={{ fontSize: 12, color: "var(--d-ink-faint)", letterSpacing: ".1em", fontWeight: 600 }}>1 · · · 4</span>
          <button className="btn btn-glass" data-cursor="link" data-no-splash style={{ padding: "10px 14px" }}>→</button>
        </div>
      </Reveal>

      {/* Sister category bubbles */}
      <Reveal>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 50 }}>
          {Object.keys(cats).map((k) => (
            <button key={k} className={"bubble" + (k === catKey ? " active" : "")}
              data-cursor="link"
              onClick={() => window.dispatchEvent(new CustomEvent("__nav", { detail: { page: "sub", kind, catKey: k } }))}>
              {cats[k].label}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Footer strip */}
      <Reveal>
        <div className="glass-card" style={{ padding: 22, marginTop: 60,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--d-ink)" }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--d-accent)" }} />
            <span style={{ fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: 18 }}>hola@carolinarivera.studio</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--d-ink-faint)", letterSpacing: ".08em", fontWeight: 600 }}>
            {kind === "design" ? "Design Portfolio" : "Personal Portfolio"} — {cat.label}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Contact (per Ref Contact sketch)
// ─────────────────────────────────────────────────────────────
function Contact({ t }) {
  const [copied, setCopied] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const email = "hola@carolinarivera.studio";

  return (
    <section style={{ padding: "120px clamp(20px, 5vw, 70px) 80px", minHeight: "100vh" }}>
      <div className="eyebrow" style={{ marginBottom: 22 }}>—{t.contact.eyebrow}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: 60, alignItems: "start" }}>
        {/* Left column — three lines + email card */}
        <div>
          <Reveal>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 400,
              fontSize: "clamp(56px, 9cqw, 140px)", lineHeight: .95, letterSpacing: "-.02em",
              color: "var(--d-ink)", marginBottom: 30 }}>
              {t.contact.title} <span style={{
                background: "linear-gradient(180deg, var(--d-accent), oklch(50% .2 280))",
                WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent"
              }}>{t.contact.titleIt}</span>
            </h1>
          </Reveal>

          {/* Three description lines (per sketch — heavy/medium/light) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 540, marginBottom: 40 }}>
            <Reveal delay={150}>
              <p style={{ fontSize: 22, lineHeight: 1.4, fontWeight: 500, color: "var(--d-ink)" }}>
                {t.contact.l1}
              </p>
            </Reveal>
            <Reveal delay={250}>
              <p style={{ fontSize: 17, lineHeight: 1.55, color: "var(--d-ink-soft)" }}>
                {t.contact.l2}
              </p>
            </Reveal>
            <Reveal delay={350}>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--d-ink-faint)", fontStyle: "italic", fontFamily: "Fraunces, serif" }}>
                {t.contact.l3}
              </p>
            </Reveal>
          </div>

          {/* Email card */}
          <Reveal delay={500}>
            <div className="glass-card" style={{ padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--d-ink-faint)", fontWeight: 600 }}>{t.contact.email}</div>
                  <div className="d-display" style={{ fontStyle: "italic", fontSize: 22, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {email}
                  </div>
                </div>
                <button className="btn btn-glass" data-no-splash data-cursor="link"
                  onClick={() => { navigator.clipboard?.writeText(email); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
                  style={{ padding: "10px 16px", fontSize: 12 }}>
                  {copied ? t.contact.copied : t.contact.copy}
                </button>
              </div>
              <div style={{ height: 1, background: "var(--d-line)", margin: "16px 0" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--d-ink-faint)", fontWeight: 600 }}>{t.contact.based}</div>
                  <div style={{ fontSize: 14, marginTop: 4, fontWeight: 500 }}>{t.contact.basedCity}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--d-ink-faint)", fontWeight: 600 }}>Reply</div>
                  <div style={{ fontSize: 14, marginTop: 4, fontWeight: 500 }}>{t.contact.reply}</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right — Send a message form */}
        <div>
          <Reveal delay={300} y={40}>
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 3000); }}
              className="glass-card" style={{ padding: 28 }}>
              <div className="d-display" style={{ fontStyle: "italic", fontSize: 26, marginBottom: 18 }}>
                {t.contact.send}
              </div>
              <input className="glass-input" placeholder={t.contact.name} style={{ marginBottom: 12 }} />
              <input className="glass-input" placeholder={t.contact.email} style={{ marginBottom: 12 }} />
              <textarea className="glass-input" placeholder={t.contact.msg} rows={5} style={{ marginBottom: 16, resize: "none" }} />
              <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} data-no-splash data-cursor="link">
                {sent ? t.contact.sent : t.contact.submit + " →"}
              </button>
            </form>
          </Reveal>

          {/* Three social bubbles per sketch */}
          <Reveal delay={450}>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 22 }}>
              {[
                { n: "Behance", g: "Bē" },
                { n: "Instagram", g: "◎" },
                { n: "LinkedIn", g: "in" },
                { n: "WhatsApp", g: "☎" },
              ].map((s) => (
                <a key={s.n} href="#" data-cursor="link" data-cursor-label={s.n}
                  className="glass-card" style={{
                    width: 60, height: 60, display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: 20,
                    color: "var(--d-ink)", textDecoration: "none", borderRadius: 999,
                  }}>
                  {s.g}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Top-level
// ─────────────────────────────────────────────────────────────
function DreamyVariant({ lang, setLang, theme, setTheme, accent }) {
  const t = STRINGS[lang];
  const [page, setPage] = React.useState({ name: "home" });
  const [openMega, setOpenMega] = React.useState(null); // 'design' | 'art' | null
  const [scrollY, setScrollY] = React.useState(0);
  const rootRef = React.useRef(null);

  React.useEffect(() => {
    const onS = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onS, { passive: true });
    onS();
    return () => window.removeEventListener("scroll", onS);
  }, []);

  React.useEffect(() => {
    const handler = (e) => {
      const { page: p, kind, catKey } = e.detail;
      if (p === "sub") setPage({ name: "sub", kind, catKey });
      else setPage({ name: p });
      window.scrollTo({ top: 0, behavior: "instant" });
      setOpenMega(null);
    };
    window.addEventListener("__nav", handler);
    return () => window.removeEventListener("__nav", handler);
  }, []);

  const goto = (name, kind, catKey) => {
    if (name === "sub") setPage({ name, kind, catKey });
    else setPage({ name });
    window.scrollTo({ top: 0, behavior: "instant" });
    setOpenMega(null);
  };

  return (
    <div className={"dreamy-root" + (theme === "dark" ? " is-dark" : "")} style={{ "--accent": accent }} ref={rootRef}>
      <style>{dreamyStyles}</style>

      {/* Header */}
      <header className="nav-bar">
        <div onClick={() => goto("home")} data-cursor="link">
          <span className="logo">
            <span className="d-display" style={{ fontStyle: "italic" }}>Carolina</span>
            <span style={{ fontFamily: "Montserrat", fontWeight: 200, fontSize: 14, letterSpacing: ".15em", textTransform: "uppercase" }}>Rivera</span>
            <span className="dot" />
          </span>
        </div>

        <nav className="nav-center">
          {[
            ["home", t.nav.home, false],
            ["design", t.nav.design, true],
            ["art", t.nav.art, true],
            ["contact", t.nav.contact, false],
          ].map(([k, l, hasMega]) => (
            <button key={k}
              className={"nav-link" + (page.name === k || (page.name === "sub" && page.kind === k) ? " active" : "")}
              onClick={() => {
                if (hasMega) setOpenMega(openMega === k ? null : k);
                else goto(k);
              }}
              onMouseEnter={() => hasMega && setOpenMega(k)}
              data-cursor="link">
              {l}{hasMega && <span style={{ marginLeft: 6, fontSize: 9, opacity: .6 }}>▾</span>}
            </button>
          ))}
        </nav>

        <div className="nav-right" style={{ display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center" }}>
          <div style={{
            display: "inline-flex", padding: 3, borderRadius: 999,
            background: "rgba(255,255,255,.55)", border: ".5px solid rgba(255,255,255,.7)",
            backdropFilter: "blur(20px) saturate(160%)", WebkitBackdropFilter: "blur(20px) saturate(160%)",
            boxShadow: "0 1px 0 rgba(255,255,255,.7) inset, 0 6px 18px -6px rgba(80,100,180,.18)",
          }}>
            {["en", "es"].map((l) => (
              <button key={l} onClick={() => setLang && setLang(l)} data-cursor="link" data-no-splash
                style={{
                  border: 0, background: lang === l ? "var(--d-ink)" : "transparent",
                  color: lang === l ? "var(--d-bg)" : "var(--d-ink-soft)",
                  padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                  letterSpacing: ".06em", cursor: "pointer", fontFamily: "inherit",
                  transition: "all .2s",
                }}>{l.toUpperCase()}</button>
            ))}
          </div>
          <div style={{
            display: "inline-flex", padding: 3, borderRadius: 999,
            background: "rgba(255,255,255,.55)", border: ".5px solid rgba(255,255,255,.7)",
            backdropFilter: "blur(20px) saturate(160%)", WebkitBackdropFilter: "blur(20px) saturate(160%)",
            boxShadow: "0 1px 0 rgba(255,255,255,.7) inset, 0 6px 18px -6px rgba(80,100,180,.18)",
          }}>
            {[["light", "\u2600"], ["dark", "\u263e"]].map(([k, ic]) => (
              <button key={k} onClick={() => setTheme && setTheme(k)} data-cursor="link" data-no-splash
                style={{
                  border: 0, background: theme === k ? "var(--d-ink)" : "transparent",
                  color: theme === k ? "var(--d-bg)" : "var(--d-ink-soft)",
                  padding: "6px 10px", borderRadius: 999, fontSize: 13, cursor: "pointer",
                  fontFamily: "inherit", transition: "all .2s", lineHeight: 1,
                }}>{ic}</button>
            ))}
          </div>
        </div>
      </header>

      {/* Mega menu */}
      {openMega && (
        <div className="mega" onMouseLeave={() => setOpenMega(null)}>
          <div className="mega-grid">
            {Object.entries(openMega === "design" ? t.designCats : t.artCats).map(([k, v], i) => (
              <button key={k} className="mega-item" data-cursor="link"
                onClick={() => goto("sub", openMega, k)}>
                <span className="mega-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="mega-label"><span className="num">{String(i + 1).padStart(2, "0")}</span>{v.label}</span>
                <span className="mega-blurb">{v.blurb}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pages */}
      <div key={page.name + (page.catKey || "")} className="page in" style={{ paddingTop: page.name === "home" ? 0 : 0 }}>
        {page.name === "home" && (
          <React.Fragment>
            <Hero t={t} accent={accent} scrollY={scrollY} onCTA={(p) => goto(p)} />
            <Marquee items={t.marquee} sep="✦" speed={36} dotColor={accent}
              style={{ color: "var(--d-ink)" }} className="marquee" />
            <PortfolioSection t={t} kind="design" accent={accent} sectionId="design-section"
              onOpen={(p) => {/* could open detail */}}
              onCategory={(c) => goto("sub", "design", c)} />
            <Marquee items={["Studio", "Carolina Rivera", "Bogotá", "Estudio", "Carolina Rivera", "2026"]}
              sep="·" speed={48} className="marquee"
              style={{ color: "var(--d-ink)" }} />
            <PortfolioSection t={t} kind="art" accent={accent} sectionId="art-section"
              onOpen={(p) => {}}
              onCategory={(c) => goto("sub", "art", c)} />
            <Contact t={t} />
          </React.Fragment>
        )}
        {page.name === "design" && (
          <PortfolioSection t={t} kind="design" accent={accent}
            onOpen={() => {}} onCategory={(c) => goto("sub", "design", c)} />
        )}
        {page.name === "art" && (
          <PortfolioSection t={t} kind="art" accent={accent}
            onOpen={() => {}} onCategory={(c) => goto("sub", "art", c)} />
        )}
        {page.name === "contact" && <Contact t={t} />}
        {page.name === "sub" && (
          <Subpage t={t} kind={page.kind} catKey={page.catKey} onBack={() => goto(page.kind)} />
        )}

        <footer style={{ padding: "30px 6vw 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: ".5px solid var(--d-line)", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 12, color: "var(--d-ink-faint)", letterSpacing: ".05em", fontWeight: 500 }}>
            {t.footer.year}
          </div>
          <div style={{ fontSize: 12, color: "var(--d-ink-faint)", letterSpacing: ".05em", fontWeight: 500 }}>
            {t.footer.built} · {t.contact.basedCity}
          </div>
        </footer>
      </div>
    </div>
  );
}

window.DreamyVariant = DreamyVariant;
