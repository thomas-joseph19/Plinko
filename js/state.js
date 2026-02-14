/* ═══════════════════════════════════════════════
   PLINKO∞ — Game State Manager
   ═══════════════════════════════════════════════ */

const SAVE_KEY = 'plinko_infinity_save';

// Default fresh state
function getDefaultState() {
    return {
        // Currencies
        coins: 0,
        gems: 0,
        totalCoinsEarned: 0,
        totalCoinsAllTime: 0,

        // Betting
        currentBet: 1,
        totalCoinsBet: 0,

        // Board
        boardRows: 10,

        // Upgrades (levels)
        upgrades: {
            ballRate: 0,
            dropSpeed: 0,
            ballMultiplier: 0,
            multiBall: 0,
            slotBoost: 0,
            offlineEarnings: 0,
            gemBinMultiplier: 0,
            gemDropRateMultiplier: 1,
            gemEventDurationBonus: 0,
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
        lastDailyChallengeDate: null,
        dailyChallengeProgress: {},
        dailyChallengesClaimed: {},
        challengeProgress: {},

        // Settings
        settings: {
            audioEnabled: true,
            animationsEnabled: true,
            volume: 0.5,
        },

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
        // Force reset if URL has ?reset=true
        if (window.location.search.includes('reset=true')) {
            localStorage.removeItem(SAVE_KEY);
            return false;
        }

        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        const saved = JSON.parse(raw);
        // Merge with defaults to handle new fields
        const defaults = getDefaultState();
        gameState = { ...defaults, ...saved };
        gameState.upgrades = { ...defaults.upgrades, ...(saved.upgrades || {}) };
        gameState.prestigeUpgrades = { ...defaults.prestigeUpgrades, ...(saved.prestigeUpgrades || {}) };
        gameState.challengeProgress = { ...defaults.challengeProgress, ...(saved.challengeProgress || {}) };
        gameState.dailyChallengeProgress = saved.dailyChallengeProgress || {};
        gameState.dailyChallengesClaimed = saved.dailyChallengesClaimed || {};
        gameState.lastDailyChallengeDate = saved.lastDailyChallengeDate || null;
        gameState.settings = { ...defaults.settings, ...(saved.settings || {}) };
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

// Ball Rate: each level makes drops 25% faster
function getDropInterval() {
    const base = CONFIG.BASE_DROP_INTERVAL;
    const level = gameState.upgrades.ballRate || 0;
    const gemMult = gameState.upgrades.gemDropRateMultiplier || 1;
    const interval = (base * Math.pow(0.75, level)) / gemMult;
    return Math.max(CONFIG.MIN_DROP_INTERVAL, interval);
}

// Drop Speed: increases ball fall velocity
function getDropSpeedMultiplier() {
    const level = gameState.upgrades.dropSpeed || 0;
    return 1 + level * 0.10; // +10% per level
}

// Ball Multiplier: chance for 10x golden ball (base 1%, +0.8% per level, cap 25%)
function getLuckyBallChance() {
    const level = gameState.upgrades.ballMultiplier || 0;
    return Math.min(0.25, 0.01 + level * 0.008);
}

// Multi-Ball: chance to split on peg hit (1% per level, cap 30%)
function getMultiBallChance() {
    const level = gameState.upgrades.multiBall || 0;
    return Math.min(0.30, level * 0.01);
}

// Slot Boost: +1% payout per level
// Slot Boost: +5% compounded per level (1.05^level)
function getSlotBoostMultiplier() {
    const level = gameState.upgrades.slotBoost || 0;
    return Math.pow(1.05, level);
}

// Global multiplier (combines slot boost + prestige + fever)
function getGlobalMultiplier() {
    let mult = 1;

    // Prestige multiplier
    if (gameState.prestigeUpgrades.globalMult) {
        mult *= 1 + (gameState.prestigeUpgrades.globalMult * 0.5);
    }

    // Slot boost
    mult *= getSlotBoostMultiplier();

    // Gem Bin Doubler
    if (gameState.upgrades.gemBinMultiplier) {
        mult *= Math.pow(2, gameState.upgrades.gemBinMultiplier);
    }

    return mult;
}

// Offline rate: base rate * offline efficiency * (1 + offlineEarnings level * 0.01)
function getOfflineRate() {
    const baseRate = getCoinsPerSecond();
    const level = gameState.upgrades.offlineEarnings || 0;
    const efficiency = CONFIG.OFFLINE_EFFICIENCY * (1 + level * 0.01);
    return baseRate * Math.min(efficiency, 1.0);
}

// Always 1 dropper, always 1 ball per drop (no longer upgradeable)
function getDropperCount() {
    return 1;
}

function getBallCount() {
    return 1;
}

function getBoardRows() {
    return CONFIG.MIN_ROWS;
}

function getCoinsPerSecond() {
    const interval = getDropInterval();
    const droppers = getDropperCount();
    const ballsPerDrop = getBallCount();
    const dropsPerSec = (1000 / interval) * droppers;
    const ballsPerSec = dropsPerSec * ballsPerDrop;

    // Average multiplier across slots
    const rows = getBoardRows();
    const multipliers = CONFIG.SLOT_MULTIPLIERS[rows] || CONFIG.SLOT_MULTIPLIERS[10];
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
    lastSlotHit: -1,
    jackpotSlot: -1,
    activeBalls: 0,
    coinPopQueue: [],
    recentCps: [],
    smoothCps: 0,
};
