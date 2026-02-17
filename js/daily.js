/* ═══════════════════════════════════════════════
   PLINKO∞ — Daily Rewards & Challenges
   ═══════════════════════════════════════════════ */

const DAILY_REWARDS = [
    { icon: '🪙', reward: '500 Coins', type: 'coins', amount: 500 },
    { icon: '🪙', reward: '1K Coins', type: 'coins', amount: 1000 },
    { icon: '💎', reward: '5 Gems', type: 'gems', amount: 5 },
    { icon: '🪙', reward: '2K Coins', type: 'coins', amount: 2000 },
    { icon: '🪙', reward: '5K Coins', type: 'coins', amount: 5000 },
    { icon: '💎', reward: '15 Gems', type: 'gems', amount: 15 },
    { icon: '🎁', reward: '10K+25💎', type: 'both', coins: 10000, gems: 25 },
];

// Pool of 50 daily challenges — cycled by day. progressKey: drop_ball | earn_coins | land_edge | land_center | land_high
const DAILY_CHALLENGE_POOL = [
    { id: 'dc_1', name: 'Edge Runner', desc: 'Land 5 balls in edge slots', target: 5, rewardType: 'gems', rewardAmount: 3, progressKey: 'land_edge' },
    { id: 'dc_2', name: 'Ball Storm', desc: 'Drop 50 balls', target: 50, rewardType: 'coins', rewardAmount: 2000, progressKey: 'drop_ball' },
    { id: 'dc_3', name: 'Money Maker', desc: 'Earn 10K coins', target: 10000, rewardType: 'gems', rewardAmount: 5, progressKey: 'earn_coins' },
    { id: 'dc_4', name: 'Dropper', desc: 'Drop 25 balls', target: 25, rewardType: 'coins', rewardAmount: 500, progressKey: 'drop_ball' },
    { id: 'dc_5', name: 'Edge Master', desc: 'Land 10 balls in edge slots', target: 10, rewardType: 'gems', rewardAmount: 8, progressKey: 'land_edge' },
    { id: 'dc_6', name: 'Coin Collector', desc: 'Earn 5K coins', target: 5000, rewardType: 'coins', rewardAmount: 1000, progressKey: 'earn_coins' },
    { id: 'dc_7', name: 'Center Shot', desc: 'Land 8 balls in center slots', target: 8, rewardType: 'gems', rewardAmount: 4, progressKey: 'land_center' },
    { id: 'dc_8', name: 'Heavy Hitter', desc: 'Land 5 balls in high-value slots (10×+)', target: 5, rewardType: 'gems', rewardAmount: 6, progressKey: 'land_high' },
    { id: 'dc_9', name: 'Ball Rain', desc: 'Drop 100 balls', target: 100, rewardType: 'coins', rewardAmount: 5000, progressKey: 'drop_ball' },
    { id: 'dc_10', name: 'Big Earner', desc: 'Earn 25K coins', target: 25000, rewardType: 'gems', rewardAmount: 10, progressKey: 'earn_coins' },
    { id: 'dc_11', name: 'Edge Seeker', desc: 'Land 3 balls in edge slots', target: 3, rewardType: 'coins', rewardAmount: 1500, progressKey: 'land_edge' },
    { id: 'dc_12', name: 'Quick Drops', desc: 'Drop 15 balls', target: 15, rewardType: 'coins', rewardAmount: 300, progressKey: 'drop_ball' },
    { id: 'dc_13', name: 'Pocket Change', desc: 'Earn 2K coins', target: 2000, rewardType: 'coins', rewardAmount: 500, progressKey: 'earn_coins' },
    { id: 'dc_14', name: 'Center Focus', desc: 'Land 5 balls in center slots', target: 5, rewardType: 'coins', rewardAmount: 800, progressKey: 'land_center' },
    { id: 'dc_15', name: 'High Roller', desc: 'Land 3 balls in high-value slots', target: 3, rewardType: 'gems', rewardAmount: 4, progressKey: 'land_high' },
    { id: 'dc_16', name: 'Mass Drop', desc: 'Drop 200 balls', target: 200, rewardType: 'gems', rewardAmount: 7, progressKey: 'drop_ball' },
    { id: 'dc_17', name: 'Rich', desc: 'Earn 50K coins', target: 50000, rewardType: 'gems', rewardAmount: 15, progressKey: 'earn_coins' },
    { id: 'dc_18', name: 'Edge Pro', desc: 'Land 15 balls in edge slots', target: 15, rewardType: 'gems', rewardAmount: 12, progressKey: 'land_edge' },
    { id: 'dc_19', name: 'Steady Drops', desc: 'Drop 75 balls', target: 75, rewardType: 'coins', rewardAmount: 3000, progressKey: 'drop_ball' },
    { id: 'dc_20', name: 'Earn 20K', desc: 'Earn 20K coins', target: 20000, rewardType: 'coins', rewardAmount: 4000, progressKey: 'earn_coins' },
    { id: 'dc_21', name: 'Center King', desc: 'Land 12 balls in center slots', target: 12, rewardType: 'gems', rewardAmount: 6, progressKey: 'land_center' },
    { id: 'dc_22', name: 'Lucky Slots', desc: 'Land 8 balls in high-value slots', target: 8, rewardType: 'gems', rewardAmount: 9, progressKey: 'land_high' },
    { id: 'dc_23', name: 'Drizzle', desc: 'Drop 10 balls', target: 10, rewardType: 'coins', rewardAmount: 200, progressKey: 'drop_ball' },
    { id: 'dc_24', name: 'Small Stack', desc: 'Earn 1K coins', target: 1000, rewardType: 'coins', rewardAmount: 400, progressKey: 'earn_coins' },
    { id: 'dc_25', name: 'Edges Only', desc: 'Land 7 balls in edge slots', target: 7, rewardType: 'gems', rewardAmount: 5, progressKey: 'land_edge' },
    { id: 'dc_26', name: 'Hundred Club', desc: 'Drop 100 balls', target: 100, rewardType: 'gems', rewardAmount: 5, progressKey: 'drop_ball' },
    { id: 'dc_27', name: '30K Earned', desc: 'Earn 30K coins', target: 30000, rewardType: 'gems', rewardAmount: 8, progressKey: 'earn_coins' },
    { id: 'dc_28', name: 'Middle Path', desc: 'Land 10 balls in center slots', target: 10, rewardType: 'coins', rewardAmount: 2000, progressKey: 'land_center' },
    { id: 'dc_29', name: 'Premium Bins', desc: 'Land 10 balls in high-value slots', target: 10, rewardType: 'gems', rewardAmount: 11, progressKey: 'land_high' },
    { id: 'dc_30', name: 'Mega Drop', desc: 'Drop 300 balls', target: 300, rewardType: 'gems', rewardAmount: 10, progressKey: 'drop_ball' },
    { id: 'dc_31', name: 'Fortune', desc: 'Earn 75K coins', target: 75000, rewardType: 'gems', rewardAmount: 20, progressKey: 'earn_coins' },
    { id: 'dc_32', name: 'Edge Legend', desc: 'Land 20 balls in edge slots', target: 20, rewardType: 'gems', rewardAmount: 15, progressKey: 'land_edge' },
    { id: 'dc_33', name: 'Light Rain', desc: 'Drop 30 balls', target: 30, rewardType: 'coins', rewardAmount: 600, progressKey: 'drop_ball' },
    { id: 'dc_34', name: '15K Coins', desc: 'Earn 15K coins', target: 15000, rewardType: 'coins', rewardAmount: 2500, progressKey: 'earn_coins' },
    { id: 'dc_35', name: 'Center Ace', desc: 'Land 15 balls in center slots', target: 15, rewardType: 'gems', rewardAmount: 8, progressKey: 'land_center' },
    { id: 'dc_36', name: 'High Value', desc: 'Land 12 balls in high-value slots', target: 12, rewardType: 'gems', rewardAmount: 12, progressKey: 'land_high' },
    { id: 'dc_37', name: 'Downpour', desc: 'Drop 150 balls', target: 150, rewardType: 'coins', rewardAmount: 4000, progressKey: 'drop_ball' },
    { id: 'dc_38', name: '40K Earned', desc: 'Earn 40K coins', target: 40000, rewardType: 'gems', rewardAmount: 12, progressKey: 'earn_coins' },
    { id: 'dc_39', name: 'Edge Hunter', desc: 'Land 8 balls in edge slots', target: 8, rewardType: 'coins', rewardAmount: 2500, progressKey: 'land_edge' },
    { id: 'dc_40', name: 'Ball Flood', desc: 'Drop 250 balls', target: 250, rewardType: 'gems', rewardAmount: 8, progressKey: 'drop_ball' },
    { id: 'dc_41', name: '50K Coins', desc: 'Earn 50K coins', target: 50000, rewardType: 'coins', rewardAmount: 8000, progressKey: 'earn_coins' },
    { id: 'dc_42', name: 'Center Pro', desc: 'Land 6 balls in center slots', target: 6, rewardType: 'gems', rewardAmount: 3, progressKey: 'land_center' },
    { id: 'dc_43', name: 'Jackpot Feel', desc: 'Land 6 balls in high-value slots', target: 6, rewardType: 'gems', rewardAmount: 5, progressKey: 'land_high' },
    { id: 'dc_44', name: 'Steady Flow', desc: 'Drop 60 balls', target: 60, rewardType: 'coins', rewardAmount: 1500, progressKey: 'drop_ball' },
    { id: 'dc_45', name: '8K Earned', desc: 'Earn 8K coins', target: 8000, rewardType: 'gems', rewardAmount: 4, progressKey: 'earn_coins' },
    { id: 'dc_46', name: 'Sides', desc: 'Land 4 balls in edge slots', target: 4, rewardType: 'coins', rewardAmount: 1000, progressKey: 'land_edge' },
    { id: 'dc_47', name: 'Center Star', desc: 'Land 20 balls in center slots', target: 20, rewardType: 'gems', rewardAmount: 10, progressKey: 'land_center' },
    { id: 'dc_48', name: 'Elite Bins', desc: 'Land 15 balls in high-value slots', target: 15, rewardType: 'gems', rewardAmount: 14, progressKey: 'land_high' },
    { id: 'dc_49', name: '500 Balls', desc: 'Drop 500 balls', target: 500, rewardType: 'gems', rewardAmount: 25, progressKey: 'drop_ball' },
    { id: 'dc_50', name: '100K Club', desc: 'Earn 100K coins', target: 100000, rewardType: 'gems', rewardAmount: 30, progressKey: 'earn_coins' },
];

