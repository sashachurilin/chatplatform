export interface ChatWallpaper {
  id: string
  name: string
  category: 'classic' | 'patterns' | 'gradients' | 'art' | 'colors' | 'custom'
  type: 'default' | 'pattern' | 'gradient' | 'image' | 'color'
  value: string // CSS color, gradient string, data URL or image URL
  bgColor?: string // Base background color or subtle gradient for pattern
  patternSize?: string // Custom pattern repeat size in full chat view
  thumbnailSize?: string // Pattern repeat size in preview cards
  blur?: number // 0-20
  dim?: number // 0-80 percentage
  thumbnail?: string // Optional custom preview CSS or URL
  tag?: string // Visual category badge (e.g. 'Фирменный', 'Неон', 'Минимал', 'Арт')
}

export type BubbleColorKey = 'classic' | 'emerald' | 'purple' | 'amber' | 'rose' | 'slate' | 'ocean'

export interface BubbleColorConfig {
  id: BubbleColorKey
  name: string
  color: string // Preview dot
  lightBg: string
  darkBg: string
  text: string
  glowClass: string
}

export interface ChatSettings {
  wallpaper: ChatWallpaper
  bubbleColor: BubbleColorKey
  fontSize: '13px' | '14px' | '15px' | '16px'
  sendOnEnter: boolean
}

export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const DOODLE_SVG_PATTERN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <defs>
    <filter id="glow1" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Background Accents (Layer 0) -->
  <g fill="#38bdf8" opacity="0.12">
    <circle cx="90" cy="90" r="16" />
    <circle cx="25" cy="30" r="8" />
    <circle cx="160" cy="140" r="10" />
    <path d="M125 18 C140 18 150 26 150 36 C150 46 140 52 130 52 L122 60 L125 52 C115 52 108 46 108 36 C108 26 115 18 125 18 Z" />
  </g>
  <!-- Main Foreground Line-art (Layer 1) -->
  <g fill="none" stroke="#60a5fa" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.75">
    <!-- Paper Airplane -->
    <path d="M18 32 L52 18 L40 54 L28 42 Z M28 42 L52 18" />
    <!-- Speech Bubble -->
    <path d="M125 18 C140 18 150 26 150 36 C150 46 140 52 130 52 L122 60 L125 52 C115 52 108 46 108 36 C108 26 115 18 125 18 Z" />
    <!-- Smiley Face -->
    <circle cx="150" cy="100" r="14" />
    <circle cx="145" cy="96" r="1.5" fill="#60a5fa" />
    <circle cx="155" cy="96" r="1.5" fill="#60a5fa" />
    <path d="M144 104 Q150 110 156 104" />
    <!-- Coffee Cup -->
    <path d="M22 96 L22 116 C22 122 30 122 38 122 C46 122 54 122 54 116 L54 96 Z M54 100 C60 100 60 110 54 110" />
    <path d="M30 88 Q32 82 30 78 M42 88 Q44 82 42 78" />
    <!-- Heart Balloon -->
    <path d="M90 90 C84 78, 68 82, 68 94 C68 110, 90 122, 90 122 C90 122, 112 110, 112 94 C112 82, 96 78, 90 90 Z" />
    <!-- Rocket -->
    <path d="M145 145 C145 145 162 140 162 158 C144 158 150 140 150 140 Z" />
    <path d="M148 147 L140 155 M159 155 L162 165" />
    <!-- Starbursts & Micro-details -->
    <polygon points="90,20 93,29 102,29 95,35 97,44 90,38 83,44 85,35 78,29 87,29" fill="#93c5fd" fill-opacity="0.3" />
    <path d="M35 155 L35 167 M29 161 L41 161" />
    <path d="M100 155 Q106 150 112 155 T124 155" />
  </g>
  <!-- Micro Star Highlights (Layer 2) -->
  <g fill="#93c5fd" opacity="0.85">
    <circle cx="70" cy="55" r="2" />
    <circle cx="170" cy="50" r="1.5" />
    <circle cx="15" cy="150" r="2" />
    <circle cx="120" cy="130" r="1.5" />
  </g>
