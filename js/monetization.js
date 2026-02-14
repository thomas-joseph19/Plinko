/* ═══════════════════════════════════════════════
   PLINKO∞ — Monetization (RevenueCat & Ads)
   ═══════════════════════════════════════════════ */

const Monetization = {
    // Configuration
    REVENUECAT_API_KEY: 'test_FecausrHExPmUXyZUWXPFeFoDNM', // Provided key
    ENTITLEMENT_ID: 'premium',

    // State
    isPremium: false,

    // RevenueCat Instance
    rc: null,

    init() {
        // Load local state
        const saved = localStorage.getItem('plinko_premium');
        if (saved === 'true') {
            this.isPremium = true;
            this.updateUI();
        }

        // 1. Try RevenueCat SDK (Web Mode)
        if (window.Purchases && typeof window.Purchases.configure === 'function') {
            try {
                // Initialize for random user ID
                const uid = 'user_' + Math.random().toString(36).substr(2, 9);
                this.rc = window.Purchases.configure(this.REVENUECAT_API_KEY, uid);

                this.rc.addCustomerInfoUpdateListener((info) => {
                    this.handleCustomerInfo(info);
                });

                console.log('Monetization: RevenueCat Initialized');
            } catch (e) {
                console.warn('Monetization: RevenueCat Error (using mock/bridge):', e);
            }
        } else {
            console.warn('Monetization: Purchases SDK not loaded');
        }

        // 2. Initialize Native Bridge Listener (Hybrid Mode)
        window.addEventListener('message', (event) => {
            try {
                // Determine if event.data is already an object or needs parsing
                const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                console.log('WebView Received:', data.type);

                if (data.type === 'PURCHASE_SUCCESS') {
                    if (data.context === 'gems') {
                        gameState.gems += data.amount;
                    } else if (data.productId === 'premium_no_ads') {
                        this.setPremium(true);
                    }
                    if (typeof updateStatsPanel === 'function') updateStatsPanel();
                    if (typeof saveGame === 'function') saveGame();
                    if (typeof renderShopView === 'function') renderShopView();
                }

                if (data.type === 'RESTORE_RESULT') {
                    // Check entitlements via bridge info
                    const info = data.customerInfo;
                    if (info && info.entitlements.active[this.ENTITLEMENT_ID]) {
                        this.setPremium(true);
                    }
                }
            } catch (e) {
                // Not a JSON message or not for us
            }
        });

        console.log('Monetization: Bridge Initialized');
    },

    handleCustomerInfo(info) {
        if (info.entitlements.active[this.ENTITLEMENT_ID] !== undefined) {
            this.setPremium(true);
        }
    },

    // ── Purchasing ──

    async purchaseNoAds() {
        console.log('Monetization: Purchasing No Ads...');

        // 1. Try Bridge
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'PURCHASE',
                productId: 'premium_no_ads',
                context: 'upgrade'
            }));
            return true;
        }

        // 2. Try RevenueCat Web SDK
        if (this.rc) {
            // In real app: const { customerInfo } = await window.Purchases.purchasePackage(pkg);
            // For now, fall through to mock or implement actual SDK call if package available
        }

        // 3. Mock fallback for browser dev
        return new Promise((resolve) => {
            setTimeout(() => {
                if (confirm('Simulate successful purchase (No Ads)?')) {
                    this.setPremium(true);
                    resolve(true);
                } else resolve(false);
            }, 500);
        });
    },

    async purchaseGems(amount, price) {
        // Map amount to Product ID
        const productId = `gems_${amount}`;
        console.log(`Monetization: Purchasing ${productId} ($${price})...`);

        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'PURCHASE',
                productId: productId,
                amount: amount,
                context: 'gems'
            }));
            return true;
        }

        // Mock fallback
        return new Promise((resolve) => {
            setTimeout(() => {
                const success = confirm(`Simulate successful purchase of ${amount} Gems?`);
                if (success) {
                    gameState.gems += amount;
                    if (typeof updateStatsPanel === 'function') updateStatsPanel();
                    if (typeof saveGame === 'function') saveGame();
                    resolve(true);
                } else resolve(false);
            }, 500);
        });
    },

    async restorePurchases() {
        console.log('Monetization: Restoring...');

        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'RESTORE' }));
            return;
        }

        // In real app: const { customerInfo } = await window.Purchases.restorePurchases();

        setTimeout(() => {
            if (this._mockPurchased) {
                this.setPremium(true);
                alert('Purchases Restored.');
            } else {
                alert('No purchases found to restore.');
            }
        }, 1000);
    },

    setPremium(status) {
        this.isPremium = status;
        this._mockPurchased = status;
        localStorage.setItem('plinko_premium', status);
        this.updateUI();

        // Hide banner if visible
        const banner = document.getElementById('adBanner');
        if (banner) banner.style.display = 'none';
    },

    updateUI() {
        // Hide "Remove Ads" buttons
        const btns = document.querySelectorAll('.remove-ads-btn');
        btns.forEach(b => {
            if (this.isPremium) {
                b.style.display = 'none';
                // Provide visual feedback if inside a list?
                // b.parentElement.innerHTML = '<span style="color:var(--accent2)">Premium Active</span>';
            } else {
                b.style.display = '';
            }
        });

        // Refresh shop UI if open
        if (typeof renderShopView === 'function') renderShopView();
    },

    // ── Ads System ──

    showAd(onComplete) {
        if (this.isPremium) {
            console.log('Monetization: Ad skipped (Premium)');
            if (onComplete) onComplete(true);
            return;
        }

        console.log('Monetization: Showing Interstitial Ad...');
        this.createAdOverlay('Interstitial Ad', onComplete);
    },

    showRewardedAd(onReward, onCancel) {
        console.log('Monetization: Showing Rewarded Ad...');
        this.createAdOverlay('Rewarded Ad (Watch for +50 Balls!)', (success) => {
            if (success) {
                if (onReward) onReward();
            } else {
                if (onCancel) onCancel();
            }
        }, true);
    },

    createAdOverlay(title, callback, isRewarded = false) {
        // Create a simulated ad overlay
        const overlay = document.createElement('div');
        overlay.className = 'ad-overlay';
        overlay.innerHTML = `
            <div class="ad-content">
                <h2>${title}</h2>
                <div class="ad-placeholder">
                    [ ADVERTISEMENT ]<br>
                    <small>Simulating 5s duration...</small>
                </div>
                <div class="ad-timer">5</div>
                <button class="ad-close-btn" disabled>Close</button>
            </div>
        `;
        document.body.appendChild(overlay);

        // Timer logic
        let timeLeft = 5;
        const timerEl = overlay.querySelector('.ad-timer');
        const closeBtn = overlay.querySelector('.ad-close-btn');

        // In reality, this would be an AdMob/AppLovin SDK event

        const interval = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(interval);
                timerEl.textContent = 'Reward Granted';
                closeBtn.disabled = false;
                closeBtn.textContent = 'Close (X)';

                // For non-rewarded, maybe auto-close or allow close immediately?
                // Standard is X appears.
            }
        }, 1000);

        closeBtn.onclick = () => {
            document.body.removeChild(overlay);
            if (callback) callback(true);
        };
    }
};

window.Monetization = Monetization;