function getTodayDateKey() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function getYesterdayDateKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// Call once per game load. Updates weekly streak and grants frenzy token at 7 days.
function processWeeklyLogin() {
    const today = getTodayDateKey();
    if (gameState.lastLoginDateKey === today) return; // Already counted today

    const yesterday = getYesterdayDateKey();
    const last = gameState.lastLoginDateKey;
    let streak = gameState.weeklyLoginStreak || 0;

    if (last === yesterday) {
        streak += 1;
    } else {
        streak = 1; // Missed a day or first time
    }

    const required = (typeof CONFIG !== 'undefined' && CONFIG.WEEKLY_STREAK_DAYS) ? CONFIG.WEEKLY_STREAK_DAYS : 7;
    if (streak >= required) {
        gameState.frenzyTokens = (gameState.frenzyTokens || 0) + 1;
        streak = 0; // Reset so they can earn again next week
    }

    gameState.weeklyLoginStreak = streak;
    gameState.lastLoginDateKey = today;
    saveGame();
}

function ensureDailyChallengeState() {
    const today = getTodayDateKey();
    if (gameState.lastDailyChallengeDate !== today) {
        gameState.lastDailyChallengeDate = today;
        gameState.dailyChallengeProgress = {};
        gameState.dailyChallengesClaimed = {};
    }
}