</svg>
`.trim())

// 2. Deep Cosmos & Constellations (Violet, Indigo & Starlight)
export const SPACE_SVG_PATTERN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
  <!-- Glowing Nebulae -->
  <g fill="#818cf8" opacity="0.12">
    <circle cx="45" cy="45" r="24" />
    <circle cx="125" cy="115" r="20" />
  </g>
  <!-- Constellation Lines -->
  <g fill="none" stroke="#a5b4fc" stroke-width="1.6" stroke-linecap="round" opacity="0.75">
    <!-- Saturn Planet -->
    <circle cx="45" cy="45" r="16" />
    <ellipse cx="45" cy="45" rx="28" ry="8" transform="rotate(-24 45 45)" />
    <!-- Crescent Moon -->
    <path d="M135 25 C124 25 116 36 122 47 C110 42 108 28 118 20 C122 17 130 18 135 25 Z" fill="#c084fc" fill-opacity="0.4" />
    <!-- Constellation Geometry -->
    <circle cx="95" cy="95" r="3.5" fill="#a5b4fc" />
    <circle cx="130" cy="85" r="3" fill="#a5b4fc" />
    <circle cx="140" cy="120" r="3.5" fill="#a5b4fc" />
    <circle cx="105" cy="135" r="3" fill="#a5b4fc" />
    <path d="M95 95 L130 85 L140 120 L105 135 Z" stroke-dasharray="3,3" />
    <!-- Orbit Rings -->
    <path d="M25 110 A 20 20 0 0 1 55 135" stroke-dasharray="2,3" />
    <circle cx="25" cy="110" r="2" fill="#a5b4fc" />
    <!-- 4-point Diamond Stars -->
    <path d="M30 115 Q35 122 35 130 Q35 122 40 115 Q35 115 35 108 Q35 115 30 115 Z" fill="#fde047" fill-opacity="0.7" stroke="none" />
    <path d="M145 60 Q148 65 148 70 Q148 65 151 60 Q148 60 148 55 Q148 60 145 60 Z" fill="#fde047" fill-opacity="0.7" stroke="none" />
  </g>
  <!-- Micro Starlight Dots -->
  <g fill="#ffffff" opacity="0.7">
    <circle cx="80" cy="30" r="1.5" />
    <circle cx="15" cy="80" r="1.2" />
    <circle cx="85" cy="150" r="1.5" />
    <circle cx="155" cy="15" r="1" />
  </g>
</svg>
`.trim())

// 3. Matrix & Cyber Terminal (Neon Mint & Code Tokens)
export const CODE_SVG_PATTERN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140">
  <g fill="#34d399" opacity="0.12">
    <rect x="10" y="65" width="48" height="48" rx="8" />
  </g>
  <g fill="none" stroke="#34d399" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.8">
    <!-- Code Brackets -->
    <path d="M15 28 L32 16 M15 28 L32 40" />
    <path d="M60 14 L42 42" stroke="#6ee7b7" stroke-width="2" />
    <path d="M72 16 L88 28 L72 40" />
    <!-- Binary Matrix Tokens -->
    <text x="105" y="32" font-family="ui-monospace, monospace" font-size="14" font-weight="bold" fill="#6ee7b7" stroke="none" opacity="0.9">101</text>
    <!-- Curly Braces Group -->
    <path d="M26 75 C20 75 18 80 18 85 C18 90 22 92 25 95 C22 98 18 100 18 105 C18 110 20 115 26 115" />
    <path d="M48 75 C54 75 56 80 56 85 C56 90 52 92 49 95 C52 98 56 100 56 105 C56 110 54 115 48 115" />
    <text x="30" y="99" font-family="ui-monospace, monospace" font-size="11" font-weight="bold" fill="#34d399" stroke="none">dev</text>
    <!-- Terminal Prompt & Logic -->
    <path d="M80 80 L95 90 L80 100" stroke="#10b981" stroke-width="2" />
    <line x1="102" y1="100" x2="114" y2="100" stroke="#10b981" stroke-width="2.5" />
    <text x="85" y="125" font-family="ui-monospace, monospace" font-size="12" font-weight="bold" fill="#34d399" stroke="none">fn()</text>
    <circle cx="70" cy="60" r="2.5" fill="#6ee7b7" />
    <circle cx="125" cy="70" r="2.5" fill="#6ee7b7" />
  </g>
</svg>
`.trim())

// 4. Cybernetic PCB & Microchip (High-Tech Sky Blue)
export const CIRCUIT_SVG_PATTERN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <!-- Glowing Chip Core -->
  <rect x="85" y="80" width="22" height="22" rx="4" fill="#0284c7" fill-opacity="0.3" stroke="#38bdf8" stroke-width="1.8" />
  <rect x="91" y="86" width="10" height="10" rx="2" fill="#38bdf8" fill-opacity="0.5" />
  <!-- Circuit Traces & Nodes -->
  <g fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" opacity="0.8">
    <path d="M0 25 H38 V65 H78 V105 H120" />
    <circle cx="38" cy="25" r="4.5" fill="#38bdf8" />
    <circle cx="78" cy="65" r="4.5" fill="#38bdf8" />
    <!-- Secondary Traces -->
    <path d="M120 20 H85 V48 H48" />
    <circle cx="85" cy="20" r="4" fill="#38bdf8" />
    <path d="M15 85 H45 V105" />
    <circle cx="45" cy="85" r="4" fill="#38bdf8" />
    <path d="M60 0 V25" />
    <circle cx="60" cy="25" r="3.5" fill="#38bdf8" />
    <!-- Pin connectors -->
    <path d="M85 86 H75 M85 92 H75 M85 98 H75" />
    <path d="M91 80 V70 M97 80 V70 M103 80 V70" />
  </g>
</svg>
`.trim())

