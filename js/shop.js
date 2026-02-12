/* ═══════════════════════════════════════════════
   PLINKO∞ — Shop
   ═══════════════════════════════════════════════ */

const SHOP_ITEMS = [
    { id: 'coin_small', icon: '🪙', name: 'Coin Pack S', desc: '5,000 Coins', price: '💎 10', cost: 10, type: 'gems', give: 'coins', amount: 5000 },
    { id: 'coin_med', icon: '💰', name: 'Coin Pack M', desc: '25,000 Coins', price: '💎 40', cost: 40, type: 'gems', give: 'coins', amount: 25000 },
    { id: 'coin_lg', icon: '🏦', name: 'Coin Pack L', desc: '100,000 Coins', price: '💎 120', cost: 120, type: 'gems', give: 'coins', amount: 100000 },
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
            if (window.AudioEngine) window.AudioEngine.upgradeBuy();

            gameState.gems -= item.cost;
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
            }
            renderShopView();
            updateStatsPanel();
            saveGame();
        });
        grid.appendChild(el);
    }
    gemSection.appendChild(grid);
    container.appendChild(gemSection);
}
