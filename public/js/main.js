/* ═══════════════════════════════════════════════
   PLINKO∞ — Main Game Loop
   ═══════════════════════════════════════════════ */

let lastFrameTime = 0;
let saveTimer = 0;
let uiRefreshTimer = 0;
let cleanupTimer = 0;

<<<<<<< HEAD
=======
// ── Haptic Feedback Support (for mobile devices) ──
window.triggerHaptic = function(type = 'light') {
    if ('vibrate' in navigator) {
        const patterns = {
            light: 10,
            medium: 20,
            heavy: 30,
            success: [10, 50, 10],
            error: [20, 50, 20, 50, 20],
            selection: 5
        };
        navigator.vibrate(patterns[type] || patterns.light);
    }
};

// ── Enhanced Touch Handler (prevents double-tap zoom and improves responsiveness) ──
function setupTouchHandlers() {
    let lastTap = 0;
    let touchStartTime = 0;
    let touchStartY = 0;
    
    // Prevent double-tap zoom
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        const timeSinceLastTap = now - lastTap;
        
        if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        lastTap = now;
    }, { passive: false });
    
    // Prevent pull-to-refresh on iOS Safari
    document.addEventListener('touchstart', (e) => {
        touchStartTime = Date.now();
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Prevent pull-to-refresh when at top of page
        if (scrollTop === 0 && touchY > touchStartY) {
            // Allow scrolling inside scrollable containers
            if (!e.target.closest('.panel-scroll') && 
                !e.target.closest('.side-panel') &&
                !e.target.closest('.tab-bar')) {
                e.preventDefault();
            }
        }
    }, { passive: false });
    
    // Improve touch responsiveness
    document.addEventListener('touchstart', (e) => {
        // Add active class for visual feedback
        if (e.target.classList.contains('upgrade-card') ||
            e.target.classList.contains('tab') ||
            e.target.classList.contains('hud-btn') ||
            e.target.classList.contains('manual-drop-btn')) {
            e.target.classList.add('touch-active');
            triggerHaptic('selection');
        }
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        // Remove active class
        const activeElements = document.querySelectorAll('.touch-active');
        activeElements.forEach(el => el.classList.remove('touch-active'));
    }, { passive: true });
}

>>>>>>> 968190d (Enhance mobile compatibility for all modern devices)
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
<<<<<<< HEAD
=======
    
    // Setup enhanced touch handlers
    setupTouchHandlers();
>>>>>>> 968190d (Enhance mobile compatibility for all modern devices)

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

<<<<<<< HEAD
    // Prevent double-tap zoom on iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
=======
    // Double-tap zoom prevention is now handled in setupTouchHandlers()
>>>>>>> 968190d (Enhance mobile compatibility for all modern devices)

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