// 5. Retro Arcade & Synthwave (Neon Coral & Violet)
export const GAMING_SVG_PATTERN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
  <g fill="#f43f5e" opacity="0.12">
    <circle cx="105" cy="105" r="20" />
    <rect x="15" y="20" width="50" height="28" rx="8" />
  </g>
  <g fill="none" stroke="#f472b6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.8">
    <!-- Game Controller -->
    <rect x="15" y="20" width="50" height="28" rx="8" />
    <path d="M27 27 V41 M20 34 H34" stroke="#f43f5e" stroke-width="2.2" />
    <circle cx="52" cy="29" r="3" fill="#f43f5e" />
    <circle cx="58" cy="37" r="3" fill="#f43f5e" />
    <!-- 8-Bit Space Invader -->
    <path d="M95 22 H125 V32 H120 V40 H125 V48 H95 V40 H100 V32 H95 Z" fill="#c084fc" fill-opacity="0.3" stroke="#c084fc" />
    <circle cx="103" cy="30" r="2" fill="#ffffff" />
    <circle cx="117" cy="30" r="2" fill="#ffffff" />
    <!-- Pixel Heart -->
    <path d="M22 92 C16 84, 5 90, 5 98 C5 110, 22 120, 22 120 C22 120, 39 110, 39 98 C39 90, 28 84, 22 92 Z" fill="#f43f5e" fill-opacity="0.4" stroke="#f43f5e" stroke-width="2" />
    <!-- Pacman & Power Pellets -->
    <path d="M85 100 A 20 20 0 1 0 114 114 L103 105 Z" fill="#fde047" fill-opacity="0.3" stroke="#fde047" stroke-width="1.8" />
    <circle cx="125" cy="105" r="3" fill="#fde047" stroke="none" />
    <circle cx="137" cy="105" r="3" fill="#fde047" stroke="none" />
  </g>
</svg>
`.trim())

// 6. Sound Waves & Music Studio (Rose & Magenta)
export const MUSIC_SVG_PATTERN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140">
  <g fill="#fb7185" opacity="0.12">
    <circle cx="105" cy="38" r="18" />
  </g>
  <g fill="none" stroke="#fb7185" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.8">
    <!-- Headphones -->
    <path d="M20 38 C20 18 52 18 52 38" stroke-width="2" />
    <rect x="15" y="34" width="11" height="18" rx="4" fill="#fb7185" fill-opacity="0.4" />
    <rect x="46" y="34" width="11" height="18" rx="4" fill="#fb7185" fill-opacity="0.4" />
    <!-- Vinyl Disc -->
    <circle cx="105" cy="38" r="16" />
    <circle cx="105" cy="38" r="6" fill="#fb7185" />
    <!-- Eighth Musical Notes -->
    <path d="M25 110 C25 118 18 121 14 117 C10 114 12 106 18 104 L25 102 V82 L48 76 V98 M48 104 C48 112 41 115 37 111 C33 108 35 100 41 98 L48 96" />
    <polygon points="25,82 48,76 48,84 25,90" fill="#fb7185" />
    <!-- Equalizer Audio Spectrum -->
    <path d="M82 92 V118 M90 84 V126 M98 75 V135 M106 88 V122 M114 96 V114 M122 80 V130" stroke="#f472b6" stroke-width="2.5" />
  </g>
</svg>
`.trim())

// 7. Topographic Contour Elevation (Cyan & Steel Navy)
export const TOPOGRAPHY_SVG_PATTERN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" viewBox="0 0 130 130">
  <g fill="none" stroke="#38bdf8" stroke-width="1.8" opacity="0.7">
    <path d="M-10 20 Q35 5 65 25 T140 15" />
    <path d="M-10 45 Q40 30 75 52 T140 40" stroke="#0284c7" />
    <path d="M-10 75 Q45 58 82 82 T140 70" />
    <path d="M-10 108 Q35 90 70 114 T140 100" stroke="#0284c7" />
    <!-- Elevation Island Contours -->
    <path d="M35 60 C46 48, 62 50, 62 62 C62 74, 50 78, 40 72 C32 66, 30 66, 35 60 Z" fill="#0284c7" fill-opacity="0.15" />
    <path d="M30 60 C44 42, 68 45, 68 62 C68 79, 48 84, 35 78 C25 70, 22 70, 30 60 Z" stroke-dasharray="3,3" />
    <path d="M90 88 C102 76, 120 80, 120 94 C120 108, 106 112, 94 106 C84 100, 82 96, 90 88 Z" fill="#38bdf8" fill-opacity="0.15" />
  </g>
