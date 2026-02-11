/* ═══════════════════════════════════════════════
   PLINKO∞ — Upgrade Definitions & Logic
   ═══════════════════════════════════════════════ */

const UPGRADES = {
    multiDrop: {
        name: '🔮 Multi-drop',
        desc: 'Drop more balls per click/auto-drop',
        category: 'ball',
        maxLevel: 50,
        baseCost: 50,
        costScale: 1.4,
        effect: (lvl) => `${1 + lvl} balls per drop`,
    },
    pegLayer: {
        name: '📐 New peg layer',
        desc: 'Add more rows of pegs',
        category: 'board',
        maxLevel: 12,
        baseCost: 500,
        costScale: 2.0,
        effect: (lvl) => `${CONFIG.MIN_ROWS + lvl} rows total`,
    },
    offlineEarnings: {
        name: '🌙 Offline earnings',
        desc: 'Earn coins even when the game is closed',
        category: 'passive',
        maxLevel: 20,
        baseCost: 1000,
        costScale: 1.5,
        effect: (lvl) => `${Math.min(100, Math.round((CONFIG.OFFLINE_EFFICIENCY + lvl * 0.05) * 100))}% rate`,
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
