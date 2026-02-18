/* ═══════════════════════════════════════════════
   PLINKO∞ — UI Rendering & Interaction
   ═══════════════════════════════════════════════ */

const SETTINGS_STORAGE_KEY = 'plinko_settings';

function initSettings() {
    const overlay = document.getElementById('settingsOverlay');
    const modal = document.getElementById('settingsModal');
    const closeBtn = document.getElementById('settingsClose');

    // Toggles & Sliders
    const audioToggle = document.getElementById('audioToggle');
    const volumeSlider = document.getElementById('volumeSlider');
    const animationToggle = document.getElementById('animationToggle');
    const autoDropToggle = document.getElementById('autoDropToggle');

    function openSettings(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (overlay) {
            overlay.classList.add('open');
            overlay.setAttribute('aria-hidden', 'false');
        }
        if (modal) modal.setAttribute('aria-hidden', 'false');

        // Sync toggles with gameState
        if (audioToggle) audioToggle.checked = gameState.settings.audioEnabled;
        if (volumeSlider) {
            volumeSlider.value = gameState.settings.volume ?? 0.5;
            const volumeValue = document.getElementById('volumeValue');
            if (volumeValue) volumeValue.textContent = Math.round(volumeSlider.value * 100) + '%';
        }
        if (animationToggle) animationToggle.checked = gameState.settings.animationsEnabled;
        if (autoDropToggle) autoDropToggle.checked = gameState.settings.autoDropEnabled !== false;
    }

    function closeSettings() {
        if (overlay) {
            overlay.classList.remove('open');
            overlay.setAttribute('aria-hidden', 'true');
        }
        if (modal) modal.setAttribute('aria-hidden', 'true');
    }

    // Use document click so the settings button always works (delegation)
    document.addEventListener('click', function handleDocClick(e) {
        if (e.target.closest && e.target.closest('#settingsBtn')) {
            openSettings(e);
        }
    });
    document.addEventListener('touchstart', function handleDocTouch(e) {
        if (e.target.closest && e.target.closest('#settingsBtn')) {
            openSettings(e);
            e.preventDefault();
        }
    }, { passive: false });

    if (closeBtn) closeBtn.addEventListener('click', closeSettings);
    if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSettings(); });

    // Toggle Listeners
    if (audioToggle) {
        audioToggle.addEventListener('change', () => {
            const isEnabled = audioToggle.checked;
            gameState.settings.audioEnabled = isEnabled;
            if (window.AudioEngine) {
                window.AudioEngine.enabled = isEnabled;
                if (isEnabled) {
                    window.AudioEngine.init(); // Ensure context exists
                    if (window.AudioEngine.ctx?.state === 'suspended') {
                        window.AudioEngine.ctx.resume();
                    }
                    window.AudioEngine.setVolume(gameState.settings.volume ?? 0.5);
                } else {
                    // Mute immediately
                    if (window.AudioEngine.masterGain) {
                        window.AudioEngine.masterGain.gain.setValueAtTime(0, window.AudioEngine.ctx?.currentTime || 0);
                    }
                }
            }
            saveGame();
        });
    }

    if (volumeSlider) {
        const volumeValue = document.getElementById('volumeValue');
        volumeSlider.addEventListener('input', () => {
            const val = parseFloat(volumeSlider.value);
            gameState.settings.volume = val;
            if (volumeValue) volumeValue.textContent = Math.round(val * 100) + '%';
            if (window.AudioEngine) {
                window.AudioEngine.setVolume(val);
                // Play a small test click when adjusting volume
                if (!volumeSlider._lastTick || Date.now() - volumeSlider._lastTick > 100) {
                    window.AudioEngine.playClick(1000, 0.2);
                    volumeSlider._lastTick = Date.now();
                }
            }
            // Debounced or throttled save? For now just save on change
        });
        volumeSlider.addEventListener('change', () => {
            saveGame();
        });
    }

    if (animationToggle) {
        animationToggle.addEventListener('change', () => {
            gameState.settings.animationsEnabled = animationToggle.checked;
            saveGame();
        });
    }

    if (autoDropToggle) {
        autoDropToggle.addEventListener('change', () => {
            gameState.settings.autoDropEnabled = autoDropToggle.checked;
            if (gameState.settings.autoDropEnabled) {
                if (typeof startAutoDroppers === 'function') startAutoDroppers();
            } else {
                if (typeof stopAutoDroppers === 'function') stopAutoDroppers();
            }
            saveGame();
        });
    }

    // ── Legal Overlay Logic (New Pop-ups) ──
    const privacyBtn = document.getElementById('privacyBtn');
    const termsBtn = document.getElementById('termsBtn');
    const privacyOverlay = document.getElementById('privacyOverlay');
    const termsOverlay = document.getElementById('termsOverlay');
    const privacyClose = document.getElementById('privacyClose');
    const termsClose = document.getElementById('termsClose');

    function openPrivacy() {
        if (privacyOverlay) privacyOverlay.classList.add('active');
    }
    function closePrivacy() {
        if (privacyOverlay) privacyOverlay.classList.remove('active');
    }
    function openTerms() {
        if (termsOverlay) termsOverlay.classList.add('active');
    }
    function closeTerms() {
        if (termsOverlay) termsOverlay.classList.remove('active');
    }

    if (privacyBtn) privacyBtn.addEventListener('click', openPrivacy);
    if (termsBtn) termsBtn.addEventListener('click', openTerms);
    if (privacyClose) privacyClose.addEventListener('click', closePrivacy);
    if (termsClose) termsClose.addEventListener('click', closeTerms);

    // Close on click outside
    if (privacyOverlay) privacyOverlay.addEventListener('click', (e) => { if (e.target === privacyOverlay) closePrivacy(); });
    if (termsOverlay) termsOverlay.addEventListener('click', (e) => { if (e.target === termsOverlay) closeTerms(); });

    // Handle Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePrivacy();
            closeTerms();
            if (overlay && overlay.classList.contains('open')) closeSettings();
        }
    });

    // Background Switcher
    const bgBtns = document.querySelectorAll('[data-bg-set]');
    const storedBg = localStorage.getItem('plinko_bg') || 'midnight';
    document.body.setAttribute('data-bg', storedBg);

    bgBtns.forEach(btn => {
        if (btn.dataset.bgSet === storedBg) btn.classList.add('active');

        btn.addEventListener('click', () => {
            const bg = btn.dataset.bgSet;
            document.body.setAttribute('data-bg', bg);
            localStorage.setItem('plinko_bg', bg);

            bgBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeSettings);
    if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSettings(); });
}

