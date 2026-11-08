const TAPE_COLORS = [
  "var(--tape-pink)",
  "var(--tape-blue)",
  "var(--tape-green)",
  "var(--tape-yellow)",
  "var(--tape-lilac)",
];

const STICKER_COLORS = [
  "var(--sticker-pink)",
  "var(--sticker-blue)",
  "var(--sticker-green)",
  "var(--sticker-yellow)",
  "var(--sticker-lilac)",
];

function hashOf(text: string): number {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash;
}

export function tapeColorFor(category: string): string {
  return TAPE_COLORS[hashOf(category) % TAPE_COLORS.length];
}

export function stickerColorFor(category: string): string {
  return STICKER_COLORS[hashOf(category) % STICKER_COLORS.length];
}

export function rotationFor(id: string): string {
  const angle = (hashOf(id) % 5) - 2; // -2deg .. 2deg
  return `rotate(${angle}deg)`;
}

export const STATUS_LABEL: Record<string, string> = {
  QUERO: "quero ✨",
  COMPRADO: "comprado ✓",
  DESISTI: "desisti 💭",
};

export const STATUS_CLASS: Record<string, string> = {
  QUERO: "status-quero",
  COMPRADO: "status-comprado",
  DESISTI: "status-desisti",
};
