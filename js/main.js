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

    // Apply theme (in case script in head didn’t run) and init settings panel
    if (typeof applyTheme === 'function') applyTheme();
    if (typeof initSettings === 'function') initSettings();

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

    // Hard Reset Handler
    const hardResetBtn = document.getElementById('hardResetBtn');
    if (hardResetBtn) {
        hardResetBtn.addEventListener('click', () => {
            if (confirm('⚠️ HARD RESET ⚠️\n\nThis will permanently delete ALL progress, coins, and prestige levels.\n\nAre you absolutely sure?')) {
                // Remove save listeners to prevent writing back old data during reload
                // Clear all storage
                localStorage.clear();

                // Clear Service Worker Caches
                if ('caches' in window) {
                    caches.keys().then(names => {
                        for (let name of names) caches.delete(name);
                    });
                }

                // Unregister Service Workers
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(registrations => {
                        for (let registration of registrations) registration.unregister();
                    });
                }

                // Force a hard reload with a reset flag
                window.location.href = window.location.origin + window.location.pathname + '?reset=true';
            }
        });
    }

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

    // ═══ iOS-Specific Handlers ═══

    // Prevent iOS context menu / callout on long-press
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Prevent pull-to-refresh and bounce scrolling
    document.addEventListener('touchmove', (e) => {
        // Allow scrolling inside panel-scroll elements
        if (!e.target.closest('.panel-scroll') && !e.target.closest('.side-panel')) {
            e.preventDefault();
        }
    }, { passive: false });

    // Prevent double-tap zoom on iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });

    // Handle app being backgrounded / foregrounded (iOS task switching)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            // App sent to background — save immediately
            gameState.lastOnlineTime = Date.now();
            saveGame();
        } else if (document.visibilityState === 'visible') {
            // App brought back — calculate offline earnings
            calculateOfflineEarnings();
            gameState.lastOnlineTime = Date.now();
            // Restart auto-droppers (timers may have been throttled)
            stopAutoDroppers();
            startAutoDroppers();
            // Rebuild board in case orientation changed
            resizeCanvas();
            rebuildBoard();
        }
    });

    // Handle iOS orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            resizeCanvas();
            rebuildBoard();
        }, 200); // Short delay to let iOS settle the new dimensions
    });

    // Request Wake Lock to prevent screen dimming during gameplay
    requestWakeLock();

    // Start game loop
    lastFrameTime = performance.now();
    requestAnimationFrame(gameLoop);

    // Periodic save
    setInterval(() => saveGame(), CONFIG.SAVE_INTERVAL);

    // Save on tab close
    window.addEventListener('beforeunload', () => saveGame());

    // Also save on page hide (more reliable on iOS)
    window.addEventListener('pagehide', () => saveGame());

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

// ── Wake Lock (prevents screen dimming during gameplay) ──
let wakeLock = null;

async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', () => {
                console.log('Wake Lock released');
            });
            console.log('Wake Lock acquired');
        }
    } catch (err) {
        // Wake lock can fail silently — that's fine
        console.log('Wake Lock not available:', err.message);
    }
}

// Re-acquire wake lock when app comes back to foreground
document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && !wakeLock) {
        await requestWakeLock();
    }
});

