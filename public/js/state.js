/* ═══════════════════════════════════════════════
   PLINKO∞ — Game State Manager
   ═══════════════════════════════════════════════ */

const SAVE_KEY = 'plinko_infinity_save';

// Default fresh state
function getDefaultState() {
    return {
        // Currencies
        coins: 100,
        gems: 0,
        totalCoinsEarned: 0,
        totalCoinsAllTime: 0,

        // Board
        boardRows: 4,

        // Upgrades (levels)
        upgrades: {
            dropSpeed: 0,
            ballCount: 0,
            ballWeight: 0,
            luckyBalls: 0,
            multiBall: 0,
            multiDropper: 0,
            dropAim: 0,
            pegDensity: 0,
            slotBoost: 0,
            magneticPegs: 0,
            bumpers: 0,
            offlineEarn: 0,
            coinMagnet: 0,
            critChance: 0,
            comboMeter: 0,
            boardExpand: 0,
        },

        // Prestige
        prestigeLevel: 0,
        prestigeTokens: 0,
        prestigeUpgrades: {},

        // Stats
        totalBallsDropped: 0,
        totalPrestigeCount: 0,
        highestCombo: 0,
        feverCount: 0,

        // Daily
        dailyStreak: 0,
        lastDailyClaim: null,
        dailyChallenges: [],
        challengeProgress: {},

        // Runtime (not saved)
        lastSaveTime: Date.now(),
        lastOnlineTime: Date.now(),
    };
}

// Active game state
let gameState = getDefaultState();

// ── Save / Load ──
function saveGame() {
    const saveData = { ...gameState };
    saveData.lastSaveTime = Date.now();
    saveData.lastOnlineTime = Date.now();
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    } catch (e) {
        console.warn('Failed to save:', e);
    }
}

function loadGame() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        const saved = JSON.parse(raw);
        // Merge with defaults to handle new fields
        const defaults = getDefaultState();
        gameState = { ...defaults, ...saved };
        gameState.upgrades = { ...defaults.upgrades, ...(saved.upgrades || {}) };
        gameState.prestigeUpgrades = { ...defaults.prestigeUpgrades, ...(saved.prestigeUpgrades || {}) };
        gameState.challengeProgress = { ...defaults.challengeProgress, ...(saved.challengeProgress || {}) };
        return true;
    } catch (e) {
        console.warn('Failed to load save:', e);
        return false;
    }
}

function resetGame() {
    gameState = getDefaultState();
    localStorage.removeItem(SAVE_KEY);
}

// ── Computed Getters ──
function getDropInterval() {
    const base = CONFIG.BASE_DROP_INTERVAL;
    const speedLevel = gameState.upgrades.dropSpeed;
    // Each level reduces interval by 12%
    const interval = base * Math.pow(0.88, speedLevel);
    return Math.max(CONFIG.MIN_DROP_INTERVAL, interval);
}

function getBallCount() {
    return 1 + gameState.upgrades.ballCount;
}

function getDropperCount() {
    return 1 + gameState.upgrades.multiDropper;
}

function getBoardRows() {
    return CONFIG.MIN_ROWS + gameState.upgrades.boardExpand;
}

function getGlobalMultiplier() {
    let mult = 1;

    // Prestige multiplier (stacking)
    if (gameState.prestigeUpgrades.globalMult) {
        mult *= 1 + (gameState.prestigeUpgrades.globalMult * 0.5);
    }

    // Slot boost upgrade
    mult *= 1 + (gameState.upgrades.slotBoost * 0.15);

    // Fever multiplier
    if (runtimeState.feverActive) {
        mult *= CONFIG.FEVER_MULTIPLIER;
    }

    // Combo multiplier
    mult *= getComboMultiplier();

    return mult;
}

function getComboMultiplier() {
    if (gameState.upgrades.comboMeter === 0) return 1;
    const comboLevel = gameState.upgrades.comboMeter;
    const consecutive = runtimeState.consecutiveHits;
    // Each consecutive hit adds (comboLevel * 5)% multiplier, up to 10 stacks
    const stacks = Math.min(consecutive, 10);
    return 1 + (stacks * comboLevel * 0.05);
}

function getCritChance() {
    return gameState.upgrades.critChance * 0.02; // 2% per level
}

function getLuckyBallChance() {
    return gameState.upgrades.luckyBalls * 0.03; // 3% per level
}

function getMultiBallChance() {
    return gameState.upgrades.multiBall * 0.04; // 4% per level
}

function getOfflineRate() {
    const baseRate = getCoinsPerSecond();
    const offlineLevel = gameState.upgrades.offlineEarn;
    const efficiency = CONFIG.OFFLINE_EFFICIENCY + (offlineLevel * 0.05);
    return baseRate * Math.min(efficiency, 1.0);
}

function getCoinsPerSecond() {
    const interval = getDropInterval();
    const droppers = getDropperCount();
    const ballsPerDrop = getBallCount();
    const dropsPerSec = (1000 / interval) * droppers;
    const ballsPerSec = dropsPerSec * ballsPerDrop;

    // Average multiplier across slots
    const rows = getBoardRows();
    const multipliers = CONFIG.SLOT_MULTIPLIERS[rows] || CONFIG.SLOT_MULTIPLIERS[4];
    const avgMult = multipliers.reduce((a, b) => a + b, 0) / multipliers.length;

    return ballsPerSec * CONFIG.BASE_BET * avgMult * getGlobalMultiplier();
}

function getBallsPerSecond() {
    const interval = getDropInterval();
    const droppers = getDropperCount();
    const ballsPerDrop = getBallCount();
    return ((1000 / interval) * droppers * ballsPerDrop);
}

// ── Runtime State (not saved) ──
const runtimeState = {
    feverActive: false,
    feverTimer: null,
    consecutiveHighHits: 0,
    consecutiveHits: 0,
    lastSlotHit: -1,
    comboSlot: -1,
    jackpotSlot: -1,
    activeBalls: 0,
    coinPopQueue: [],
    recentCps: [],
    smoothCps: 0,
};