</svg>
`.trim())

// 8. Cyber Honeycomb Hive (Amber Gold & Carbon)
export const HEX_SVG_PATTERN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="92" viewBox="0 0 80 92">
  <g fill="none" stroke="#f59e0b" stroke-width="1.8" opacity="0.75">
    <path d="M40 0 L80 23 V69 L40 92 L0 69 V23 Z" fill="#f59e0b" fill-opacity="0.08" />
    <path d="M40 22 L65 36 V66 L40 80 L15 66 V36 Z" stroke-dasharray="3,3" stroke="#fbbf24" />
    <circle cx="40" cy="46" r="4.5" fill="#f59e0b" />
    <circle cx="0" cy="23" r="3" fill="#fbbf24" />
    <circle cx="80" cy="23" r="3" fill="#fbbf24" />
    <circle cx="0" cy="69" r="3" fill="#fbbf24" />
    <circle cx="80" cy="69" r="3" fill="#fbbf24" />
  </g>
</svg>
`.trim())

// 9. Japanese Waves Seigaiha (Deep Marine & Aqua Crests)
export const SEIGAIHA_SVG_PATTERN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="90" height="45" viewBox="0 0 90 45">
  <g fill="none" stroke="#60a5fa" stroke-width="1.8" opacity="0.75">
    <path d="M0 45 A45 45 0 0 1 90 45" fill="#60a5fa" fill-opacity="0.06" />
    <path d="M10 45 A35 35 0 0 1 80 45" stroke="#93c5fd" />
    <path d="M20 45 A25 25 0 0 1 70 45" />
    <path d="M30 45 A15 15 0 0 1 60 45" stroke="#bfdbfe" />
    <path d="M40 45 A5 5 0 0 1 50 45" />
    <!-- Overlapping Rows -->
    <path d="M-45 45 A45 45 0 0 1 45 45" />
    <path d="M45 45 A45 45 0 0 1 135 45" />
  </g>
</svg>
`.trim())

// 10. Isometric 3D Cubes (Architectural Indigo & Violet)
export const ISOMETRIC_SVG_PATTERN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="60" height="104" viewBox="0 0 60 104">
  <g stroke="#818cf8" stroke-width="1.8" opacity="0.8">
    <path d="M30 0 L60 17.3 V52 L30 34.6 Z" fill="#818cf8" fill-opacity="0.3" />
    <path d="M30 0 L0 17.3 V52 L30 34.6 Z" fill="#818cf8" fill-opacity="0.55" />
    <path d="M30 34.6 L60 52 L30 69.3 L0 52 Z" fill="#818cf8" fill-opacity="0.15" />
    <path d="M30 69.3 L60 86.6 V104 L30 86.6 Z" fill="#818cf8" fill-opacity="0.3" />
    <path d="M30 69.3 L0 86.6 V104 L30 86.6 Z" fill="#818cf8" fill-opacity="0.55" />
  </g>
</svg>
`.trim())

// 11. Botanical Rainforest (Sage, Emerald & Flora)
export const BOTANICAL_SVG_PATTERN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
  <g fill="#22c55e" opacity="0.15">
    <circle cx="35" cy="45" r="22" />
    <circle cx="115" cy="115" r="20" />
  </g>
  <g fill="none" stroke="#4ade80" stroke-width="1.8" stroke-linecap="round" opacity="0.8">
    <!-- Monstera Leaf Silhouette -->
    <path d="M22 55 C12 32, 34 16, 52 28 C64 40, 52 62, 22 55 Z" fill="#22c55e" fill-opacity="0.35" />
    <path d="M22 55 L46 32 M32 46 L27 38 M40 40 L42 32" stroke="#86efac" stroke-width="2" />
    <!-- Palm Fronds Branch -->
    <path d="M95 22 Q120 45 112 75" stroke="#4ade80" stroke-width="2" />
    <path d="M104 32 C112 28 120 32 120 38 C114 42 106 38 104 32 Z" fill="#4ade80" />
    <path d="M110 48 C118 45 126 50 124 56 C118 58 110 54 110 48 Z" fill="#4ade80" />
    <path d="M106 64 C114 62 120 68 118 74 C112 75 106 70 106 64 Z" fill="#4ade80" />
    <!-- Botanical Sprig -->
    <path d="M40 130 C24 112, 40 95, 62 102 C74 118, 56 136, 40 130 Z" fill="#22c55e" fill-opacity="0.3" />
    <path d="M100 100 L130 130 M108 120 L100 130 M120 108 L130 100" stroke="#86efac" stroke-width="2" />
  </g>
