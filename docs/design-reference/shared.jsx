// shared.jsx — i18n strings, custom cursor, paint splash, hooks
// Categories: 6 Design + 3 Artwork. Each has many works.

const STRINGS = {
  en: {
    nav: { home: "Home", design: "Design", art: "Artwork", contact: "Contact" },
    designCats: {
      ui:       { label: "UI Design",                blurb: "Interfaces, products, and quiet systems." },
      social:   { label: "Social Media",             blurb: "Feeds, campaigns, and visual narratives." },
      branding: { label: "Branding",                 blurb: "Identity systems, marks, and worlds." },
      ai:       { label: "AI Designs / Image Editing", blurb: "Composites, retouching, and synthetic imagery." },
      print:    { label: "Print",                    blurb: "Editorial, posters, packaging, books." },
      illu:     { label: "Illustration",             blurb: "Characters, scenes, and storytelling." },
    },
    artCats: {
      draw:  { label: "Drawing",     blurb: "Studies in graphite and ink." },
      paint: { label: "Painting",    blurb: "Oils, acrylics, watercolors." },
      photo: { label: "Photography", blurb: "Light, place, and quiet observation." },
    },
    hero: {
      eyebrow: "Graphic Designer · Visual Artist",
      first: "Carolina",
      last: "Rivera",
      lede:
        "Crafting brands, identities, and quiet objects — somewhere between the page, the screen, and the canvas.",
      cta1: "See the work",
      cta2: "Say hello",
      since: "Independent practice — since 2019",
      scrollHint: "scroll",
    },
    marquee: ["Branding", "Editorial", "Illustration", "Print", "Identity", "Painting", "Photography", "UI Design", "Social", "AI Imaging"],
    sections: {
      designEyebrow: "Design Portfolio · Selected",
      designTitle1: "Things made",
      designTitle2: "for the screen and the page",
      artEyebrow: "Personal Portfolio · Studio",
      artTitle1: "Things made",
      artTitle2: "by hand",
    },
    meta: { studio: "Studio", role: "Role", sectors: "Sectors", year: "Year", open: "View case", drag: "drag · click" },
    contact: {
      eyebrow: "Contact",
      title: "Let's make",
      titleIt: "something",
      l1: "Available for commissions, collaborations, and the occasional impossible idea.",
      l2: "I work with studios, founders, and artists across identity, editorial, and digital product.",
      l3: "Open from May 2026 — write me before the calendar fills.",
      email: "Email",
      based: "Based in",
      basedCity: "Bogotá, COL",
      reply: "Reply within 48h",
      copy: "Copy",
      copied: "Copied",
      send: "Send a message",
      name: "Name",
      msg: "Tell me about it",
      submit: "Send",
      sent: "Thanks — talk soon.",
    },
    footer: { year: "© 2026 Carolina Rivera", built: "Designed & built with care" },
    back: "Back",
    explore: "Explore the case",
  },
  es: {
    nav: { home: "Inicio", design: "Diseño", art: "Arte", contact: "Contacto" },
    designCats: {
      ui:       { label: "Diseño UI",                blurb: "Interfaces, productos y sistemas." },
      social:   { label: "Redes Sociales",           blurb: "Feeds, campañas y narrativas visuales." },
      branding: { label: "Branding",                 blurb: "Identidades, marcas y mundos." },
      ai:       { label: "Diseño con IA / Edición",  blurb: "Composiciones, retoque e imágenes sintéticas." },
      print:    { label: "Impreso",                  blurb: "Editorial, afiches, packaging, libros." },
      illu:     { label: "Ilustración",              blurb: "Personajes, escenas y narrativa." },
    },
    artCats: {
      draw:  { label: "Dibujo",     blurb: "Estudios a grafito y tinta." },
      paint: { label: "Pintura",    blurb: "Óleos, acrílicos y acuarelas." },
      photo: { label: "Fotografía", blurb: "Luz, lugar y observación." },
    },
    hero: {
      eyebrow: "Diseñadora Gráfica · Artista Visual",
      first: "Carolina",
      last: "Rivera",
      lede: "Creando marcas, identidades y objetos silenciosos — entre la página, la pantalla y el lienzo.",
      cta1: "Ver el trabajo",
      cta2: "Saludar",
      since: "Práctica independiente — desde 2019",
      scrollHint: "desliza",
    },
    marquee: ["Branding", "Editorial", "Ilustración", "Imprenta", "Identidad", "Pintura", "Fotografía", "UI", "Redes", "IA"],
    sections: {
      designEyebrow: "Portafolio de Diseño · Selección",
      designTitle1: "Cosas hechas",
      designTitle2: "para la pantalla y la página",
      artEyebrow: "Portafolio Personal · Estudio",
      artTitle1: "Cosas hechas",
      artTitle2: "a mano",
    },
    meta: { studio: "Estudio", role: "Rol", sectors: "Sectores", year: "Año", open: "Ver caso", drag: "arrastra · clic" },
    contact: {
      eyebrow: "Contacto",
      title: "Hagamos",
      titleIt: "algo",
      l1: "Disponible para encargos, colaboraciones y la ocasional idea imposible.",
      l2: "Trabajo con estudios, fundadores y artistas en identidad, editorial y producto digital.",
      l3: "Disponible desde mayo 2026 — escribe antes de que se llene el calendario.",
      email: "Email",
      based: "Basada en",
      basedCity: "Bogotá, COL",
      reply: "Respondo en 48h",
      copy: "Copiar",
      copied: "Copiado",
      send: "Envía un mensaje",
      name: "Nombre",
      msg: "Cuéntame",
      submit: "Enviar",
      sent: "¡Gracias — hablamos pronto!",
    },
    footer: { year: "© 2026 Carolina Rivera", built: "Diseñado y hecho con cuidado" },
    back: "Volver",
    explore: "Explorar el caso",
  },
};

