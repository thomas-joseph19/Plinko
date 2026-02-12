/* ═══════════════════════════════════════════════
   PLINKO∞ — Shop
   ═══════════════════════════════════════════════ */

const SHOP_ITEMS = [
    { id: 'bin_doubler', icon: '🎰', name: 'Bin Doubler', desc: 'Permanently double all bin values', price: '💎 100', cost: 100, type: 'gems' },
    { id: 'ball_rain', icon: '🌧️', name: 'Ball Rain', desc: '1,000 balls with edge gravity', price: '💎 10', cost: 10, type: 'gems' },
    { id: 'coin_trade', icon: '🪙', name: 'Coin Trade', desc: 'Get 100,000 coins', price: '💎 10', cost: 10, type: 'gems' },
    { id: 'drop_doubler', icon: '⚡', name: 'Drop Doubler', desc: 'Permanently double ball drop rate', price: '💎 20', cost: 20, type: 'gems' },
    { id: 'event_extender', icon: '⏱️', name: 'Event Extender', desc: 'All events last +15s (Max 5m)', price: '💎 20', cost: 20, type: 'gems' },
];

function renderShopView() {
    const container = document.getElementById('shopItems');
    if (!container) return;
    container.innerHTML = '<div class="category-label">💎 Gem Shop</div>';

    const grid = document.createElement('div');
    grid.className = 'shop-grid';

    for (const item of SHOP_ITEMS) {
        const el = document.createElement('div');
        el.className = 'shop-item';

        let disabled = false;
        if (item.id === 'event_extender' && (gameState.upgrades.gemEventDurationBonus || 0) >= 270) {
            disabled = true;
        }

        const affordable = gameState.gems >= item.cost && !disabled;

        el.innerHTML = `
      <div class="shop-item-icon">${item.icon}</div>
      <div class="shop-item-name">${item.name}</div>
      <div class="shop-item-desc">${item.desc}</div>
      <div class="shop-item-price" style="${affordable ? '' : 'opacity:0.4; color: #ef4444'}">${disabled ? 'MAXED' : item.price}</div>
    `;

        el.addEventListener('click', () => {
            if (gameState.gems < item.cost || disabled) return;
            gameState.gems -= item.cost;

            if (item.id === 'bin_doubler') {
                gameState.upgrades.gemBinMultiplier = (gameState.upgrades.gemBinMultiplier || 0) + 1;
                if (typeof renderSlotTray === 'function') renderSlotTray(getBoardRows());
            } else if (item.id === 'ball_rain') {
                if (typeof triggerBallRain === 'function') triggerBallRain();
            } else if (item.id === 'coin_trade') {
                gameState.coins += 100000;
                gameState.totalCoinsEarned += 100000;
            } else if (item.id === 'drop_doubler') {
                gameState.upgrades.gemDropRateMultiplier = (gameState.upgrades.gemDropRateMultiplier || 1) * 2;
                if (typeof startAutoDroppers === 'function') startAutoDroppers();
                if (typeof renderDroppers === 'function') renderDroppers();
            } else if (item.id === 'event_extender') {
                gameState.upgrades.gemEventDurationBonus = (gameState.upgrades.gemEventDurationBonus || 0) + 15;
            }

            renderShopView();
            updateStatsPanel();
            saveGame();
        });
        grid.appendChild(el);
    }
    container.appendChild(grid);
}