// Deterministic pick of 3 unique challenges for the day (cycled from pool of 50)
function getTodaysChallenges() {
    ensureDailyChallengeState();
    const today = getTodayDateKey();
    let seed = 0;
    for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i);
    const poolLen = DAILY_CHALLENGE_POOL.length;
    const indices = [];
    for (let i = 0; i < 3; i++) {
        let idx = (seed + i * 17 + i * i * 7) % poolLen;
        while (indices.includes(idx)) idx = (idx + 1) % poolLen;
        indices.push(idx);
    }
    return indices.map(i => ({ ...DAILY_CHALLENGE_POOL[i] }));
}

function isDailyAvailable() {
    if (!gameState.lastDailyClaim) return true;
    const last = new Date(gameState.lastDailyClaim);
    return last.toDateString() !== new Date().toDateString();
}

function claimDaily(event) {
    if (!isDailyAvailable()) return false;

    const dayIndex = (gameState.dailyStreak || 0) % DAILY_REWARDS.length;
    const r = DAILY_REWARDS[dayIndex];

    if (r.type === 'coins') {
        gameState.coins += r.amount;
    } else if (r.type === 'gems') {
        gameState.gems += r.amount;
    } else if (r.type === 'both') {
        gameState.coins += r.coins;
        gameState.gems += r.gems;
    }

    gameState.dailyStreak = (gameState.dailyStreak || 0) + 1;
    gameState.lastDailyClaim = new Date().toISOString();

    saveGame();

    // Visual & Audio feedback
    if (event && event.currentTarget) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        if (typeof spawnConfetti === 'function') spawnConfetti(x, y);
        if (typeof particleBurst === 'function') {
            const color = r.type === 'gems' ? '#00E5FF' : (r.type === 'coins' ? '#FFD740' : '#FF6B81');
            particleBurst(x, y, color, 15);
        }
        if (window.AudioEngine && typeof window.AudioEngine.upgradeBuy === 'function') {
            window.AudioEngine.upgradeBuy();
        }
    }

    return true;
}

