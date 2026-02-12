/* ═══════════════════════════════════════════════
   PLINKO∞ — Canvas Renderer
   ═══════════════════════════════════════════════ */

let ctx;
let canvasW, canvasH, dpr;

function initRenderer() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    dpr = window.devicePixelRatio || 1;
    createBallSprites();
}

// ── Sprite Caching ──
let ballSprite = null;
let luckyBallSprite = null;

function createBallSprites() {
    const r = CONFIG.BALL_RADIUS;
    // Padding to avoid clipping glow
    const size = (r + 4) * 2;

    // 1. Normal Ball Sprite
    ballSprite = document.createElement('canvas');
    ballSprite.width = size;
    ballSprite.height = size;
    const ctx1 = ballSprite.getContext('2d');
    const c = size / 2;

    // Glow
    const glow = ctx1.createRadialGradient(c, c, r * 0.5, c, c, r + 2);
    glow.addColorStop(0, '#a78bfa');
    glow.addColorStop(1, 'rgba(167, 139, 250, 0)');
    ctx1.fillStyle = glow;
    ctx1.beginPath();
    ctx1.arc(c, c, r + 2, 0, Math.PI * 2);
    ctx1.fill();

    // Body
    const grad1 = ctx1.createRadialGradient(c - 2, c - 2, 0, c, c, r);
    grad1.addColorStop(0, '#c4b5fd');
    grad1.addColorStop(1, '#7c3aed');
    ctx1.fillStyle = grad1;
    ctx1.beginPath();
    ctx1.arc(c, c, r, 0, Math.PI * 2);
    ctx1.fill();

    // Highlight
    ctx1.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx1.beginPath();
    ctx1.arc(c - 2, c - 2, r * 0.3, 0, Math.PI * 2);
    ctx1.fill();

    // 2. Lucky Ball Sprite
    luckyBallSprite = document.createElement('canvas');
    luckyBallSprite.width = size * 2; // Bigger for larger glow
    luckyBallSprite.height = size * 2;
    const ctx2 = luckyBallSprite.getContext('2d');
    const c2 = size; // Center

    // Golden Glow
    const glow2 = ctx2.createRadialGradient(c2, c2, r * 0.5, c2, c2, r * 3);
    glow2.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
    glow2.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx2.fillStyle = glow2;
    ctx2.beginPath();
    ctx2.arc(c2, c2, r * 3, 0, Math.PI * 2);
    ctx2.fill();

    // Body
    const grad2 = ctx2.createRadialGradient(c2 - 2, c2 - 2, 0, c2, c2, r);
    grad2.addColorStop(0, '#fef08a');
    grad2.addColorStop(0.7, '#f59e0b');
    grad2.addColorStop(1, '#d97706');
    ctx2.fillStyle = grad2;
    ctx2.beginPath();
    ctx2.arc(c2, c2, r, 0, Math.PI * 2);
    ctx2.fill();

    // Highlight
    ctx2.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx2.beginPath();
    ctx2.arc(c2 - 2, c2 - 2, r * 0.3, 0, Math.PI * 2);
    ctx2.fill();
}

function resizeCanvas() {
    const canvas = document.getElementById('gameCanvas');
    const boardEl = document.getElementById('plinkoBoard');
    if (!canvas || !boardEl) return;

    const rect = boardEl.getBoundingClientRect();
    canvasW = rect.width;
    canvasH = rect.height;

    canvas.width = canvasW * dpr;
    canvas.height = canvasH * dpr;
    canvas.style.width = canvasW + 'px';
    canvas.style.height = canvasH + 'px';

    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// ── Main render frame ──
function renderFrame() {
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvasW, canvasH);

    // Draw pegs
    drawPegs();

    // Draw ball trails
    drawTrails();

    // Draw balls
    drawBalls();
}

// ── Draw Pegs ──
function drawPegs() {
    for (const peg of pegPositions) {
        const lit = peg.lit;

        if (lit > 0.01) {
            // Glowing peg
            const glow = lit;
            ctx.save();

            // Outer glow
            const gradient = ctx.createRadialGradient(peg.x, peg.y, 0, peg.x, peg.y, 12 * glow);
            gradient.addColorStop(0, `rgba(192, 132, 252, ${0.6 * glow})`);
            gradient.addColorStop(1, 'rgba(192, 132, 252, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, 12 * glow, 0, Math.PI * 2);
            ctx.fill();

            // Bright center
            ctx.fillStyle = `rgba(232, 220, 255, ${0.9 * glow})`;
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, CONFIG.PEG_RADIUS + 1, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        } else {
            // Normal peg
            ctx.save();

            // Peg body
            const pegGrad = ctx.createRadialGradient(
                peg.x - 1, peg.y - 1, 0,
                peg.x, peg.y, CONFIG.PEG_RADIUS + 1
            );
            pegGrad.addColorStop(0, '#8b7ab8');
            pegGrad.addColorStop(1, '#3d2870');
            ctx.fillStyle = pegGrad;
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, CONFIG.PEG_RADIUS, 0, Math.PI * 2);
            ctx.fill();

            // Subtle border
            ctx.strokeStyle = 'rgba(192, 132, 252, 0.25)';
            ctx.lineWidth = 0.5;
            ctx.stroke();

            ctx.restore();
        }
    }
}

// ── Draw Ball Trails ──
function drawTrails() {
    const now = Date.now();

    for (const ball of balls) {
        if (!ball.trailPoints || ball.trailPoints.length < 2) continue;

        const color = ball.isLucky
            ? 'rgba(251, 191, 36, '
            : 'rgba(168, 130, 255, ';

        for (let i = 0; i < ball.trailPoints.length - 1; i++) {
            const pt = ball.trailPoints[i];
            const age = now - pt.t;
            if (age > 300) continue;

            const alpha = Math.max(0, 0.3 * (1 - age / 300));
            const size = CONFIG.BALL_RADIUS * (1 - age / 300) * 0.7;

            ctx.fillStyle = color + alpha + ')';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ── Draw Balls (Optimized) ──
function drawBalls() {
    for (const ball of balls) {
        if (!ball.position) continue;
        const x = ball.position.x;
        const y = ball.position.y;

        if (ball.isLucky && luckyBallSprite) {
            const size = luckyBallSprite.width;
            ctx.drawImage(luckyBallSprite, Math.floor(x - size / 2), Math.floor(y - size / 2));
        } else if (ballSprite) {
            const size = ballSprite.width;
            ctx.drawImage(ballSprite, Math.floor(x - size / 2), Math.floor(y - size / 2));
        }
    }
}