// ── Render Slot Tray ──
function renderSlotTray(rows) {
    const tray = document.getElementById('slotTray');
    if (!tray) return;

    const multipliers = CONFIG.SLOT_MULTIPLIERS[rows] || CONFIG.SLOT_MULTIPLIERS[10];
    tray.innerHTML = '';

    // Align visual slots with the peg-defined bins
    if (lastRowPegXCoords.length >= 2) {
        const leftPeg = lastRowPegXCoords[0];
        const rightPeg = lastRowPegXCoords[lastRowPegXCoords.length - 1];
        tray.style.paddingLeft = leftPeg + 'px';
        tray.style.paddingRight = (boardWidth - rightPeg) + 'px';
    }

    const boost = getGlobalMultiplier(); // Includes slot boost + prestige

    multipliers.forEach((baseMult, i) => {
        const slot = document.createElement('div');
        // Calculate actual displayed value
        let val = +(baseMult * boost).toFixed(2);

        // Hard cap bins originally < 1 at 0.75
        if (baseMult < 1) {
            val = Math.min(val, 0.75);
        }

        const type = getSlotType(val);
        slot.className = 'slot ' + type;

        // Format: clean number + ×  (e.g., "8×", "0.5×", "1.2K×")
        let displayVal;
        if (val >= 1000) {
            displayVal = formatCost(val);
        } else if (val >= 10 && val === Math.floor(val)) {
            displayVal = String(Math.floor(val));
        } else if (val >= 1 && val === Math.floor(val)) {
            displayVal = String(Math.floor(val));
        } else {
            displayVal = val.toFixed(1);
        }

        slot.innerHTML = `<span class="mult">${displayVal}</span><span class="x">×</span>`;
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

    // Old orb indicators removed in favor of single nozzle animation
    container.innerHTML = '';
    // We only update the text label now

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
        card.addEventListener('click', () => {
            if (purchaseUpgrade(id)) {
                card.classList.add('purchased');
                // Confetti visual feedback
                if (window.spawnConfetti) {
                    const rect = card.getBoundingClientRect();
                    window.spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
                }
                setTimeout(() => card.classList.remove('purchased'), 400);
                // Refresh UI
                refreshUpgradeUI();
                updateStatsPanel();
                renderDroppers();
                // Restart auto-droppers if relevant upgrade
                if (['ballRate', 'dropSpeed'].includes(id)) {
                    stopAutoDroppers();
                    startAutoDroppers();
                }

                // Refresh slot display if boost purchased
                if (id === 'slotBoost') {
                    renderSlotTray(getBoardRows());
                }
            } else {
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
    const comboText = '—';

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
    setTextIfChanged('coinDisplay', formatNumber(Math.floor(gameState.coins)));
    setTextIfChanged('gemDisplay', formatNumber(gameState.gems));

    // Clamp bet to coins (if coins dropped below current bet)
    if (typeof window.updateBetDisplay === 'function') window.updateBetDisplay();

    // ── Betting Unlock Check ──
    checkBettingUnlock();

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

    // Update events panel if visible (now in Upgrades view)
    if (typeof isAnyEventActive === 'function') {
        const upgradesView = document.getElementById('upgradesView');
        if (upgradesView && upgradesView.classList.contains('active')) {
            renderEventsPanel();
        }
        // Update global status bar
        const statusEl = document.getElementById('eventGlobalStatus');
        if (statusEl) {
            if (isAnyEventActive()) {
                const ev = EVENTS[eventState.activeEvent];
                const remaining = Math.ceil(getEventTimeRemaining() / 1000);
                statusEl.textContent = `${ev.name} — ${remaining}s left`;
                statusEl.style.color = 'var(--accent2)';
            } else if (isEventOnCooldown()) {
                const cdSec = Math.ceil(getCooldownRemaining() / 1000);
                const mins = Math.floor(cdSec / 60);
                const secs = cdSec % 60;
                statusEl.textContent = `Cooldown: ${mins}:${String(secs).padStart(2, '0')}`;
                statusEl.style.color = 'var(--text-dim)';
            } else {
                statusEl.textContent = 'Ready — Choose an event!';
                statusEl.style.color = 'var(--success)';
            }
        }
    }
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
        tab.addEventListener('click', () => {
            const viewId = tab.dataset.view;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            views.forEach(v => v.classList.remove('active'));
            const target = document.getElementById(viewId);
            if (target) target.classList.add('active');

            // Render view content on switch
            if (viewId === 'upgradesView') {
                renderUpgradesView();
                if (typeof renderEventsPanel === 'function') renderEventsPanel();
            }
            if (viewId === 'statsView') { updateStatsPanel(); renderQuickUpgrades(); }
            if (viewId === 'prestigeView') renderPrestigeView();
            if (viewId === 'dailyView') renderDailyView();
            if (viewId === 'shopView') renderShopView();


            // Hide badge on tab
            const badge = tab.querySelector('.badge');
            if (badge) badge.style.display = 'none';
        });
    });

    // Swipe Navigation
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;

        // Threshold check (50px min swipe, ignore vertical scrolls > 60px)
        if (Math.abs(touchEndX - touchStartX) > 50 && Math.abs(touchEndY - touchStartY) < 60) {
            const tabsArray = Array.from(document.querySelectorAll('.tab'));
            const activeIndex = tabsArray.findIndex(t => t.classList.contains('active'));

            if (touchEndX < touchStartX) {
                // Swiped Left -> Next Tab
                if (activeIndex < tabsArray.length - 1) tabsArray[activeIndex + 1].click();
            } else {
                // Swiped Right -> Prev Tab
                if (activeIndex > 0) tabsArray[activeIndex - 1].click();
            }
        }
    }, { passive: true });
}

// ── Prestige Reset Button ──
function initPrestigeButton() {
    const btn = document.getElementById('prestigeResetBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            if (!canPrestige()) return;
            const tokens = calculatePrestigeTokens();
            if (confirm(`Prestige Reset?\n\nYou'll earn ${tokens} Prestige Token(s).\nYour coins and upgrades will reset, but prestige bonuses are permanent.\n\nContinue?`)) {
                if (window.Monetization) {
                    window.Monetization.showAd(() => {
                        doPrestigeReset();
                    });
                } else {
                    doPrestigeReset();
                }

                function doPrestigeReset() {
                    performPrestige();
                    rebuildBoard();
                    stopAutoDroppers();
                    startAutoDroppers();
                    renderDroppers();
                    refreshUpgradeUI();
                    renderPrestigeView();
                    updateStatsPanel();
                    particleBurst(window.innerWidth / 2, window.innerHeight / 2, '#c084fc', 30);
                }
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

    // Initialize bet selector
    initBetSelector();

    // Board click-to-drop DISABLED per user request
    /*
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
    */
}

// ── Offline Earnings Toast ──
function showOfflineEarnings(coins, timeAway) {
    if (coins === 0) return;

    const toast = document.getElementById('offlineToast');
    const msg = document.getElementById('offlineMsg');
    const closeBtn = document.getElementById('toastClose');

    if (!toast || !msg) return;

    const hours = Math.floor(timeAway / 3600000);
    const mins = Math.floor((timeAway % 3600000) / 60000);
    const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

    const isLoss = coins < 0;
    const absCoins = Math.abs(coins);
    const verb = isLoss ? 'Lost' : 'Earned';
    const color = isLoss ? 'var(--danger)' : 'var(--gold)';
    const sign = isLoss ? '-' : '+';

    msg.innerHTML = `${verb} <strong style="color:${color}">${sign}${formatNumber(Math.floor(absCoins))} coins</strong> while away (${timeStr})`;
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

// ── Bet Selector ──
function initBetSelector() {
    const decreaseBtn = document.getElementById('betDecrease');
    const increaseBtn = document.getElementById('betIncrease');
    const maxBtn = document.getElementById('betMax');
    const betDisplay = document.getElementById('betDisplay');
    const betAmountText = document.getElementById('betAmountDisplay');

    function updateBetDisplay() {
        // Clamp bet: if coins dropped below bet, reduce bet
        if (gameState.currentBet > Math.max(1, Math.floor(gameState.coins)) && gameState.coins > 0) {
            gameState.currentBet = Math.max(1, Math.floor(gameState.coins));
        }
        if (gameState.coins <= 0 && gameState.currentBet > 1) {
            gameState.currentBet = 1;
        }
        if (betAmountText) {
            betAmountText.textContent = formatNumber(gameState.currentBet);
        }
        if (decreaseBtn) {
            decreaseBtn.disabled = gameState.currentBet <= 1;
        }
    }

    // Expose globally so prestige/other systems can trigger it
    window.updateBetDisplay = updateBetDisplay;

    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            if (gameState.currentBet > 1) {
                // If it's a large number, decrease by a significant amount (10%)
                if (gameState.currentBet > 100) {
                    gameState.currentBet = Math.max(1, Math.floor(gameState.currentBet / 2));
                } else {
                    // Standard small increments
                    const steps = [1, 5, 10, 25, 50, 100];
                    const idx = steps.findIndex(s => s >= gameState.currentBet);
                    if (idx > 0) {
                        gameState.currentBet = steps[idx - 1];
                    } else if (idx === -1) {
                        gameState.currentBet = 100;
                    } else {
                        gameState.currentBet = 1;
                    }
                }
                updateBetDisplay();
            }
        });
    }

    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            // Cap at current coins
            if (gameState.currentBet < gameState.coins) {
                if (gameState.currentBet >= 100) {
                    gameState.currentBet = Math.min(Math.floor(gameState.coins), gameState.currentBet * 2);
                } else {
                    const steps = [1, 5, 10, 25, 50, 100];
                    const idx = steps.findIndex(s => s > gameState.currentBet);
                    if (idx !== -1) {
                        gameState.currentBet = steps[idx];
                    } else {
                        gameState.currentBet = 200; // Start doubling from 100
                    }
                }
                updateBetDisplay();
            }
        });
    }

    if (maxBtn) {
        maxBtn.addEventListener('click', () => {
            if (gameState.coins >= 1) {
                gameState.currentBet = Math.floor(gameState.coins);
                updateBetDisplay();
            }
        });
    }

    if (betDisplay) {
        betDisplay.style.cursor = 'pointer';
        betDisplay.addEventListener('click', () => {
            const input = prompt('Enter bet amount (Min: 1, Max: ' + formatNumber(Math.floor(gameState.coins)) + '):', gameState.currentBet);
            if (input !== null) {
                const val = parseInt(input.replace(/,/g, ''));
                if (!isNaN(val) && val >= 1) {
                    gameState.currentBet = Math.min(val, Math.floor(gameState.coins || 1));
                    if (gameState.currentBet < 1) gameState.currentBet = 1;
                    updateBetDisplay();
                }
            }
        });
    }

    // Initialize display
    updateBetDisplay();

}

