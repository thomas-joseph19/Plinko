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

function isDailyAvailable() {
    if (!gameState.lastDailyClaim) return true;
    const last = new Date(gameState.lastDailyClaim);
    return last.toDateString() !== new Date().toDateString();
}

function claimDaily() {
    if (!isDailyAvailable()) return false;
    const dayIndex = gameState.dailyStreak % DAILY_REWARDS.length;
    const r = DAILY_REWARDS[dayIndex];
    if (r.type === 'coins') gameState.coins += r.amount;
    else if (r.type === 'gems') gameState.gems += r.amount;
    else { gameState.coins += r.coins; gameState.gems += r.gems; }
    gameState.dailyStreak++;
    gameState.lastDailyClaim = new Date().toISOString();
    saveGame();
    return true;
}

function renderDailyView() {
    const grid = document.getElementById('dailyGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const currentDay = gameState.dailyStreak % DAILY_REWARDS.length;
    const available = isDailyAvailable();

    DAILY_REWARDS.forEach((r, i) => {
        const d = document.createElement('div');
        d.className = 'daily-day';
        if (i < currentDay || (i === currentDay && !available)) d.classList.add('claimed');
        else if (i === currentDay && available) d.classList.add('available');
        else d.classList.add('locked');
        d.innerHTML = `<div class="daily-day-num">Day ${i + 1}</div><div class="daily-day-icon">${r.icon}</div><div class="daily-day-reward">${r.reward}</div>`;
        if (i === currentDay && available) {
            d.addEventListener('click', () => {
                if (claimDaily()) { renderDailyView(); updateStatsPanel(); }
            });
        }
        grid.appendChild(d);
    });

    const badge = document.getElementById('dailyBadge');
    if (badge) badge.style.display = available ? '' : 'none';

    // Challenges
    const container = document.getElementById('dailyChallenges');
    if (!container) return;
    container.innerHTML = '';
    const challenges = [
        { name: 'Edge Runner', desc: 'Land 5 balls in edge slots', target: 5, reward: '💎 3', id: 'land_edge' },
        { name: 'Ball Storm', desc: 'Drop 50 balls', target: 50, reward: '🪙 2K', id: 'drop_50' },
        { name: 'Money Maker', desc: 'Earn 10K coins', target: 10000, reward: '💎 5', id: 'earn_10k' },
    ];
    for (const c of challenges) {
        const p = gameState.challengeProgress[c.id] || 0;
        const pct = Math.min(100, (p / c.target) * 100);
        const card = document.createElement('div');
        card.className = 'challenge-card';
        card.innerHTML = `<div class="challenge-header"><span class="challenge-name">${pct >= 100 ? '✅' : '🎯'} ${c.name}</span><span class="challenge-reward">${c.reward}</span></div><div class="challenge-progress-bar"><div class="challenge-progress-fill" style="width:${pct}%"></div></div><div class="challenge-text">${c.desc} — ${Math.min(p, c.target)}/${c.target}</div>`;
        container.appendChild(card);
    }
}
