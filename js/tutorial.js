/* ═══════════════════════════════════════════════
   PLINKO∞ — Interactive Walkthrough
   ═══════════════════════════════════════════════ */

const TUTORIAL_STEPS = [
    {
        icon: '🎯',
        title: 'Welcome to PLINKO∞',
        text: 'Experience the most satisfying idle Plinko game. Your journey to infinite wealth starts here!',
        view: 'boardView'
    },
    {
        icon: '⬇️',
        title: 'Manual Drop',
        text: 'This is where it begins. Tap here to drop balls manually and earn your first coins!',
        view: 'boardView',
        highlight: '#manualDropBtn',
        position: 'top' // Move modal to top because highlight is at bottom
    },
    {
        icon: '📈',
        title: 'Betting Power',
        text: 'Increase your bet to drop more valuable balls. Higher risk, much higher rewards!',
        view: 'boardView',
        highlight: '#betSelector',
        position: 'top'
    },
    {
        icon: '🔧',
        title: 'Power Up',
        text: 'Spend your coins here to automate the board, increase ball speed, and multiply payouts.',
        view: 'upgradesView',
        highlight: '#ballUpgrades'
    },
    {
        icon: '⚡',
        title: 'Special Events',
        text: 'Keep an eye on active events! They provide massive limited-time boosts to your progress.',
        view: 'upgradesView',
        highlight: '#eventInfoBar'
    },
    {
        icon: '📊',
        title: 'Live Performance',
        text: 'Track your coins per second and manage quick upgrades without leaving the board view.',
        view: 'statsView',
        highlight: '.stats-card'
    },
    {
        icon: '⭐',
        title: 'Ascension',
        text: 'When progress slows, Prestige! You will start over but with permanent bonuses that dwarf your previous run.',
        view: 'prestigeView',
        highlight: '#prestigeInfo'
    },
    {
        icon: '🎁',
        title: 'Daily Rewards',
        text: 'Log in every day for free coins and gems. Complete challenges for extra bonuses!',
        view: 'dailyView',
        highlight: '#dailyGrid'
    },
    {
        icon: '💎',
        title: 'The Vault',
        text: 'Visit the shop for premium bundles and permanent account-wide multipliers.',
        view: 'shopView',
        highlight: '#shopItems'
    },
    {
        icon: '🚀',
        title: 'Ready to Play?',
        text: 'You are ready to reach infinity. Start dropping and enjoy the climb!',
        view: 'boardView'
    }
];

let currentStep = 0;

function initTutorial() {
    const overlay = document.getElementById('tutorialOverlay');
    const content = document.getElementById('tutorialContent');
    const dotsContainer = document.getElementById('tutorialDots');
    const nextBtn = document.getElementById('tutorialNext');
    const prevBtn = document.getElementById('tutorialPrev');

    if (!overlay || !content || !nextBtn) return;

    // Show tutorial if not seen
    if (!gameState.settings.tutorialSeen) {
        showTutorial();
    }

    function showTutorial() {
        currentStep = 0;
        renderStep();
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
    }

    function closeTutorial() {
        clearHighlights();
        overlay.classList.remove('open');
        overlay.classList.remove('dimmed');
        overlay.setAttribute('aria-hidden', 'true');
        gameState.settings.tutorialSeen = true;
        saveGame();

        // Return to board view when done
        document.querySelector('.tab[data-view="boardView"]')?.click();
    }

    function clearHighlights() {
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
    }

    function renderStep() {
        const step = TUTORIAL_STEPS[currentStep];

        // Clear previous state
        clearHighlights();
        overlay.classList.remove('dimmed');
        overlay.style.alignItems = step.position === 'top' ? 'flex-start' : 'flex-end';
        overlay.style.padding = step.position === 'top' ? '100px 20px 20px 20px' : '20px 20px 100px 20px';

        // Switch Tab if needed
        if (step.view) {
            const tab = document.querySelector(`.tab[data-view="${step.view}"]`);
            if (tab && !tab.classList.contains('active')) {
                tab.click();
            }
        }

        // Apply Highlight
        if (step.highlight) {
            const el = document.querySelector(step.highlight);
            if (el) {
                el.classList.add('tutorial-highlight');
                overlay.classList.add('dimmed');

                // Ensure the highlighted element is visible
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        } else {
            // If no highlight, scroll to top of view
            const activeView = document.querySelector('.view-panel.active .panel-scroll');
            if (activeView) activeView.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Render content
        content.innerHTML = `
            <div class="tutorial-step-content">
                <span class="tutorial-icon">${step.icon}</span>
                <h3 class="tutorial-title">${step.title}</h3>
                <p class="tutorial-text">${step.text}</p>
            </div>
        `;

        // Render dots
        dotsContainer.innerHTML = '';
        TUTORIAL_STEPS.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = `tutorial-dot ${i === currentStep ? 'active' : ''}`;
            dotsContainer.appendChild(dot);
        });

        // Update buttons
        prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
        nextBtn.textContent = currentStep === TUTORIAL_STEPS.length - 1 ? 'Play' : 'Next';
    }

    // Add event listeners only once
    if (!nextBtn._hasTutorialListener) {
        nextBtn.addEventListener('click', () => {
            if (currentStep < TUTORIAL_STEPS.length - 1) {
                currentStep++;
                renderStep();
                if (window.AudioEngine) window.AudioEngine.playClick(800, 0.1);
            } else {
                closeTutorial();
                if (window.AudioEngine) window.AudioEngine.playClick(1200, 0.2);
            }
        });
        nextBtn._hasTutorialListener = true;
    }

    if (!prevBtn._hasTutorialListener) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                renderStep();
                if (window.AudioEngine) window.AudioEngine.playClick(600, 0.1);
            }
        });
        prevBtn._hasTutorialListener = true;
    }
}

// Global accessor to trigger it manually
window.startTutorial = function () {
    gameState.settings.tutorialSeen = false;
    const overlay = document.getElementById('tutorialOverlay');
    if (overlay) {
        currentStep = 0;
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');

        // Ensure initTutorial is called to bind listeners and show initial step
        initTutorial();
    }
};
