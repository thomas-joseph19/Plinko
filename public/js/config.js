/* ═══════════════════════════════════════════════
   PLINKO∞ — Game Configuration & Constants
   ═══════════════════════════════════════════════ */

const CONFIG = {
  // ── Physics ──
  GRAVITY: 1.2,
  BALL_RADIUS: 6,
  PEG_RADIUS: 4,
  BALL_RESTITUTION: 0.5,
  BALL_FRICTION: 0.02,
  BALL_DENSITY: 0.002,
  PEG_FRICTION: 0.05,
  WALL_THICKNESS: 10,

  // ── Board ──
  MIN_ROWS: 4,
  MAX_ROWS: 16,
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
  BASE_BET: 10,                // base cost/value per ball
  SLOT_MULTIPLIERS: {
    4:  [50, 10, 3, 1, 1, 3, 10, 50],
    5:  [100, 25, 5, 2, 1, 2, 5, 25, 100],
    6:  [100, 25, 10, 3, 1.5, 1, 1.5, 3, 10, 25, 100],
    7:  [200, 50, 10, 5, 2, 1, 1, 1, 2, 5, 10, 50, 200],
    8:  [200, 50, 25, 10, 3, 1.5, 1, 1.5, 3, 10, 25, 50, 200],
    9:  [500, 100, 25, 10, 5, 2, 1, 2, 5, 10, 25, 100, 500],
    10: [500, 100, 50, 25, 10, 3, 1.5, 1, 1.5, 3, 10, 25, 50, 100, 500],
    11: [500, 200, 100, 25, 10, 5, 2, 1, 2, 5, 10, 25, 100, 200, 500],
    12: [1000, 200, 100, 50, 10, 5, 3, 1.5, 1, 1.5, 3, 5, 10, 50, 100, 200, 1000],
    13: [1000, 500, 200, 50, 25, 10, 3, 1.5, 1, 1.5, 3, 10, 25, 50, 200, 500, 1000],
    14: [1000, 500, 200, 100, 25, 10, 5, 2, 1.5, 1, 1.5, 2, 5, 10, 25, 100, 200, 500, 1000],
    15: [2000, 500, 200, 100, 50, 25, 10, 3, 1.5, 1, 1.5, 3, 10, 25, 50, 100, 200, 500, 2000],
    16: [5000, 1000, 500, 200, 100, 25, 10, 5, 2, 1, 2, 5, 10, 25, 100, 200, 500, 1000, 5000],
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
function getSlotType(mult) {
  if (mult >= 100) return 'edge-high';
  if (mult >= 10) return 'mid-high';
  return 'center';
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
