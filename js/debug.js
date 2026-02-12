
// ── Debug Tools ──
function initDebug() {
    const btn = document.getElementById('debugMoneyBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            gameState.coins += 100000;
            gameState.totalCoinsEarned += 100000;
            updateStatsPanel();
            refreshUpgradeUI();

            // Visual feedback
            const originalText = btn.textContent;
            btn.textContent = 'Done! ✅';
            btn.style.background = '#22c55e';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '#ef4444';
            }, 1000);
        });
    }

    const cdBtn = document.getElementById('debugCooldownBtn');
    if (cdBtn) {
        cdBtn.addEventListener('click', () => {
            if (typeof resetEventCooldowns === 'function') resetEventCooldowns();

            // Visual feedback
            const originalText = cdBtn.textContent;
            cdBtn.textContent = 'Reset! ✅';
            cdBtn.style.background = '#22c55e';
            setTimeout(() => {
                cdBtn.textContent = originalText;
                cdBtn.style.background = '#3b82f6';
            }, 1000);
        });
    }
}

// Ensure this is called when the script loads or UI inits
// Since ui.js is just functions, we should probably call this from state.js or wherever init happens.
// Or just run it immediately if defer is used.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDebug);
} else {
    initDebug();
}
