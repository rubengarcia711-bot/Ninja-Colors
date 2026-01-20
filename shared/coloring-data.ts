import type { ColoringPage } from "./schema";

export const NINJA_CHARACTERS = [
  { id: "ninja-1", name: "Shadow Strike", color: "#1a1a2e" },
  { id: "ninja-2", name: "Flame Fist", color: "#e74c3c" },
  { id: "ninja-3", name: "Thunder Bolt", color: "#f1c40f" },
  { id: "ninja-4", name: "Ice Storm", color: "#3498db" },
  { id: "ninja-5", name: "Leaf Dancer", color: "#27ae60" },
];

export const BRAINROT_CHARACTERS = [
  { id: "brainrot-1", name: "Skibidi Boss", color: "#9b59b6" },
  { id: "brainrot-2", name: "Fanum Taxer", color: "#e67e22" },
  { id: "brainrot-3", name: "Rizz Master", color: "#1abc9c" },
  { id: "brainrot-4", name: "Ohio Final Boss", color: "#c0392b" },
  { id: "brainrot-5", name: "Gyatt Lord", color: "#8e44ad" },
];

const createNinjaSvg = (id: string, name: string) => `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <g data-region="${id}-body" fill="none" stroke="#333" stroke-width="3">
    <circle cx="200" cy="120" r="60"/>
    <rect x="150" y="180" width="100" height="120" rx="20"/>
    <line x1="150" y1="220" x2="80" y2="280"/>
    <line x1="250" y1="220" x2="320" y2="280"/>
    <line x1="170" y1="300" x2="150" y2="380"/>
    <line x1="230" y1="300" x2="250" y2="380"/>
  </g>
  <g data-region="${id}-headband" fill="none" stroke="#333" stroke-width="3">
    <rect x="140" y="100" width="120" height="25" rx="5"/>
    <line x1="260" y1="112" x2="300" y2="130"/>
    <line x1="260" y1="112" x2="290" y2="95"/>
  </g>
  <g data-region="${id}-eyes" fill="none" stroke="#333" stroke-width="2">
    <ellipse cx="175" cy="115" rx="15" ry="10"/>
    <ellipse cx="225" cy="115" rx="15" ry="10"/>
  </g>
  <g data-region="${id}-weapon" fill="none" stroke="#333" stroke-width="3">
    <line x1="310" y1="270" x2="360" y2="220"/>
    <polygon points="360,220 370,230 350,250"/>
  </g>
</svg>
`;

const createBrainrotSvg = (id: string, name: string) => `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <g data-region="${id}-head" fill="none" stroke="#333" stroke-width="3">
    <ellipse cx="200" cy="150" rx="80" ry="90"/>
    <circle cx="165" cy="130" r="25"/>
    <circle cx="235" cy="130" r="25"/>
    <path d="M160 180 Q200 220 240 180"/>
  </g>
  <g data-region="${id}-body" fill="none" stroke="#333" stroke-width="3">
    <rect x="130" y="240" width="140" height="100" rx="25"/>
    <line x1="130" y1="280" x2="60" y2="320"/>
    <line x1="270" y1="280" x2="340" y2="320"/>
  </g>
  <g data-region="${id}-legs" fill="none" stroke="#333" stroke-width="3">
    <rect x="150" y="340" width="40" height="50" rx="10"/>
    <rect x="210" y="340" width="40" height="50" rx="10"/>
  </g>
  <g data-region="${id}-accessories" fill="none" stroke="#333" stroke-width="2">
    <path d="M120 80 Q140 40 160 80"/>
    <path d="M240 80 Q260 40 280 80"/>
    <circle cx="165" cy="130" r="8"/>
    <circle cx="235" cy="130" r="8"/>
  </g>
</svg>
`;

