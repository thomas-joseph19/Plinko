/* ═══════════════════════════════════════════════
   PLINKO∞ — Shop
   ═══════════════════════════════════════════════ */

const SHOP_ITEMS = [
    { id: 'coin_small', icon: '🪙', name: 'Coin Pack S', desc: '5,000 Coins', price: '💎 10', cost: 10, type: 'gems', give: 'coins', amount: 5000 },
    { id: 'coin_med', icon: '💰', name: 'Coin Pack M', desc: '25,000 Coins', price: '💎 40', cost: 40, type: 'gems', give: 'coins', amount: 25000 },
    { id: 'coin_lg', icon: '🏦', name: 'Coin Pack L', desc: '100,000 Coins', price: '💎 120', cost: 120, type: 'gems', give: 'coins', amount: 100000 },
    { id: 'bin_doubler', icon: '🎰', name: 'Bin Boost', desc: '+25% bin values (stacks up to 5×)', price: '💎 100', cost: 100, type: 'gems', give: 'upgrade', maxLevel: 5 },
    { id: 'ball_rain', icon: '🌧️', name: 'Ball Rain', desc: '200 free balls rain down fast', price: '💎 50', cost: 50, type: 'gems', give: 'rain' },
    { id: 'drop_doubler', icon: '⚡', name: 'Drop Boost', desc: '+50% drop rate (stacks up to 5×)', price: '💎 20', cost: 20, type: 'gems', give: 'upgrade', maxLevel: 5 },
    { id: 'event_extender', icon: '⏱️', name: 'Event Extender', desc: 'All events last +15s (max 5 purchases)', price: '💎 20', cost: 20, type: 'gems', give: 'upgrade', maxLevel: 5 },
    { id: 'ball_storm', icon: '🌪️', name: 'Ball Storm', desc: '50 balls drop instantly (Bet: 10)', price: '💎 15', cost: 15, type: 'gems', give: 'storm', amount: 50 },
    { id: 'lucky_pack', icon: '🍀', name: 'Lucky Pack', desc: '10 guaranteed golden balls', price: '💎 20', cost: 20, type: 'gems', give: 'lucky', amount: 10 },
    { id: 'fever_now', icon: '🔥', name: 'Instant Fever', desc: 'Trigger Fever Mode now!', price: '💎 25', cost: 25, type: 'gems', give: 'fever', amount: 1 },
];

