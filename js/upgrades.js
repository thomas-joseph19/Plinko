/* ═══════════════════════════════════════════════
   PLINKO∞ — Upgrade Definitions & Logic
   ═══════════════════════════════════════════════ */

const UPGRADES = {
    // ── Ball Upgrades ──
    ballRate: {
        name: '⚡ Ball Rate',
        desc: 'Auto-drop fires faster',
        category: 'ball',
        maxLevel: 100,
        baseCost: 1000,
        costScale: 1.8,
        effect: (lvl) => `Drop every ${(2000 * Math.pow(0.95, lvl) / 1000).toFixed(2)}s`,
    },
    dropSpeed: {
        name: '🚀 Drop Speed',
        desc: 'Balls fall faster',
        category: 'ball',
        maxLevel: 100,
        baseCost: 1000,
        costScale: 1.8,
        effect: (lvl) => `+${lvl * 5}% fall speed`,
    },
    ballMultiplier: {
        name: '🍀 Ball Multiplier',
        desc: 'Chance for 10× payout balls',
        category: 'ball',
        maxLevel: 100,
        baseCost: 1000,
        costScale: 1.8,
        effect: (lvl) => `${Math.min(15, lvl * 0.5).toFixed(1)}% chance`,
    },
    multiBall: {
        name: '🌀 Multi-Ball',
        desc: 'Balls split chance',
        category: 'ball',
        maxLevel: 100,
        baseCost: 1000,
        costScale: 1.8,
        effect: (lvl) => `${Math.min(25, lvl * 0.5)}% split chance`,
    },

    // ── Board Upgrades ──
    slotBoost: {
        name: '💰 Slot Boost',
        desc: 'All slots pay +2% per level',
        category: 'board',
        maxLevel: 100,
        baseCost: 1000,
        costScale: 1.8,
        effect: (lvl) => `×${Math.pow(1.02, lvl).toFixed(2)} payout`,
    },

    // ── Passive Upgrades ──
    offlineEarnings: {
        name: '🌙 Offline Earnings',
        desc: 'Earn while away',
        category: 'passive',
        maxLevel: 100,
        baseCost: 1000,
        costScale: 1.8,
        effect: (lvl) => `+${lvl * 3}% offline income`,
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
        // Safe cap at 75% reduction to prevent negative costs for high levels
        const reduction = Math.min(0.75, gameState.prestigeUpgrades.costReduction * 0.08);
        cost *= (1 - reduction);
    }

    return Math.max(1, Math.ceil(cost));
}

// ── Purchase ──
function purchaseUpgrade(upgradeId) {
    const u = UPGRADES[upgradeId];
    const level = gameState.upgrades[upgradeId] || 0;
    if (level >= u.maxLevel) return false;

    const cost = getUpgradeCost(upgradeId);
    if (gameState.coins < cost) return false;

    gameState.coins = Math.max(0, gameState.coins - cost);
    gameState.upgrades[upgradeId] = level + 1;

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
