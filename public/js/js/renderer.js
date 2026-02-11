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

// ── Draw Balls ──
function drawBalls() {
    for (const ball of balls) {
        const x = ball.position.x;
        const y = ball.position.y;
        const r = CONFIG.BALL_RADIUS;

        ctx.save();

        if (ball.isLucky) {
            // Golden lucky ball
            // Outer glow
            const glow = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 3);
            glow.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
            glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(x, y, r * 3, 0, Math.PI * 2);
            ctx.fill();

            // Ball body
            const grad = ctx.createRadialGradient(x - 2, y - 2, 0, x, y, r);
            grad.addColorStop(0, '#fef08a');
            grad.addColorStop(0.7, '#f59e0b');
            grad.addColorStop(1, '#d97706');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();

            // Specular highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Normal violet ball
            // Subtle glow
            const glow = ctx.createRadialGradient(x, y, r, x, y, r * 2.5);
            glow.addColorStop(0, 'rgba(124, 58, 237, 0.3)');
            glow.addColorStop(1, 'rgba(124, 58, 237, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Ball body
            const grad = ctx.createRadialGradient(x - 2, y - 2, 0, x, y, r);
            grad.addColorStop(0, '#e0d8ff');
            grad.addColorStop(0.6, '#9f7aea');
            grad.addColorStop(1, '#6d28d9');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();

            // Specular highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.beginPath();
            ctx.arc(x - r * 0.25, y - r * 0.3, r * 0.25, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}
