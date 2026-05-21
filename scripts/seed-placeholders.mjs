// scripts/seed-placeholders.mjs
//
// Generates 8 placeholder project JSONs per category (9 categories × 8 = 72).
// Idempotent: rerun safely; existing 2 Phase-0 stubs (sample.json) are preserved.

// packages
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const contentRoot = join(repoRoot, 'src/content/projects');

// Per-category placeholder slug pools. 8 items each.
const POOLS = {
  'design/branding': [
    { slug: 'aurora-studio',     en: 'Aurora Studio',          es: 'Aurora Studio',           subEn: 'Identity for a residency',          subEs: 'Identidad para una residencia',           role: 'Designer', sectors: ['culture', 'residency'], year: 2025 },
    { slug: 'florería-núcleo',   en: 'Florería Núcleo',        es: 'Florería Núcleo',         subEn: 'Local florist rebrand',             subEs: 'Rediseño para una florería local',        role: 'Designer', sectors: ['retail', 'lifestyle'], year: 2024 },
    { slug: 'maris-coffee',      en: 'Maris Coffee',           es: 'Café Maris',              subEn: 'Specialty coffee brand',            subEs: 'Marca de café de especialidad',           role: 'Designer', sectors: ['food', 'hospitality'], year: 2024 },
    { slug: 'paloma-ceramics',   en: 'Paloma Ceramics',        es: 'Cerámica Paloma',         subEn: 'Studio identity & packaging',       subEs: 'Identidad y empaque del estudio',         role: 'Designer', sectors: ['craft', 'product'], year: 2025 },
    { slug: 'cardumen',          en: 'Cardumen',               es: 'Cardumen',                subEn: 'Editorial collective brand',         subEs: 'Marca de colectivo editorial',            role: 'Designer', sectors: ['publishing', 'culture'], year: 2025 },
    { slug: 'verbena',           en: 'Verbena',                es: 'Verbena',                 subEn: 'Wellness brand identity',           subEs: 'Identidad de marca de bienestar',         role: 'Designer', sectors: ['wellness', 'lifestyle'], year: 2024 },
    { slug: 'ojo-de-agua',       en: 'Ojo de Agua',            es: 'Ojo de Agua',             subEn: 'Sustainable water bottling',         subEs: 'Embotellado de agua sostenible',          role: 'Designer', sectors: ['sustainability', 'product'], year: 2025 },
    { slug: 'volcan-records',    en: 'Volcán Records',         es: 'Volcán Records',          subEn: 'Independent label identity',         subEs: 'Identidad de sello independiente',        role: 'Designer', sectors: ['music', 'culture'], year: 2024 },
  ],
  'design/social-media': [
    { slug: 'fest-2025',         en: 'Fest 2025',              es: 'Fest 2025',               subEn: 'Festival campaign templates',        subEs: 'Plantillas de campaña de festival',       role: 'Designer', sectors: ['events', 'culture'], year: 2025 },
    { slug: 'la-feria',          en: 'La Feria',               es: 'La Feria',                subEn: 'Weekly market posts',                subEs: 'Posts semanales de mercado',              role: 'Designer', sectors: ['retail', 'community'], year: 2024 },
    { slug: 'voces-digitales',   en: 'Voces Digitales',        es: 'Voces Digitales',         subEn: 'Podcast launch series',              subEs: 'Serie de lanzamiento de podcast',         role: 'Designer', sectors: ['media', 'culture'], year: 2025 },
    { slug: 'reels-fall',        en: 'Reels: Fall',            es: 'Reels: Otoño',            subEn: 'Seasonal short-form content',        subEs: 'Contenido corto de temporada',            role: 'Designer', sectors: ['fashion', 'social'], year: 2024 },
    { slug: 'studio-thread',     en: 'Studio Thread',          es: 'Studio Thread',           subEn: 'Process documentation series',       subEs: 'Serie de documentación de proceso',       role: 'Designer', sectors: ['behind-the-scenes', 'culture'], year: 2025 },
    { slug: 'fragmentos',        en: 'Fragmentos',             es: 'Fragmentos',              subEn: 'Editorial micro-stories',            subEs: 'Micro-historias editoriales',             role: 'Designer', sectors: ['publishing', 'social'], year: 2024 },
    { slug: 'open-call-25',      en: 'Open Call 2025',         es: 'Convocatoria 2025',       subEn: 'Submission campaign suite',          subEs: 'Suite de campaña de envío',               role: 'Designer', sectors: ['culture', 'events'], year: 2025 },
    { slug: 'caja-digital',      en: 'Caja Digital',           es: 'Caja Digital',            subEn: 'Boxed Reels series',                 subEs: 'Serie de Reels en formato caja',          role: 'Designer', sectors: ['social', 'experiments'], year: 2024 },
  ],
  'design/ai-designs': [
    { slug: 'liminal',           en: 'Liminal',                es: 'Liminal',                 subEn: 'AI-assisted editorial covers',       subEs: 'Portadas editoriales asistidas por IA',   role: 'Art Director', sectors: ['publishing', 'experimental'], year: 2025 },
    { slug: 'estatura',          en: 'Estatura',               es: 'Estatura',                subEn: 'Generative campaign keyframes',       subEs: 'Keyframes generativos de campaña',        role: 'Art Director', sectors: ['advertising', 'experimental'], year: 2025 },
    { slug: 'eco-portrait',      en: 'Eco Portrait',           es: 'Eco Retrato',             subEn: 'AI portraiture commission',          subEs: 'Encargo de retrato con IA',               role: 'Art Director', sectors: ['portraiture', 'experimental'], year: 2024 },
    { slug: 'campos',            en: 'Campos',                 es: 'Campos',                  subEn: 'Generative landscape series',         subEs: 'Serie generativa de paisajes',            role: 'Art Director', sectors: ['landscape', 'experimental'], year: 2025 },
    { slug: 'velo',              en: 'Velo',                   es: 'Velo',                    subEn: 'Editorial photography retouch',      subEs: 'Retoque fotográfico editorial',           role: 'Image Editor', sectors: ['publishing'], year: 2024 },
    { slug: 'puente',            en: 'Puente',                 es: 'Puente',                  subEn: 'Hybrid AI + photo work',             subEs: 'Trabajo híbrido IA + foto',               role: 'Art Director', sectors: ['hybrid', 'experimental'], year: 2025 },
    { slug: 'noche-larga',       en: 'Long Night',             es: 'Noche Larga',             subEn: 'Album artwork generation',           subEs: 'Generación de portada de álbum',          role: 'Art Director', sectors: ['music'], year: 2024 },
    { slug: 'estanque',          en: 'Estanque',               es: 'Estanque',                subEn: 'Brand story keyframes',              subEs: 'Keyframes de relato de marca',            role: 'Art Director', sectors: ['advertising'], year: 2025 },
  ],
  'design/print': [
    { slug: 'almanaque-2025',    en: 'Almanaque 2025',         es: 'Almanaque 2025',          subEn: 'Yearly almanac design',              subEs: 'Diseño de almanaque anual',               role: 'Designer', sectors: ['publishing'], year: 2025 },
    { slug: 'casa-libro',        en: 'Casa Libro',             es: 'Casa Libro',              subEn: 'Independent press identity',          subEs: 'Identidad de editorial independiente',    role: 'Designer', sectors: ['publishing'], year: 2024 },
    { slug: 'menu-fonda',        en: 'Fonda Menu',             es: 'Menú Fonda',              subEn: 'Restaurant menu system',             subEs: 'Sistema de menús de restaurante',         role: 'Designer', sectors: ['food'], year: 2024 },
    { slug: 'poster-veladas',    en: 'Veladas Poster',         es: 'Cartel Veladas',          subEn: 'Concert poster series',              subEs: 'Serie de carteles de concierto',          role: 'Designer', sectors: ['music', 'culture'], year: 2025 },
    { slug: 'memoria',           en: 'Memoria',                es: 'Memoria',                 subEn: 'Annual report layout',               subEs: 'Maquetación de informe anual',            role: 'Designer', sectors: ['institutional'], year: 2025 },
    { slug: 'mar-libro',         en: 'Mar Libro',              es: 'Mar Libro',               subEn: 'Photo book design',                  subEs: 'Diseño de fotolibro',                     role: 'Designer', sectors: ['publishing', 'photography'], year: 2024 },
    { slug: 'ediciones-pera',    en: 'Ediciones Pera',         es: 'Ediciones Pera',          subEn: 'Catalog series',                     subEs: 'Serie de catálogos',                      role: 'Designer', sectors: ['publishing'], year: 2024 },
    { slug: 'taller-papel',      en: 'Taller Papel',           es: 'Taller Papel',            subEn: 'Workshop printed collateral',         subEs: 'Material impreso de taller',              role: 'Designer', sectors: ['craft', 'culture'], year: 2025 },
  ],
  'design/illustration': [
    { slug: 'siesta',            en: 'Siesta',                 es: 'Siesta',                  subEn: 'Editorial illustration series',      subEs: 'Serie de ilustración editorial',          role: 'Illustrator', sectors: ['editorial'], year: 2024 },
    { slug: 'arroyo',            en: 'Arroyo',                 es: 'Arroyo',                  subEn: 'Children’s book illustrations',  subEs: 'Ilustraciones para libro infantil',       role: 'Illustrator', sectors: ['publishing', 'children'], year: 2025 },
    { slug: 'fauna',              en: 'Fauna',                  es: 'Fauna',                   subEn: 'Field guide illustrations',          subEs: 'Ilustraciones para guía de campo',         role: 'Illustrator', sectors: ['publishing', 'science'], year: 2024 },
    { slug: 'recetario',         en: 'Recetario',              es: 'Recetario',               subEn: 'Cookbook illustration set',           subEs: 'Set de ilustración para recetario',       role: 'Illustrator', sectors: ['publishing', 'food'], year: 2025 },
    { slug: 'cuentos-luna',      en: 'Cuentos Luna',           es: 'Cuentos Luna',            subEn: 'Bedtime story art direction',        subEs: 'Dirección de arte para cuentos',          role: 'Illustrator', sectors: ['publishing', 'children'], year: 2024 },
    { slug: 'dorso',             en: 'Dorso',                  es: 'Dorso',                   subEn: 'Magazine spread illustrations',       subEs: 'Ilustraciones para revista',              role: 'Illustrator', sectors: ['editorial'], year: 2025 },
    { slug: 'vendaval',          en: 'Vendaval',               es: 'Vendaval',                subEn: 'Album cover illustration',           subEs: 'Ilustración de portada de álbum',         role: 'Illustrator', sectors: ['music'], year: 2024 },
    { slug: 'pájaros-rotos',     en: 'Broken Birds',           es: 'Pájaros Rotos',           subEn: 'Personal illustration series',        subEs: 'Serie de ilustración personal',           role: 'Illustrator', sectors: ['personal'], year: 2025 },
  ],
  'design/ui-design': [
    { slug: 'lectura',           en: 'Lectura',                es: 'Lectura',                 subEn: 'Reading app interface',              subEs: 'Interfaz de app de lectura',              role: 'Designer', sectors: ['app', 'reading'], year: 2025 },
    { slug: 'maps-eco',          en: 'Maps Eco',               es: 'Maps Eco',                subEn: 'Sustainable maps redesign',          subEs: 'Rediseño de mapas sostenibles',           role: 'Designer', sectors: ['app', 'sustainability'], year: 2024 },
    { slug: 'studio-portal',     en: 'Studio Portal',          es: 'Studio Portal',           subEn: 'Creative-studio extranet',            subEs: 'Extranet de estudio creativo',            role: 'Designer', sectors: ['web', 'b2b'], year: 2025 },
    { slug: 'agenda',            en: 'Agenda',                 es: 'Agenda',                  subEn: 'Personal scheduling redesign',        subEs: 'Rediseño de agenda personal',             role: 'Designer', sectors: ['app', 'productivity'], year: 2024 },
    { slug: 'librería-mar',      en: 'Librería Mar',           es: 'Librería Mar',            subEn: 'Indie bookshop e-commerce',          subEs: 'E-commerce de librería indie',            role: 'Designer', sectors: ['web', 'retail'], year: 2025 },
    { slug: 'foro-abierto',      en: 'Open Forum',             es: 'Foro Abierto',            subEn: 'Community forum design',             subEs: 'Diseño de foro comunitario',              role: 'Designer', sectors: ['web', 'community'], year: 2024 },
    { slug: 'archivo',           en: 'Archivo',                es: 'Archivo',                 subEn: 'Personal archive interface',          subEs: 'Interfaz de archivo personal',            role: 'Designer', sectors: ['app', 'personal'], year: 2025 },
    { slug: 'galería-tres',      en: 'Galería Tres',           es: 'Galería Tres',            subEn: 'Gallery website',                    subEs: 'Sitio web de galería',                    role: 'Designer', sectors: ['web', 'culture'], year: 2024 },
  ],
  'artwork/drawing': [
    { slug: 'cuaderno-azul',     en: 'Blue Notebook',          es: 'Cuaderno Azul',           subEn: 'Daily ink studies',                  subEs: 'Estudios diarios a tinta',                role: 'Artist', sectors: ['ink', 'study'], year: 2025 },
    { slug: 'manos',             en: 'Hands',                  es: 'Manos',                   subEn: 'Pencil portrait series',             subEs: 'Serie de retratos a lápiz',               role: 'Artist', sectors: ['portrait'], year: 2024 },
    { slug: 'naufragio',         en: 'Naufragio',              es: 'Naufragio',               subEn: 'Mixed-media seascapes',              subEs: 'Marinas en técnica mixta',                role: 'Artist', sectors: ['mixed-media'], year: 2025 },
    { slug: 'sombras',           en: 'Sombras',                es: 'Sombras',                 subEn: 'Charcoal interior studies',          subEs: 'Estudios de interiores a carbón',         role: 'Artist', sectors: ['charcoal', 'interior'], year: 2024 },
    { slug: 'flora-personal',    en: 'Personal Flora',         es: 'Flora Personal',          subEn: 'Botanical pencil sketches',           subEs: 'Bocetos botánicos a lápiz',               role: 'Artist', sectors: ['botanical'], year: 2025 },
    { slug: 'sin-titulo-7',      en: 'Untitled No. 7',         es: 'Sin Título No. 7',        subEn: 'Abstract gesture drawings',           subEs: 'Dibujos gestuales abstractos',            role: 'Artist', sectors: ['abstract'], year: 2024 },
    { slug: 'ventanas',          en: 'Ventanas',               es: 'Ventanas',                subEn: 'Window-light pencil studies',         subEs: 'Estudios de luz de ventana a lápiz',      role: 'Artist', sectors: ['study'], year: 2025 },
    { slug: 'mapa',              en: 'Mapa',                   es: 'Mapa',                    subEn: 'Imaginary cartography',              subEs: 'Cartografía imaginaria',                  role: 'Artist', sectors: ['cartography'], year: 2024 },
  ],
  'artwork/painting': [
    { slug: 'azul-tarde',        en: 'Tarde Azul',             es: 'Tarde Azul',              subEn: 'Watercolor afternoons',              subEs: 'Tardes en acuarela',                      role: 'Artist', sectors: ['watercolor'], year: 2025 },
    { slug: 'arboleda',          en: 'Arboleda',               es: 'Arboleda',                subEn: 'Acrylic forest series',              subEs: 'Serie de bosques en acrílico',            role: 'Artist', sectors: ['acrylic', 'landscape'], year: 2024 },
    { slug: 'patio',             en: 'Patio',                  es: 'Patio',                   subEn: 'Domestic interior paintings',         subEs: 'Pinturas de interiores domésticos',       role: 'Artist', sectors: ['interior'], year: 2025 },
    { slug: 'mar-adentro',       en: 'Mar Adentro',            es: 'Mar Adentro',             subEn: 'Seascape oils',                       subEs: 'Marinas en óleo',                          role: 'Artist', sectors: ['oil', 'seascape'], year: 2025 },
    { slug: 'pomelo',            en: 'Pomelo',                 es: 'Pomelo',                  subEn: 'Still-life pomelo studies',          subEs: 'Naturalezas muertas con pomelo',          role: 'Artist', sectors: ['still-life'], year: 2024 },
    { slug: 'caminos',           en: 'Caminos',                es: 'Caminos',                 subEn: 'Landscape oil series',               subEs: 'Serie de paisajes en óleo',               role: 'Artist', sectors: ['oil', 'landscape'], year: 2025 },
    { slug: 'puerta-amarilla',   en: 'Yellow Door',            es: 'Puerta Amarilla',         subEn: 'Architectural fragments',             subEs: 'Fragmentos arquitectónicos',              role: 'Artist', sectors: ['architecture'], year: 2024 },
    { slug: 'sin-fin',           en: 'Sin Fin',                es: 'Sin Fin',                 subEn: 'Abstract acrylic series',            subEs: 'Serie abstracta en acrílico',             role: 'Artist', sectors: ['abstract'], year: 2025 },
  ],
  'artwork/photography': [
    { slug: 'verano-largo',      en: 'Long Summer',            es: 'Verano Largo',            subEn: 'Summer travel notes',                subEs: 'Notas de viaje de verano',                role: 'Photographer', sectors: ['travel'], year: 2024 },
    { slug: 'cocina',            en: 'Cocina',                 es: 'Cocina',                  subEn: 'Quiet kitchen still-lifes',          subEs: 'Naturalezas muertas tranquilas de cocina', role: 'Photographer', sectors: ['still-life', 'domestic'], year: 2025 },
    { slug: 'callejón',          en: 'Callejón',               es: 'Callejón',                subEn: 'Street photography in CDMX',          subEs: 'Fotografía de calle en CDMX',             role: 'Photographer', sectors: ['street'], year: 2025 },
    { slug: 'manualidades',      en: 'Manualidades',           es: 'Manualidades',            subEn: 'Studio process documentation',        subEs: 'Documentación de proceso en estudio',      role: 'Photographer', sectors: ['process'], year: 2024 },
    { slug: 'olas',              en: 'Olas',                   es: 'Olas',                    subEn: 'Ocean studies',                       subEs: 'Estudios oceánicos',                      role: 'Photographer', sectors: ['nature'], year: 2024 },
    { slug: 'familiar',          en: 'Familiar',               es: 'Familiar',                subEn: 'Portrait of close friends',          subEs: 'Retrato de amistades cercanas',           role: 'Photographer', sectors: ['portrait'], year: 2025 },
    { slug: 'tianguis',          en: 'Tianguis',               es: 'Tianguis',                subEn: 'Open-market photo essay',             subEs: 'Ensayo fotográfico de tianguis',          role: 'Photographer', sectors: ['documentary'], year: 2024 },
    { slug: 'reflejos',          en: 'Reflejos',               es: 'Reflejos',                subEn: 'Reflective surfaces series',          subEs: 'Serie de superficies reflectantes',       role: 'Photographer', sectors: ['abstract', 'experimental'], year: 2025 },
  ],
};

const stringHash = (s) => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
};
const hueFromSlug = (slug) => 200 + (stringHash(slug) % 121);

let written = 0;
let skipped = 0;

for (const [path, items] of Object.entries(POOLS)) {
  const [kind, category] = path.split('/');
  const dir = join(contentRoot, kind, category);
  mkdirSync(dir, { recursive: true });
  items.forEach((item, i) => {
    const seq = String(i + 1).padStart(2, '0');
    const filename = `${seq}-${item.slug}.json`;
    const filepath = join(dir, filename);
    if (existsSync(filepath)) {
      skipped += 1;
      return;
    }
    const hue = hueFromSlug(item.slug);
    const json = {
      slug: item.slug,
      kind,
      category,
      title: { en: item.en, es: item.es },
      subtitle: { en: item.subEn, es: item.subEs },
      studio: 'Independent',
      role: { en: item.role, es: item.role },
      sectors: item.sectors,
      year: item.year,
      cover: `placeholder:hue=${hue}`,
      gallery: [],
    };
    writeFileSync(filepath, JSON.stringify(json, null, 2) + '\n');
    written += 1;
  });
}

console.log(`Wrote ${written} placeholder JSONs (${skipped} already existed and were left alone).`);