// ── Confirmation Dialog ──
function showShopConfirm(item, onConfirm) {
    // Remove any existing dialog
    const existing = document.querySelector('.shop-confirm-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'shop-confirm-overlay';

    // Build level info for upgrades
    let levelInfo = '';
    if (item.give === 'upgrade' && item.maxLevel) {
        const current = getUpgradeLevel(item.id);
        if (current >= item.maxLevel) {
            levelInfo = `<div class="shop-confirm-level">Already maxed! (${current}/${item.maxLevel})</div>`;
        } else {
            levelInfo = `<div class="shop-confirm-level">Level ${current} → ${current + 1} / ${item.maxLevel}</div>`;
        }
    }

    overlay.innerHTML = `
        <div class="shop-confirm-dialog">
            <div class="shop-confirm-icon">${item.icon}</div>
            <div class="shop-confirm-title">${item.name}</div>
            <div class="shop-confirm-desc">${item.desc}</div>
            ${levelInfo}
            <div class="shop-confirm-cost">${item.price}</div>
            <div class="shop-confirm-balance">You have: 💎 ${gameState.gems}</div>
            <div class="shop-confirm-buttons">
                <button class="shop-confirm-cancel" id="shopConfirmCancel">Cancel</button>
                <button class="shop-confirm-buy" id="shopConfirmBuy">Buy</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });

    document.getElementById('shopConfirmCancel').addEventListener('click', () => overlay.remove());
    document.getElementById('shopConfirmBuy').addEventListener('click', () => {
        overlay.remove();
        onConfirm();
    });
}

// ── Get current level of a permanent upgrade ──
function getUpgradeLevel(itemId) {
    if (itemId === 'bin_doubler') return gameState.upgrades.gemBinMultiplier || 0;
    if (itemId === 'drop_doubler') {
        // Convert multiplier back to level: 1.5^level
        const mult = gameState.upgrades.gemDropRateMultiplier || 1;
        return Math.round(Math.log(mult) / Math.log(1.5));
    }
    if (itemId === 'event_extender') return Math.floor((gameState.upgrades.gemEventDurationBonus || 0) / 15);
    return 0;
}

// ── Execute Purchase ──
function executePurchase(item, el) {
    if (gameState.gems < item.cost) {
        if (typeof showToast === 'function') showToast('Not enough gems!', 'error');
        return;
    }

    // Check max level for upgrades
    if (item.give === 'upgrade' && item.maxLevel) {
        const level = getUpgradeLevel(item.id);
        if (level >= item.maxLevel) {
            if (typeof showToast === 'function') showToast('Already maxed out!', 'error');
            return;
        }
    }

    // Deduct gems
    gameState.gems -= item.cost;

    // Audio feedback
    if (window.AudioEngine && typeof window.AudioEngine.upgradeBuy === 'function') {
        window.AudioEngine.upgradeBuy();
    }

    // Confetti visual
    if (typeof spawnConfetti === 'function' && el) {
        const rect = el.getBoundingClientRect();
        spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    // ── Apply item effect ──
    if (item.give === 'coins') {
        gameState.coins += item.amount;
        if (typeof showToast === 'function') showToast(`+${typeof formatNumber === 'function' ? formatNumber(item.amount) : item.amount} Coins!`, 'info');

    } else if (item.give === 'storm') {
        // Ball Storm: 50 free balls dropped at bet=10
        const count = item.amount || 50;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                if (typeof spawnBall === 'function') spawnBall(null, 15, false, 10, true);
            }, i * 60);
        }
        if (typeof showToast === 'function') showToast(`🌪️ ${count} balls incoming!`, 'info');

    } else if (item.give === 'lucky') {
        const count = item.amount || 10;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                if (typeof spawnBall === 'function') spawnBall(null, 15, true, null, true);
            }, i * 100);
        }
        if (typeof showToast === 'function') showToast(`🍀 ${count} golden balls!`, 'info');

    } else if (item.give === 'fever') {
        if (typeof triggerFever === 'function') {
            triggerFever();
            if (typeof showToast === 'function') showToast('🔥 Fever activated!', 'info');
        }

    } else if (item.give === 'rain') {
        if (typeof triggerBallRain === 'function') {
            triggerBallRain();
            if (typeof showToast === 'function') showToast('🌧️ Ball rain!', 'info');
        }

    } else if (item.give === 'upgrade') {
        if (item.id === 'bin_doubler') {
            // +25% per level (1.25^level), max 5 levels = ~3.05× multiplier
            gameState.upgrades.gemBinMultiplier = (gameState.upgrades.gemBinMultiplier || 0) + 1;
            if (typeof renderSlotTray === 'function') renderSlotTray(getBoardRows());
            const newLevel = gameState.upgrades.gemBinMultiplier;
            const totalMult = Math.pow(1.25, newLevel).toFixed(2);
            if (typeof showToast === 'function') showToast(`🎰 Bin Boost Lv${newLevel}! (${totalMult}× bins)`, 'info');

        } else if (item.id === 'drop_doubler') {
            // +50% per level (1.5^level), max 5 levels = ~7.6× rate
            gameState.upgrades.gemDropRateMultiplier = (gameState.upgrades.gemDropRateMultiplier || 1) * 1.5;
            if (typeof stopAutoDroppers === 'function') stopAutoDroppers();
            if (typeof startAutoDroppers === 'function') startAutoDroppers();
            const newLevel = getUpgradeLevel('drop_doubler');
            if (typeof showToast === 'function') showToast(`⚡ Drop Boost Lv${newLevel}!`, 'info');

        } else if (item.id === 'event_extender') {
            gameState.upgrades.gemEventDurationBonus = (gameState.upgrades.gemEventDurationBonus || 0) + 15;
            const newLevel = getUpgradeLevel('event_extender');
            if (typeof showToast === 'function') showToast(`⏱️ Events +${newLevel * 15}s!`, 'info');
        }
    }

    renderShopView();
    if (typeof updateStatsPanel === 'function') updateStatsPanel();
    if (typeof saveGame === 'function') saveGame();
}

function renderShopView() {
    const container = document.getElementById('shopItems');
    if (!container) return;
    container.innerHTML = '';

    // ── Special: Premium + Free in one row (2 columns) ──
    if (window.Monetization) {
        const specialSection = document.createElement('div');
        specialSection.className = 'shop-section';
        specialSection.innerHTML = '<div class="category-label shop-label-special">⭐ Special</div>';
        const specialGrid = document.createElement('div');
        specialGrid.className = 'shop-grid shop-grid-2';

        if (!window.Monetization.isPremium) {
            const noAdsBtn = document.createElement('div');
            noAdsBtn.className = 'shop-item premium-item remove-ads-btn';
            noAdsBtn.innerHTML = `
                <div class="shop-item-icon">🚫</div>
                <div class="shop-item-name">No Ads</div>
                <div class="shop-item-desc">Remove ads & support dev</div>
                <div class="shop-item-price">$2.99</div>
            `;
            noAdsBtn.addEventListener('click', () => window.Monetization.purchaseNoAds());
            specialGrid.appendChild(noAdsBtn);
        }
        const watchAdBtn = document.createElement('div');
        watchAdBtn.className = 'shop-item ad-item';
        watchAdBtn.innerHTML = `
            <div class="shop-item-icon">🎁</div>
            <div class="shop-item-name">Watch Ad</div>
            <div class="shop-item-desc">+50 Balls free</div>
            <div class="shop-item-price">FREE</div>
        `;
        watchAdBtn.addEventListener('click', () => {
            window.Monetization.showRewardedAd(() => {
                for (let i = 0; i < 50; i++) setTimeout(() => spawnBall(null, 15), i * 50);
                if (typeof showToast === 'function') showToast('🎁 +50 Balls delivered!', 'info');
            }, () => {
                if (typeof showToast === 'function') showToast('Ad cancelled', 'error');
            });
        });
        specialGrid.appendChild(watchAdBtn);
        specialSection.appendChild(specialGrid);
        container.appendChild(specialSection);
    }

    // ── Gem Shop ──
    const gemSection = document.createElement('div');
    gemSection.className = 'shop-section';
    gemSection.innerHTML = '<div class="category-label">💎 Gem Shop</div>';

    const grid = document.createElement('div');
    grid.className = 'shop-grid shop-grid-4';

    for (const item of SHOP_ITEMS) {
        const el = document.createElement('div');
        el.className = 'shop-item';
        const affordable = gameState.gems >= item.cost;
        if (!affordable) el.classList.add('shop-item-unaffordable');

        // Check if maxed
        let isMaxed = false;
        let levelTag = '';
        if (item.give === 'upgrade' && item.maxLevel) {
            const level = getUpgradeLevel(item.id);
            isMaxed = level >= item.maxLevel;
            levelTag = `<div class="shop-item-level">${isMaxed ? 'MAX' : `Lv ${level}/${item.maxLevel}`}</div>`;
            if (isMaxed) el.classList.add('shop-item-maxed');
        }

        el.innerHTML = `
            <div class="shop-item-icon">${item.icon}</div>
            <div class="shop-item-name">${item.name}</div>
            <div class="shop-item-desc">${item.desc}</div>
            ${levelTag}
            <div class="shop-item-price">${item.price}</div>
        `;

        el.addEventListener('click', () => {
            if (isMaxed) {
                if (typeof showToast === 'function') showToast('Already maxed!', 'error');
                return;
            }
            if (!affordable) {
                if (typeof showToast === 'function') showToast('Not enough gems!', 'error');
                return;
            }
            showShopConfirm(item, () => executePurchase(item, el));
        });
        grid.appendChild(el);
    }
    gemSection.appendChild(grid);
    container.appendChild(gemSection);


    // ── Buy Gems Section (Real Money) ──
    const buyGemsSection = document.createElement('div');
    buyGemsSection.className = 'shop-section';
    buyGemsSection.innerHTML = '<div class="category-label" style="color:var(--accent2)">💎 Buy Gems</div>';

    const buyGemsGrid = document.createElement('div');
    buyGemsGrid.className = 'shop-grid shop-grid-3';

    const GEM_PACKS = [
        { amount: 10, price: '2.99' },
        { amount: 50, price: '12.99' },
        { amount: 100, price: '25.99' }
    ];

    GEM_PACKS.forEach(pack => {
        const el = document.createElement('div');
        el.className = 'shop-item';
        el.innerHTML = `
            <div class="shop-item-icon">💎</div>
            <div class="shop-item-name">${pack.amount} Gems</div>
            <div class="shop-item-desc">Premium currency for upgrades</div>
            <div class="shop-item-price">$${pack.price}</div>
        `;
        el.addEventListener('click', async () => {
            if (window.Monetization) {
                const success = await window.Monetization.purchaseGems(pack.amount, pack.price);
                if (success) renderShopView();
            }
        });
        buyGemsGrid.appendChild(el);
    });

    buyGemsSection.appendChild(buyGemsGrid);
    container.appendChild(buyGemsSection);
}