// Each project belongs to a single category. Hue used for placeholder color.
const PROJECTS = {
  // ── Design ──────────────────────────────────────────────────
  ui: [
    { id:"ui1", title:"Hábito Diario",        client:"Hábito",       role:"Product Design", sector:"Wellness · App",        year:"2025", hue:232, glyph:"◐" },
    { id:"ui2", title:"Floto Banking",        client:"Floto",        role:"UI · Design Sys", sector:"Fintech",              year:"2024", hue:210, glyph:"◯" },
    { id:"ui3", title:"Salto Editor",         client:"Editorial Salto", role:"Web App",     sector:"Publishing",           year:"2024", hue:280, glyph:"§" },
    { id:"ui4", title:"Marea Travel",         client:"Marea",        role:"Mobile UI",      sector:"Travel",               year:"2025", hue:198, glyph:"≈" },
    { id:"ui5", title:"Quieto Audio",         client:"Quieto",       role:"Product",        sector:"Audio · Wellness",     year:"2023", hue:262, glyph:"◉" },
    { id:"ui6", title:"Pluma Notes",          client:"Pluma",        role:"UX · UI",        sector:"Productivity",         year:"2024", hue:238, glyph:"✎" },
    { id:"ui7", title:"Sol Calendar",         client:"Sol",          role:"UI",             sector:"Calendar",             year:"2025", hue:38,  glyph:"☀" },
    { id:"ui8", title:"Bruma Maps",           client:"Bruma",        role:"UI · Brand",     sector:"Maps",                 year:"2024", hue:188, glyph:"◇" },
  ],
  social: [
    { id:"s1", title:"Veranillo Campaign",    client:"Heladería Veranillo", role:"Art Direction", sector:"Food · Retail",  year:"2025", hue:32,  glyph:"❀" },
    { id:"s2", title:"Lluvia Magazine",       client:"Revista Lluvia", role:"Social System",   sector:"Editorial",          year:"2024", hue:222, glyph:"❍" },
    { id:"s3", title:"Casa Andina",           client:"Casa Andina",  role:"Content Design", sector:"Hospitality",          year:"2024", hue:14,  glyph:"▲" },
    { id:"s4", title:"Cinema Antigua",        client:"Cinema Antigua", role:"Reels & Stills", sector:"Cinema",             year:"2025", hue:340, glyph:"◐" },
    { id:"s5", title:"Tres Hojas",            client:"Tres Hojas Tea", role:"Identity · Social", sector:"Beverages",       year:"2023", hue:142, glyph:"✦" },
    { id:"s6", title:"Estudio Pez",           client:"Estudio Pez",  role:"Visual System",  sector:"Studio",               year:"2025", hue:192, glyph:"≋" },
  ],
  branding: [
    { id:"b1", title:"Florería Núcleo",       client:"Núcleo",       role:"Brand · Identity", sector:"Retail · Floristry", year:"2025", hue:232, glyph:"✿" },
    { id:"b2", title:"Pan & Sal",             client:"Pan & Sal",    role:"Wordmark · Pack",  sector:"Food",               year:"2023", hue:38,  glyph:"✱" },
    { id:"b3", title:"Cordillera Records",    client:"Cordillera",   role:"Identity",         sector:"Music",              year:"2024", hue:18,  glyph:"▶" },
    { id:"b4", title:"Niebla Ceramics",       client:"Niebla",       role:"Identity · Pack",  sector:"Craft · Retail",     year:"2024", hue:248, glyph:"◯" },
    { id:"b5", title:"Hilo Architects",       client:"Hilo",         role:"Identity",         sector:"Architecture",       year:"2025", hue:24,  glyph:"━" },
    { id:"b6", title:"Sereno Hotels",         client:"Sereno",       role:"Brand System",     sector:"Hospitality",        year:"2024", hue:200, glyph:"◇" },
    { id:"b7", title:"Mesa Compartida",       client:"Mesa",         role:"Identity",         sector:"Restaurant",         year:"2023", hue:8,   glyph:"❍" },
    { id:"b8", title:"Caracol Bookshop",      client:"Caracol",      role:"Brand",            sector:"Retail · Books",     year:"2025", hue:280, glyph:"@" },
  ],
  ai: [
    { id:"ai1", title:"Aurora Composites",    client:"Personal",     role:"AI · Compositing", sector:"Editorial",          year:"2025", hue:262, glyph:"✺" },
    { id:"ai2", title:"Synthetic Botanica",   client:"Personal",     role:"AI Imagery",       sector:"Art Direction",      year:"2025", hue:142, glyph:"❁" },
    { id:"ai3", title:"Retouch — Luz",        client:"Magazine Luz", role:"Retouch",          sector:"Editorial",          year:"2024", hue:18,  glyph:"◐" },
    { id:"ai4", title:"Ghost Architecture",   client:"Personal",     role:"AI · Image",       sector:"Concept",            year:"2025", hue:230, glyph:"▢" },
    { id:"ai5", title:"Estudio Ritual Set",   client:"Estudio Ritual", role:"AI · Photo Edit", sector:"Beauty",            year:"2024", hue:340, glyph:"❀" },
    { id:"ai6", title:"Concept — Submarine",  client:"Personal",     role:"AI Imagery",       sector:"Concept",            year:"2025", hue:200, glyph:"≈" },
  ],
  print: [
    { id:"p1", title:"Revista Lluvia 04",     client:"Lluvia",       role:"Editorial Design", sector:"Magazine",           year:"2025", hue:220, glyph:"❍" },
    { id:"p2", title:"Cuaderno Calma",        client:"Calma",        role:"Book · Print",     sector:"Publishing",         year:"2024", hue:38,  glyph:"§" },
    { id:"p3", title:"Festival Quieto",       client:"Quieto Fest",  role:"Posters",          sector:"Music · Culture",    year:"2024", hue:262, glyph:"▲" },
    { id:"p4", title:"Mesa Menu Cards",       client:"Mesa",         role:"Print Suite",      sector:"Restaurant",         year:"2023", hue:8,   glyph:"❀" },
    { id:"p5", title:"Núcleo Pack",           client:"Núcleo",       role:"Packaging",        sector:"Floristry",          year:"2025", hue:232, glyph:"✿" },
    { id:"p6", title:"Atlas Quieto",          client:"Atlas",        role:"Book Design",      sector:"Publishing",         year:"2024", hue:200, glyph:"◇" },
  ],
  illu: [
    { id:"i1", title:"Bicho Series",          client:"Personal",     role:"Illustration",     sector:"Series",             year:"2025", hue:142, glyph:"✺" },
    { id:"i2", title:"Cuento del Higo",       client:"Editorial Salto", role:"Book Illu",     sector:"Children's Book",    year:"2024", hue:320, glyph:"❀" },
    { id:"i3", title:"Festín",                client:"Personal",     role:"Mixed Media",      sector:"Series",             year:"2025", hue:350, glyph:"❁" },
    { id:"i4", title:"Pez & Anzuelo",         client:"Lluvia",       role:"Editorial Illu",   sector:"Magazine",           year:"2024", hue:192, glyph:"≋" },
    { id:"i5", title:"Frutas",                client:"Personal",     role:"Botanical Illu",   sector:"Series",             year:"2025", hue:28,  glyph:"◐" },
    { id:"i6", title:"Manos / Studies",       client:"Personal",     role:"Studies",          sector:"Studies",            year:"2024", hue:24,  glyph:"✑" },
  ],
  // ── Artwork ─────────────────────────────────────────────────
  draw: [
    { id:"d1", title:"Estudio nº 12",         client:"Studio",       role:"Graphite & Ink",   sector:"Studies",            year:"2024", hue:30,  glyph:"✦" },
    { id:"d2", title:"Manos",                 client:"Studio",       role:"Charcoal",         sector:"Figure",             year:"2024", hue:24,  glyph:"✑" },
    { id:"d3", title:"Cabeza",                client:"Studio",       role:"Graphite",         sector:"Portrait",           year:"2025", hue:18,  glyph:"◉" },
    { id:"d4", title:"Patio",                 client:"Studio",       role:"Ink Wash",         sector:"Landscape",          year:"2023", hue:200, glyph:"≈" },
    { id:"d5", title:"Frutas",                client:"Studio",       role:"Pen",              sector:"Still life",         year:"2024", hue:28,  glyph:"◐" },
    { id:"d6", title:"Sketchbook 04",         client:"Studio",       role:"Mixed",            sector:"Sketchbook",         year:"2025", hue:42,  glyph:"§" },
  ],
  paint: [
    { id:"pt1", title:"Carmesí",              client:"Studio",       role:"Oil on linen",     sector:"Series",             year:"2025", hue:14,  glyph:"▲" },
    { id:"pt2", title:"Higo",                 client:"Studio",       role:"Watercolor",       sector:"Still life",         year:"2025", hue:320, glyph:"❀" },
    { id:"pt3", title:"Naranja",              client:"Studio",       role:"Acrylic",          sector:"Still life",         year:"2025", hue:28,  glyph:"◐" },
    { id:"pt4", title:"Mar Interior",         client:"Studio",       role:"Oil",              sector:"Landscape",          year:"2024", hue:220, glyph:"≈" },
    { id:"pt5", title:"Ventana Sur",          client:"Studio",       role:"Oil",              sector:"Interior",           year:"2024", hue:248, glyph:"◇" },
    { id:"pt6", title:"Fruteros",             client:"Studio",       role:"Acrylic",          sector:"Still life",         year:"2023", hue:38,  glyph:"❍" },
  ],
  photo: [
    { id:"ph1", title:"Ventana",              client:"Studio",       role:"35mm",             sector:"Photo Essay",        year:"2023", hue:200, glyph:"▦" },
    { id:"ph2", title:"Calle Defensa",        client:"Studio",       role:"Series",           sector:"Documentary",        year:"2023", hue:250, glyph:"▣" },
    { id:"ph3", title:"Mediodía",             client:"Studio",       role:"Photo",            sector:"Series",             year:"2024", hue:210, glyph:"◉" },
    { id:"ph4", title:"Lluvia",               client:"Studio",       role:"Photo",            sector:"Series",             year:"2024", hue:232, glyph:"≈" },
    { id:"ph5", title:"Bogotá Norte",         client:"Studio",       role:"Series",           sector:"Documentary",        year:"2025", hue:180, glyph:"▢" },
    { id:"ph6", title:"Verde / Sombra",       client:"Studio",       role:"Photo",            sector:"Series",             year:"2025", hue:142, glyph:"✺" },
  ],
};

