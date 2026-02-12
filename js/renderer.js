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
    const size = (r + 4) * 2;

    // 1. Normal Ball — bright cyan, high contrast
    ballSprite = document.createElement('canvas');
    ballSprite.width = size;
    ballSprite.height = size;
    const ctx1 = ballSprite.getContext('2d');
    ctx1.imageSmoothingEnabled = false;
    const c = size / 2;

    // Glow — bright
    const glow = ctx1.createRadialGradient(c, c, r * 0.2, c, c, r + 3);
    glow.addColorStop(0, 'rgba(0, 229, 255, 0.5)');
    glow.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx1.fillStyle = glow;
    ctx1.beginPath();
    ctx1.arc(c, c, r + 3, 0, Math.PI * 2);
    ctx1.fill();

    // Body — solid bright fill
    const grad1 = ctx1.createRadialGradient(c - 1, c - 1, 0, c, c, r);
    grad1.addColorStop(0, '#FFFFFF');
    grad1.addColorStop(0.3, '#80F0FF');
    grad1.addColorStop(1, '#00E5FF');
    ctx1.fillStyle = grad1;
    ctx1.beginPath();
    ctx1.arc(c, c, r, 0, Math.PI * 2);
    ctx1.fill();

    // Hard specular highlight
    ctx1.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx1.beginPath();
    ctx1.arc(c - 1.5, c - 2.5, r * 0.2, 0, Math.PI * 2);
    ctx1.fill();

    // 2. Lucky Ball — bright gold
    luckyBallSprite = document.createElement('canvas');
    luckyBallSprite.width = size * 2;
    luckyBallSprite.height = size * 2;
    const ctx2 = luckyBallSprite.getContext('2d');
    ctx2.imageSmoothingEnabled = false;
    const c2 = size;

    // Golden Glow
    const glow2 = ctx2.createRadialGradient(c2, c2, r * 0.3, c2, c2, r * 3);
    glow2.addColorStop(0, 'rgba(255, 215, 64, 0.4)');
    glow2.addColorStop(1, 'rgba(255, 215, 64, 0)');
    ctx2.fillStyle = glow2;
    ctx2.beginPath();
    ctx2.arc(c2, c2, r * 3, 0, Math.PI * 2);
    ctx2.fill();

    // Body — solid gold
    const grad2 = ctx2.createRadialGradient(c2 - 1, c2 - 1, 0, c2, c2, r);
    grad2.addColorStop(0, '#FFFFFF');
    grad2.addColorStop(0.3, '#FFEA80');
    grad2.addColorStop(1, '#FFD740');
    ctx2.fillStyle = grad2;
    ctx2.beginPath();
    ctx2.arc(c2, c2, r, 0, Math.PI * 2);
    ctx2.fill();

    // Highlight
    ctx2.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx2.beginPath();
    ctx2.arc(c2 - 1.5, c2 - 2.5, r * 0.2, 0, Math.PI * 2);
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

// ── Draw Pegs — bright against dark board ──
function drawPegs() {
    for (const peg of pegPositions) {
        const lit = peg.lit;

        if (lit > 0.01) {
            const glow = lit;
            ctx.save();

            // Bright glow burst
            const gradient = ctx.createRadialGradient(peg.x, peg.y, 0, peg.x, peg.y, 12 * glow);
            gradient.addColorStop(0, `rgba(0, 229, 255, ${0.6 * glow})`);
            gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, 12 * glow, 0, Math.PI * 2);
            ctx.fill();

            // White-hot center
            ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * glow})`;
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, CONFIG.PEG_RADIUS + 0.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        } else {
            // Normal peg — visible bright dots against dark board
            ctx.save();

            // Solid fill — brighter for contrast
            ctx.fillStyle = 'rgba(168, 160, 216, 0.45)';
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, CONFIG.PEG_RADIUS, 0, Math.PI * 2);
            ctx.fill();

            // Center dot highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, CONFIG.PEG_RADIUS * 0.3, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }
}

// ── Draw Ball Trails — bright streaks ──
function drawTrails() {
    const now = Date.now();

    for (const ball of balls) {
        if (!ball.trailPoints || ball.trailPoints.length < 2) continue;

        const color = ball.isLucky
            ? 'rgba(255, 215, 64, '
            : 'rgba(0, 229, 255, ';

        for (let i = 0; i < ball.trailPoints.length - 1; i++) {
            const pt = ball.trailPoints[i];
            const age = now - pt.t;
            if (age > 300) continue;

            const alpha = Math.max(0, 0.4 * (1 - age / 300));
            const size = CONFIG.BALL_RADIUS * (1 - age / 300) * 0.6;

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
