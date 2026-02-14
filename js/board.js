/* ═══════════════════════════════════════════════
   PLINKO∞ — Physics Board (Matter.js)
   ═══════════════════════════════════════════════ */

let engine, world, render;
let boardWidth = 500;
let boardHeight = 600;
let pegs = [];
let walls = [];
let balls = [];
let slots = [];
let slotSensorBodies = [];
let pegPositions = [];

// ── Initialize Physics Engine ──
function initPhysics() {
    engine = Matter.Engine.create({
        gravity: { x: 0, y: CONFIG.GRAVITY },
    });
    world = engine.world;

    // Reduce position iterations for performance with many balls
    engine.positionIterations = 6;
    engine.velocityIterations = 4;
}

// ── Build / Rebuild the Board ──
function rebuildBoard() {
    const canvas = document.getElementById('gameCanvas');
    const boardEl = document.getElementById('plinkoBoard');
    if (!boardEl || !canvas) return;

    const rect = boardEl.getBoundingClientRect();
    boardWidth = rect.width;
    boardHeight = rect.height;

    // Canvas sizing is handled by renderer.js resizeCanvas() to maintain pixel scale


    // Clear existing bodies
    Matter.World.clear(world, false);
    pegs = [];
    walls = [];
    balls = [];
    slotSensorBodies = [];
    pegPositions = [];

    const rows = getBoardRows();
    const slotH = CONFIG.SLOT_HEIGHT;
    const padTop = boardHeight * CONFIG.BOARD_PADDING_TOP;
    const padBot = slotH + 10;
    const padSide = boardWidth * CONFIG.BOARD_PADDING_SIDE;
    const usableH = boardHeight - padTop - padBot;
    const usableW = boardWidth - padSide * 2;

    // ── Create walls ──
    const wallOpts = { isStatic: true, restitution: 0.3, friction: 0.1, render: { visible: false } };

    // Left wall with high friction to stop edge-riding
    walls.push(Matter.Bodies.rectangle(
        -CONFIG.WALL_THICKNESS / 2, boardHeight / 2,
        CONFIG.WALL_THICKNESS, boardHeight,
        { isStatic: true, restitution: 0.1, friction: 0.8, render: { visible: false } }
    ));
    // Right wall with high friction to stop edge-riding
    walls.push(Matter.Bodies.rectangle(
        boardWidth + CONFIG.WALL_THICKNESS / 2, boardHeight / 2,
        CONFIG.WALL_THICKNESS, boardHeight,
        { isStatic: true, restitution: 0.1, friction: 0.8, render: { visible: false } }
    ));
    // Bottom floor
    walls.push(Matter.Bodies.rectangle(
        boardWidth / 2, boardHeight + CONFIG.WALL_THICKNESS / 2,
        boardWidth, CONFIG.WALL_THICKNESS, wallOpts
    ));

    Matter.World.add(world, walls);

    // ── Create pegs ──
    const pegOpts = {
        isStatic: true,
        restitution: CONFIG.BALL_RESTITUTION,
        friction: CONFIG.PEG_FRICTION,
        circleRadius: CONFIG.PEG_RADIUS,
        label: 'peg',
    };

    // Requirement: Start with 2 pegs, end with 11 pegs (creating 12-ish bins but user wants specific peg counts)
    // Sequence: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 (Total 10 rows)
    const numRows = 10;
    const finalPegCount = 11;
    const startPegCount = 2;

    // We calculate horizontal spacing based on the widest row
    const dx = usableW / (finalPegCount - 1);
    const dy = usableH / (numRows - 1);

    for (let r = 0; r < numRows; r++) {
        const rowY = padTop + r * dy;

        // Linear interpolation from Start to End
        const cols = Math.round(startPegCount + (r * (finalPegCount - startPegCount) / (numRows - 1)));

        const rowWidth = (cols - 1) * dx;
        const xStart = (boardWidth - rowWidth) / 2;

        for (let c = 0; c < cols; c++) {
            const pegX = xStart + c * dx;
            const peg = Matter.Bodies.circle(pegX, rowY, CONFIG.PEG_RADIUS, pegOpts);
            peg.pegIndex = pegPositions.length;
            pegs.push(peg);
            pegPositions.push({ x: pegX, y: rowY, lit: 0 });
        }
    }

    Matter.World.add(world, pegs);

    // ── Create slot dividers and sensors ──
    // Final row has 11 pegs -> creates 12 spaces/bins
    const numSlots = 12;
    const slotWidth = boardWidth / numSlots;

    // Slot dividers
    const dividerOpts = { isStatic: true, restitution: 0.2, friction: 0.3, render: { visible: false } };
    for (let i = 0; i <= numSlots; i++) {
        const divX = i * slotWidth;
        const divider = Matter.Bodies.rectangle(
            divX, boardHeight - slotH / 2 - 2,
            2, slotH - 4,
            dividerOpts
        );
        Matter.World.add(world, [divider]);
    }

    // Slot sensors (invisible triggers at bottom)
    for (let i = 0; i < numSlots; i++) {
        const sensorX = slotWidth / 2 + i * slotWidth;
        const sensor = Matter.Bodies.rectangle(
            sensorX, boardHeight - slotH + 8,
            slotWidth - 4, 12,
            { isStatic: true, isSensor: true, label: 'slot_' + i }
        );
        sensor.slotIndex = i;
        slotSensorBodies.push(sensor);
    }
    Matter.World.add(world, slotSensorBodies);

    // ── Pick jackpot slot ──

    // Render slot tray HTML
    renderSlotTray(numRows);

    // ── Collision events ──
    Matter.Events.off(engine); // Clear old events
    Matter.Events.on(engine, 'collisionStart', handleCollisions);
}

