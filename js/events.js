/* ═══════════════════════════════════════════════
   PLINKO∞ — Event System
   ═══════════════════════════════════════════════ */

// ── Event Definitions ──
const EVENTS = {
    ball_evolution: {
        id: 'ball_evolution',
        name: '🧬 Ball Evolution',
        desc: 'Balls gain multiplier from peg hits (up to 4×)',
        cost: 20000,
        duration: 30000,
        cooldown: 300000,
        idleSafe: false,
        effects: { perPegHit: 0.05, maxBonus: 3.0 },
    },
    bin_roulette: {
        id: 'bin_roulette',
        name: '🎰 Bin Roulette',
        desc: 'Bin values reroll every 2.5s (0.6×–1.8× range)',
        cost: 20000,
        duration: 30000,
        cooldown: 300000,
        idleSafe: true,
        effects: { rerollInterval: 2500, minMult: 0.6, maxMult: 1.8 },
    },
    hyper_ball_storm: {
        id: 'hyper_ball_storm',
        name: '🌪️ Hyper Ball Storm',
        desc: '8× spawn rate, 3× max balls, −15% drop speed',
        cost: 20000,
        duration: 30000,
        cooldown: 300000,
        idleSafe: true,
        effects: { spawnRateMult: 8.0, maxBallsMult: 3.0, dropSpeedMod: -0.15 },
    },
    edge_singularity: {
        id: 'edge_singularity',
        name: '🌀 Edge Singularity',
        desc: 'Gravity wells pull balls toward high-value edges',
        cost: 20000,
        duration: 30000,
        cooldown: 300000,
        idleSafe: false,
        effects: { edgePullStrength: 0.9, maxEdgeForce: 1.2 },
    },
    peg_cascade: {
        id: 'peg_cascade',
        name: '💥 Peg Cascade',
        desc: 'Pegs shatter on hit, awarding bonus coins',
        cost: 20000,
        duration: 30000,
        cooldown: 300000,
        idleSafe: true,
        effects: { pegDestructible: true, basePegBonus: 2 },
    },
};

// ── Event Runtime State ──
const eventState = {
    activeEvent: null,       // id of currently active event, or null
    activeEndTime: 0,        // timestamp when active event ends
    cooldownEndTime: 0,      // timestamp when global cooldown ends
    binRouletteTimer: null,  // interval for bin roulette rerolls
    binRouletteValues: null, // current roulette multiplier overrides
    stormDropTimer: null,    // interval for hyper ball storm extra spawns
    destroyedPegs: new Set(), // indices of destroyed pegs (peg cascade)
    savedMaxBalls: 0,        // original MAX_BALLS_ON_BOARD before storm
};

// ── Query Helpers ──
function isEventActive(eventId) {
    if (!eventId) return eventState.activeEvent !== null;
    return eventState.activeEvent === eventId;
}

function isAnyEventActive() {
    return eventState.activeEvent !== null && Date.now() < eventState.activeEndTime;
}

function isEventOnCooldown() {
    return Date.now() < eventState.cooldownEndTime;
}

function getEventTimeRemaining() {
    if (!isAnyEventActive()) return 0;
    return Math.max(0, eventState.activeEndTime - Date.now());
}

function getCooldownRemaining() {
    if (!isEventOnCooldown()) return 0;
    return Math.max(0, eventState.cooldownEndTime - Date.now());
}

function resetEventCooldowns() {
    eventState.cooldownEndTime = 0;
    if (typeof renderEventsPanel === 'function') renderEventsPanel();
}