</svg>
`.trim())

// 12. Minimalist Blueprint Dots (Precision Cyber Grid)
export const DOTS_SVG_PATTERN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
  <g opacity="0.8">
    <circle cx="18" cy="18" r="3.2" fill="#38bdf8" />
    <circle cx="0" cy="0" r="2" fill="#0284c7" />
    <circle cx="36" cy="0" r="2" fill="#0284c7" />
    <circle cx="0" cy="36" r="2" fill="#0284c7" />
    <circle cx="36" cy="36" r="2" fill="#0284c7" />
    <!-- Micro Crosshairs -->
    <path d="M18 10 V14 M18 22 V26 M10 18 H14 M22 18 H26" stroke="#38bdf8" stroke-width="1.2" stroke-linecap="round" />
  </g>
</svg>
`.trim())

// 13. Memphis Art & Confetti (Playful Neon Shapes)
export const MEMPHIS_SVG_PATTERN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" viewBox="0 0 130 130">
  <g fill="none" stroke="#ec4899" stroke-width="2" stroke-linecap="round" opacity="0.8">
    <!-- Squiggle Wave -->
    <path d="M18 24 Q30 12 42 24 T66 24" stroke="#fbbf24" stroke-width="2.5" />
    <!-- Geometric Triangle -->
    <polygon points="98,18 112,38 84,38" fill="#ec4899" fill-opacity="0.35" stroke="#ec4899" />
    <!-- Target Circles -->
    <circle cx="30" cy="95" r="14" stroke="#38bdf8" />
    <circle cx="30" cy="95" r="4.5" fill="#38bdf8" stroke="none" />
    <!-- Confetti Cross -->
    <path d="M88 88 L112 112 M112 88 L88 112" stroke="#f43f5e" stroke-width="2.5" />
    <!-- Accent Dots -->
    <circle cx="95" cy="60" r="3.5" fill="#fbbf24" stroke="none" />
    <circle cx="42" cy="60" r="3.5" fill="#38bdf8" stroke="none" />
  </g>
</svg>
`.trim())

// 14. Cozy Cafe & Espresso (Warm Caramel & Roasts)
export const COFFEE_SVG_PATTERN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140">
  <g fill="#f59e0b" opacity="0.14">
    <circle cx="100" cy="40" r="18" />
    <rect x="22" y="32" width="36" height="34" rx="8" />
  </g>
  <g fill="none" stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.8">
    <!-- Steaming Coffee Mug -->
    <path d="M22 34 H56 V54 C56 64 46 68 39 68 C32 68 22 64 22 54 Z" fill="#d97706" fill-opacity="0.25" />
    <path d="M56 40 C64 40 64 52 56 52" stroke-width="2" />
    <path d="M30 24 Q33 16 30 12 M39 24 Q42 16 39 12 M48 24 Q51 16 48 12" stroke="#fbbf24" stroke-width="1.8" />
    <!-- Coffee Beans -->
    <ellipse cx="102" cy="40" rx="14" ry="9" transform="rotate(-30 102 40)" fill="#d97706" fill-opacity="0.4" />
    <path d="M96 36 Q102 40 108 44" stroke="#ffffff" stroke-width="1.6" />
    <!-- Croissant -->
    <path d="M28 105 C28 92 48 86 60 95 C66 101 60 116 48 116 C36 116 28 110 28 105 Z" fill="#f59e0b" fill-opacity="0.3" />
    <!-- Takeaway Cup -->
    <path d="M90 90 H120 L114 126 H96 Z M88 90 H122" fill="#d97706" fill-opacity="0.3" stroke-width="2" />
  </g>
</svg>
`.trim())

// 15. Diamond Rhombus Mesh (Crystalline Indigo)
export const DIAMOND_SVG_PATTERN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70">
  <g fill="none" stroke="#60a5fa" stroke-width="1.8" opacity="0.75">
    <path d="M35 0 L70 35 L35 70 L0 35 Z" fill="#60a5fa" fill-opacity="0.08" />
    <path d="M35 12 L58 35 L35 58 L12 35 Z" stroke-dasharray="3,3" stroke="#93c5fd" />
    <circle cx="35" cy="35" r="4.5" fill="#60a5fa" />
    <circle cx="0" cy="35" r="2.5" fill="#93c5fd" />
    <circle cx="70" cy="35" r="2.5" fill="#93c5fd" />
    <circle cx="35" cy="0" r="2.5" fill="#93c5fd" />
    <circle cx="35" cy="70" r="2.5" fill="#93c5fd" />
  </g>
