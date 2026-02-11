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

    canvas.width = boardWidth * window.devicePixelRatio;
    canvas.height = boardHeight * window.devicePixelRatio;
    canvas.style.width = boardWidth + 'px';
    canvas.style.height = boardHeight + 'px';

    // Clear existing bodies
    Matter.World.clear(world, false);
    pegs = [];
    walls = [];
    balls = [];
    slotSensorBodies = [];
    pegPositions = [];

    const rows = getBoardRows();
    const slotH = CONFIG.SLOT_HEIGHT;
    const padTop = boardHeight * 0.1; // More space at top for initial drop
    const padBot = slotH + 10;
    const usableH = boardHeight - padTop - padBot;

    // ── Create walls ──
    const wallOpts = { isStatic: true, restitution: 0.3, friction: 0.1, render: { visible: false } };
    walls.push(Matter.Bodies.rectangle(-CONFIG.WALL_THICKNESS / 2, boardHeight / 2, CONFIG.WALL_THICKNESS, boardHeight, wallOpts));
    walls.push(Matter.Bodies.rectangle(boardWidth + CONFIG.WALL_THICKNESS / 2, boardHeight / 2, CONFIG.WALL_THICKNESS, boardHeight, wallOpts));
    walls.push(Matter.Bodies.rectangle(boardWidth / 2, boardHeight + CONFIG.WALL_THICKNESS / 2, boardWidth, CONFIG.WALL_THICKNESS, wallOpts));
    Matter.World.add(world, walls);

    // ── Create pegs in a Classic Pyramid (Galton Board) ──
    const pegOpts = {
        isStatic: true,
        restitution: CONFIG.BALL_RESTITUTION,
        friction: CONFIG.PEG_FRICTION,
        circleRadius: CONFIG.PEG_RADIUS,
        label: 'peg',
    };

    // To form a bell curve distribution, we start with 1 peg and add one per row
    // Staggered layout: Row 0 has 1 peg, Row 1 has 2 pegs, etc.
    const rowSpacing = usableH / (rows - 1 || 1);
    const maxCols = rows;
    // We want the bottom row to fit within the board width
    const horizontalSpacing = Math.min(60, (boardWidth * 0.85) / maxCols);

    for (let r = 0; r < rows; r++) {
        const cols = r + 1; // 1, 2, 3...
        const rowY = padTop + r * rowSpacing;

        // Center the row
        const rowWidth = (cols - 1) * horizontalSpacing;
        const rowStartX = (boardWidth - rowWidth) / 2;

        for (let c = 0; c < cols; c++) {
            const pegX = rowStartX + c * horizontalSpacing;
            const peg = Matter.Bodies.circle(pegX, rowY, CONFIG.PEG_RADIUS, pegOpts);
            peg.pegIndex = pegPositions.length;
            pegs.push(peg);
            pegPositions.push({ x: pegX, y: rowY, lit: 0 });
        }
    }

    Matter.World.add(world, pegs);

    // ── Create slots aligned with the bottom row of pegs ──
    const lastRowCols = rows;
    const lastRowWidth = (lastRowCols - 1) * horizontalSpacing;
    const lastRowStartX = (boardWidth - lastRowWidth) / 2;

    const numSlots = lastRowCols + 1;
    const slotXOffsets = [];
    for (let i = 0; i < numSlots; i++) {
        slotXOffsets.push(lastRowStartX - horizontalSpacing / 2 + i * horizontalSpacing);
    }

    // Adapt multipliers to the number of slots
    // We want a "Bell Curve" payout: Small on edges, BIG in the middle (Real Plinko)
    const baseMults = [1, 5, 20, 50, 250, 50, 20, 5, 1];
    const multipliers = [];
    for (let i = 0; i < numSlots; i++) {
        // Map current index to the base pattern
        const ratio = i / (numSlots - 1);
        const patternIdx = Math.floor(ratio * (baseMults.length - 1));
        multipliers.push(baseMults[patternIdx]);
    }

    // Store multipliers for rendering
    runtimeState.currentMultipliers = multipliers;

    // Slot dividers
    const dividerOpts = { isStatic: true, restitution: 0.2, friction: 0.3, render: { visible: false } };
    for (let i = 0; i <= numSlots; i++) {
        const divX = lastRowStartX - horizontalSpacing / 2 + (i - 0.5) * horizontalSpacing + horizontalSpacing / 2;
        // Wait, simpler: dividers are between slots
        const dividerX = lastRowStartX - horizontalSpacing + i * horizontalSpacing + horizontalSpacing / 2;

        const divider = Matter.Bodies.rectangle(
            dividerX, boardHeight - slotH / 2 - 2,
            2, slotH - 4,
            dividerOpts
        );
        Matter.World.add(world, [divider]);
    }

    // Slot sensors
    for (let i = 0; i < numSlots; i++) {
        const sensorX = lastRowStartX - horizontalSpacing / 2 + i * horizontalSpacing;
        const sensor = Matter.Bodies.rectangle(
            sensorX, boardHeight - slotH + 8,
            horizontalSpacing - 4, 12,
            { isStatic: true, isSensor: true, label: 'slot_' + i }
        );
        sensor.slotIndex = i;
        slotSensorBodies.push(sensor);
    }
    Matter.World.add(world, slotSensorBodies);

    // Jackpots
    runtimeState.jackpotSlot = Math.floor(numSlots / 2); // Always middle for "Real Plinko" feel

    renderSlotTray(rows);

    Matter.Events.off(engine);
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

            // Ball weight: bias toward edges
            if (gameState.upgrades.ballWeight > 0) {
                const bias = gameState.upgrades.ballWeight * 0.003;
                const centerX = boardWidth / 2;
                const direction = ball.position.x < centerX ? -1 : 1;
                Matter.Body.applyForce(ball, ball.position, { x: bias * direction, y: 0 });
            }

            // Magnetic pegs
            if (gameState.upgrades.magneticPegs > 0) {
                const chance = gameState.upgrades.magneticPegs * 0.05;
                if (Math.random() < chance) {
                    // Pull toward nearest edge
                    const centerX = boardWidth / 2;
                    const direction = ball.position.x < centerX ? -1 : 1;
                    Matter.Body.applyForce(ball, ball.position, { x: 0.008 * direction, y: 0 });
                }
            }

            // Multi-ball split
            if (gameState.upgrades.multiBall > 0 && !ball.hasSplit) {
                const splitChance = getMultiBallChance();
                if (Math.random() < splitChance && runtimeState.activeBalls < CONFIG.MAX_BALLS_ON_BOARD) {
                    ball.hasSplit = true;
                    spawnBall(ball.position.x, ball.position.y, ball.isLucky);
                }
            }
        }

        // Ball hitting slot sensor
        const slotBody = [bodyA, bodyB].find(b => b.label && b.label.startsWith('slot_'));
        const ballBody = [bodyA, bodyB].find(b => b.label === 'ball');

        if (slotBody && ballBody && !ballBody.scored) {
            ballBody.scored = true;
            const slotIdx = slotBody.slotIndex;
            handleSlotHit(slotIdx, ballBody);
        }
    }
}