// ── Betting Unlock System ──
const BETTING_UNLOCK_THRESHOLD = 10000;
let _bettingUnlockShown = false;

function checkBettingUnlock() {
    return; // Betting is available for all users
    if (_bettingUnlockShown) return;
    if (gameState.totalCoinsEarned >= BETTING_UNLOCK_THRESHOLD) {
        _bettingUnlockShown = true;
        gameState.settings.bettingUnlocked = true;

        // Reveal bet selector with animation
        const betSel = document.getElementById('betSelector');
        if (betSel) {
            betSel.style.display = '';
            betSel.classList.add('bet-unlock-animate');
            setTimeout(() => betSel.classList.remove('bet-unlock-animate'), 1500);
        }

        // Confetti burst
        if (typeof spawnConfetti === 'function') {
            spawnConfetti(window.innerWidth / 2, window.innerHeight / 2);
        }

        // Show unlock modal
        showBettingUnlockModal();

        if (typeof saveGame === 'function') saveGame();
    }
}

function showBettingUnlockModal() {
    const existing = document.querySelector('.unlock-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'unlock-modal-overlay';
    overlay.innerHTML = `
        <div class="unlock-modal">
            <div class="unlock-modal-icon">🎲</div>
            <div class="unlock-modal-badge">NEW FEATURE</div>
            <h2 class="unlock-modal-title">Betting Unlocked!</h2>
            <p class="unlock-modal-text">
                You've earned <strong>10,000 coins</strong> — nice work!
            </p>
            <p class="unlock-modal-text">
                You can now <strong>change your bet amount</strong> using the selector above the board. Higher bets mean bigger wins — but also bigger losses!
            </p>
            <div class="unlock-modal-tips">
                <div class="unlock-tip">➖ ➕ Tap to adjust bet</div>
                <div class="unlock-tip">🎯 Tap the number to type a custom bet</div>
                <div class="unlock-tip">⚠️ Bet is capped at your coin balance</div>
            </div>
            <button class="unlock-modal-btn" id="unlockModalClose">Got it!</button>
        </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
    document.getElementById('unlockModalClose').addEventListener('click', () => overlay.remove());
}
// Toast notification helper
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? 'var(--danger)' : 'var(--accent1)'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-family: var(--font-pixel);
        font-size: 12px;
        z-index: 10000;
        animation: toastSlide 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Remove after 2 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlide 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}