</svg>
`.trim())

// 16. Celestial Stardust & Glimmer (Gold & Stellar Dust)
export const STARDUST_SVG_PATTERN = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <g fill="#fde047" opacity="0.85">
    <!-- 4-point Diamond Starbursts -->
    <path d="M30 18 Q36 30 48 30 Q36 30 30 42 Q24 30 12 30 Q24 30 30 18 Z" />
    <path d="M90 75 Q96 87 108 87 Q96 87 90 99 Q84 87 72 87 Q84 87 90 75 Z" />
    <!-- Little Sparkles & Stars -->
    <circle cx="90" cy="28" r="3" />
    <circle cx="30" cy="90" r="3.5" />
    <circle cx="60" cy="60" r="2.5" />
    <circle cx="102" cy="54" r="2" />
    <circle cx="18" cy="60" r="2" />
  </g>
  <g stroke="#fde047" stroke-width="1.4" stroke-linecap="round" opacity="0.6">
    <path d="M85 28 H95 M90 23 V33" />
    <path d="M25 90 H35 M30 85 V95" />
  </g>
</svg>
`.trim())


export const WALLPAPER_PRESETS: ChatWallpaper[] = [
  {
    id: 'default',
    name: 'Стандартный фон',
    category: 'classic',
    type: 'default',
    value: '',
    thumbnail: 'linear-gradient(to bottom right, #f1f5f9, #e2e8f0)',
    tag: 'Классика',
  },

  {
    id: 'heychat-doodles',
    name: 'HeyChat Дудлы',
    category: 'patterns',
    type: 'pattern',
    value: DOODLE_SVG_PATTERN,
    bgColor: '#0c1b2a',
    patternSize: '160px 160px',
    thumbnailSize: '65px 65px',
    thumbnail: '#0c1b2a',
    tag: 'Фирменный',
  },
  {
    id: 'space-cosmos',
    name: 'Космос и Звёзды',
    category: 'patterns',
    type: 'pattern',
    value: SPACE_SVG_PATTERN,
    bgColor: '#070a16',
    patternSize: '150px 150px',
    thumbnailSize: '60px 60px',
    thumbnail: '#070a16',
    tag: 'Космос',
  },
  {
    id: 'matrix-code',
    name: 'Матрица и Код',
    category: 'patterns',
    type: 'pattern',
    value: CODE_SVG_PATTERN,
    bgColor: '#04150e',
    patternSize: '130px 130px',
    thumbnailSize: '55px 55px',
    thumbnail: '#04150e',
    tag: 'Кодинг',
  },
  {
    id: 'cyber-circuit',
    name: 'Кибернетика',
    category: 'patterns',
    type: 'pattern',
    value: CIRCUIT_SVG_PATTERN,
    bgColor: '#0a1a29',
    patternSize: '110px 110px',
    thumbnailSize: '50px 50px',
    thumbnail: '#0a1a29',
    tag: 'Техно',
  },
  {
    id: 'retro-gaming',
    name: 'Ретро Гейминг',
    category: 'patterns',
    type: 'pattern',
    value: GAMING_SVG_PATTERN,
    bgColor: '#15092a',
    patternSize: '140px 140px',
    thumbnailSize: '60px 60px',
    thumbnail: '#15092a',
    tag: 'Аркада',
  },
  {
    id: 'music-beats',
    name: 'Музыка и Ритм',
    category: 'patterns',
    type: 'pattern',
    value: MUSIC_SVG_PATTERN,
    bgColor: '#1a0d1e',
    patternSize: '130px 130px',
    thumbnailSize: '55px 55px',
    thumbnail: '#1a0d1e',
    tag: 'Музыка',
  },
  {
    id: 'contour-topo',
    name: 'Топография',
    category: 'patterns',
    type: 'pattern',
    value: TOPOGRAPHY_SVG_PATTERN,
    bgColor: '#0b1928',
    patternSize: '120px 120px',
    thumbnailSize: '55px 55px',
    thumbnail: '#0b1928',
    tag: 'Карты',
  },
  {
    id: 'honeycomb-hex',
    name: 'Кибер Соты',
    category: 'patterns',
    type: 'pattern',
    value: HEX_SVG_PATTERN,
    bgColor: '#141417',
    patternSize: '80px 92px',
    thumbnailSize: '40px 46px',
    thumbnail: '#141417',
    tag: 'Геометрия',
  },
  {
    id: 'seigaiha-waves',
    name: 'Японские волны',
    category: 'patterns',
    type: 'pattern',
    value: SEIGAIHA_SVG_PATTERN,
    bgColor: '#0a2038',
    patternSize: '80px 40px',
    thumbnailSize: '40px 20px',
    thumbnail: '#0a2038',
    tag: 'Волны',
  },
  {
    id: 'isometric-cubes',
    name: '3D Кубы',
    category: 'patterns',
    type: 'pattern',
    value: ISOMETRIC_SVG_PATTERN,
    bgColor: '#0f172a',
    patternSize: '60px 104px',
    thumbnailSize: '30px 52px',
    thumbnail: '#0f172a',
    tag: '3D Арт',
  },
  {
    id: 'botanical-flora',
    name: 'Тропический лес',
    category: 'patterns',
    type: 'pattern',
    value: BOTANICAL_SVG_PATTERN,
    bgColor: '#061c13',
    patternSize: '140px 140px',
    thumbnailSize: '60px 60px',
    thumbnail: '#061c13',
    tag: 'Природа',
  },
  {
    id: 'blueprint-dots',
    name: 'Точечная сетка',
    category: 'patterns',
    type: 'pattern',
    value: DOTS_SVG_PATTERN,
    bgColor: '#0e1828',
    patternSize: '36px 36px',
    thumbnailSize: '24px 24px',
    thumbnail: '#0e1828',
    tag: 'Минимал',
  },
  {
    id: 'memphis-confetti',
    name: 'Мемфис Конфетти',
    category: 'patterns',
    type: 'pattern',
    value: MEMPHIS_SVG_PATTERN,
    bgColor: '#1b1744',
    patternSize: '120px 120px',
    thumbnailSize: '55px 55px',
    thumbnail: '#1b1744',
    tag: 'Мемфис',
  },
  {
    id: 'cozy-coffee',
    name: 'Кофейный уют',
    category: 'patterns',
    type: 'pattern',
    value: COFFEE_SVG_PATTERN,
    bgColor: '#1a110a',
    patternSize: '130px 130px',
    thumbnailSize: '55px 55px',
    thumbnail: '#1a110a',
    tag: 'Кофе',
  },
  {
    id: 'diamond-mesh',
    name: 'Алмазная сетка',
    category: 'patterns',
    type: 'pattern',
    value: DIAMOND_SVG_PATTERN,
    bgColor: '#0b1626',
    patternSize: '70px 70px',
    thumbnailSize: '35px 35px',
    thumbnail: '#0b1626',
    tag: 'Кристалл',
  },
  {
    id: 'celestial-stardust',
    name: 'Звёздная пыль',
    category: 'patterns',
    type: 'pattern',
    value: STARDUST_SVG_PATTERN,
    bgColor: '#1b0d30',
    patternSize: '110px 110px',
    thumbnailSize: '50px 50px',
    thumbnail: '#1b0d30',
    tag: 'Золото',
  },

  {
    id: 'aurora',
    name: 'Северное сияние',
    category: 'gradients',
    type: 'gradient',
    value: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    thumbnail: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    tag: 'Аврора',
  },
  {
    id: 'sunset-glow',
    name: 'Закатный бриз',
    category: 'gradients',
    type: 'gradient',
    value: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
    thumbnail: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
    tag: 'Закат',
  },
  {
    id: 'lavender-dream',
    name: 'Лавандовый закат',
    category: 'gradients',
    type: 'gradient',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    thumbnail: 'linear-gradient(135deg, #667eea, #764ba2)',
    tag: 'Лаванда',
  },
  {
    id: 'cyber-neon',
    name: 'Неоновый кибер',
    category: 'gradients',
    type: 'gradient',
    value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    thumbnail: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    tag: 'Неон',
  },
  {
    id: 'emerald-glow',
    name: 'Изумрудная мгла',
    category: 'gradients',
    type: 'gradient',
    value: 'linear-gradient(135deg, #093028 0%, #237a57 100%)',
    thumbnail: 'linear-gradient(135deg, #093028, #237a57)',
    tag: 'Изумруд',
  },
  {
    id: 'ocean-deep',
    name: 'Океанская бездна',
    category: 'gradients',
    type: 'gradient',
    value: 'linear-gradient(135deg, #1cb5e0 0%, #000046 100%)',
    thumbnail: 'linear-gradient(135deg, #1cb5e0, #000046)',
    tag: 'Океан',
  },
  {
    id: 'cosmic-purple',
    name: 'Глубокий космос',
    category: 'gradients',
    type: 'gradient',
    value: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
    thumbnail: 'linear-gradient(135deg, #141e30, #243b55)',
    tag: 'Космос',
  },
  {
    id: 'pastel-candy',
    name: 'Пастельная мечта',
    category: 'gradients',
    type: 'gradient',
    value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    thumbnail: 'linear-gradient(135deg, #a8edea, #fed6e3)',
    tag: 'Пастель',
  },

  {
    id: 'starfield',
    name: 'Звёздное небо',
    category: 'art',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1400&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=80',
    tag: 'Фото',
  },
  {
    id: 'mountain-sunset',
    name: 'Горный хребет',
    category: 'art',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80',
    tag: 'Горы',
  },
  {
    id: 'cyber-city',
    name: 'Ночной мегаполис',
    category: 'art',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=300&q=80',
    tag: 'Город',
  },
  {
    id: 'misty-forest',
    name: 'Туманный лес',
    category: 'art',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=80',
    tag: 'Лес',
  },
  {
    id: 'abstract-wave',
    name: 'Абстрактные волны',
    category: 'art',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1400&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=300&q=80',
    tag: 'Абстракция',
  },

  {
    id: 'solid-slate',
    name: 'Тёмный графит',
    category: 'colors',
    type: 'color',
    value: '#1e293b',
    thumbnail: '#1e293b',
    tag: 'Графит',
  },
  {
    id: 'solid-navy',
    name: 'Глубокий индиго',
    category: 'colors',
    type: 'color',
    value: '#0f172a',
    thumbnail: '#0f172a',
    tag: 'Индиго',
  },
  {
    id: 'solid-warm',
    name: 'Тёплый беж',
    category: 'colors',
    type: 'color',
    value: '#f5f0eb',
    thumbnail: '#f5f0eb',
    tag: 'Беж',
  },
  {
    id: 'solid-emerald',
    name: 'Изумрудный тон',
    category: 'colors',
    type: 'color',
    value: '#064e3b',
    thumbnail: '#064e3b',
    tag: 'Изумруд',
  },
  {
    id: 'solid-ruby',
    name: 'Винный бордо',
    category: 'colors',
    type: 'color',
    value: '#4c0519',
    thumbnail: '#4c0519',
    tag: 'Бордо',
  },
]