// ── Activate Event ──
function activateEvent(eventId) {
    const ev = EVENTS[eventId];
    if (!ev) return false;

    // Block if another event is active
    if (isAnyEventActive()) return false;

    // Block if on cooldown
    if (isEventOnCooldown()) return false;

    // Check cost
    if (gameState.coins < ev.cost) return false;

    // Deduct coins
    gameState.coins -= ev.cost;

    // Set active
    eventState.activeEvent = eventId;
    eventState.activeEndTime = Date.now() + ev.duration;
    eventState.cooldownEndTime = Date.now() + ev.duration + ev.cooldown;

    // Apply event-specific setup
    switch (eventId) {
        case 'ball_evolution':
            // Mark all current balls with pegHits tracker
            for (const ball of balls) {
                if (ball.pegHits === undefined) ball.pegHits = 0;
            }
            break;

        case 'bin_roulette':
            startBinRoulette();
            break;

        case 'hyper_ball_storm':
            startHyperStorm();
            break;

        case 'edge_singularity':
            // Physics forces applied in updatePhysics tick
            break;

        case 'peg_cascade':
            eventState.destroyedPegs.clear();
            break;
    }

    // Visual feedback
    showEventActivation(ev);

    return true;
}

// ── End Event (called when duration expires) ──
function endActiveEvent() {
    const eventId = eventState.activeEvent;
    if (!eventId) return;

    // Set active to null BEFORE cleanup so that state checks inside cleanup (like getDropInterval) see it as inactive
    eventState.activeEvent = null;
    eventState.activeEndTime = 0;

    // Cleanup event-specific state
    switch (eventId) {
        case 'bin_roulette':
            stopBinRoulette();
            break;

        case 'hyper_ball_storm':
            stopHyperStorm();
            break;

        case 'peg_cascade':
            // Respawn destroyed pegs
            respawnDestroyedPegs();
            break;
    }

    // Update UI
    if (typeof renderEventsPanel === 'function') renderEventsPanel();
}

// ── Tick (called every frame from updatePhysics) ──
function tickEvents() {
    // Check if active event has expired
    if (eventState.activeEvent !== null && Date.now() >= eventState.activeEndTime) {
        endActiveEvent();
    }
}

// ═══════════════════════════════════════════
// Event-Specific Implementations
// ═══════════════════════════════════════════

// ── Ball Evolution ──
function getBallEvolutionMultiplier(ball) {
    if (!isEventActive('ball_evolution')) return 1;
    const hits = ball.pegHits || 0;
    const bonus = Math.min(hits * EVENTS.ball_evolution.effects.perPegHit, EVENTS.ball_evolution.effects.maxBonus);
    return 1 + bonus;
}

// ── Bin Roulette ──
function startBinRoulette() {
    const ev = EVENTS.bin_roulette;
    rerollBinValues();
    eventState.binRouletteTimer = setInterval(() => {
        rerollBinValues();
    }, ev.effects.rerollInterval);
}

function rerollBinValues() {
    const ev = EVENTS.bin_roulette;
    // Get base multipliers
    const rows = typeof getBoardRows === 'function' ? getBoardRows() : 10;
    const baseMultipliers = CONFIG.SLOT_MULTIPLIERS[rows] || CONFIG.SLOT_MULTIPLIERS[10];

    // Clone and shuffle the base multipliers to mix up high/low values positions
    const shuffled = [...baseMultipliers];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Apply random multiplier scale to the shuffled values
    eventState.binRouletteValues = shuffled.map(base => {
        const roll = ev.effects.minMult + Math.random() * (ev.effects.maxMult - ev.effects.minMult);
        return +(base * roll).toFixed(2);
    });

    // Update slot tray visually
    if (typeof renderSlotTray === 'function') {
        renderRouletteSlotTray();
    }
}

function renderRouletteSlotTray() {
    const tray = document.getElementById('slotTray');
    if (!tray || !eventState.binRouletteValues) return;

    tray.innerHTML = '';
    const boost = typeof getGlobalMultiplier === 'function' ? getGlobalMultiplier() : 1;

    eventState.binRouletteValues.forEach((val, i) => {
        const slot = document.createElement('div');
        const displayVal = +(val * boost).toFixed(2);
        const type = typeof getSlotType === 'function' ? getSlotType(displayVal) : 'center';
        slot.className = 'slot ' + type + ' roulette-flash';

        slot.innerHTML = `<span class="mult">${displayVal >= 1000 ? formatCost(displayVal) : formatNumber(displayVal)}</span><span class="x">×</span>`;
        tray.appendChild(slot);
    });
}

