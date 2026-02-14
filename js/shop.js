/* ═══════════════════════════════════════════════
   PLINKO∞ — Shop
   ═══════════════════════════════════════════════ */

const SHOP_ITEMS = [
    { id: 'coin_small', icon: '🪙', name: 'Coin Pack S', desc: '5,000 Coins', price: '💎 10', cost: 10, type: 'gems', give: 'coins', amount: 5000 },
    { id: 'coin_med', icon: '💰', name: 'Coin Pack M', desc: '25,000 Coins', price: '💎 40', cost: 40, type: 'gems', give: 'coins', amount: 25000 },
    { id: 'coin_lg', icon: '🏦', name: 'Coin Pack L', desc: '100,000 Coins', price: '💎 120', cost: 120, type: 'gems', give: 'coins', amount: 100000 },
    { id: 'bin_doubler', icon: '🎰', name: 'Bin Doubler', desc: 'Permanently double all bin values', price: '💎 100', cost: 100, type: 'gems', give: 'upgrade' },
    { id: 'ball_rain', icon: '🌧️', name: 'Ball Rain', desc: '1,000 balls with edge gravity', price: '💎 10', cost: 10, type: 'gems', give: 'rain' },
    { id: 'drop_doubler', icon: '⚡', name: 'Drop Doubler', desc: 'Permanently double ball drop rate', price: '💎 20', cost: 20, type: 'gems', give: 'upgrade' },
    { id: 'event_extender', icon: '⏱️', name: 'Event Extender', desc: 'All events last +15s (Max 5m)', price: '💎 20', cost: 20, type: 'gems', give: 'upgrade' },
    { id: 'ball_storm', icon: '🌪️', name: 'Ball Storm', desc: 'Drop 50 balls instantly!', price: '💎 15', cost: 15, type: 'gems', give: 'storm', amount: 50 },
    { id: 'lucky_pack', icon: '🍀', name: 'Lucky Pack', desc: '10 guaranteed golden balls', price: '💎 20', cost: 20, type: 'gems', give: 'lucky', amount: 10 },
    { id: 'fever_now', icon: '🔥', name: 'Instant Fever', desc: 'Trigger Fever Mode now!', price: '💎 25', cost: 25, type: 'gems', give: 'fever', amount: 1 },
];

function renderShopView() {
    const container = document.getElementById('shopItems');
    if (!container) return;
    container.innerHTML = '';

    // ── Premium Section (No Ads) ──
    if (window.Monetization && !window.Monetization.isPremium) {
        const premiumSection = document.createElement('div');
        premiumSection.className = 'shop-section';
        premiumSection.innerHTML = '<div class="category-label" style="color:var(--accent2)">🌟 Premium</div>';

        const noAdsBtn = document.createElement('div');
        noAdsBtn.className = 'shop-item premium-item remove-ads-btn';
        noAdsBtn.innerHTML = `
            <div class="shop-item-icon">🚫</div>
            <div class="shop-item-name">No Ads Bundle</div>
            <div class="shop-item-desc">Remove forced ads & support dev!</div>
            <div class="shop-item-price">$2.99</div>
        `;
        noAdsBtn.addEventListener('click', () => {
            window.Monetization.purchaseNoAds();
        });
        premiumSection.appendChild(noAdsBtn);
        container.appendChild(premiumSection);
    }

    // ── Free Stuff (Ads) ──
    if (window.Monetization) {
        const adSection = document.createElement('div');
        adSection.className = 'shop-section';
        adSection.innerHTML = '<div class="category-label" style="color:var(--accent1)">📺 Free Stuff</div>';

        const watchAdBtn = document.createElement('div');
        watchAdBtn.className = 'shop-item ad-item';
        watchAdBtn.innerHTML = `
            <div class="shop-item-icon">🎁</div>
            <div class="shop-item-name">Watch Ad</div>
            <div class="shop-item-desc">Get +50 Balls instantly</div>
            <div class="shop-item-price">FREE</div>
        `;
        watchAdBtn.addEventListener('click', () => {
            window.Monetization.showRewardedAd(() => {
                // Reward: 50 balls
                for (let i = 0; i < 50; i++) {
                    setTimeout(() => spawnBall(null, 15), i * 50);
                }
                alert('Reward: +50 Balls delivered!');
            }, () => {
                alert('Ad cancelled - no reward.');
            });
        });
        adSection.appendChild(watchAdBtn);
        container.appendChild(adSection);
    }

    // ── Gem Shop ──
    const gemSection = document.createElement('div');
    gemSection.className = 'shop-section';
    gemSection.innerHTML = '<div class="category-label">💎 Gem Shop</div>';

    const grid = document.createElement('div');
    grid.className = 'shop-grid';

    for (const item of SHOP_ITEMS) {
        // ... (existing item logic)
        const el = document.createElement('div');
        el.className = 'shop-item';
        const affordable = gameState.gems >= item.cost;
        // Make unavailable items dimmer
        const style = affordable ? '' : 'opacity: 0.5; filter: grayscale(1); pointer-events: none;';

        el.innerHTML = `
      <div class="shop-item-icon">${item.icon}</div>
      <div class="shop-item-name">${item.name}</div>
      <div class="shop-item-desc">${item.desc}</div>
      <div class="shop-item-price" style="${style}">${item.price}</div>
    `;
        el.addEventListener('click', () => {
            if (gameState.gems < item.cost) return;
            // Purchase logic
            if (window.AudioEngine && typeof window.AudioEngine.upgradeBuy === 'function') window.AudioEngine.upgradeBuy();

            gameState.gems -= item.cost;

            // Confetti visual feedback
            if (window.spawnConfetti) {
                const rect = el.getBoundingClientRect();
                window.spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }
            if (window.AudioEngine && typeof window.AudioEngine.upgradeBuy === 'function') window.AudioEngine.upgradeBuy();

            if (item.give === 'coins') {
                gameState.coins += item.amount;
            } else if (item.give === 'storm') {
                for (let i = 0; i < item.amount; i++) {
                    setTimeout(() => spawnBall(null, 15), i * 40);
                }
            } else if (item.give === 'lucky') {
                for (let i = 0; i < item.amount; i++) {
                    setTimeout(() => spawnBall(null, 15, true), i * 100);
                }
            } else if (item.give === 'fever') {
                if (typeof triggerFever === 'function') triggerFever();
            } else if (item.give === 'rain') {
                if (typeof triggerBallRain === 'function') triggerBallRain();
            } else if (item.give === 'upgrade') {
                if (item.id === 'bin_doubler') {
                    gameState.upgrades.gemBinMultiplier = (gameState.upgrades.gemBinMultiplier || 0) + 1;
                    if (typeof renderSlotTray === 'function') renderSlotTray(getBoardRows());
                } else if (item.id === 'drop_doubler') {
                    gameState.upgrades.gemDropRateMultiplier = (gameState.upgrades.gemDropRateMultiplier || 1) * 2;
                    if (typeof stopAutoDroppers === 'function') stopAutoDroppers();
                    if (typeof startAutoDroppers === 'function') startAutoDroppers();
                } else if (item.id === 'event_extender') {
                    gameState.upgrades.gemEventDurationBonus = (gameState.upgrades.gemEventDurationBonus || 0) + 15;
                }
            }
            renderShopView();
            updateStatsPanel();
            saveGame();
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
    buyGemsGrid.className = 'shop-grid';

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
