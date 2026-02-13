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

        // Initialize RevenueCat SDK
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
                console.warn('Monetization: RevenueCat Error (using mock):', e);
            }
        } else {
            console.warn('Monetization: Purchases SDK not loaded (using mock)');
        }
    },

    handleCustomerInfo(info) {
        if (info.entitlements.active[this.ENTITLEMENT_ID] !== undefined) {
            this.setPremium(true);
        }
    },

    // ── Purchasing ──

    async purchaseNoAds() {
        console.log('Monetization: Purchasing No Ads...');

        // Mock success for web demo
        // In real app: const { customerInfo } = await window.Purchases.purchasePackage(pkg);

        return new Promise((resolve) => {
            setTimeout(() => {
                const success = confirm('Simulate successful purchase?');
                if (success) {
                    this.setPremium(true);
                    alert('Purchase Successful! Ads removed.');
                    resolve(true);
                } else {
                    alert('Purchase Cancelled.');
                    resolve(false);
                }
            }, 500);
        });
    },

    async purchaseGems(amount, price) {
        console.log(`Monetization: Purchasing ${amount} Gems for $${price}...`);

        return new Promise((resolve) => {
            setTimeout(() => {
                const success = confirm(`Simulate successful purchase of ${amount} Gems for $${price}?`);
                if (success) {
                    gameState.gems += amount;
                    alert(`Purchase Successful! Added ${amount} Gems.`);
                    if (typeof updateStatsPanel === 'function') updateStatsPanel();
                    if (typeof saveGame === 'function') saveGame();
                    resolve(true);
                } else {
                    alert('Purchase Cancelled.');
                    resolve(false);
                }
            }, 500);
        });
    },

    async restorePurchases() {
        console.log('Monetization: Restoring...');
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
