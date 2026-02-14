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

// ── Haptic Feedback (Vibration) ──
function triggerHaptic(type) {
    if (!navigator.vibrate) return;

    // Check if settings allow haptics (assuming audioToggle covers "Sound & Feedback")
    // Or we could add a specific haptic toggle. For now, we'll respect the global "Animations" or "Audio" setting?
    // Let's assume haptics are always on if supported, unless user explicitly disabled (UI needs update later).
    // For now, we'll just run it.

    switch (type) {
        case 'light':
            navigator.vibrate(10); // Very short tick
            break;
        case 'medium':
            navigator.vibrate(25); // Noticeable bump
            break;
        case 'heavy':
            navigator.vibrate([50, 50, 50]); // Double bump
            break;
        case 'success':
            navigator.vibrate([30, 30, 30]);
            break;
        case 'warning':
            navigator.vibrate([50, 100, 50]);
            break;
    }
}

// ── Show Coin Pop on Slot Hit (Floating Text) ──
function showSlotHit(slotIndex, coins, isBig, isCritical) {
    const board = document.getElementById('plinkoBoard');
    const slotEls = document.querySelectorAll('.slot');
    if (!board || !slotEls[slotIndex]) return;

    // Performance limit - strict for small hits, loose for big/crits
    if (!isBig && !isCritical && board.childElementCount > 150) return;

    // Throttle small wins unless they are critical
    if (!isBig && !isCritical && coins < 5 && Math.random() > 0.5) return;

    const slotEl = slotEls[slotIndex];
    const boardRect = board.getBoundingClientRect();
    const slotRect = slotEl.getBoundingClientRect();

    const pop = document.createElement('div');
    // Base class
    let className = 'coin-pop';
    let text = '+' + formatNumber(coins);

    // Styling logic
    if (isCritical) {
        className += ' crit'; // CSS needs to define this, or we set style inline
        text = '🔥 +' + formatNumber(coins);
        pop.style.fontSize = '14px';
        pop.style.color = '#FFD740'; // Gold
        pop.style.fontWeight = '800';
        pop.style.textShadow = '0 0 8px rgba(255, 215, 64, 0.8)';
        pop.style.zIndex = '100';
    } else if (isBig) {
        className += ' big';
        pop.style.fontSize = '12px';
        pop.style.color = '#3EE87F'; // Green/Success
        pop.style.fontWeight = '700';
    }

    pop.className = className;
    pop.textContent = text;

    // Center text on slot
    pop.style.left = (slotRect.left - boardRect.left + slotRect.width / 2) + 'px';
    pop.style.top = (slotRect.top - boardRect.top - 12) + 'px'; // Float a bit higher

    board.appendChild(pop);

    // Animation duration depends on importance
    const duration = isCritical ? 1500 : 1000;

    // Use Web Animations API for smoother float if critical
    if (isCritical) {
        pop.animate([
            { transform: 'translate(-50%, 0) scale(0.5)', opacity: 0 },
            { transform: 'translate(-50%, -20px) scale(1.5)', opacity: 1, offset: 0.2 },
            { transform: 'translate(-50%, -80px) scale(1)', opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            fill: 'forwards'
        });
    } else {
        // Fallback to CSS animation 'coinFloat' defined in style.css, but with inline override if needed
        // Since we didn't add .crit styles to CSS, we rely on js inline styles + standard animation
        // We'll leave the standard CSS animation for non-crit
    }

    setTimeout(() => pop.remove(), duration);
}

// ── Fever Mode ──
function triggerFever() {
    if (runtimeState.feverActive) return;

    runtimeState.feverActive = true;
    runtimeState.consecutiveHighHits = 0;
    gameState.feverCount++;

    const duration = CONFIG.FEVER_DURATION;

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

// ── Confetti Burst (UI Feedback) ──
function spawnConfetti(x, y) {
    const count = 16;
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#FFFFFF', '#A8E6CF'];

    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'confetti';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const velocity = 30 + Math.random() * 80;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        // Use Web Animations API
        el.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: 700 + Math.random() * 500,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            fill: 'forwards'
        });

        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    }
}