// ─────────────────────────────────────────────────────────────
// Custom cursor
// ─────────────────────────────────────────────────────────────
function CustomCursor({ accent = "#7A8FF7", mode = "light" }) {
  const dotRef = React.useRef(null);
  const ringRef = React.useRef(null);
  const [hover, setHover] = React.useState(null);
  const [labelText, setLabelText] = React.useState("");
  const target = React.useRef({ x: -100, y: -100 });
  const pos = React.useRef({ x: -100, y: -100 });
  const ringPos = React.useRef({ x: -100, y: -100 });

  React.useEffect(() => {
    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      const el = e.target.closest && e.target.closest("[data-cursor]");
      if (el) {
        setHover(el.getAttribute("data-cursor"));
        setLabelText(el.getAttribute("data-cursor-label") || "");
      } else {
        setHover(null); setLabelText("");
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  React.useEffect(() => {
    let raf;
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.45;
      pos.current.y += (target.current.y - pos.current.y) * 0.45;
      ringPos.current.x += (target.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (target.current.y - ringPos.current.y) * 0.18;
      if (dotRef.current)
        dotRef.current.style.transform = `translate3d(${pos.current.x}px,${pos.current.y}px,0) translate(-50%,-50%)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px,${ringPos.current.y}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const fg = mode === "dark" ? "#fff" : "#15131a";
  const ringSize = hover === "media" ? 96 : hover === "drag" ? 72 : hover === "link" ? 56 : 28;
  const ringBg = hover === "media" ? accent : "transparent";
  const ringBorder = hover === "media" ? "transparent" : hover === "drag" ? `1.5px dashed ${accent}` : `1.5px solid ${fg}`;
  const dotSize = hover ? 0 : 5;

  return (
    <React.Fragment>
      <div ref={ringRef} style={{
        position: "fixed", left: 0, top: 0, width: ringSize, height: ringSize,
        borderRadius: 999, background: ringBg, border: ringBorder,
        pointerEvents: "none", zIndex: 99998,
        mixBlendMode: hover === "media" ? "normal" : "difference",
        transition: "width .25s cubic-bezier(.2,.8,.2,1), height .25s cubic-bezier(.2,.8,.2,1), background .2s, border .2s",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: 11, fontWeight: 600, letterSpacing: ".04em",
        textTransform: "uppercase", fontFamily: "'Montserrat', sans-serif",
      }}>
        {hover === "media" && labelText ? labelText : ""}
      </div>
      <div ref={dotRef} style={{
        position: "fixed", left: 0, top: 0, width: dotSize, height: dotSize,
        borderRadius: 999, background: fg, pointerEvents: "none",
        zIndex: 99999, mixBlendMode: "difference",
        transition: "width .2s, height .2s",
      }} />
    </React.Fragment>
  );
}

function PaintSplash({ accent = "#7A8FF7" }) {
  const [drops, setDrops] = React.useState([]);
  React.useEffect(() => {
    const onClick = (e) => {
      if (e.target.closest("input,textarea,select,[data-no-splash]")) return;
      const id = Math.random().toString(36).slice(2);
      const colors = [accent, "#A8B5FA", "#D4DCFF", "#C5B8FF", "#9F8CFF"];
      const d = Array.from({ length: 8 }).map((_, i) => ({
        id: id + i, x: e.clientX, y: e.clientY,
        dx: (Math.random() - 0.5) * 140,
        dy: (Math.random() - 0.5) * 140 - 30,
        size: 4 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360,
      }));
      setDrops((s) => [...s, ...d]);
      setTimeout(() => {
        setDrops((s) => s.filter((x) => !d.find((nd) => nd.id === x.id)));
      }, 900);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [accent]);
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99997, overflow: "hidden" }}>
      {drops.map((d) => (
        <span key={d.id} style={{
          position: "absolute", left: d.x, top: d.y,
          width: d.size, height: d.size, background: d.color,
          borderRadius: Math.random() > 0.5 ? "50%" : "30% 70% 70% 30% / 30% 30% 70% 70%",
          transform: `translate(-50%,-50%) rotate(${d.rot}deg)`,
          animation: "splash-fly .9s cubic-bezier(.15,.8,.3,1) forwards",
          "--dx": d.dx + "px", "--dy": d.dy + "px",
        }} />
      ))}
    </div>
  );
}

function useReveal() {
  const ref = React.useRef(null);
  const [v, setV] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setV(true); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, v];
}

function Reveal({ children, delay = 0, y = 24, as: As = "div", style, ...rest }) {
  const [ref, v] = useReveal();
  return (
    <As ref={ref} style={{
      ...style,
      transform: v ? "translate3d(0,0,0)" : `translate3d(0,${y}px,0)`,
      opacity: v ? 1 : 0,
      transition: `transform .9s cubic-bezier(.2,.8,.2,1) ${delay}ms, opacity .9s ease ${delay}ms`,
    }} {...rest}>
      {children}
    </As>
  );
}

function MaskReveal({ children, delay = 0, style, as: As = "span" }) {
  const [ref, v] = useReveal();
  return (
    <As ref={ref} style={{ ...style, display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
      <span style={{
        display: "inline-block",
        transform: v ? "translateY(0)" : "translateY(110%)",
        transition: `transform 1.1s cubic-bezier(.2,.8,.15,1) ${delay}ms`,
      }}>{children}</span>
    </As>
  );
}

function Marquee({ items, sep = "✦", speed = 32, style, dotColor }) {
  const row = (
    <div style={{ display: "flex", gap: 28, alignItems: "center", paddingRight: 28 }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          <span>{it}</span>
          <span style={{ color: dotColor || "currentColor", opacity: 0.6 }}>{sep}</span>
        </React.Fragment>
      ))}
    </div>
  );
  return (
    <div style={{ overflow: "hidden", whiteSpace: "nowrap", ...style }}>
      <div style={{ display: "inline-flex", animation: `marquee-x ${speed}s linear infinite` }}>
        {row}{row}{row}{row}
      </div>
    </div>
  );
}

Object.assign(window, {
  STRINGS, PROJECTS,
  CustomCursor, PaintSplash, Reveal, MaskReveal, Marquee, useReveal,
});