// Call this when the player does something that counts toward a challenge. 
function recordDailyProgress(progressKey, amount) {
    if (!progressKey || amount <= 0) return;
    ensureDailyChallengeState();
    const challenges = getTodaysChallenges();
    let anyCompleted = false;
    for (const c of challenges) {
        if (c.progressKey !== progressKey) continue;
        if (gameState.dailyChallengesClaimed[c.id]) continue;

        const cur = gameState.dailyChallengeProgress[c.id] || 0;
        if (cur >= c.target) continue; // Already completed but not yet claimed

        const next = Math.min(c.target, cur + amount);
        gameState.dailyChallengeProgress[c.id] = next;

        if (next >= c.target) {
            anyCompleted = true;
        }
    }
    if (anyCompleted || amount > 0) saveGame();
    if (anyCompleted && typeof updateStatsPanel === 'function') updateStatsPanel();
    if (anyCompleted && typeof renderDailyView === 'function') renderDailyView();
}

function claimDailyChallenge(challengeId, event) {
    const challenges = getTodaysChallenges();
    const c = challenges.find(ch => ch.id === challengeId);
    if (!c) return;

    const p = gameState.dailyChallengeProgress[c.id] || 0;
    if (p < c.target || gameState.dailyChallengesClaimed[c.id]) return;

    // Award reward
    if (c.rewardType === 'coins') gameState.coins += c.rewardAmount;
    else if (c.rewardType === 'gems') gameState.gems += c.rewardAmount;

    gameState.dailyChallengesClaimed[c.id] = true;
    saveGame();

    // Visual & Audio feedback
    if (event && event.currentTarget) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        if (typeof spawnConfetti === 'function') spawnConfetti(x, y);
        if (typeof particleBurst === 'function') {
            const color = c.rewardType === 'gems' ? '#00E5FF' : '#FFD740';
            particleBurst(x, y, color, 12);
        }
        if (window.AudioEngine && typeof window.AudioEngine.upgradeBuy === 'function') {
            window.AudioEngine.upgradeBuy();
        }
    }

    if (typeof updateStatsPanel === 'function') updateStatsPanel();
    renderDailyView();
}

