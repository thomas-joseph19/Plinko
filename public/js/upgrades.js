/* ═══════════════════════════════════════════════
   PLINKO∞ — Upgrade Definitions & Logic
   ═══════════════════════════════════════════════ */

const UPGRADES = {
    // ── Ball Upgrades ──
    dropSpeed: {
        name: '⚡ Drop Speed',
        desc: 'Auto-drop fires faster',
        category: 'ball',
        maxLevel: 50,
        baseCost: 50,
        costScale: 1.35,
        effect: (lvl) => `Drop every ${(CONFIG.BASE_DROP_INTERVAL * Math.pow(0.88, lvl) / 1000).toFixed(2)}s`,
    },
    ballCount: {
        name: '🔮 Ball Count',
        desc: 'Drop more balls per auto-drop',
        category: 'ball',
        maxLevel: 20,
        baseCost: 500,
        costScale: 1.7,
        effect: (lvl) => `${1 + lvl} balls per drop`,
    },
    ballWeight: {
        name: '⚖️ Ball Weight',
        desc: 'Heavier balls bounce toward edges',
        category: 'ball',
        maxLevel: 10,
        baseCost: 2000,
        costScale: 2.0,
        effect: (lvl) => `+${lvl * 10}% edge bias`,
    },
    luckyBalls: {
        name: '🍀 Lucky Balls',
        desc: 'Chance for golden 10x balls',
        category: 'ball',
        maxLevel: 15,
        baseCost: 1000,
        costScale: 1.6,
        effect: (lvl) => `${(lvl * 3)}% chance`,
    },
    multiBall: {
        name: '🌀 Multi-Ball',
        desc: 'Balls split into 2 on peg hit',
        category: 'ball',
        maxLevel: 10,
        baseCost: 8000,
        costScale: 2.2,
        effect: (lvl) => `${(lvl * 4)}% split chance`,
    },

    // ── Dropper Upgrades ──
    multiDropper: {
        name: '🎯 Multi-Dropper',
        desc: 'Add extra dropper units',
        category: 'dropper',
        maxLevel: 5,
        baseCost: 5000,
        costScale: 3.0,
        effect: (lvl) => `${1 + lvl} droppers`,
    },
    dropAim: {
        name: '🧲 Drop Aim',
        desc: 'Target edge zones for bigger risk/reward',
        category: 'dropper',
        maxLevel: 10,
        baseCost: 3000,
        costScale: 1.8,
        effect: (lvl) => `+${lvl * 8}% edge targeting`,
    },

    // ── Board Upgrades ──
    boardExpand: {
        name: '📐 Board Expand',
        desc: 'Add more peg rows for bigger payouts',
        category: 'board',
        maxLevel: 12,
        baseCost: 2000,
        costScale: 2.5,
        effect: (lvl) => `${CONFIG.MIN_ROWS + lvl} rows`,
    },
    slotBoost: {
        name: '💰 Slot Boost',
        desc: 'All slots pay +15% per level',
        category: 'board',
        maxLevel: 20,
        baseCost: 800,
        costScale: 1.5,
        effect: (lvl) => `+${lvl * 15}% payout`,
    },
    magneticPegs: {
        name: '🧲 Magnetic Pegs',
        desc: 'Some pegs pull balls to high slots',
        category: 'board',
        maxLevel: 8,
        baseCost: 10000,
        costScale: 2.0,
        effect: (lvl) => `${lvl * 5}% of pegs magnetic`,
    },
    bumpers: {
        name: '💥 Bumpers',
        desc: 'Pinball bumpers give 2x on hit',
        category: 'board',
        maxLevel: 5,
        baseCost: 15000,
        costScale: 2.5,
        effect: (lvl) => `${lvl} bumpers active`,
    },

    // ── Passive Upgrades ──
    offlineEarn: {
        name: '🌙 Offline Earnings',
        desc: 'Earn more coins while away',
        category: 'passive',
        maxLevel: 10,
        baseCost: 3000,
        costScale: 1.8,
        effect: (lvl) => `${Math.min(100, Math.round((CONFIG.OFFLINE_EFFICIENCY + lvl * 0.05) * 100))}% rate`,
    },
    critChance: {
        name: '💎 Critical Hit',
        desc: 'Balls can pay 100x their slot',
        category: 'passive',
        maxLevel: 15,
        baseCost: 5000,
        costScale: 1.7,
        effect: (lvl) => `${lvl * 2}% chance`,
    },
    comboMeter: {
        name: '🔥 Combo Meter',
        desc: 'Consecutive same-slot hits build multiplier',
        category: 'passive',
        maxLevel: 10,
        baseCost: 4000,
        costScale: 1.9,
        effect: (lvl) => `+${lvl * 5}% per combo`,
    },
    coinMagnet: {
        name: '🧲 Coin Magnet',
        desc: 'Auto-collects coins (pure visual speed)',
        category: 'passive',
        maxLevel: 5,
        baseCost: 1500,
        costScale: 1.6,
        effect: (lvl) => `Level ${lvl} collection`,
    },
};

// ── Cost Calculation ──
function getUpgradeCost(upgradeId) {
    const u = UPGRADES[upgradeId];
    const level = gameState.upgrades[upgradeId] || 0;
    if (level >= u.maxLevel) return Infinity;

    let cost = u.baseCost * Math.pow(u.costScale, level);

    // Prestige cost reduction
    if (gameState.prestigeUpgrades.costReduction) {
        cost *= 1 - (gameState.prestigeUpgrades.costReduction * 0.08);
    }

    return Math.ceil(cost);
}

// ── Purchase ──
function purchaseUpgrade(upgradeId) {
    const u = UPGRADES[upgradeId];
    const level = gameState.upgrades[upgradeId] || 0;
    if (level >= u.maxLevel) return false;

    const cost = getUpgradeCost(upgradeId);
    if (gameState.coins < cost) return false;

    gameState.coins -= cost;
    gameState.upgrades[upgradeId] = level + 1;

    // Board expand triggers board rebuild
    if (upgradeId === 'boardExpand') {
        if (typeof rebuildBoard === 'function') rebuildBoard();
    }

    return true;
}

// ── Check affordability ──
function canAfford(upgradeId) {
    const cost = getUpgradeCost(upgradeId);
    return gameState.coins >= cost;
}

function isMaxed(upgradeId) {
    const u = UPGRADES[upgradeId];
    return (gameState.upgrades[upgradeId] || 0) >= u.maxLevel;
}

// ── Count affordable upgrades ──
function countAffordableUpgrades() {
    let count = 0;
    for (const id in UPGRADES) {
        if (!isMaxed(id) && canAfford(id)) count++;
    }
    return count;
}
