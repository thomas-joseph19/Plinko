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
    container.innerHTML = '<div class="category-label">💎 Gem Shop</div>';

    const grid = document.createElement('div');
    grid.className = 'shop-grid';

    for (const item of SHOP_ITEMS) {
        const el = document.createElement('div');
        el.className = 'shop-item';
        const affordable = gameState.gems >= item.cost;
        el.innerHTML = `
      <div class="shop-item-icon">${item.icon}</div>
      <div class="shop-item-name">${item.name}</div>
      <div class="shop-item-desc">${item.desc}</div>
      <div class="shop-item-price" style="${affordable ? '' : 'opacity:0.4'}">${item.price}</div>
    `;
        el.addEventListener('click', () => {
            if (gameState.gems < item.cost) return;
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
                triggerFever();
            }
            renderShopView();
            updateStatsPanel();
            saveGame();
        });
        grid.appendChild(el);
    }
    container.appendChild(grid);
}