// ── Handle Collisions ──
function handleCollisions(event) {
    const pairs = event.pairs;

    for (const pair of pairs) {
        const { bodyA, bodyB } = pair;

        // Ball hitting peg
        if ((bodyA.label === 'peg' && bodyB.label === 'ball') ||
            (bodyB.label === 'peg' && bodyA.label === 'ball')) {
            const peg = bodyA.label === 'peg' ? bodyA : bodyB;
            const ball = bodyA.label === 'ball' ? bodyA : bodyB;

            // Light up peg
            if (peg.pegIndex !== undefined && pegPositions[peg.pegIndex]) {
                pegPositions[peg.pegIndex].lit = 1;
            }

            // Sparkle effect
            if (typeof spawnSparkle === 'function') {
                spawnSparkle(peg.position.x, peg.position.y);
            }

            // Audio: Peg Hit
            if (window.AudioEngine) {
                const yPct = peg.position.y / boardHeight;
                window.AudioEngine.pegHit(yPct, ball.isLucky);
            }

            // Multi-ball split
            if (gameState.upgrades.multiBall > 0 && !ball.hasSplit) {
                const splitChance = getMultiBallChance();
                if (Math.random() < splitChance && runtimeState.activeBalls < CONFIG.MAX_BALLS_ON_BOARD) {
                    ball.hasSplit = true;
                    spawnBall(ball.position.x, ball.position.y, ball.isLucky);
                }
            }

            // Peg Cascade Event
            if (typeof handlePegCascadeHit === 'function') {
                handlePegCascadeHit(peg);
            }

            // Ball Evolution tracking
            if (ball.pegHits !== undefined) {
                ball.pegHits++;
            }
        }

        // Ball hitting slot sensor
        const slotBody = [bodyA, bodyB].find(b => b.label && b.label.startsWith('slot_'));
        const ballBody = [bodyA, bodyB].find(b => b.label === 'ball');

        if (slotBody && ballBody && !ballBody.scored) {
            ballBody.scored = true;
            // Disable further collisions immediately to prevent double-counting or floor bounces
            if (ballBody.collisionFilter) {
                ballBody.collisionFilter.mask = 0;
            }
            const slotIdx = slotBody.slotIndex;
            handleSlotHit(slotIdx, ballBody);
        }
    }
}

