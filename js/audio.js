/* ═══════════════════════════════════════════════
   PLINKO∞ — Arcade Sound Engine (Optimized & Non-Intrusive)
   ═══════════════════════════════════════════════ */

const AudioEngine = {
    ctx: null,
    enabled: true,
    masterGain: null,

    // Throttling to prevent cacophony
    lastPegTime: 0,
    activeVoices: 0,

    init() {
        if (gameState?.settings) {
            this.enabled = gameState.settings.audioEnabled;
        }

        // If we're turning it off, don't do anything (it's already handled by play functions)
        // If we're already initialized, don't re-init
        if (this.ctx) return;
        if (!this.enabled) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();

            this.masterGain = this.ctx.createGain();
            this.setVolume(gameState.settings.volume ?? 0.5);
            this.masterGain.connect(this.ctx.destination);

            // Resume context handler
            const resumeHandler = () => {
                if (this.ctx && this.ctx.state === 'suspended') {
                    this.ctx.resume();
                }
                document.removeEventListener('click', resumeHandler);
                document.removeEventListener('touchstart', resumeHandler);
            };
            document.addEventListener('click', resumeHandler);
            document.addEventListener('touchstart', resumeHandler);
        } catch (e) {
            console.warn('Audio API not supported');
            this.enabled = false;
        }
    },

    setVolume(val) {
        if (!this.masterGain) return;
        // Map 0-1 range to a reasonable gain (0 to 0.4)
        const targetGain = val * 0.4;
        this.masterGain.gain.setTargetAtTime(targetGain, this.ctx?.currentTime || 0, 0.1);
    },

    // ── Ultra-short "Tick" (Mechanical Arcade Switch) ──
    playClick(pitch = 800, vol = 0.1) {
        if (!this.ctx) return;

        // Prevent sound overlap overload
        // If too many sounds playing, skip this one
        if (this.activeVoices > 8) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'square'; // Arcade chip sound
        osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, this.ctx.currentTime); // Soften the edge

        const now = this.ctx.currentTime;
        // Very short envelope: 15ms total
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.02);

        this.activeVoices++;
        setTimeout(() => this.activeVoices--, 20);
    },

    // ── Musical Tone (Rare Events) ──
    playChime(freq, vol = 0.3) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine'; // Pure tone
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3); // Longer decay

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.3);
    },

    // ── Events ──

    pegHit(yPercent, isLucky) {
        const now = Date.now();
        // Global throttle: max 1 peg sound every 15ms (approx 60fps limit)
        if (now - this.lastPegTime < 15) return;

        this.lastPegTime = now;

        if (isLucky) {
            // Magical chime for special balls
            // Pentatonic scale
            const baseFreqs = [523, 587, 659, 783, 880, 1046];
            const idx = Math.floor((1 - yPercent) * (baseFreqs.length - 1));
            const freq = baseFreqs[idx] || 880;
            this.playChime(freq, 0.2);
        } else {
            // Standard balls: just a "tick"
            // Slight pitch variation based on height for subtle feedback
            // range 1200Hz (top) down to 800Hz (bottom) -> mechanical feel
            const pitch = 1200 - (yPercent * 400);
            // Random jitter to avoid phasing
            const jitter = Math.random() * 50 - 25;
            this.playClick(pitch + jitter, 0.05); // Very quiet
        }
    },

    slotHit(isJackpot, tier) {
        if (isJackpot) {
            // Jackpot: Fanfare
            [440, 554, 659, 880, 1108, 1318].forEach((f, i) => {
                setTimeout(() => this.playChime(f, 0.2), i * 60);
            });
        } else {
            // Coin Sound
            if (tier >= 2) { // Only play 'coin' for decent multipliers (10x+)
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                // Switch to sine for a smoother, less 8-bit annoying sound
                osc.type = 'sine';

                // Lower pitch slightly (G5 -> C6)
                osc.frequency.setValueAtTime(784, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1046, this.ctx.currentTime + 0.1);

                gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15); // Softer tail

                osc.connect(gain);
                gain.connect(this.masterGain);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.15);
            } else {
                // Low tier: Quiet thud
                this.playClick(200, 0.05);
            }
        }
    },

    drop() {
        // Subtle low thud
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);

        gain.gain.setValueAtTime(0.15, now); // Very quiet
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.05);
    },

    upgradeBuy() {
        // Quick subtle "cha-ching" or rise
        this.playChime(880, 0.15);
        setTimeout(() => this.playChime(1760, 0.1), 50);
    },

    prestige() {
        // Deep reset sound
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    },

    click() {
        // UI click
        this.playClick(2000, 0.02);
    }
};

window.AudioEngine = AudioEngine;