function renderDailyView() {
    const grid = document.getElementById('dailyGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const currentDay = (gameState.dailyStreak || 0) % DAILY_REWARDS.length;
    const available = isDailyAvailable();

    DAILY_REWARDS.forEach((r, i) => {
        const d = document.createElement('div');
        d.className = 'daily-day';

        if (i < currentDay || (i === currentDay && !available)) {
            d.classList.add('claimed');
        } else if (i === currentDay && available) {
            d.classList.add('available');
        } else {
            d.classList.add('locked');
        }

        d.innerHTML = `
            <div class="daily-day-num">Day ${i + 1}</div>
            <div class="daily-day-icon">${r.icon}</div>
            <div class="daily-day-reward">${r.reward}</div>
            ${(i === currentDay && available) ? '<div class="daily-claim-prompt">TAP!</div>' : ''}
        `;

        if (i === currentDay && available) {
            d.addEventListener('click', (e) => {
                if (claimDaily(e)) {
                    renderDailyView();
                    updateStatsPanel();
                }
            });
        }
        grid.appendChild(d);
    });

    const badge = document.getElementById('dailyBadge');
    if (badge) badge.style.display = (available || hasUnclaimedChallenges()) ? '' : 'none';

    // Weekly Streak & Frenzy Mode (ensure section exists so it's always visible)
    let weeklySection = document.getElementById('weeklyFrenzySection');
    if (!weeklySection) {
        weeklySection = document.createElement('div');
        weeklySection.id = 'weeklyFrenzySection';
        weeklySection.className = 'weekly-frenzy-section';
        const dailyGrid = document.getElementById('dailyGrid');
        if (dailyGrid && dailyGrid.parentNode) {
            dailyGrid.parentNode.insertBefore(weeklySection, dailyGrid);
        }
    }
    const required = (typeof CONFIG !== 'undefined' && CONFIG.WEEKLY_STREAK_DAYS) ? CONFIG.WEEKLY_STREAK_DAYS : 7;
    const streak = gameState.weeklyLoginStreak || 0;
    const tokens = gameState.frenzyTokens || 0;
    const frenzyActive = typeof runtimeState !== 'undefined' && runtimeState.frenzyActive;
    weeklySection.innerHTML = `
        <div class="category-label">⚡ Frenzy Mode — Weekly Reward</div>
        <div class="weekly-streak-card">
            <div class="weekly-streak-text">Randomized 10-45s of 3× faster drops + FREE high-value balls (100-1K+ coins each). Log in 7 days in a row to earn more.</div>
            <div class="weekly-streak-progress"><span class="weekly-streak-count">${streak}/${required}</span> days this week</div>
            ${tokens > 0 && !frenzyActive ? `
                <button type="button" class="frenzy-activate-btn" id="frenzyActivateBtn">
                    ⚡ Activate Frenzy (${tokens} left)
                </button>
            ` : frenzyActive ? '<div class="frenzy-active-label">Frenzy active on board!</div>' : '<div class="frenzy-locked-label">Earn more by logging in 7 days in a row</div>'}
        </div>
    `;
    const btn = document.getElementById('frenzyActivateBtn');
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            var fn = typeof window.triggerFrenzy === 'function' ? window.triggerFrenzy : (typeof triggerFrenzy === 'function' ? triggerFrenzy : null);
            if (!fn) return;
            fn();
            var boardTab = document.querySelector('.tab[data-view="boardView"]');
            if (boardTab) boardTab.click();
            renderDailyView();
            if (typeof updateStatsPanel === 'function') updateStatsPanel();
        });
    }

    // Daily challenges (3 per day from pool of 50)
    const container = document.getElementById('dailyChallenges');
    if (!container) return;
    container.innerHTML = '';
    const challenges = getTodaysChallenges();
    for (const c of challenges) {
        const p = gameState.dailyChallengeProgress[c.id] || 0;
        const claimed = !!gameState.dailyChallengesClaimed[c.id];
        const completed = p >= c.target;
        const pct = Math.min(100, (p / c.target) * 100);
        const rewardStr = c.rewardType === 'gems' ? `💎 ${c.rewardAmount}` : `🪙 ${typeof formatNumber === 'function' ? formatNumber(c.rewardAmount) : c.rewardAmount}`;

        const card = document.createElement('div');
        let cardClass = 'challenge-card';
        if (claimed) cardClass += ' challenge-claimed';
        else if (completed) cardClass += ' challenge-completed';

        card.className = cardClass;
        card.innerHTML = `
            <div class="challenge-header">
                <span class="challenge-name">${claimed ? '✅' : (completed ? '✨' : '🎯')} ${c.name}</span>
                <span class="challenge-reward">${rewardStr}</span>
            </div>
            <div class="challenge-progress-bar">
                <div class="challenge-progress-fill" style="width:${pct}%"></div>
            </div>
            <div class="challenge-text">
                ${c.desc} — ${Math.min(p, c.target)}/${c.target}
                ${claimed ? ' (Claimed)' : (completed ? ' <span class="claim-prompt">— TAP TO CLAIM!</span>' : '')}
            </div>
        `;

        if (completed && !claimed) {
            card.addEventListener('click', (e) => claimDailyChallenge(c.id, e));
        }

        container.appendChild(card);
    }
}

function hasUnclaimedChallenges() {
    ensureDailyChallengeState();
    const challenges = getTodaysChallenges();
    return challenges.some(c => {
        const p = gameState.dailyChallengeProgress[c.id] || 0;
        const claimed = !!gameState.dailyChallengesClaimed[c.id];
        return p >= c.target && !claimed;
    });
}
