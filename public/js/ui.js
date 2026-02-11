/* ═══════════════════════════════════════════════
   PLINKO∞ — UI Rendering & Interaction
   ═══════════════════════════════════════════════ */

// ── Render Slot Tray ──
function renderSlotTray(rows) {
    const tray = document.getElementById('slotTray');
    if (!tray) return;

    const multipliers = runtimeState.currentMultipliers || CONFIG.SLOT_MULTIPLIERS[rows] || CONFIG.SLOT_MULTIPLIERS[5];
    tray.innerHTML = '';

    multipliers.forEach((mult, i) => {
        const slot = document.createElement('div');
        const type = getSlotType(mult);
        slot.className = 'slot ' + type;
        if (i === runtimeState.jackpotSlot) slot.classList.add('jackpot');

        slot.innerHTML = `<span class="mult">${mult >= 1000 ? formatCost(mult) : mult}</span><span class="x">×</span>`;
        tray.appendChild(slot);
    });
}

// ── Render Dropper Indicators ──
function renderDroppers() {
    const container = document.getElementById('dropperIndicators');
    const label = document.getElementById('dropLabel');
    if (!container) return;

    const count = getDropperCount();
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = 'drop-indicator';
        container.appendChild(dot);
    }

    if (label) {
        const bps = getBallsPerSecond().toFixed(1);
        label.textContent = `AUTO-DROP ×${count} · ${bps}/s`;
    }
}

// ── Render Upgrade Card ──
function createUpgradeCard(id, compact) {
    const u = UPGRADES[id];
    const level = gameState.upgrades[id] || 0;
    const maxed = level >= u.maxLevel;
    const cost = getUpgradeCost(id);
    const affordable = gameState.coins >= cost;

    const card = document.createElement('div');
    card.className = 'upgrade-card';
    if (maxed) card.classList.add('maxed');
    if (!maxed && affordable) card.classList.add('affordable');
    card.dataset.upgradeId = id;

    const levelLabel = maxed
        ? '<span class="upgrade-level maxed-label">MAX</span>'
        : `<span class="upgrade-level">Lv ${level}</span>`;

    const progressPct = maxed ? 100 : (level / u.maxLevel) * 100;
    const fillClass = maxed ? 'upgrade-progress-fill maxed-fill' : 'upgrade-progress-fill';

    const costLabel = maxed
        ? '<div class="upgrade-cost" style="color:var(--gold)">✓ Done</div>'
        : `<div class="upgrade-cost ${affordable ? '' : 'unaffordable'}">🪙 ${formatCost(cost)}</div>`;

    const effectLine = !compact && !maxed
        ? `<div class="upgrade-effect">→ ${u.effect(level + 1)}</div>`
        : (maxed ? `<div class="upgrade-effect" style="color:var(--gold)">→ ${u.effect(level)}</div>` : '');

    card.innerHTML = `
    <div class="upgrade-header">
      <span class="upgrade-name">${u.name}</span>
      ${levelLabel}
    </div>
    ${!compact ? `<div class="upgrade-desc">${u.desc}</div>` : ''}
    ${effectLine}
    <div class="upgrade-footer">
      <div class="upgrade-progress"><div class="${fillClass}" style="width:${progressPct}%"></div></div>
      ${costLabel}
    </div>
  `;

    if (!maxed) {
        // Enhanced touch handling
        card.addEventListener('touchstart', () => {
            if (typeof triggerHaptic === 'function') triggerHaptic('selection');
        }, { passive: true });

        card.addEventListener('click', () => {
            if (purchaseUpgrade(id)) {
                if (typeof triggerHaptic === 'function') triggerHaptic('success');
                card.classList.add('purchased');
                setTimeout(() => card.classList.remove('purchased'), 400);
                // Refresh UI
                refreshUpgradeUI();
                updateStatsPanel();
                renderDroppers();
                // Restart auto-droppers if relevant upgrade
                if (['dropSpeed', 'ballCount', 'multiDropper', 'dropAim'].includes(id)) {
                    stopAutoDroppers();
                    startAutoDroppers();
                }
            } else {
                if (typeof triggerHaptic === 'function') triggerHaptic('error');
                card.classList.add('rejected');
                setTimeout(() => card.classList.remove('rejected'), 350);
            }
        });
    }

    return card;
}

// ── Render All Upgrades (full view) ──
function renderUpgradesView() {
    const categories = {
        ball: document.getElementById('ballUpgrades'),
        dropper: document.getElementById('dropperUpgrades'),
        board: document.getElementById('boardUpgrades'),
        passive: document.getElementById('passiveUpgrades'),
    };

    for (const key in categories) {
        if (categories[key]) categories[key].innerHTML = '';
    }

    for (const id in UPGRADES) {
        const u = UPGRADES[id];
        const container = categories[u.category];
        if (container) {
            container.appendChild(createUpgradeCard(id, false));
        }
    }
}

