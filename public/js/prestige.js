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
        id: 'feverExtend',
        name: 'Fever Frenzy',
        icon: '🔥',
        desc: '+5s fever duration per level',
        maxLevel: 5,
        cost: (lvl) => 3 + lvl * 2,
    },
    {
        id: 'offlineBoost',
        name: 'Night Shift',
        icon: '🌙',
        desc: '+10% offline earning rate per level',
        maxLevel: 5,
        cost: (lvl) => 2 + lvl * 2,
    },
    {
        id: 'autoPrestige',
        name: 'Board Themes',
        icon: '🎨',
        desc: 'Unlock unique board visual themes',
        maxLevel: 3,
        cost: (lvl) => 5 + lvl * 5,
    },
];

// ── Prestige Token Calculation ──
function calculatePrestigeTokens() {
    const earned = gameState.totalCoinsEarned;
    if (earned < CONFIG.PRESTIGE_THRESHOLD) return 0;
    // Sqrt-based scaling: more coins = more tokens, but diminishing
    return Math.floor(Math.sqrt(earned / CONFIG.PRESTIGE_THRESHOLD) * (1 + gameState.prestigeLevel * 0.2));
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

    // Reset progress (keep prestige upgrades)
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

    // Prestige bonus: start with ball count levels
    if (savedPrestige.startBalls) {
        gameState.upgrades.ballCount = Math.min(savedPrestige.startBalls, UPGRADES.ballCount.maxLevel);
    }

    // Starting coins scale with prestige
    gameState.coins = 100 * Math.pow(2, savedLevel);

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