const createBattleSvg = (id: string) => `
<svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
  <g data-region="${id}-ninja" fill="none" stroke="#333" stroke-width="3">
    <circle cx="120" cy="150" r="40"/>
    <rect x="90" y="190" width="60" height="80" rx="15"/>
    <line x1="90" y1="220" x2="40" y2="260"/>
    <line x1="150" y1="220" x2="200" y2="180"/>
    <rect x="75" y="135" width="90" height="18" rx="4"/>
  </g>
  <g data-region="${id}-brainrot" fill="none" stroke="#333" stroke-width="3">
    <ellipse cx="380" cy="150" rx="55" ry="60"/>
    <rect x="340" y="210" width="80" height="70" rx="20"/>
    <circle cx="360" cy="135" r="18"/>
    <circle cx="400" cy="135" r="18"/>
    <path d="M355 175 Q380 200 405 175"/>
  </g>
  <g data-region="${id}-action" fill="none" stroke="#333" stroke-width="3">
    <polygon points="200,180 240,200 230,220 190,200"/>
    <polygon points="250,170 270,190 290,170 270,150"/>
    <polygon points="300,200 320,180 340,200 320,220"/>
    <line x1="220" y1="150" x2="280" y2="140" stroke-dasharray="5,5"/>
  </g>
  <g data-region="${id}-effects" fill="none" stroke="#333" stroke-width="2">
    <path d="M160 100 L170 80 L180 100"/>
    <path d="M100 90 L95 70 L110 85"/>
    <circle cx="300" cy="100" r="8"/>
    <circle cx="320" cy="85" r="5"/>
    <path d="M420 100 Q430 80 440 100"/>
  </g>
  <g data-region="${id}-ground" fill="none" stroke="#333" stroke-width="2">
    <line x1="50" y1="350" x2="450" y2="350"/>
    <ellipse cx="120" cy="355" rx="40" ry="8"/>
    <ellipse cx="380" cy="355" rx="50" ry="10"/>
  </g>
</svg>
`;

export const coloringPages: ColoringPage[] = [
  {
    id: "ninja-shadow",
    name: "Shadow Strike",
    category: "ninja",
    svgContent: createNinjaSvg("shadow", "Shadow Strike"),
    thumbnail: "",
    isNew: true,
  },
  {
    id: "ninja-flame",
    name: "Flame Fist",
    category: "ninja",
    svgContent: createNinjaSvg("flame", "Flame Fist"),
    thumbnail: "",
  },
  {
    id: "ninja-thunder",
    name: "Thunder Bolt",
    category: "ninja",
    svgContent: createNinjaSvg("thunder", "Thunder Bolt"),
    thumbnail: "",
  },
  {
    id: "ninja-ice",
    name: "Ice Storm",
    category: "ninja",
    svgContent: createNinjaSvg("ice", "Ice Storm"),
    thumbnail: "",
    isNew: true,
  },
  {
    id: "brainrot-skibidi",
    name: "Skibidi Boss",
    category: "brainrot",
    svgContent: createBrainrotSvg("skibidi", "Skibidi Boss"),
    thumbnail: "",
    isNew: true,
  },
  {
    id: "brainrot-fanum",
    name: "Fanum Taxer",
    category: "brainrot",
    svgContent: createBrainrotSvg("fanum", "Fanum Taxer"),
    thumbnail: "",
  },
  {
    id: "brainrot-rizz",
    name: "Rizz Master",
    category: "brainrot",
    svgContent: createBrainrotSvg("rizz", "Rizz Master"),
    thumbnail: "",
  },
  {
    id: "brainrot-ohio",
    name: "Ohio Final Boss",
    category: "brainrot",
    svgContent: createBrainrotSvg("ohio", "Ohio Final Boss"),
    thumbnail: "",
  },
  {
    id: "battle-epic",
    name: "Epic Showdown",
    category: "battle",
    svgContent: createBattleSvg("epic"),
    thumbnail: "",
    isNew: true,
  },
  {
    id: "battle-clash",
    name: "Ultimate Clash",
    category: "battle",
    svgContent: createBattleSvg("clash"),
    thumbnail: "",
  },
];

export const COLOR_PALETTE = [
  "#e74c3c", "#c0392b", "#9b59b6", "#8e44ad", "#3498db", "#2980b9",
  "#1abc9c", "#16a085", "#27ae60", "#229954", "#f1c40f", "#f39c12",
  "#e67e22", "#d35400", "#ecf0f1", "#bdc3c7", "#95a5a6", "#7f8c8d",
  "#34495e", "#2c3e50", "#1a1a2e", "#000000", "#ffffff", "#ff69b4",
  "#ff1493", "#00ced1", "#7cfc00", "#ffa500", "#ff4500", "#dda0dd",
];

export const BRUSH_SIZES = [4, 8, 12, 16, 24, 32];