// ── Render Quick Upgrades (side panel + stats tab) ──
function renderQuickUpgrades() {
    const containers = [
        document.getElementById('quickUpgrades'),
        document.getElementById('quickUpgrades2')
    ].filter(Boolean);
    if (containers.length === 0) return;
    containers.forEach(c => c.innerHTML = '');

    // Show top 3 affordable + cheapest unaffordable
    const sortedIds = Object.keys(UPGRADES)
        .filter(id => !isMaxed(id))
        .sort((a, b) => getUpgradeCost(a) - getUpgradeCost(b));

    const shown = sortedIds.slice(0, 4);

    for (const id of shown) {
        containers.forEach(c => c.appendChild(createUpgradeCard(id, true)));
    }
}

// ── Refresh all upgrade UIs ──
function refreshUpgradeUI() {
    renderUpgradesView();
    renderQuickUpgrades();

    // Upgrade badge
    const badge = document.getElementById('upgradeBadge');
    const count = countAffordableUpgrades();
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = '';
        } else {
            badge.style.display = 'none';
        }
    }
}

// ── Update Stats Panel ──
function updateStatsPanel() {
    // Calculate smooth CPS from recent data
    const now = Date.now();
    runtimeState.recentCps = runtimeState.recentCps.filter(e => now - e.time < 3000);
    const recentTotal = runtimeState.recentCps.reduce((sum, e) => sum + e.amount, 0);
    const recentCps = runtimeState.recentCps.length > 0 ? recentTotal / 3 : 0;

    // Smooth it
    runtimeState.smoothCps = runtimeState.smoothCps * 0.8 + recentCps * 0.2;

    const cps = runtimeState.smoothCps > 0 ? runtimeState.smoothCps : getCoinsPerSecond();

    const cpsText = formatNumber(Math.round(cps));
    const bpsText = getBallsPerSecond().toFixed(1);
    const multText = '×' + getGlobalMultiplier().toFixed(1);
    const rowsText = String(getBoardRows());
    const prestigeText = 'Lv. ' + gameState.prestigeLevel;
    const combo = runtimeState.consecutiveHits || 0;
    const comboText = combo > 1 ? `×${combo}` : '×1';

    // Update both old side-panel IDs and new Stats tab IDs
    setTextIfChanged('statCps', cpsText);
    setTextIfChanged('statCps2', cpsText);
    setTextIfChanged('statBps', bpsText);
    setTextIfChanged('statBps2', bpsText);
    setTextIfChanged('statMult', multText);
    setTextIfChanged('statMult2', multText);
    setTextIfChanged('statRows', rowsText);
    setTextIfChanged('statRows2', rowsText);
    setTextIfChanged('statPrestige', prestigeText);
    setTextIfChanged('statPrestige2', prestigeText);
    setTextIfChanged('statCombo', comboText);
    setTextIfChanged('statCombo2', comboText);

    // Currency displays
    setTextIfChanged('coinDisplay', formatNumber(Math.floor(gameState.coins)));
    setTextIfChanged('gemDisplay', formatNumber(gameState.gems));

    // Prestige teaser (both old and new)
    const tokens = calculatePrestigeTokens();
    ['prestigeTeaserSub', 'prestigeTeaserSub2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (canPrestige()) {
                el.textContent = `Reset for ${tokens} token${tokens !== 1 ? 's' : ''}`;
            } else {
                const needed = CONFIG.PRESTIGE_THRESHOLD - gameState.totalCoinsEarned;
                el.textContent = `Need ${formatNumber(Math.max(0, needed))} more coins`;
            }
        }
    });
}

// ── Helper: only update text if changed (reduce DOM writes) ──
function setTextIfChanged(id, text) {
    const el = document.getElementById(id);
    if (el && el.textContent !== text) el.textContent = text;
}

// ── Render Prestige View ──
function renderPrestigeView() {
    setTextIfChanged('prestigeLevel', String(gameState.prestigeLevel));
    setTextIfChanged('prestigeTokens', String(gameState.prestigeTokens));
    setTextIfChanged('tokensOnReset', String(calculatePrestigeTokens()));
    setTextIfChanged('totalEarned', formatNumber(gameState.totalCoinsEarned));

    const resetSub = document.getElementById('prestigeResetSub');
    if (resetSub) {
        const tokens = calculatePrestigeTokens();
        resetSub.textContent = `Earn ${tokens} token${tokens !== 1 ? 's' : ''}`;
    }

    // Prestige tree
    const tree = document.getElementById('prestigeTree');
    if (!tree) return;
    tree.innerHTML = '';

    for (const pu of PRESTIGE_UPGRADES) {
        const level = gameState.prestigeUpgrades[pu.id] || 0;
        const maxed = level >= pu.maxLevel;
        const cost = maxed ? 0 : pu.cost(level);
        const affordable = gameState.prestigeTokens >= cost;

        const card = document.createElement('div');
        card.className = 'prestige-upgrade' + (maxed ? ' owned' : '');

        card.innerHTML = `
      <div class="prestige-upgrade-icon">${pu.icon}</div>
      <div class="prestige-upgrade-info">
        <div class="prestige-upgrade-name">${pu.name} ${maxed ? '(MAX)' : `Lv ${level}`}</div>
        <div class="prestige-upgrade-desc">${pu.desc}</div>
      </div>
      <div class="prestige-upgrade-cost ${maxed ? 'owned-label' : ''}">${maxed ? '✓' : `⭐ ${cost}`}</div>
    `;

        if (!maxed) {
            card.addEventListener('click', () => {
                if (buyPrestigeUpgrade(pu.id)) {
                    renderPrestigeView();
                    updateStatsPanel();
                    if (typeof triggerHaptic === 'function') triggerHaptic('success');
                } else {
                    if (typeof triggerHaptic === 'function') triggerHaptic('error');
                }
            });
        }

        tree.appendChild(card);
    }
}