function stopBinRoulette() {
    if (eventState.binRouletteTimer) {
        clearInterval(eventState.binRouletteTimer);
        eventState.binRouletteTimer = null;
    }
    eventState.binRouletteValues = null;
    // Re-render normal slot tray
    if (typeof renderSlotTray === 'function') {
        const rows = typeof getBoardRows === 'function' ? getBoardRows() : 10;
        renderSlotTray(rows);
    }
}

function getBinRouletteValue(slotIndex) {
    if (!isEventActive('bin_roulette') || !eventState.binRouletteValues) return null;
    return eventState.binRouletteValues[slotIndex] || null;
}

// ── Hyper Ball Storm ──
function startHyperStorm() {
    const ev = EVENTS.hyper_ball_storm;

    // Save and increase max balls
    eventState.savedMaxBalls = CONFIG.MAX_BALLS_ON_BOARD;
    CONFIG.MAX_BALLS_ON_BOARD = Math.floor(CONFIG.MAX_BALLS_ON_BOARD * ev.effects.maxBallsMult);

    // Restart auto-droppers with faster rate
    if (typeof stopAutoDroppers === 'function') stopAutoDroppers();
    if (typeof startAutoDroppers === 'function') startAutoDroppers();

    // Additional rapid-fire spawner
    const stormInterval = Math.max(30, getDropInterval() / ev.effects.spawnRateMult);
    eventState.stormDropTimer = setInterval(() => {
        if (runtimeState.activeBalls < CONFIG.MAX_BALLS_ON_BOARD) {
            const x = boardWidth / 2 + (Math.random() - 0.5) * boardWidth * 0.3;
            spawnBall(x, 15);
        }
    }, stormInterval);
}

function stopHyperStorm() {
    // Restore max balls
    if (eventState.savedMaxBalls > 0) {
        CONFIG.MAX_BALLS_ON_BOARD = eventState.savedMaxBalls;
        eventState.savedMaxBalls = 0;
    }

    // Stop storm spawner
    if (eventState.stormDropTimer) {
        clearInterval(eventState.stormDropTimer);
        eventState.stormDropTimer = null;
    }

    // Restart auto-droppers at normal rate
    if (typeof stopAutoDroppers === 'function') stopAutoDroppers();
    if (typeof startAutoDroppers === 'function') startAutoDroppers();
}

function getStormDropSpeedMod() {
    if (!isEventActive('hyper_ball_storm')) return 0;
    return EVENTS.hyper_ball_storm.effects.dropSpeedMod;
}

// ── Edge Singularity ──
function applyEdgeSingularity(ball) {
    if (!isEventActive('edge_singularity')) return;

    const ev = EVENTS.edge_singularity;
    const x = ball.position.x;

    // Distance to nearest edge
    const distLeft = x;
    const distRight = boardWidth - x;
    const nearestEdgeDist = Math.min(distLeft, distRight);

    if (nearestEdgeDist < 1) return; // Avoid division by zero

    // Pull toward nearest edge
    const pullStrength = ev.effects.edgePullStrength;
    const maxForce = ev.effects.maxEdgeForce;

    let forceX = pullStrength / nearestEdgeDist;
    forceX = Math.min(forceX, maxForce);

    // Scale down to physics-appropriate force magnitude
    forceX *= 0.0001;

    // Direction: toward nearest edge
    const direction = distLeft < distRight ? -1 : 1;

    Matter.Body.applyForce(ball, ball.position, { x: forceX * direction, y: 0 });
}