export const BUBBLE_COLOR_PRESETS: BubbleColorConfig[] = [
  {
    id: 'classic',
    name: 'HeyChat Синий',
    color: '#69a1c8',
    lightBg: 'bg-[#69a1c8] text-white',
    darkBg: 'bg-[#2b5278] text-white',
    text: 'text-white',
    glowClass: 'ring-blue-400',
  },
  {
    id: 'ocean',
    name: 'Яркий Лазурный',
    color: '#2F80ED',
    lightBg: 'bg-[#2F80ED] text-white',
    darkBg: 'bg-[#1a5fb4] text-white',
    text: 'text-white',
    glowClass: 'ring-sky-400',
  },
  {
    id: 'emerald',
    name: 'Изумрудный',
    color: '#10b981',
    lightBg: 'bg-[#10b981] text-white',
    darkBg: 'bg-[#047857] text-white',
    text: 'text-white',
    glowClass: 'ring-emerald-400',
  },
  {
    id: 'purple',
    name: 'Кибер Фиолетовый',
    color: '#8b5cf6',
    lightBg: 'bg-[#8b5cf6] text-white',
    darkBg: 'bg-[#6d28d9] text-white',
    text: 'text-white',
    glowClass: 'ring-purple-400',
  },
  {
    id: 'rose',
    name: 'Коралловый',
    color: '#f43f5e',
    lightBg: 'bg-[#f43f5e] text-white',
    darkBg: 'bg-[#be123c] text-white',
    text: 'text-white',
    glowClass: 'ring-rose-400',
  },
  {
    id: 'amber',
    name: 'Янтарный',
    color: '#f59e0b',
    lightBg: 'bg-[#f59e0b] text-white',
    darkBg: 'bg-[#b45309] text-white',
    text: 'text-white',
    glowClass: 'ring-amber-400',
  },
  {
    id: 'slate',
    name: 'Стильный Графит',
    color: '#475569',
    lightBg: 'bg-[#475569] text-white',
    darkBg: 'bg-[#334155] text-white',
    text: 'text-white',
    glowClass: 'ring-slate-400',
  },
]

export const DEFAULT_CHAT_SETTINGS: ChatSettings = {
  wallpaper: WALLPAPER_PRESETS[0],
  bubbleColor: 'classic',
  fontSize: '14px',
  sendOnEnter: true,
}
