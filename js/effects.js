/* ═══════════════════════════════════════════════
   PLINKO∞ — Visual Effects
   ═══════════════════════════════════════════════ */

// ── Spawn Sparkle on Peg Hit ──
// ── Spawn Sparkle on Peg Hit ──
function spawnSparkle(x, y) {
    // Throttle: only 30% of hits create a visual sparkle to save DOM perf
    if (Math.random() > 0.3) return;

    const board = document.getElementById('plinkoBoard');
    if (!board) return;

    // Hard limit: if too many sparkles, don't add more
    if (board.childElementCount > 100) return;

    const el = document.createElement('div');
    el.className = 'peg-sparkle';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    board.appendChild(el);

    setTimeout(() => el.remove(), 350);
}

// ── Show Coin Pop on Slot Hit ──
function showSlotHit(slotIndex, coins, isBig) {
    // Throttle small wins if many balls are falling
    if (!isBig && coins < 5 && Math.random() > 0.5) return;

    const board = document.getElementById('plinkoBoard');
    const slotEls = document.querySelectorAll('.slot');
    if (!board || !slotEls[slotIndex]) return;

    // Performance limit
    if (board.childElementCount > 150) return;

    const slotEl = slotEls[slotIndex];
    const boardRect = board.getBoundingClientRect();
    const slotRect = slotEl.getBoundingClientRect();

    const pop = document.createElement('div');
    pop.className = 'coin-pop' + (isBig ? ' big' : '');
    pop.textContent = '+' + formatNumber(coins);
    pop.style.left = (slotRect.left - boardRect.left + slotRect.width / 2) + 'px';
    pop.style.top = (slotRect.top - boardRect.top - 8) + 'px';
    board.appendChild(pop);

    setTimeout(() => pop.remove(), 1000);
}

// ── Fever Mode ──
function triggerFever() {
    if (runtimeState.feverActive) return;

    runtimeState.feverActive = true;
    runtimeState.consecutiveHighHits = 0;
    gameState.feverCount++;

    const duration = CONFIG.FEVER_DURATION + (gameState.prestigeUpgrades.feverExtend || 0) * 5000;

    // Banner
    const banner = document.getElementById('feverBanner');
    if (banner) {
        banner.classList.add('show');
        setTimeout(() => banner.classList.remove('show'), 2500);
    }

    // Board glow
    const board = document.getElementById('plinkoBoard');
    if (board) board.classList.add('fever-active');

    // Overlay
    const overlay = document.getElementById('feverOverlay');
    if (overlay) overlay.classList.add('active');

    // Speed up auto-droppers during fever
    stopAutoDroppers();
    startAutoDroppers(); // Will recalculate with fever multiplier active

    // End fever
    runtimeState.feverTimer = setTimeout(() => {
        runtimeState.feverActive = false;
        if (board) board.classList.remove('fever-active');
        if (overlay) overlay.classList.remove('active');
        stopAutoDroppers();
        startAutoDroppers();
    }, duration);
}

// ── Screen Shake (for big wins) ──
function screenShake(intensity) {
    const app = document.getElementById('app');
    if (!app) return;

    const duration = 300;
    const start = Date.now();

    function shakeFrame() {
        const elapsed = Date.now() - start;
        if (elapsed > duration) {
            app.style.transform = '';
            return;
        }

        const progress = elapsed / duration;
        const decay = 1 - progress;
        const x = (Math.random() - 0.5) * intensity * decay;
        const y = (Math.random() - 0.5) * intensity * decay;
        app.style.transform = `translate(${x}px, ${y}px)`;

        requestAnimationFrame(shakeFrame);
    }

    requestAnimationFrame(shakeFrame);
}

// ── Particle Burst (for upgrades/prestige) ──
function particleBurst(x, y, color, count) {
    const board = document.getElementById('plinkoBoard') || document.body;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
      position: absolute;
      width: 4px; height: 4px;
      border-radius: 50%;
      background: ${color};
      box-shadow: 0 0 6px ${color};
      left: ${x}px; top: ${y}px;
      pointer-events: none;
      z-index: 50;
    `;

        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 40 + Math.random() * 60;
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;

        board.appendChild(particle);

        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }
        ], {
            duration: 500 + Math.random() * 300,
            easing: 'ease-out',
            fill: 'forwards'
        });

        setTimeout(() => particle.remove(), 900);
    }
}
