/* ═══════════════════════════════════════════════
   PLINKO∞ — Main Game Loop
   ═══════════════════════════════════════════════ */

let lastFrameTime = 0;
let saveTimer = 0;
let uiRefreshTimer = 0;
let cleanupTimer = 0;

// ── Boot sequence ──
function boot() {
    console.log('%c PLINKO∞ ', 'background: linear-gradient(135deg, #c084fc, #38bdf8); color: white; font-size: 18px; font-weight: bold; padding: 8px 16px; border-radius: 8px;');

    // Load saved game
    const hadSave = loadGame();

    // Initialize physics
    initPhysics();

    // Initialize renderer
    initRenderer();

    // Build the board
    rebuildBoard();
    resizeCanvas();

    // Render initial UI
    renderDroppers();
    renderQuickUpgrades();
    renderUpgradesView();
    updateStatsPanel();

    // Initialize interactions
    initTabs();
    initPrestigeButton();
    initManualDrop();

    // Calculate offline earnings
    if (hadSave) {
        calculateOfflineEarnings();
    }

    // Check daily badge
    if (isDailyAvailable()) {
        const badge = document.getElementById('dailyBadge');
        if (badge) { badge.textContent = '!'; badge.style.display = ''; }
    }

    // Start auto-droppers
    startAutoDroppers();

    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        rebuildBoard();
    });

    // Start game loop
    lastFrameTime = performance.now();
    requestAnimationFrame(gameLoop);

    // Periodic save
    setInterval(() => saveGame(), CONFIG.SAVE_INTERVAL);

    // Save on tab close
    window.addEventListener('beforeunload', () => saveGame());

    console.log('Game booted successfully!');
}

// ── Offline earnings calculation ──
function calculateOfflineEarnings() {
    const lastTime = gameState.lastOnlineTime || gameState.lastSaveTime;
    if (!lastTime) return;

    const now = Date.now();
    const elapsed = now - lastTime;
    const minAway = 60000; // must be away 1+ minutes

    if (elapsed < minAway) return;

    const maxMs = CONFIG.MAX_OFFLINE_HOURS * 3600000;
    const clampedElapsed = Math.min(elapsed, maxMs);
    const offlineRate = getOfflineRate();
    const earned = offlineRate * (clampedElapsed / 1000);

    if (earned > 0) {
        gameState.coins += earned;
        gameState.totalCoinsEarned += earned;
        showOfflineEarnings(earned, clampedElapsed);
    }
}

// ── Main game loop ──
function gameLoop(timestamp) {
    const delta = Math.min(timestamp - lastFrameTime, 50);
    lastFrameTime = timestamp;

    // Update physics
    updatePhysics(delta);

    // Render frame
    renderFrame();

    // Periodic UI updates (every 500ms)
    uiRefreshTimer += delta;
    if (uiRefreshTimer >= 500) {
        uiRefreshTimer = 0;
        updateStatsPanel();
    }

    // Periodic cleanup (every 3s)
    cleanupTimer += delta;
    if (cleanupTimer >= 3000) {
        cleanupTimer = 0;
        cleanupBalls();
        refreshUpgradeUI();
    }

    requestAnimationFrame(gameLoop);
}

// ── Start the game when DOM is ready ──
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