// ── Tab Switching ──
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const views = document.querySelectorAll('.view-panel');

    tabs.forEach(tab => {
        tab.addEventListener('touchstart', () => {
            if (typeof triggerHaptic === 'function') triggerHaptic('selection');
        }, { passive: true });

        tab.addEventListener('click', () => {
            const viewId = tab.dataset.view;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            views.forEach(v => v.classList.remove('active'));
            const target = document.getElementById(viewId);
            if (target) target.classList.add('active');

            // Render view content on switch
            if (viewId === 'upgradesView') renderUpgradesView();
            if (viewId === 'statsView') { updateStatsPanel(); renderQuickUpgrades(); }
            if (viewId === 'prestigeView') renderPrestigeView();
            if (viewId === 'dailyView') renderDailyView();
            if (viewId === 'shopView') renderShopView();

            // Hide badge on tab
            const badge = tab.querySelector('.badge');
            if (badge) badge.style.display = 'none';
        });
    });
}

// ── Prestige Reset Button ──
function initPrestigeButton() {
    const btn = document.getElementById('prestigeResetBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            if (!canPrestige()) return;
            const tokens = calculatePrestigeTokens();
            if (confirm(`Prestige Reset?\n\nYou'll earn ${tokens} Prestige Token(s).\nYour coins and upgrades will reset, but prestige bonuses are permanent.\n\nContinue?`)) {
                performPrestige();
                rebuildBoard();
                stopAutoDroppers();
                startAutoDroppers();
                renderDroppers();
                refreshUpgradeUI();
                renderPrestigeView();
                updateStatsPanel();
                particleBurst(window.innerWidth / 2, window.innerHeight / 2, '#c084fc', 30);
                if (typeof triggerHaptic === 'function') triggerHaptic('heavy');
            }
        });
    }

    // Prestige teasers (both old and new)
    ['prestigeTeaser', 'prestigeTeaser2'].forEach(id => {
        const teaser = document.getElementById(id);
        if (teaser) {
            teaser.addEventListener('click', () => {
                document.querySelector('.tab[data-view="prestigeView"]')?.click();
            });
        }
    });
}

// ── Manual Drop Button ──
function initManualDrop() {
    const btn = document.getElementById('manualDropBtn');
    if (btn) {
        // Use both touchstart (iOS) and click (desktop) with dedup
        let btnTouched = false;

        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            btnTouched = true;
            if (typeof triggerHaptic === 'function') triggerHaptic('medium');
            const count = getBallCount();
            for (let i = 0; i < count; i++) {
                setTimeout(() => spawnBall(null, 15), i * 50);
            }
        }, { passive: false });

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (btnTouched) { btnTouched = false; return; } // Skip if just handled by touch
            const count = getBallCount();
            for (let i = 0; i < count; i++) {
                setTimeout(() => spawnBall(null, 15), i * 50);
            }
        });
    }

    // Also allow touching/clicking on the board to drop
    const boardEl = document.getElementById('plinkoBoard');
    if (boardEl) {
        let boardTouched = false;

        boardEl.addEventListener('touchstart', (e) => {
            const rect = boardEl.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            // Only drop if touching in top 15% of board
            if (touch.clientY - rect.top < rect.height * 0.15) {
                boardTouched = true;
                if (typeof triggerHaptic === 'function') triggerHaptic('light');
                spawnBall(x, 15);
            }
        }, { passive: true });

        boardEl.addEventListener('click', (e) => {
            if (boardTouched) { boardTouched = false; return; }
            const rect = boardEl.getBoundingClientRect();
            const x = e.clientX - rect.left;
            // Only drop if clicking in top 15% of board
            if (e.clientY - rect.top < rect.height * 0.15) {
                spawnBall(x, 15);
            }
        });
    }
}

// ── Offline Earnings Toast ──
function showOfflineEarnings(coins, timeAway) {
    if (coins <= 0) return;

    const toast = document.getElementById('offlineToast');
    const msg = document.getElementById('offlineMsg');
    const closeBtn = document.getElementById('toastClose');

    if (!toast || !msg) return;

    const hours = Math.floor(timeAway / 3600000);
    const mins = Math.floor((timeAway % 3600000) / 60000);
    const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

    msg.innerHTML = `Earned <strong style="color:var(--gold)">+${formatNumber(Math.floor(coins))} coins</strong> while away (${timeStr})`;
    toast.style.display = 'flex';

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            toast.style.display = 'none';
        });
    }

    // Auto-hide after 6 seconds
    setTimeout(() => {
        if (toast) toast.style.display = 'none';
    }, 6000);
}