// ── Peg Cascade ──
function handlePegCascadeHit(peg) {
    if (!isEventActive('peg_cascade')) return;
    if (eventState.destroyedPegs.has(peg.pegIndex)) return;

    // Mark as destroyed
    eventState.destroyedPegs.add(peg.pegIndex);

    // Award bonus coins
    const bonus = EVENTS.peg_cascade.effects.basePegBonus * (typeof getSlotBoostMultiplier === 'function' ? getSlotBoostMultiplier() : 1);
    const rounded = Math.round(bonus);
    gameState.coins += rounded;
    gameState.totalCoinsEarned += rounded;

    // Remove peg from physics
    if (typeof world !== 'undefined') {
        Matter.World.remove(world, peg);
    }

    // Visual: hide the peg position
    if (pegPositions[peg.pegIndex]) {
        pegPositions[peg.pegIndex].destroyed = true;
        pegPositions[peg.pegIndex].lit = 1; // Flash before disappearing
    }

    // Sparkle burst effect
    if (typeof particleBurst === 'function') {
        particleBurst(peg.position.x, peg.position.y, '#fbbf24', 6);
    }
}

function respawnDestroyedPegs() {
    // Rebuild the board to restore all pegs
    eventState.destroyedPegs.clear();
    if (typeof rebuildBoard === 'function') {
        rebuildBoard();
    }
}

function isPegDestroyed(pegIndex) {
    return eventState.destroyedPegs.has(pegIndex);
}

// ── Visual Feedback ──
function showEventActivation(ev) {
    // Screen shake
    if (typeof screenShake === 'function') {
        screenShake(6);
    }

    // Particle burst at board center
    if (typeof particleBurst === 'function') {
        const bEl = document.getElementById('plinkoBoard');
        if (bEl) {
            const r = bEl.getBoundingClientRect();
            particleBurst(r.width / 2, r.height / 2, '#38bdf8', 20);
        }
    }

    // Flash event banner
    const banner = document.getElementById('eventBanner');
    if (banner) {
        banner.textContent = `⚡ ${ev.name} ACTIVE ⚡`;
        banner.classList.add('show');
        setTimeout(() => banner.classList.remove('show'), 2500);
    }
}

// ── Events Panel UI ──
function renderEventsPanel() {
    const container = document.getElementById('eventCards');
    if (!container) return;

    // Clear container first
    container.innerHTML = '';

    // Render all events
    Object.values(EVENTS).forEach(ev => {
        const id = ev.id;
        const isActive = isEventActive(id);
        const onCooldown = isEventOnCooldown() && !isActive;
        const canBuy = gameState.coins >= ev.cost && !isAnyEventActive() && !isEventOnCooldown();

        const card = document.createElement('div');
        card.className = 'event-card';
        // Add classes for styling states (dimmed if cooldown, highlighted if active, etc)
        if (isActive) card.classList.add('event-active');
        if (onCooldown) card.classList.add('event-cooldown');
        if (canBuy) card.classList.add('event-affordable');

        let statusHTML = '';
        if (isActive) {
            const remaining = Math.ceil(getEventTimeRemaining() / 1000);
            statusHTML = `<div class="event-status active">⏱ ${remaining}s remaining</div>`;
        } else if (onCooldown) {
            const cdRemaining = Math.ceil(getCooldownRemaining() / 1000);
            const mins = Math.floor(cdRemaining / 60);
            const secs = cdRemaining % 60;
            statusHTML = `<div class="event-status cooldown">🕐 ${mins}:${String(secs).padStart(2, '0')} cooldown</div>`;
        } else {
            statusHTML = `<div class="event-cost ${canBuy ? '' : 'unaffordable'}">🪙 ${formatCost(ev.cost)}</div>`;
        }

        const idleTag = ev.idleSafe
            ? '<span class="event-tag idle-safe">✓ Idle-Safe</span>'
            : '<span class="event-tag active-only">⚠ Active Only</span>';

        card.innerHTML = `
            <div class="event-header">
                <span class="event-name">${ev.name}</span>
                ${idleTag}
            </div>
            <div class="event-desc">${ev.desc}</div>
            <div class="event-duration">Duration: ${ev.duration / 1000}s</div>
            <div class="event-footer">
                ${statusHTML}
            </div>
        `;

        if (canBuy) {
            card.addEventListener('click', () => {
                if (activateEvent(id)) {
                    renderEventsPanel(); // Re-render to show active state immediately
                }
            });
        }

        container.appendChild(card);
    });
}
