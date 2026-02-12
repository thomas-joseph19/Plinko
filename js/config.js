/* ═══════════════════════════════════════════════
   PLINKO∞ — Game Configuration & Constants
   ═══════════════════════════════════════════════ */

const CONFIG = {
  // ── Physics ──
  GRAVITY: 1.2,
  BALL_RADIUS: 6,
  PEG_RADIUS: 4,
  BALL_RESTITUTION: 0.4,
  BALL_FRICTION: 0.05,
  BALL_DENSITY: 0.002,
  PEG_FRICTION: 0.1,
  WALL_THICKNESS: 10,

  // ── Board ──
  MIN_ROWS: 10,
  MAX_ROWS: 10,
  SLOT_HEIGHT: 48,
  BOARD_PADDING_TOP: 0.06,    // % of board height
  BOARD_PADDING_BOTTOM: 0.12, // % of board height (for slots)
  BOARD_PADDING_SIDE: 0.08,   // % of board width

  // ── Timing ──
  BASE_DROP_INTERVAL: 2000,    // ms between auto drops
  MIN_DROP_INTERVAL: 200,
  SAVE_INTERVAL: 10000,        // auto-save every 10s
  TICK_RATE: 50,               // economy tick every 50ms
  FEVER_DURATION: 15000,       // 15 sec fever mode
  MAX_BALLS_ON_BOARD: 200,

  // ── Economy ──
  BASE_BET: 1,                // Each "1x" pays 1 coin
  SLOT_MULTIPLIERS: {
    // Custom 12-bin layout for 10 rows
    // Pegs end at 11 -> 12 bins
    10: [
      50, 25, 10, 5, 1, 1, 1, 1, 5, 10, 25, 50
    ],
  },

  // ── Prestige ──
  PRESTIGE_THRESHOLD: 100000,   // minimum coins earned to prestige
  PRESTIGE_SCALING: 1.5,

  // ── Offline ──
  MAX_OFFLINE_HOURS: 12,
  OFFLINE_EFFICIENCY: 0.5,     // 50% of online rate

  // ── Fever ──
  FEVER_TRIGGER: 5,            // consecutive high-value hits
  FEVER_MULTIPLIER: 3,

  // ── Gems ──
  GEM_DAILY_BASE: 5,
  GEM_PRESTIGE_BONUS: 10,
};

// Slot type classification
// Slot type classification
function getSlotType(mult) {
  if (mult >= 100) return 'tier-5';
  if (mult >= 25) return 'tier-4';
  if (mult >= 10) return 'tier-3';
  if (mult >= 3) return 'tier-2';
  if (mult >= 1) return 'tier-1';
  return 'tier-0';
}

// Number formatting
function formatNumber(n) {
  if (n >= 1e15) return (n / 1e15).toFixed(2) + 'Q';
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e4) return (n / 1e3).toFixed(1) + 'K';
  if (n >= 1000) return n.toLocaleString();
  if (n % 1 !== 0) return n.toFixed(1);
  return String(Math.floor(n));
}

// Compact number for costs
function formatCost(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(1) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(Math.floor(n));
}