// ── Handle Ball Landing in Slot ──
function handleSlotHit(slotIndex, ballBody) {
    const rows = getBoardRows();
    const multipliers = CONFIG.SLOT_MULTIPLIERS[rows] || CONFIG.SLOT_MULTIPLIERS[4];
    let mult = multipliers[slotIndex] || 1;

    // Roulette multiplier override
    if (typeof getBinRouletteValue === 'function') {
        const rouletteVal = getBinRouletteValue(slotIndex);
        if (rouletteVal !== null) mult = rouletteVal;
    }

    // Lucky ball bonus
    const isLucky = ballBody.isLucky;
    if (isLucky) mult *= 10;

    // Ball Evolution Event
    if (typeof getBallEvolutionMultiplier === 'function') {
        mult *= getBallEvolutionMultiplier(ballBody);
    }

    // Global multiplier
    const globalMult = getGlobalMultiplier();
    const coins = Math.round(mult * globalMult);

    // Award coins
    gameState.coins += coins;
    gameState.totalCoinsEarned += coins;

    // Daily challenges: earn_coins, land_edge, land_center, land_high
    if (typeof recordDailyProgress === 'function') {
        recordDailyProgress('earn_coins', coins);
        const numSlots = (multipliers && multipliers.length) || 12;
        if (slotIndex === 0 || slotIndex === numSlots - 1) recordDailyProgress('land_edge', 1);
        if (slotIndex === 5 || slotIndex === 6) recordDailyProgress('land_center', 1);
        const baseMult = multipliers[slotIndex] || 1;
        if (baseMult >= 10) recordDailyProgress('land_high', 1);
    }

    // Track CPS
    runtimeState.recentCps.push({ amount: coins, time: Date.now() });

    // Fever tracking removed

    // Visual effects
    // Critical if lucky ball OR high multiplier (>= 10)
    const isCritical = isLucky || mult >= 10;

    if (typeof showSlotHit === 'function') {
        showSlotHit(slotIndex, coins, mult >= 3, isCritical);
    }

    // Haptic Feedback (No haptic for peg hits, only slots)
    if (typeof triggerHaptic === 'function') {
        if (isCritical) {
            triggerHaptic('heavy');
        } else if (mult >= 3) {
            triggerHaptic('medium');
        } else {
            triggerHaptic('light'); // Very subtle for 0.2x / 0.5x / 1x
        }
    }

    // Audio: Slot Hit
    if (window.AudioEngine) {
        // Simple tier logic: mult > 10 is high tier
        const tier = mult > 9 ? 3 : (mult > 2 ? 1 : 0);
        window.AudioEngine.slotHit(isLucky, tier);
    }

    // Slot flash
    const slotEls = document.querySelectorAll('.slot');
    if (slotEls[slotIndex]) {
        slotEls[slotIndex].classList.remove('hit');
        void slotEls[slotIndex].offsetWidth; // reflow to restart animation
        slotEls[slotIndex].classList.add('hit');
    }

    // Coin chip pulse
    const chip = document.getElementById('coinChip');
    if (chip) {
        chip.classList.remove('pulse');
        void chip.offsetWidth;
        chip.classList.add('pulse');
    }

    // Remove ball after a brief moment
    setTimeout(() => {
        removeBall(ballBody);
    }, 200);
}

// ── Spawn a Ball ──
function spawnBall(x, y, forceGolden) {
    if (runtimeState.activeBalls >= CONFIG.MAX_BALLS_ON_BOARD) return null;

    // Visual Dropper Animation - Trigger only if spawned near center (manual or auto)
    const nozzle = document.querySelector('.dropper-nozzle');
    if (nozzle && (!x || Math.abs(x - boardWidth / 2) < 20)) {
        nozzle.classList.remove('active');
        void nozzle.offsetWidth; // trigger reflow
        nozzle.classList.add('active');
    }

    const isLucky = forceGolden || (Math.random() < getLuckyBallChance());

    // Audio: Drop
    if (window.AudioEngine) {
        window.AudioEngine.drop();
    }

    // Sub-pixel jitter (0.1px) is invisible but prevents "perfect" physics paths
    // without it, every ball would follow the exact same left/right path
    const dropX = x || boardWidth / 2 + (Math.random() - 0.5) * 0.1;
    const dropY = y || 15;

    const ball = Matter.Bodies.circle(dropX, dropY, CONFIG.BALL_RADIUS, {
        restitution: CONFIG.BALL_RESTITUTION,
        friction: CONFIG.BALL_FRICTION,
        density: CONFIG.BALL_DENSITY,
        label: 'ball',
    });

    ball.isLucky = isLucky;
    ball.scored = false;
    ball.hasSplit = false;
    ball.spawnTime = Date.now();
    ball.pegHits = 0;
    ball.trailPoints = [];

    // Pinpoint drop: zero horizontal velocity
    // Apply drop speed upgrade
    const speedMult = typeof getDropSpeedMultiplier === 'function' ? getDropSpeedMultiplier() : 1;
    Matter.Body.setVelocity(ball, { x: 0, y: 1.0 * speedMult });

    balls.push(ball);
    Matter.World.add(world, [ball]);
    runtimeState.activeBalls++;
    gameState.totalBallsDropped++;

    if (typeof recordDailyProgress === 'function') recordDailyProgress('drop_ball', 1);

    return ball;
}

// ── Remove a Ball ──
function removeBall(ball) {
    Matter.World.remove(world, ball);
    const idx = balls.indexOf(ball);
    if (idx > -1) balls.splice(idx, 1);
    runtimeState.activeBalls = Math.max(0, runtimeState.activeBalls - 1);
}

