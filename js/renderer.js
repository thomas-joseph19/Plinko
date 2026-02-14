/* ═══════════════════════════════════════════════
   PLINKO — Canvas Renderer (Pixel Arcade)
   ═══════════════════════════════════════════════ */

let ctx;
let canvasW, canvasH, dpr;

// Pixel scale — render at low res, CSS upscales with image-rendering: pixelated for chunky look
const PIXEL_SCALE = 0.35;

function initRenderer() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    dpr = window.devicePixelRatio || 1;
    createBallSprites();
}

// ── Sprite Caching ──
let ballSprite = null;
let luckyBallSprite = null;

function createBallSprites() {
    const r = CONFIG.BALL_RADIUS;
    const size = (r + 8) * 2; // Larger canvas for bigger glow

    // 1. Normal Ball — Neon Cyan
    ballSprite = document.createElement('canvas');
    ballSprite.width = size;
    ballSprite.height = size;
    const ctx1 = ballSprite.getContext('2d');
    ctx1.imageSmoothingEnabled = false;
    const c = size / 2;

    // Intense Glow (Outer)
    const glow = ctx1.createRadialGradient(c, c, r * 0.5, c, c, r + 6);
    glow.addColorStop(0, 'rgba(0, 255, 255, 0.8)'); // Brighter core
    glow.addColorStop(0.5, 'rgba(0, 229, 255, 0.3)');
    glow.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx1.fillStyle = glow;
    ctx1.beginPath();
    ctx1.arc(c, c, r + 6, 0, Math.PI * 2);
    ctx1.fill();

    // Body — Solid Core
    const grad1 = ctx1.createRadialGradient(c - 1, c - 1, 0, c, c, r);
    grad1.addColorStop(0, '#FFFFFF');
    grad1.addColorStop(0.4, '#80F0FF');
    grad1.addColorStop(1, '#00E5FF');
    ctx1.fillStyle = grad1;
    ctx1.beginPath();
    ctx1.arc(c, c, r, 0, Math.PI * 2);
    ctx1.fill();

    // Highlight
    ctx1.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx1.beginPath();
    ctx1.arc(c - 1.5, c - 2.5, r * 0.25, 0, Math.PI * 2);
    ctx1.fill();

    // 2. Lucky Ball — Neon Gold
    luckyBallSprite = document.createElement('canvas');
    luckyBallSprite.width = size;
    luckyBallSprite.height = size;
    const ctx2 = luckyBallSprite.getContext('2d');
    ctx2.imageSmoothingEnabled = false;
    const c2 = size / 2;

    // Golden Glow
    const glow2 = ctx2.createRadialGradient(c2, c2, r * 0.5, c2, c2, r + 6);
    glow2.addColorStop(0, 'rgba(255, 215, 64, 0.8)');
    glow2.addColorStop(0.6, 'rgba(255, 180, 0, 0.3)');
    glow2.addColorStop(1, 'rgba(255, 215, 64, 0)');
    ctx2.fillStyle = glow2;
    ctx2.beginPath();
    ctx2.arc(c2, c2, r + 6, 0, Math.PI * 2);
    ctx2.fill();

    // Body
    const grad2 = ctx2.createRadialGradient(c2 - 1, c2 - 1, 0, c2, c2, r);
    grad2.addColorStop(0, '#FFFFFF');
    grad2.addColorStop(0.4, '#FFEA80');
    grad2.addColorStop(1, '#FFD740');
    ctx2.fillStyle = grad2;
    ctx2.beginPath();
    ctx2.arc(c2, c2, r, 0, Math.PI * 2);
    ctx2.fill();

    // Highlight
    ctx2.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx2.beginPath();
    ctx2.arc(c2 - 1.5, c2 - 2.5, r * 0.25, 0, Math.PI * 2);
    ctx2.fill();
}

function resizeCanvas() {
    const canvas = document.getElementById('gameCanvas');
    const boardEl = document.getElementById('plinkoBoard');
    if (!canvas || !boardEl) return;

    const rect = boardEl.getBoundingClientRect();

    // Guard: if the board hasn't laid out yet, retry after a frame
    if (rect.width < 10 || rect.height < 10) {
        requestAnimationFrame(resizeCanvas);
        return;
    }

    canvasW = rect.width;
    canvasH = rect.height;

    // Render at lower resolution for the chunky pixel look
    const renderScale = dpr * PIXEL_SCALE;
    canvas.width = Math.floor(canvasW * renderScale);
    canvas.height = Math.floor(canvasH * renderScale);

    if (ctx) {
        ctx.setTransform(renderScale, 0, 0, renderScale, 0, 0);
        ctx.imageSmoothingEnabled = false;
    }
}

// ── Main render frame ──
function renderFrame() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasW, canvasH);
    drawPegs();
    drawTrails();
    drawBalls();
}

// ── Draw Pegs — Neon Glow ──
function drawPegs() {
    for (const peg of pegPositions) {
        if (peg.destroyed) continue;

        const lit = peg.lit;

        if (lit > 0.01) {
            const glow = lit;
            ctx.save();
            ctx.globalCompositeOperation = 'lighter'; // Additive blending -> Neon Look

            // Intense core flash
            const gradient = ctx.createRadialGradient(peg.x, peg.y, 0, peg.x, peg.y, 14 * glow);
            gradient.addColorStop(0, `rgba(180, 240, 255, ${0.9 * glow})`);
            gradient.addColorStop(0.4, `rgba(0, 229, 255, ${0.7 * glow})`);
            gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, 14 * glow, 0, Math.PI * 2);
            ctx.fill();

            // White-hot center
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, CONFIG.PEG_RADIUS, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        } else {
            // Normal peg (dim)
            ctx.fillStyle = 'rgba(100, 100, 140, 0.3)'; // Dimmer base for contrast
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, CONFIG.PEG_RADIUS, 0, Math.PI * 2);
            ctx.fill();

            // Tiny dot center
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ── Draw Ball Trails — Neon Streaks ──
function drawTrails() {
    const now = Date.now();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; // Additive trails

    for (const ball of balls) {
        if (!ball.trailPoints || ball.trailPoints.length < 2) continue;

        const isLucky = ball.isLucky;
        const colorBase = isLucky ? '255, 200, 0' : '0, 240, 255'; // RGB values

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw connected line for smoother neon look
        ctx.beginPath();

        // Start from current position
        ctx.moveTo(ball.position.x, ball.position.y);

        for (let i = ball.trailPoints.length - 1; i >= 0; i--) {
            const pt = ball.trailPoints[i];
            const age = now - pt.t;
            if (age > 400) break; // Longer trails

            // Draw segments manually to handle opacity fading (gradient stroke is complex on path)
            // or just draw the path with a single gradient?
            // Simpler: Draw dots but closer together creates a line feel?
            // Actually, dots with 'lighter' blend mode creates a laser beam effect.

            const alpha = Math.max(0, 1 - age / 400); // Fade out
            const size = CONFIG.BALL_RADIUS * (0.8 + 0.5 * alpha); // Thick trails

            ctx.fillStyle = `rgba(${colorBase}, ${alpha * 0.6})`;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.restore();
}

// ── Draw Balls ──
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