// ── Handle Ball Landing in Slot ──
function handleSlotHit(slotIndex, ballBody) {
    const rows = getBoardRows();
    const multipliers = runtimeState.currentMultipliers || CONFIG.SLOT_MULTIPLIERS[rows] || [1];
    let mult = multipliers[slotIndex] || 1;

    // Is it the jackpot slot?
    const isJackpot = slotIndex === runtimeState.jackpotSlot;
    // In Real Plinko center slots pay more, so we don't necessarily need an extra mult here
    // But we'll keep a small bonus if it's the specific jackpot slot
    if (isJackpot) mult *= 2;

    // Lucky ball bonus
    const isLucky = ballBody.isLucky;
    if (isLucky) mult *= 10;

    // Critical hit
    let isCrit = false;
    if (getCritChance() > 0 && Math.random() < getCritChance()) {
        isCrit = true;
        const critMult = gameState.prestigeUpgrades.critBoost ? 200 : 100;
        mult *= critMult;
    }

    // Bumper bonus check
    if (ballBody.bumperHit) {
        mult *= 2;
    }

    // Global multiplier
    const globalMult = getGlobalMultiplier();
    const coins = Math.round(CONFIG.BASE_BET * mult * globalMult);

    // Award coins
    gameState.coins += coins;
    gameState.totalCoinsEarned += coins;

    // Track CPS
    runtimeState.recentCps.push({ amount: coins, time: Date.now() });

    // Combo tracking
    if (gameState.upgrades.comboMeter > 0) {
        if (slotIndex === runtimeState.comboSlot) {
            runtimeState.consecutiveHits++;
            if (runtimeState.consecutiveHits > gameState.highestCombo) {
                gameState.highestCombo = runtimeState.consecutiveHits;
            }
        } else {
            runtimeState.comboSlot = slotIndex;
            runtimeState.consecutiveHits = 1;
        }
    }

    // Fever tracking
    const highValue = mult >= 10;
    if (highValue) {
        runtimeState.consecutiveHighHits++;
        if (runtimeState.consecutiveHighHits >= CONFIG.FEVER_TRIGGER && !runtimeState.feverActive) {
            triggerFever();
        }
    } else {
        runtimeState.consecutiveHighHits = Math.max(0, runtimeState.consecutiveHighHits - 1);
    }

    // Visual effects
    if (typeof showSlotHit === 'function') {
        showSlotHit(slotIndex, coins, isCrit || isJackpot || isLucky);
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

    const isLucky = forceGolden || (Math.random() < getLuckyBallChance());

    // Slight random offset for natural feel
    const dropX = x || boardWidth / 2 + (Math.random() - 0.5) * (boardWidth * 0.4);
    const dropY = y || 15;

    // Drop aim: bias x position towards edges
    let finalX = dropX;
    if (!x && gameState.upgrades.dropAim > 0) {
        const aimBias = gameState.upgrades.dropAim * 0.08;
        if (Math.random() < aimBias) {
            finalX = Math.random() < 0.5 ? boardWidth * 0.1 : boardWidth * 0.9;
            finalX += (Math.random() - 0.5) * 30;
        }
    }

    const ball = Matter.Bodies.circle(finalX, dropY, CONFIG.BALL_RADIUS, {
        restitution: CONFIG.BALL_RESTITUTION,
        friction: CONFIG.BALL_FRICTION,
        density: CONFIG.BALL_DENSITY,
        label: 'ball',
    });

    ball.isLucky = isLucky;
    ball.scored = false;
    ball.hasSplit = false;
    ball.spawnTime = Date.now();
    ball.trailPoints = [];

    // Small random initial velocity for natural spread
    Matter.Body.setVelocity(ball, {
        x: (Math.random() - 0.5) * 2,
        y: Math.random() * 1.5 + 0.5,
    });

    balls.push(ball);
    Matter.World.add(world, [ball]);
    runtimeState.activeBalls++;
    gameState.totalBallsDropped++;

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
    if (total === 1) return boardWidth / 2 + (Math.random() - 0.5) * (boardWidth * 0.5);
    const spacing = boardWidth * 0.7 / (total - 1);
    const startX = boardWidth * 0.15;
    return startX + index * spacing + (Math.random() - 0.5) * 20;
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
    if (engine) {
        Matter.Engine.update(engine, delta);
    }

    // Store trail points for active balls
    for (const ball of balls) {
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
