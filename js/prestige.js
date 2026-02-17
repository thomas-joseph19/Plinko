/* ═══════════════════════════════════════════════
   PLINKO∞ — Prestige System
   ═══════════════════════════════════════════════ */

const PRESTIGE_UPGRADES = [
    {
        id: 'globalMult',
        name: 'Global Multiplier',
        icon: '🌟',
        desc: '+50% coin earnings per level',
        maxLevel: 20,
        cost: (lvl) => 1 + lvl * 2,
    },
    {
        id: 'startBalls',
        name: 'Head Start',
        icon: '🎱',
        desc: 'Start with extra ball count levels',
        maxLevel: 5,
        cost: (lvl) => 2 + lvl * 3,
    },
    {
        id: 'costReduction',
        name: 'Discount Master',
        icon: '💸',
        desc: '-8% upgrade costs per level',
        maxLevel: 8,
        cost: (lvl) => 2 + lvl * 2,
    },
    {
        id: 'critBoost',
        name: 'Lucky Strike',
        icon: '⚡',
        desc: 'Critical hits pay 200x instead of 100x',
        maxLevel: 1,
        cost: () => 15,
    },
    {
        id: 'offlineBoost',
        name: 'Night Shift',
        icon: '🌙',
        desc: '+10% offline earning rate per level',
        maxLevel: 5,
        cost: (lvl) => 2 + lvl * 2,
    },
];

// ── Prestige Token Calculation ──
function calculatePrestigeTokens() {
    const earned = gameState.totalCoinsEarned;
    if (earned < CONFIG.PRESTIGE_THRESHOLD) return 0;
    // Base 5 tokens at threshold, scales with coins and prestige level
    return Math.floor(5 * Math.sqrt(earned / CONFIG.PRESTIGE_THRESHOLD) * (1 + gameState.prestigeLevel * 0.2));
}

// ── Can Prestige ──
function canPrestige() {
    return gameState.totalCoinsEarned >= CONFIG.PRESTIGE_THRESHOLD;
}

// ── Perform Prestige ──
function performPrestige() {
    const tokens = calculatePrestigeTokens();
    if (tokens <= 0) return false;

    // Award tokens
    gameState.prestigeTokens += tokens;
    gameState.prestigeLevel++;
    gameState.totalPrestigeCount++;
    gameState.gems += CONFIG.GEM_PRESTIGE_BONUS;

    // Reset progress (keep prestige upgrades, settings, gem upgrades)
    const savedPrestige = { ...gameState.prestigeUpgrades };
    const savedTokens = gameState.prestigeTokens;
    const savedLevel = gameState.prestigeLevel;
    const savedGems = gameState.gems;
    const savedPrestigeCount = gameState.totalPrestigeCount;
    const savedAllTime = gameState.totalCoinsAllTime + gameState.totalCoinsEarned;
    const savedBalls = gameState.totalBallsDropped;
    const savedFever = gameState.feverCount;
    const savedHighCombo = gameState.highestCombo;
    const savedDaily = gameState.dailyStreak;
    const savedLastDaily = gameState.lastDailyClaim;
    const savedSettings = { ...gameState.settings };
    const savedFrenzyTokens = gameState.frenzyTokens || 0;
    const savedGemBin = gameState.upgrades.gemBinMultiplier || 0;
    const savedGemDrop = gameState.upgrades.gemDropRateMultiplier || 1;
    const savedGemEvent = gameState.upgrades.gemEventDurationBonus || 0;

    // Reset to defaults
    const fresh = getDefaultState();
    gameState = fresh;

    // Restore prestige data
    gameState.prestigeUpgrades = savedPrestige;
    gameState.prestigeTokens = savedTokens;
    gameState.prestigeLevel = savedLevel;
    gameState.gems = savedGems;
    gameState.totalPrestigeCount = savedPrestigeCount;
    gameState.totalCoinsAllTime = savedAllTime;
    gameState.totalBallsDropped = savedBalls;
    gameState.feverCount = savedFever;
    gameState.highestCombo = savedHighCombo;
    gameState.dailyStreak = savedDaily;
    gameState.lastDailyClaim = savedLastDaily;
    gameState.settings = savedSettings;
    gameState.frenzyTokens = savedFrenzyTokens;

    // Restore gem shop upgrades (paid with premium currency, shouldn't reset)
    gameState.upgrades.gemBinMultiplier = savedGemBin;
    gameState.upgrades.gemDropRateMultiplier = savedGemDrop;
    gameState.upgrades.gemEventDurationBonus = savedGemEvent;

    // Prestige bonus: start with ball rate levels
    if (savedPrestige.startBalls) {
        gameState.upgrades.ballRate = Math.min(savedPrestige.startBalls, UPGRADES.ballRate.maxLevel);
    }

    // Starting coins: 0 on prestige (you earned prestige tokens instead)
    gameState.coins = 0;

    saveGame();
    return true;
}

// ── Buy Prestige Upgrade ──
function buyPrestigeUpgrade(upgradeId) {
    const pu = PRESTIGE_UPGRADES.find(u => u.id === upgradeId);
    if (!pu) return false;

    const currentLevel = gameState.prestigeUpgrades[upgradeId] || 0;
    if (currentLevel >= pu.maxLevel) return false;

    const cost = pu.cost(currentLevel);
    if (gameState.prestigeTokens < cost) return false;

    gameState.prestigeTokens -= cost;
    gameState.prestigeUpgrades[upgradeId] = currentLevel + 1;

    saveGame();
    return true;
}