// ── Clean up stuck/old balls ──
function cleanupBalls() {
    const now = Date.now();
    const toRemove = [];

    for (const ball of balls) {
        // Remove balls that are too old (stuck) or fell off screen
        if (now - ball.spawnTime > 15000 || ball.position.y > boardHeight + 50) {
            if (!ball.scored) {
                // Give minimum payout for stuck balls
                const rows = getBoardRows();
                const multipliers = CONFIG.SLOT_MULTIPLIERS[rows] || CONFIG.SLOT_MULTIPLIERS[4];
                const midSlot = Math.floor(multipliers.length / 2);
                handleSlotHit(midSlot, ball);
            }
            toRemove.push(ball);
        }
    }

    for (const ball of toRemove) {
        removeBall(ball);
    }
}

// ── Auto-drop system ──
let dropTimers = [];

function startAutoDroppers() {
    stopAutoDroppers();

    const dropperCount = getDropperCount();
    const interval = getDropInterval();
    const ballsPerDrop = getBallCount();

    for (let d = 0; d < dropperCount; d++) {
        const offset = d * (interval / dropperCount); // Stagger droppers

        const timerId = setTimeout(() => {
            const innerTimer = setInterval(() => {
                for (let b = 0; b < ballsPerDrop; b++) {
                    const dropperX = getDropperX(d, dropperCount);
                    setTimeout(() => spawnBall(dropperX, 15), b * 80);
                }
                // Flash dropper indicator
                flashDropper(d);
            }, getDropInterval());
            dropTimers.push(innerTimer);
        }, offset);
        dropTimers.push(timerId);
    }
}

function stopAutoDroppers() {
    for (const t of dropTimers) {
        clearTimeout(t);
        clearInterval(t);
    }
    dropTimers = [];
}

function getDropperX(index, total) {
    // ALWAYS return the exact center, regardless of how many droppers are active
    return boardWidth / 2;
}

function flashDropper(index) {
    const indicators = document.querySelectorAll('.drop-indicator');
    if (indicators[index]) {
        indicators[index].classList.add('firing');
        setTimeout(() => indicators[index].classList.remove('firing'), 150);
    }
}

// ── Update physics step ──
function updatePhysics(delta) {
    if (typeof tickEvents === 'function') tickEvents();

    if (engine) {
        Matter.Engine.update(engine, delta);
    }

    // Centering Bias: Nudges balls toward center to achieve requested probabilities
    // (1k bin = 0.0001%, 100 bin = 0.1%, 25 bin = 1%)
    const centerX = boardWidth / 2;
    for (const ball of balls) {
        const distFromCenter = ball.position.x - centerX;
        const absDist = Math.abs(distFromCenter);

        if (absDist > 5) {
            // Natural 25x Cubic Pull: Baseline for 0.1% odds but looks organic
            const pullStrength = 0.00005 * Math.pow(absDist / centerX, 3);
            const forceX = distFromCenter > 0 ? -pullStrength : pullStrength;
            Matter.Body.applyForce(ball, ball.position, { x: forceX, y: 0 });
        }

        // Apply event-specific forces
        if (typeof applyEdgeSingularity === 'function') applyEdgeSingularity(ball);

        // Gem Rain: extra edge gravity
        if (ball.isRainBall) {
            const side = ball.position.x < boardWidth / 2 ? -1 : 1;
            Matter.Body.applyForce(ball, ball.position, { x: 0.0003 * side, y: 0 });
        }

        // Store trail points for active balls
        if (!ball.trailPoints) ball.trailPoints = [];
        ball.trailPoints.push({ x: ball.position.x, y: ball.position.y, t: Date.now() });
        // Keep only last 8 trail points
        if (ball.trailPoints.length > 8) ball.trailPoints.shift();
    }

    // Fade peg lights
    for (const p of pegPositions) {
        if (p.lit > 0) p.lit = Math.max(0, p.lit - 0.04);
    }
}

// ── Gem Upgrades: Ball Rain ──
function triggerBallRain() {
    const count = 1000;
    const batchSize = 25;
    const interval = 50; // ms between batches

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            if (runtimeState.activeBalls >= CONFIG.MAX_BALLS_ON_BOARD + 1000) return;

            const x = 20 + Math.random() * (boardWidth - 40);
            const ball = spawnBall(x, 15);

            if (ball) {
                const side = x < boardWidth / 2 ? -1 : 1;
                Matter.Body.applyForce(ball, ball.position, { x: 0.002 * side, y: 0 });
                ball.isRainBall = true;
            }
        }, Math.floor(i / batchSize) * interval);
    }
}
