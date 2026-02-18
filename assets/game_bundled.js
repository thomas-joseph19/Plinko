export default `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>PLINKO∞ — Idle Plinko Game</title>
  <meta name="description"
    content="Drop balls, earn coins, upgrade everything. A satisfying idle Plinko game with physics, upgrades, and prestige.">

  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2818023938860764"
    crossorigin="anonymous"></script>

  <!-- iOS PWA / Standalone App -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="PLINKO∞">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#0a0a0d">
  <meta name="format-detection" content="telephone=no">

  <!-- iOS Icons -->
  <link rel="apple-touch-icon" href="icons/Logo.png">
  <link rel="apple-touch-icon" sizes="180x180" href="icons/Logo.png">
  <link rel="icon" type="image/png" href="icons/Logo.png">

  <!-- PWA Manifest -->
  <link rel="manifest" href="manifest.json">

  <!-- Fonts & Styles -->
  <link
    href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap"
    rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>

<body>

  <!-- Ambient background orbs -->
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="orb orb-3"></div>
  <div class="bg-sparkles" id="bgSparkles"></div>

  <!-- Offline earnings toast -->
  <div class="offline-toast" id="offlineToast" style="display:none;">
    <div class="toast-icon">🌙</div>
    <div class="toast-body">
      <div class="toast-title">Welcome back!</div>
      <div class="toast-sub" id="offlineMsg">Earned <strong>+0 coins</strong> while away</div>
    </div>
    <div class="toast-close" id="toastClose">✕</div>
  </div>

  <!-- Fever Mode Overlay -->
  <div class="fever-overlay" id="feverOverlay"></div>
  <div class="frenzy-overlay" id="frenzyOverlay"></div>

  <div class="app" id="app">

    <!-- ═══════════ HUD BAR ═══════════ -->
    <header class="hud" id="hud">
      <div class="hud-logo">PLINKO∞</div>
      <div class="hud-currencies">
        <div class="currency-chip coins" id="coinChip">
          <span class="icon">🪙</span>
          <span id="coinDisplay">0</span>
        </div>
        <div class="currency-chip gems" id="gemChip">
          <span class="icon">💎</span>
          <span id="gemDisplay">0</span>
        </div>
      </div>
      <div class="hud-actions">
        <button type="button" class="hud-btn" title="Settings" id="settingsBtn" aria-label="Settings">⚙️</button>
      </div>
    </header>

    <!-- ═══════════ MAIN CONTENT AREA ═══════════ -->
    <div class="main-content" id="mainContent">

      <!-- ── BOARD VIEW (default) ── -->
      <div class="view-panel board-view active" id="boardView">
        <main class="board-area">
          <!-- Drop zone -->
          <div class="drop-zone" id="dropZone">
            <div class="dropper-nozzle" id="dropperNozzle">
              <div class="dropper-pipe"></div>
              <div class="dropper-tip"></div>
            </div>
            <span class="drop-label" id="dropLabel">AUTO-DROP ×1</span>
          </div>

          <!-- The Plinko board canvas -->
          <div class="plinko-board" id="plinkoBoard">
            <canvas id="gameCanvas"></canvas>

            <!-- Fever banner -->
            <div class="fever-banner" id="feverBanner">🔥 FEVER MODE 🔥</div>
            <div class="frenzy-banner" id="frenzyBanner">⚡ FRENZY MODE ⚡</div>

            <!-- Frenzy Countdown Timer (floating on board) -->
            <div class="frenzy-timer" id="frenzyTimer" style="display:none;">
              <span class="frenzy-timer-icon">⚡</span>
              <span class="frenzy-timer-text" id="frenzyTimerText">0s</span>
            </div>

            <!-- Event banner -->
            <div class="fever-banner" id="eventBanner"
              style="background: linear-gradient(135deg, rgba(56,189,248,0.95), rgba(99,102,241,0.95));">⚡ EVENT ACTIVE
              ⚡</div>

            <!-- Slot tray rendered by JS -->
            <div class="slot-tray" id="slotTray"></div>
          </div>

          <!-- Frenzy Randomizer Overlay (fullscreen, shown before frenzy starts) -->
          <div class="frenzy-randomizer-overlay" id="frenzyRandomizer" style="display:none;">
            <div class="frenzy-randomizer-content">
              <div class="frenzy-randomizer-title">⚡ FRENZY MODE ⚡</div>
              <div class="frenzy-randomizer-slot" id="frenzySlotDuration">
                <div class="frenzy-slot-label">DURATION</div>
                <div class="frenzy-slot-value" id="frenzyDurationValue">--</div>
                <div class="frenzy-slot-unit">seconds</div>
              </div>
              <div class="frenzy-randomizer-slot" id="frenzySlotValue">
                <div class="frenzy-slot-label">BALL VALUE</div>
                <div class="frenzy-slot-value" id="frenzyValueValue">--</div>
                <div class="frenzy-slot-unit">coins each</div>
              </div>
              <div class="frenzy-randomizer-status" id="frenzyRandomizerStatus">Randomizing...</div>
            </div>
          </div>

          <!-- Bet Amount Selector -->
          <div class="bet-selector" id="betSelector">
            <button class="bet-btn" id="betDecrease" title="Decrease bet">−</button>
            <div class="bet-display">
              <span class="bet-label">BET</span>
              <span class="bet-amount" id="betAmountDisplay">1</span>
            </div>
            <button class="bet-btn" id="betIncrease" title="Increase bet">+</button>
          </div>

          <!-- Floating manual drop button -->
          <button class="manual-drop-btn" id="manualDropBtn" title="Drop a ball!">⬇</button>
        </main>
      </div>

      <!-- ── UPGRADES VIEW ── -->
      <div class="view-panel upgrades-view" id="upgradesView">
        <div class="panel-scroll">
          <div class="panel-header">
            <h2 class="panel-title">🔧 Upgrades</h2>
            <p class="panel-subtitle">Spend coins to power up your Plinko machine</p>
          </div>

          <div class="upgrade-category">
            <div class="category-label">⚡ Ball Upgrades</div>
            <div class="upgrade-grid" id="ballUpgrades"></div>
          </div>

          <div class="upgrade-category">
            <div class="category-label">🏗️ Board Upgrades</div>
            <div class="upgrade-grid" id="boardUpgrades"></div>
          </div>

          <div class="upgrade-category">
            <div class="category-label">💰 Passive Upgrades</div>
            <div class="upgrade-grid" id="passiveUpgrades"></div>
          </div>

          <div class="upgrade-category">
            <div class="category-label">⚡ Events</div>
            <div class="event-info-bar" id="eventInfoBar">
              <span class="event-info-status" id="eventGlobalStatus">Ready</span>
            </div>
            <div class="event-grid" id="eventCards"></div>
          </div>
        </div>
      </div>

      <!-- ── PRESTIGE VIEW ── -->
      <div class="view-panel prestige-view" id="prestigeView">
        <div class="panel-scroll">
          <div class="panel-header">
            <h2 class="panel-title">⭐ Prestige</h2>
            <p class="panel-subtitle">Reset progress for powerful permanent bonuses</p>
          </div>

          <div class="prestige-info-card" id="prestigeInfo">
            <div class="prestige-stats">
              <div class="p-stat">
                <span class="p-stat-label">Current Prestige</span>
                <span class="p-stat-value" id="prestigeLevel">0</span>
              </div>
              <div class="p-stat">
                <span class="p-stat-label">Tokens Available</span>
                <span class="p-stat-value" id="prestigeTokens">0</span>
              </div>
              <div class="p-stat">
                <span class="p-stat-label">Tokens on Reset</span>
                <span class="p-stat-value highlight" id="tokensOnReset">0</span>
              </div>
              <div class="p-stat">
                <span class="p-stat-label">Total Earned</span>
                <span class="p-stat-value" id="totalEarned">0</span>
              </div>
            </div>
            <button class="prestige-reset-btn" id="prestigeResetBtn">
              <span class="prestige-reset-label">⭐ PRESTIGE RESET</span>
              <span class="prestige-reset-sub" id="prestigeResetSub">Earn 0 tokens</span>
            </button>
          </div>

          <div class="prestige-tree" id="prestigeTree"></div>
        </div>
      </div>

      <!-- ── DAILY VIEW ── -->
      <div class="view-panel daily-view" id="dailyView">
        <div class="panel-scroll">
          <div class="panel-header">
            <h2 class="panel-title">🎁 Daily Rewards</h2>
            <p class="panel-subtitle">Log in every day for escalating rewards</p>
          </div>
          <!-- Frenzy Mode: first so it's always visible -->
          <div class="weekly-frenzy-section" id="weeklyFrenzySection"></div>
          <div class="daily-grid" id="dailyGrid"></div>
          <div class="challenge-section">
            <div class="category-label">🎯 Daily Challenges</div>
            <div id="dailyChallenges"></div>
          </div>
        </div>
      </div>

      <!-- ── SHOP VIEW ── -->
      <div class="view-panel shop-view" id="shopView">
        <div class="panel-scroll">
          <div class="panel-header">
            <h2 class="panel-title">💎 Shop</h2>
            <p class="panel-subtitle">Premium items and special offers</p>
          </div>
          <div id="shopItems"></div>
        </div>
      </div>


      <!-- ── STATS VIEW (was side panel) ── -->
      <div class="view-panel stats-view" id="statsView">
        <div class="panel-scroll">
          <div class="panel-header">
            <h2 class="panel-title">📊 Live Stats</h2>
            <p class="panel-subtitle">Track your Plinko performance</p>
          </div>

          <div class="stats-card">
            <div class="card-title">Performance</div>
            <div class="stat-row">
              <span class="stat-label">Coins / sec</span>
              <span class="stat-value highlight" id="statCps2">0</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Balls / sec</span>
              <span class="stat-value" id="statBps2">0</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Multiplier</span>
              <span class="stat-value highlight" id="statMult2">×1.0</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Board Rows</span>
              <span class="stat-value" id="statRows2">4</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Prestige</span>
              <span class="stat-value" id="statPrestige2">Lv. 0</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Combo</span>
              <span class="stat-value" id="statCombo2">×1</span>
            </div>
          </div>

          <!-- Quick upgrades -->
          <div class="stats-card">
            <div class="card-title">Quick Upgrades</div>
            <div id="quickUpgrades2"></div>
          </div>

          <!-- Prestige teaser -->
          <div class="prestige-btn" id="prestigeTeaser2">
            <div class="prestige-label">⭐ PRESTIGE</div>
            <div class="prestige-sub" id="prestigeTeaserSub2">Reset for permanent boost</div>
          </div>

          <!-- Hard Reset -->
          <button id="hardResetBtn"
            style="margin-top: 32px; width: 100%; padding: 10px; background: rgba(248, 113, 113, 0.1); border: 1px solid rgba(248, 113, 113, 0.2); color: #f87171; border-radius: 8px; font-family: 'Rajdhani'; font-weight: 600; cursor: pointer; font-size: 11px; letter-spacing: 1px;">
            💀 HARD RESET ALL DATA
          </button>
        </div>
      </div>

    </div>

    <!-- ═══════════ TAB BAR ═══════════ -->
    <nav class="tab-bar" id="tabBar">
      <div class="tab active" data-view="boardView">
        <span class="tab-icon">🎯</span>
        <span>Board</span>
      </div>
      <div class="tab" data-view="upgradesView">
        <span class="tab-icon">🔧</span>
        <span>Upgrades</span>
        <span class="badge" id="upgradeBadge" style="display:none">0</span>
      </div>
      <div class="tab" data-view="statsView">
        <span class="tab-icon">📊</span>
        <span>Stats</span>
      </div>
      <div class="tab" data-view="prestigeView">
        <span class="tab-icon">⭐</span>
        <span>Prestige</span>
      </div>
      <div class="tab" data-view="dailyView">
        <span class="tab-icon">🎁</span>
        <span>Daily</span>
        <span class="badge" id="dailyBadge" style="display:none">!</span>
      </div>
      <div class="tab" data-view="shopView">
        <span class="tab-icon">💎</span>
        <span>Shop</span>
      </div>
    </nav>
    <div id="adBanner" class="ad-banner">
      <div style="font-size: 10px; color: #555; letter-spacing: 1px;">ADVERTISEMENT</div>
    </div>
  </div>

  <!-- Tutorial Overlay -->
  <div class="tutorial-overlay" id="tutorialOverlay" aria-hidden="true">
    <div class="tutorial-modal">
      <div id="tutorialContent">
        <!-- Dynamically populated -->
      </div>
      <div class="tutorial-footer">
        <button class="tutorial-btn secondary" id="tutorialPrev" style="visibility: hidden;">Back</button>
        <div class="tutorial-dots" id="tutorialDots"></div>
        <button class="tutorial-btn primary" id="tutorialNext">Next</button>
      </div>
    </div>
  </div>

  <!-- Settings Modal -->
  <div class="settings-overlay" id="settingsOverlay" aria-hidden="true">
    <div class="settings-modal" id="settingsModal" role="dialog" aria-labelledby="settingsTitle">
      <div class="settings-header">
        <h2 class="settings-title" id="settingsTitle">⚙️ Settings</h2>
        <button type="button" class="settings-close" id="settingsClose" aria-label="Close settings">✕</button>
      </div>
      <div class="settings-body">
        <div class="settings-group">
          <div class="settings-label">Sound & Feedback</div>
          <div class="settings-control">
            <div class="control-info">
              <span class="control-name">Audio Effects</span>
              <span class="control-desc">Play arcade sounds and chimes</span>
            </div>
            <label class="switch">
              <input type="checkbox" id="audioToggle">
              <span class="slider"></span>
            </label>
          </div>
          <div class="settings-control volume-control">
            <div class="control-info">
              <span class="control-name">Volume</span>
            </div>
            <input type="range" id="volumeSlider" min="0" max="1" step="0.05" class="volume-slider">
          </div>
          <div class="settings-control">
            <div class="control-info">
              <span class="control-name">Animations</span>
              <span class="control-desc">Enable smooth visual effects</span>
            </div>
            <label class="switch">
              <input type="checkbox" id="animationToggle">
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="settings-group">
          <div class="settings-label">Gameplay</div>
          <div class="settings-control">
            <div class="control-info">
              <span class="control-name">Auto Drop</span>
              <span class="control-desc">Balls drop automatically over time</span>
            </div>
            <label class="switch">
              <input type="checkbox" id="autoDropToggle">
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="settings-group">
          <div class="settings-label">Information</div>
          <div class="legal-links">
            <button type="button" class="legal-btn" id="privacyBtn">Privacy Policy</button>
            <button type="button" class="legal-btn" id="termsBtn">Terms of Service</button>
          </div>
          <p class="settings-hint">Version 1.2.0</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Privacy Policy Modal -->
  <div class="legal-overlay" id="privacyOverlay" aria-hidden="true">
    <div class="legal-modal">
      <div class="legal-header">
        <h2 class="legal-title">Privacy Policy</h2>
        <button type="button" class="legal-close" id="privacyClose">✕</button>
      </div>
      <div class="legal-body">
        <p>Last updated: February 17, 2026</p>
        <p>PLINKO∞ ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we
          collect, use, and share information about you when you play our game.</p>
        <h3>Information We Collect</h3>
        <p>We do not collect any personal information. All game data is stored locally on your device via browser local
          storage.</p>
        <h3>Third-Party Services</h3>
        <p>Our game may include links to third-party services (like RevenueCat for purchases or Google AdSense for ads).
          We are not responsible for the privacy practices of these third-party services.</p>
        <h3>Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, please contact us at: <a
            href="mailto:plinkosupport@proton.me" style="color: #60a5fa;">plinkosupport@proton.me</a></p>
      </div>
    </div>
  </div>

  <!-- Terms of Service Modal -->
  <div class="legal-overlay" id="termsOverlay" aria-hidden="true">
    <div class="legal-modal">
      <div class="legal-header">
        <h2 class="legal-title">Terms of Service</h2>
        <button type="button" class="legal-close" id="termsClose">✕</button>
      </div>
      <div class="legal-body">
        <p>Last updated: February 17, 2026</p>
        <p>By using PLINKO∞, you agree to these Terms of Service. Please read them carefully.</p>
        <h3>Game Use</h3>
        <p>PLINKO∞ is for entertainment purposes only. The "coins" or "gems" used in the game have no real-world value
          and cannot be exchanged for currency.</p>
        <h3>In-App Purchases</h3>
        <p>We may offer virtual goods or currency for purchase via real money. All sales are final and non-refundable.
          Your purchases are handled by Apple/Google via the RevenueCat SDK.</p>
        <h3>Intellectual Property</h3>
        <p>All content included in the game (art, code, logic) is the property of the developers and is protected by
          copyright laws.</p>
        <h3>Support</h3>
        <p>For support or inquiries, email us at: <a href="mailto:plinkosupport@proton.me"
            style="color: #60a5fa;">plinkosupport@proton.me</a></p>
      </div>
    </div>
  </div>

  <!-- Matter.js physics engine -->
  <script type="text/javascript">/* js/matter.min.js */
/*!
 * matter-js 0.20.0 by @liabru
 * http://brm.io/matter-js/
 * License MIT
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("Matter",[],t):"object"==typeof exports?exports.Matter=t():e.Matter=t()}(this,(function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=20)}([function(e,t){var n={};e.exports=n,function(){n._baseDelta=1e3/60,n._nextId=0,n._seed=0,n._nowStartTime=+new Date,n._warnedOnce={},n._decomp=null,n.extend=function(e,t){var o,i;"boolean"==typeof t?(o=2,i=t):(o=1,i=!0);for(var r=o;r<arguments.length;r++){var a=arguments[r];if(a)for(var s in a)i&&a[s]&&a[s].constructor===Object?e[s]&&e[s].constructor!==Object?e[s]=a[s]:(e[s]=e[s]||{},n.extend(e[s],i,a[s])):e[s]=a[s]}return e},n.clone=function(e,t){return n.extend({},t,e)},n.keys=function(e){if(Object.keys)return Object.keys(e);var t=[];for(var n in e)t.push(n);return t},n.values=function(e){var t=[];if(Object.keys){for(var n=Object.keys(e),o=0;o<n.length;o++)t.push(e[n[o]]);return t}for(var i in e)t.push(e[i]);return t},n.get=function(e,t,n,o){t=t.split(".").slice(n,o);for(var i=0;i<t.length;i+=1)e=e[t[i]];return e},n.set=function(e,t,o,i,r){var a=t.split(".").slice(i,r);return n.get(e,t,0,-1)[a[a.length-1]]=o,o},n.shuffle=function(e){for(var t=e.length-1;t>0;t--){var o=Math.floor(n.random()*(t+1)),i=e[t];e[t]=e[o],e[o]=i}return e},n.choose=function(e){return e[Math.floor(n.random()*e.length)]},n.isElement=function(e){return"undefined"!=typeof HTMLElement?e instanceof HTMLElement:!!(e&&e.nodeType&&e.nodeName)},n.isArray=function(e){return"[object Array]"===Object.prototype.toString.call(e)},n.isFunction=function(e){return"function"==typeof e},n.isPlainObject=function(e){return"object"==typeof e&&e.constructor===Object},n.isString=function(e){return"[object String]"===toString.call(e)},n.clamp=function(e,t,n){return e<t?t:e>n?n:e},n.sign=function(e){return e<0?-1:1},n.now=function(){if("undefined"!=typeof window&&window.performance){if(window.performance.now)return window.performance.now();if(window.performance.webkitNow)return window.performance.webkitNow()}return Date.now?Date.now():new Date-n._nowStartTime},n.random=function(t,n){return n=void 0!==n?n:1,(t=void 0!==t?t:0)+e()*(n-t)};var e=function(){return n._seed=(9301*n._seed+49297)%233280,n._seed/233280};n.colorToNumber=function(e){return 3==(e=e.replace("#","")).length&&(e=e.charAt(0)+e.charAt(0)+e.charAt(1)+e.charAt(1)+e.charAt(2)+e.charAt(2)),parseInt(e,16)},n.logLevel=1,n.log=function(){console&&n.logLevel>0&&n.logLevel<=3&&console.log.apply(console,["matter-js:"].concat(Array.prototype.slice.call(arguments)))},n.info=function(){console&&n.logLevel>0&&n.logLevel<=2&&console.info.apply(console,["matter-js:"].concat(Array.prototype.slice.call(arguments)))},n.warn=function(){console&&n.logLevel>0&&n.logLevel<=3&&console.warn.apply(console,["matter-js:"].concat(Array.prototype.slice.call(arguments)))},n.warnOnce=function(){var e=Array.prototype.slice.call(arguments).join(" ");n._warnedOnce[e]||(n.warn(e),n._warnedOnce[e]=!0)},n.deprecated=function(e,t,o){e[t]=n.chain((function(){n.warnOnce("🔅 deprecated 🔅",o)}),e[t])},n.nextId=function(){return n._nextId++},n.indexOf=function(e,t){if(e.indexOf)return e.indexOf(t);for(var n=0;n<e.length;n++)if(e[n]===t)return n;return-1},n.map=function(e,t){if(e.map)return e.map(t);for(var n=[],o=0;o<e.length;o+=1)n.push(t(e[o]));return n},n.topologicalSort=function(e){var t=[],o=[],i=[];for(var r in e)o[r]||i[r]||n._topologicalSort(r,o,i,e,t);return t},n._topologicalSort=function(e,t,o,i,r){var a=i[e]||[];o[e]=!0;for(var s=0;s<a.length;s+=1){var l=a[s];o[l]||(t[l]||n._topologicalSort(l,t,o,i,r))}o[e]=!1,t[e]=!0,r.push(e)},n.chain=function(){for(var e=[],t=0;t<arguments.length;t+=1){var n=arguments[t];n._chained?e.push.apply(e,n._chained):e.push(n)}var o=function(){for(var t,n=new Array(arguments.length),o=0,i=arguments.length;o<i;o++)n[o]=arguments[o];for(o=0;o<e.length;o+=1){var r=e[o].apply(t,n);void 0!==r&&(t=r)}return t};return o._chained=e,o},n.chainPathBefore=function(e,t,o){return n.set(e,t,n.chain(o,n.get(e,t)))},n.chainPathAfter=function(e,t,o){return n.set(e,t,n.chain(n.get(e,t),o))},n.setDecomp=function(e){n._decomp=e},n.getDecomp=function(){var e=n._decomp;try{e||"undefined"==typeof window||(e=window.decomp),e||"undefined"==typeof global||(e=global.decomp)}catch(t){e=null}return e}}()},function(e,t){var n={};e.exports=n,n.create=function(e){var t={min:{x:0,y:0},max:{x:0,y:0}};return e&&n.update(t,e),t},n.update=function(e,t,n){e.min.x=1/0,e.max.x=-1/0,e.min.y=1/0,e.max.y=-1/0;for(var o=0;o<t.length;o++){var i=t[o];i.x>e.max.x&&(e.max.x=i.x),i.x<e.min.x&&(e.min.x=i.x),i.y>e.max.y&&(e.max.y=i.y),i.y<e.min.y&&(e.min.y=i.y)}n&&(n.x>0?e.max.x+=n.x:e.min.x+=n.x,n.y>0?e.max.y+=n.y:e.min.y+=n.y)},n.contains=function(e,t){return t.x>=e.min.x&&t.x<=e.max.x&&t.y>=e.min.y&&t.y<=e.max.y},n.overlaps=function(e,t){return e.min.x<=t.max.x&&e.max.x>=t.min.x&&e.max.y>=t.min.y&&e.min.y<=t.max.y},n.translate=function(e,t){e.min.x+=t.x,e.max.x+=t.x,e.min.y+=t.y,e.max.y+=t.y},n.shift=function(e,t){var n=e.max.x-e.min.x,o=e.max.y-e.min.y;e.min.x=t.x,e.max.x=t.x+n,e.min.y=t.y,e.max.y=t.y+o}},function(e,t){var n={};e.exports=n,n.create=function(e,t){return{x:e||0,y:t||0}},n.clone=function(e){return{x:e.x,y:e.y}},n.magnitude=function(e){return Math.sqrt(e.x*e.x+e.y*e.y)},n.magnitudeSquared=function(e){return e.x*e.x+e.y*e.y},n.rotate=function(e,t,n){var o=Math.cos(t),i=Math.sin(t);n||(n={});var r=e.x*o-e.y*i;return n.y=e.x*i+e.y*o,n.x=r,n},n.rotateAbout=function(e,t,n,o){var i=Math.cos(t),r=Math.sin(t);o||(o={});var a=n.x+((e.x-n.x)*i-(e.y-n.y)*r);return o.y=n.y+((e.x-n.x)*r+(e.y-n.y)*i),o.x=a,o},n.normalise=function(e){var t=n.magnitude(e);return 0===t?{x:0,y:0}:{x:e.x/t,y:e.y/t}},n.dot=function(e,t){return e.x*t.x+e.y*t.y},n.cross=function(e,t){return e.x*t.y-e.y*t.x},n.cross3=function(e,t,n){return(t.x-e.x)*(n.y-e.y)-(t.y-e.y)*(n.x-e.x)},n.add=function(e,t,n){return n||(n={}),n.x=e.x+t.x,n.y=e.y+t.y,n},n.sub=function(e,t,n){return n||(n={}),n.x=e.x-t.x,n.y=e.y-t.y,n},n.mult=function(e,t){return{x:e.x*t,y:e.y*t}},n.div=function(e,t){return{x:e.x/t,y:e.y/t}},n.perp=function(e,t){return{x:(t=!0===t?-1:1)*-e.y,y:t*e.x}},n.neg=function(e){return{x:-e.x,y:-e.y}},n.angle=function(e,t){return Math.atan2(t.y-e.y,t.x-e.x)},n._temp=[n.create(),n.create(),n.create(),n.create(),n.create(),n.create()]},function(e,t,n){var o={};e.exports=o;var i=n(2),r=n(0);o.create=function(e,t){for(var n=[],o=0;o<e.length;o++){var i=e[o],r={x:i.x,y:i.y,index:o,body:t,isInternal:!1};n.push(r)}return n},o.fromPath=function(e,t){var n=[];return e.replace(/L?\\s*([-\\d.e]+)[\\s,]*([-\\d.e]+)*/gi,(function(e,t,o){n.push({x:parseFloat(t),y:parseFloat(o)})})),o.create(n,t)},o.centre=function(e){for(var t,n,r,a=o.area(e,!0),s={x:0,y:0},l=0;l<e.length;l++)r=(l+1)%e.length,t=i.cross(e[l],e[r]),n=i.mult(i.add(e[l],e[r]),t),s=i.add(s,n);return i.div(s,6*a)},o.mean=function(e){for(var t={x:0,y:0},n=0;n<e.length;n++)t.x+=e[n].x,t.y+=e[n].y;return i.div(t,e.length)},o.area=function(e,t){for(var n=0,o=e.length-1,i=0;i<e.length;i++)n+=(e[o].x-e[i].x)*(e[o].y+e[i].y),o=i;return t?n/2:Math.abs(n)/2},o.inertia=function(e,t){for(var n,o,r=0,a=0,s=e,l=0;l<s.length;l++)o=(l+1)%s.length,r+=(n=Math.abs(i.cross(s[o],s[l])))*(i.dot(s[o],s[o])+i.dot(s[o],s[l])+i.dot(s[l],s[l])),a+=n;return t/6*(r/a)},o.translate=function(e,t,n){n=void 0!==n?n:1;var o,i=e.length,r=t.x*n,a=t.y*n;for(o=0;o<i;o++)e[o].x+=r,e[o].y+=a;return e},o.rotate=function(e,t,n){if(0!==t){var o,i,r,a,s=Math.cos(t),l=Math.sin(t),c=n.x,u=n.y,d=e.length;for(a=0;a<d;a++)i=(o=e[a]).x-c,r=o.y-u,o.x=c+(i*s-r*l),o.y=u+(i*l+r*s);return e}},o.contains=function(e,t){for(var n,o=t.x,i=t.y,r=e.length,a=e[r-1],s=0;s<r;s++){if(n=e[s],(o-a.x)*(n.y-a.y)+(i-a.y)*(a.x-n.x)>0)return!1;a=n}return!0},o.scale=function(e,t,n,r){if(1===t&&1===n)return e;var a,s;r=r||o.centre(e);for(var l=0;l<e.length;l++)a=e[l],s=i.sub(a,r),e[l].x=r.x+s.x*t,e[l].y=r.y+s.y*n;return e},o.chamfer=function(e,t,n,o,a){t="number"==typeof t?[t]:t||[8],n=void 0!==n?n:-1,o=o||2,a=a||14;for(var s=[],l=0;l<e.length;l++){var c=e[l-1>=0?l-1:e.length-1],u=e[l],d=e[(l+1)%e.length],p=t[l<t.length?l:t.length-1];if(0!==p){var f=i.normalise({x:u.y-c.y,y:c.x-u.x}),v=i.normalise({x:d.y-u.y,y:u.x-d.x}),m=Math.sqrt(2*Math.pow(p,2)),y=i.mult(r.clone(f),p),g=i.normalise(i.mult(i.add(f,v),.5)),x=i.sub(u,i.mult(g,m)),h=n;-1===n&&(h=1.75*Math.pow(p,.32)),(h=r.clamp(h,o,a))%2==1&&(h+=1);for(var b=Math.acos(i.dot(f,v))/h,S=0;S<h;S++)s.push(i.add(i.rotate(y,b*S),x))}else s.push(u)}return s},o.clockwiseSort=function(e){var t=o.mean(e);return e.sort((function(e,n){return i.angle(t,e)-i.angle(t,n)})),e},o.isConvex=function(e){var t,n,o,i,r=0,a=e.length;if(a<3)return null;for(t=0;t<a;t++)if(o=(t+2)%a,i=(e[n=(t+1)%a].x-e[t].x)*(e[o].y-e[n].y),(i-=(e[n].y-e[t].y)*(e[o].x-e[n].x))<0?r|=1:i>0&&(r|=2),3===r)return!1;return 0!==r||null},o.hull=function(e){var t,n,o=[],r=[];for((e=e.slice(0)).sort((function(e,t){var n=e.x-t.x;return 0!==n?n:e.y-t.y})),n=0;n<e.length;n+=1){for(t=e[n];r.length>=2&&i.cross3(r[r.length-2],r[r.length-1],t)<=0;)r.pop();r.push(t)}for(n=e.length-1;n>=0;n-=1){for(t=e[n];o.length>=2&&i.cross3(o[o.length-2],o[o.length-1],t)<=0;)o.pop();o.push(t)}return o.pop(),r.pop(),o.concat(r)}},function(e,t,n){var o={};e.exports=o;var i=n(3),r=n(2),a=n(7),s=n(0),l=n(1),c=n(11);!function(){o._timeCorrection=!0,o._inertiaScale=4,o._nextCollidingGroupId=1,o._nextNonCollidingGroupId=-1,o._nextCategory=1,o._baseDelta=1e3/60,o.create=function(t){var n={id:s.nextId(),type:"body",label:"Body",parts:[],plugin:{},angle:0,vertices:i.fromPath("L 0 0 L 40 0 L 40 40 L 0 40"),position:{x:0,y:0},force:{x:0,y:0},torque:0,positionImpulse:{x:0,y:0},constraintImpulse:{x:0,y:0,angle:0},totalContacts:0,speed:0,angularSpeed:0,velocity:{x:0,y:0},angularVelocity:0,isSensor:!1,isStatic:!1,isSleeping:!1,motion:0,sleepThreshold:60,density:.001,restitution:0,friction:.1,frictionStatic:.5,frictionAir:.01,collisionFilter:{category:1,mask:4294967295,group:0},slop:.05,timeScale:1,render:{visible:!0,opacity:1,strokeStyle:null,fillStyle:null,lineWidth:null,sprite:{xScale:1,yScale:1,xOffset:0,yOffset:0}},events:null,bounds:null,chamfer:null,circleRadius:0,positionPrev:null,anglePrev:0,parent:null,axes:null,area:0,mass:0,inertia:0,deltaTime:1e3/60,_original:null},o=s.extend(n,t);return e(o,t),o},o.nextGroup=function(e){return e?o._nextNonCollidingGroupId--:o._nextCollidingGroupId++},o.nextCategory=function(){return o._nextCategory=o._nextCategory<<1,o._nextCategory};var e=function(e,t){t=t||{},o.set(e,{bounds:e.bounds||l.create(e.vertices),positionPrev:e.positionPrev||r.clone(e.position),anglePrev:e.anglePrev||e.angle,vertices:e.vertices,parts:e.parts||[e],isStatic:e.isStatic,isSleeping:e.isSleeping,parent:e.parent||e}),i.rotate(e.vertices,e.angle,e.position),c.rotate(e.axes,e.angle),l.update(e.bounds,e.vertices,e.velocity),o.set(e,{axes:t.axes||e.axes,area:t.area||e.area,mass:t.mass||e.mass,inertia:t.inertia||e.inertia});var n=e.isStatic?"#14151f":s.choose(["#f19648","#f5d259","#f55a3c","#063e7b","#ececd1"]),a=e.isStatic?"#555":"#ccc",u=e.isStatic&&null===e.render.fillStyle?1:0;e.render.fillStyle=e.render.fillStyle||n,e.render.strokeStyle=e.render.strokeStyle||a,e.render.lineWidth=e.render.lineWidth||u,e.render.sprite.xOffset+=-(e.bounds.min.x-e.position.x)/(e.bounds.max.x-e.bounds.min.x),e.render.sprite.yOffset+=-(e.bounds.min.y-e.position.y)/(e.bounds.max.y-e.bounds.min.y)};o.set=function(e,t,n){var i;for(i in"string"==typeof t&&(i=t,(t={})[i]=n),t)if(Object.prototype.hasOwnProperty.call(t,i))switch(n=t[i],i){case"isStatic":o.setStatic(e,n);break;case"isSleeping":a.set(e,n);break;case"mass":o.setMass(e,n);break;case"density":o.setDensity(e,n);break;case"inertia":o.setInertia(e,n);break;case"vertices":o.setVertices(e,n);break;case"position":o.setPosition(e,n);break;case"angle":o.setAngle(e,n);break;case"velocity":o.setVelocity(e,n);break;case"angularVelocity":o.setAngularVelocity(e,n);break;case"speed":o.setSpeed(e,n);break;case"angularSpeed":o.setAngularSpeed(e,n);break;case"parts":o.setParts(e,n);break;case"centre":o.setCentre(e,n);break;default:e[i]=n}},o.setStatic=function(e,t){for(var n=0;n<e.parts.length;n++){var o=e.parts[n];t?(o.isStatic||(o._original={restitution:o.restitution,friction:o.friction,mass:o.mass,inertia:o.inertia,density:o.density,inverseMass:o.inverseMass,inverseInertia:o.inverseInertia}),o.restitution=0,o.friction=1,o.mass=o.inertia=o.density=1/0,o.inverseMass=o.inverseInertia=0,o.positionPrev.x=o.position.x,o.positionPrev.y=o.position.y,o.anglePrev=o.angle,o.angularVelocity=0,o.speed=0,o.angularSpeed=0,o.motion=0):o._original&&(o.restitution=o._original.restitution,o.friction=o._original.friction,o.mass=o._original.mass,o.inertia=o._original.inertia,o.density=o._original.density,o.inverseMass=o._original.inverseMass,o.inverseInertia=o._original.inverseInertia,o._original=null),o.isStatic=t}},o.setMass=function(e,t){var n=e.inertia/(e.mass/6);e.inertia=n*(t/6),e.inverseInertia=1/e.inertia,e.mass=t,e.inverseMass=1/e.mass,e.density=e.mass/e.area},o.setDensity=function(e,t){o.setMass(e,t*e.area),e.density=t},o.setInertia=function(e,t){e.inertia=t,e.inverseInertia=1/e.inertia},o.setVertices=function(e,t){t[0].body===e?e.vertices=t:e.vertices=i.create(t,e),e.axes=c.fromVertices(e.vertices),e.area=i.area(e.vertices),o.setMass(e,e.density*e.area);var n=i.centre(e.vertices);i.translate(e.vertices,n,-1),o.setInertia(e,o._inertiaScale*i.inertia(e.vertices,e.mass)),i.translate(e.vertices,e.position),l.update(e.bounds,e.vertices,e.velocity)},o.setParts=function(e,t,n){var r;for(t=t.slice(0),e.parts.length=0,e.parts.push(e),e.parent=e,r=0;r<t.length;r++){var a=t[r];a!==e&&(a.parent=e,e.parts.push(a))}if(1!==e.parts.length){if(n=void 0===n||n){var s=[];for(r=0;r<t.length;r++)s=s.concat(t[r].vertices);i.clockwiseSort(s);var l=i.hull(s),c=i.centre(l);o.setVertices(e,l),i.translate(e.vertices,c)}var u=o._totalProperties(e);e.area=u.area,e.parent=e,e.position.x=u.centre.x,e.position.y=u.centre.y,e.positionPrev.x=u.centre.x,e.positionPrev.y=u.centre.y,o.setMass(e,u.mass),o.setInertia(e,u.inertia),o.setPosition(e,u.centre)}},o.setCentre=function(e,t,n){n?(e.positionPrev.x+=t.x,e.positionPrev.y+=t.y,e.position.x+=t.x,e.position.y+=t.y):(e.positionPrev.x=t.x-(e.position.x-e.positionPrev.x),e.positionPrev.y=t.y-(e.position.y-e.positionPrev.y),e.position.x=t.x,e.position.y=t.y)},o.setPosition=function(e,t,n){var o=r.sub(t,e.position);n?(e.positionPrev.x=e.position.x,e.positionPrev.y=e.position.y,e.velocity.x=o.x,e.velocity.y=o.y,e.speed=r.magnitude(o)):(e.positionPrev.x+=o.x,e.positionPrev.y+=o.y);for(var a=0;a<e.parts.length;a++){var s=e.parts[a];s.position.x+=o.x,s.position.y+=o.y,i.translate(s.vertices,o),l.update(s.bounds,s.vertices,e.velocity)}},o.setAngle=function(e,t,n){var o=t-e.angle;n?(e.anglePrev=e.angle,e.angularVelocity=o,e.angularSpeed=Math.abs(o)):e.anglePrev+=o;for(var a=0;a<e.parts.length;a++){var s=e.parts[a];s.angle+=o,i.rotate(s.vertices,o,e.position),c.rotate(s.axes,o),l.update(s.bounds,s.vertices,e.velocity),a>0&&r.rotateAbout(s.position,o,e.position,s.position)}},o.setVelocity=function(e,t){var n=e.deltaTime/o._baseDelta;e.positionPrev.x=e.position.x-t.x*n,e.positionPrev.y=e.position.y-t.y*n,e.velocity.x=(e.position.x-e.positionPrev.x)/n,e.velocity.y=(e.position.y-e.positionPrev.y)/n,e.speed=r.magnitude(e.velocity)},o.getVelocity=function(e){var t=o._baseDelta/e.deltaTime;return{x:(e.position.x-e.positionPrev.x)*t,y:(e.position.y-e.positionPrev.y)*t}},o.getSpeed=function(e){return r.magnitude(o.getVelocity(e))},o.setSpeed=function(e,t){o.setVelocity(e,r.mult(r.normalise(o.getVelocity(e)),t))},o.setAngularVelocity=function(e,t){var n=e.deltaTime/o._baseDelta;e.anglePrev=e.angle-t*n,e.angularVelocity=(e.angle-e.anglePrev)/n,e.angularSpeed=Math.abs(e.angularVelocity)},o.getAngularVelocity=function(e){return(e.angle-e.anglePrev)*o._baseDelta/e.deltaTime},o.getAngularSpeed=function(e){return Math.abs(o.getAngularVelocity(e))},o.setAngularSpeed=function(e,t){o.setAngularVelocity(e,s.sign(o.getAngularVelocity(e))*t)},o.translate=function(e,t,n){o.setPosition(e,r.add(e.position,t),n)},o.rotate=function(e,t,n,i){if(n){var r=Math.cos(t),a=Math.sin(t),s=e.position.x-n.x,l=e.position.y-n.y;o.setPosition(e,{x:n.x+(s*r-l*a),y:n.y+(s*a+l*r)},i),o.setAngle(e,e.angle+t,i)}else o.setAngle(e,e.angle+t,i)},o.scale=function(e,t,n,r){var a=0,s=0;r=r||e.position;for(var u=0;u<e.parts.length;u++){var d=e.parts[u];i.scale(d.vertices,t,n,r),d.axes=c.fromVertices(d.vertices),d.area=i.area(d.vertices),o.setMass(d,e.density*d.area),i.translate(d.vertices,{x:-d.position.x,y:-d.position.y}),o.setInertia(d,o._inertiaScale*i.inertia(d.vertices,d.mass)),i.translate(d.vertices,{x:d.position.x,y:d.position.y}),u>0&&(a+=d.area,s+=d.inertia),d.position.x=r.x+(d.position.x-r.x)*t,d.position.y=r.y+(d.position.y-r.y)*n,l.update(d.bounds,d.vertices,e.velocity)}e.parts.length>1&&(e.area=a,e.isStatic||(o.setMass(e,e.density*a),o.setInertia(e,s))),e.circleRadius&&(t===n?e.circleRadius*=t:e.circleRadius=null)},o.update=function(e,t){var n=(t=(void 0!==t?t:1e3/60)*e.timeScale)*t,a=o._timeCorrection?t/(e.deltaTime||t):1,u=1-e.frictionAir*(t/s._baseDelta),d=(e.position.x-e.positionPrev.x)*a,p=(e.position.y-e.positionPrev.y)*a;e.velocity.x=d*u+e.force.x/e.mass*n,e.velocity.y=p*u+e.force.y/e.mass*n,e.positionPrev.x=e.position.x,e.positionPrev.y=e.position.y,e.position.x+=e.velocity.x,e.position.y+=e.velocity.y,e.deltaTime=t,e.angularVelocity=(e.angle-e.anglePrev)*u*a+e.torque/e.inertia*n,e.anglePrev=e.angle,e.angle+=e.angularVelocity;for(var f=0;f<e.parts.length;f++){var v=e.parts[f];i.translate(v.vertices,e.velocity),f>0&&(v.position.x+=e.velocity.x,v.position.y+=e.velocity.y),0!==e.angularVelocity&&(i.rotate(v.vertices,e.angularVelocity,e.position),c.rotate(v.axes,e.angularVelocity),f>0&&r.rotateAbout(v.position,e.angularVelocity,e.position,v.position)),l.update(v.bounds,v.vertices,e.velocity)}},o.updateVelocities=function(e){var t=o._baseDelta/e.deltaTime,n=e.velocity;n.x=(e.position.x-e.positionPrev.x)*t,n.y=(e.position.y-e.positionPrev.y)*t,e.speed=Math.sqrt(n.x*n.x+n.y*n.y),e.angularVelocity=(e.angle-e.anglePrev)*t,e.angularSpeed=Math.abs(e.angularVelocity)},o.applyForce=function(e,t,n){var o=t.x-e.position.x,i=t.y-e.position.y;e.force.x+=n.x,e.force.y+=n.y,e.torque+=o*n.y-i*n.x},o._totalProperties=function(e){for(var t={mass:0,area:0,inertia:0,centre:{x:0,y:0}},n=1===e.parts.length?0:1;n<e.parts.length;n++){var o=e.parts[n],i=o.mass!==1/0?o.mass:1;t.mass+=i,t.area+=o.area,t.inertia+=o.inertia,t.centre=r.add(t.centre,r.mult(o.position,i))}return t.centre=r.div(t.centre,t.mass),t}}()},function(e,t,n){var o={};e.exports=o;var i=n(0);o.on=function(e,t,n){for(var o,i=t.split(" "),r=0;r<i.length;r++)o=i[r],e.events=e.events||{},e.events[o]=e.events[o]||[],e.events[o].push(n);return n},o.off=function(e,t,n){if(t){"function"==typeof t&&(n=t,t=i.keys(e.events).join(" "));for(var o=t.split(" "),r=0;r<o.length;r++){var a=e.events[o[r]],s=[];if(n&&a)for(var l=0;l<a.length;l++)a[l]!==n&&s.push(a[l]);e.events[o[r]]=s}}else e.events={}},o.trigger=function(e,t,n){var o,r,a,s,l=e.events;if(l&&i.keys(l).length>0){n||(n={}),o=t.split(" ");for(var c=0;c<o.length;c++)if(a=l[r=o[c]]){(s=i.clone(n,!1)).name=r,s.source=e;for(var u=0;u<a.length;u++)a[u].apply(e,[s])}}}},function(e,t,n){var o={};e.exports=o;var i=n(5),r=n(0),a=n(1),s=n(4);o.create=function(e){return r.extend({id:r.nextId(),type:"composite",parent:null,isModified:!1,bodies:[],constraints:[],composites:[],label:"Composite",plugin:{},cache:{allBodies:null,allConstraints:null,allComposites:null}},e)},o.setModified=function(e,t,n,i){if(e.isModified=t,t&&e.cache&&(e.cache.allBodies=null,e.cache.allConstraints=null,e.cache.allComposites=null),n&&e.parent&&o.setModified(e.parent,t,n,i),i)for(var r=0;r<e.composites.length;r++){var a=e.composites[r];o.setModified(a,t,n,i)}},o.add=function(e,t){var n=[].concat(t);i.trigger(e,"beforeAdd",{object:t});for(var a=0;a<n.length;a++){var s=n[a];switch(s.type){case"body":if(s.parent!==s){r.warn("Composite.add: skipped adding a compound body part (you must add its parent instead)");break}o.addBody(e,s);break;case"constraint":o.addConstraint(e,s);break;case"composite":o.addComposite(e,s);break;case"mouseConstraint":o.addConstraint(e,s.constraint)}}return i.trigger(e,"afterAdd",{object:t}),e},o.remove=function(e,t,n){var r=[].concat(t);i.trigger(e,"beforeRemove",{object:t});for(var a=0;a<r.length;a++){var s=r[a];switch(s.type){case"body":o.removeBody(e,s,n);break;case"constraint":o.removeConstraint(e,s,n);break;case"composite":o.removeComposite(e,s,n);break;case"mouseConstraint":o.removeConstraint(e,s.constraint)}}return i.trigger(e,"afterRemove",{object:t}),e},o.addComposite=function(e,t){return e.composites.push(t),t.parent=e,o.setModified(e,!0,!0,!1),e},o.removeComposite=function(e,t,n){var i=r.indexOf(e.composites,t);if(-1!==i){var a=o.allBodies(t);o.removeCompositeAt(e,i);for(var s=0;s<a.length;s++)a[s].sleepCounter=0}if(n)for(s=0;s<e.composites.length;s++)o.removeComposite(e.composites[s],t,!0);return e},o.removeCompositeAt=function(e,t){return e.composites.splice(t,1),o.setModified(e,!0,!0,!1),e},o.addBody=function(e,t){return e.bodies.push(t),o.setModified(e,!0,!0,!1),e},o.removeBody=function(e,t,n){var i=r.indexOf(e.bodies,t);if(-1!==i&&(o.removeBodyAt(e,i),t.sleepCounter=0),n)for(var a=0;a<e.composites.length;a++)o.removeBody(e.composites[a],t,!0);return e},o.removeBodyAt=function(e,t){return e.bodies.splice(t,1),o.setModified(e,!0,!0,!1),e},o.addConstraint=function(e,t){return e.constraints.push(t),o.setModified(e,!0,!0,!1),e},o.removeConstraint=function(e,t,n){var i=r.indexOf(e.constraints,t);if(-1!==i&&o.removeConstraintAt(e,i),n)for(var a=0;a<e.composites.length;a++)o.removeConstraint(e.composites[a],t,!0);return e},o.removeConstraintAt=function(e,t){return e.constraints.splice(t,1),o.setModified(e,!0,!0,!1),e},o.clear=function(e,t,n){if(n)for(var i=0;i<e.composites.length;i++)o.clear(e.composites[i],t,!0);return t?e.bodies=e.bodies.filter((function(e){return e.isStatic})):e.bodies.length=0,e.constraints.length=0,e.composites.length=0,o.setModified(e,!0,!0,!1),e},o.allBodies=function(e){if(e.cache&&e.cache.allBodies)return e.cache.allBodies;for(var t=[].concat(e.bodies),n=0;n<e.composites.length;n++)t=t.concat(o.allBodies(e.composites[n]));return e.cache&&(e.cache.allBodies=t),t},o.allConstraints=function(e){if(e.cache&&e.cache.allConstraints)return e.cache.allConstraints;for(var t=[].concat(e.constraints),n=0;n<e.composites.length;n++)t=t.concat(o.allConstraints(e.composites[n]));return e.cache&&(e.cache.allConstraints=t),t},o.allComposites=function(e){if(e.cache&&e.cache.allComposites)return e.cache.allComposites;for(var t=[].concat(e.composites),n=0;n<e.composites.length;n++)t=t.concat(o.allComposites(e.composites[n]));return e.cache&&(e.cache.allComposites=t),t},o.get=function(e,t,n){var i,r;switch(n){case"body":i=o.allBodies(e);break;case"constraint":i=o.allConstraints(e);break;case"composite":i=o.allComposites(e).concat(e)}return i?0===(r=i.filter((function(e){return e.id.toString()===t.toString()}))).length?null:r[0]:null},o.move=function(e,t,n){return o.remove(e,t),o.add(n,t),e},o.rebase=function(e){for(var t=o.allBodies(e).concat(o.allConstraints(e)).concat(o.allComposites(e)),n=0;n<t.length;n++)t[n].id=r.nextId();return e},o.translate=function(e,t,n){for(var i=n?o.allBodies(e):e.bodies,r=0;r<i.length;r++)s.translate(i[r],t);return e},o.rotate=function(e,t,n,i){for(var r=Math.cos(t),a=Math.sin(t),l=i?o.allBodies(e):e.bodies,c=0;c<l.length;c++){var u=l[c],d=u.position.x-n.x,p=u.position.y-n.y;s.setPosition(u,{x:n.x+(d*r-p*a),y:n.y+(d*a+p*r)}),s.rotate(u,t)}return e},o.scale=function(e,t,n,i,r){for(var a=r?o.allBodies(e):e.bodies,l=0;l<a.length;l++){var c=a[l],u=c.position.x-i.x,d=c.position.y-i.y;s.setPosition(c,{x:i.x+u*t,y:i.y+d*n}),s.scale(c,t,n)}return e},o.bounds=function(e){for(var t=o.allBodies(e),n=[],i=0;i<t.length;i+=1){var r=t[i];n.push(r.bounds.min,r.bounds.max)}return a.create(n)}},function(e,t,n){var o={};e.exports=o;var i=n(4),r=n(5),a=n(0);o._motionWakeThreshold=.18,o._motionSleepThreshold=.08,o._minBias=.9,o.update=function(e,t){for(var n=t/a._baseDelta,r=o._motionSleepThreshold,s=0;s<e.length;s++){var l=e[s],c=i.getSpeed(l),u=i.getAngularSpeed(l),d=c*c+u*u;if(0===l.force.x&&0===l.force.y){var p=Math.min(l.motion,d),f=Math.max(l.motion,d);l.motion=o._minBias*p+(1-o._minBias)*f,l.sleepThreshold>0&&l.motion<r?(l.sleepCounter+=1,l.sleepCounter>=l.sleepThreshold/n&&o.set(l,!0)):l.sleepCounter>0&&(l.sleepCounter-=1)}else o.set(l,!1)}},o.afterCollisions=function(e){for(var t=o._motionSleepThreshold,n=0;n<e.length;n++){var i=e[n];if(i.isActive){var r=i.collision,a=r.bodyA.parent,s=r.bodyB.parent;if(!(a.isSleeping&&s.isSleeping||a.isStatic||s.isStatic)&&(a.isSleeping||s.isSleeping)){var l=a.isSleeping&&!a.isStatic?a:s,c=l===a?s:a;!l.isStatic&&c.motion>t&&o.set(l,!1)}}}},o.set=function(e,t){var n=e.isSleeping;t?(e.isSleeping=!0,e.sleepCounter=e.sleepThreshold,e.positionImpulse.x=0,e.positionImpulse.y=0,e.positionPrev.x=e.position.x,e.positionPrev.y=e.position.y,e.anglePrev=e.angle,e.speed=0,e.angularSpeed=0,e.motion=0,n||r.trigger(e,"sleepStart")):(e.isSleeping=!1,e.sleepCounter=0,n&&r.trigger(e,"sleepEnd"))}},function(e,t,n){var o={};e.exports=o;var i,r,a,s=n(3),l=n(9);i=[],r={overlap:0,axis:null},a={overlap:0,axis:null},o.create=function(e,t){return{pair:null,collided:!1,bodyA:e,bodyB:t,parentA:e.parent,parentB:t.parent,depth:0,normal:{x:0,y:0},tangent:{x:0,y:0},penetration:{x:0,y:0},supports:[null,null],supportCount:0}},o.collides=function(e,t,n){if(o._overlapAxes(r,e.vertices,t.vertices,e.axes),r.overlap<=0)return null;if(o._overlapAxes(a,t.vertices,e.vertices,t.axes),a.overlap<=0)return null;var i,c,u=n&&n.table[l.id(e,t)];u?i=u.collision:((i=o.create(e,t)).collided=!0,i.bodyA=e.id<t.id?e:t,i.bodyB=e.id<t.id?t:e,i.parentA=i.bodyA.parent,i.parentB=i.bodyB.parent),e=i.bodyA,t=i.bodyB,c=r.overlap<a.overlap?r:a;var d=i.normal,p=i.tangent,f=i.penetration,v=i.supports,m=c.overlap,y=c.axis,g=y.x,x=y.y;g*(t.position.x-e.position.x)+x*(t.position.y-e.position.y)>=0&&(g=-g,x=-x),d.x=g,d.y=x,p.x=-x,p.y=g,f.x=g*m,f.y=x*m,i.depth=m;var h=o._findSupports(e,t,d,1),b=0;if(s.contains(e.vertices,h[0])&&(v[b++]=h[0]),s.contains(e.vertices,h[1])&&(v[b++]=h[1]),b<2){var S=o._findSupports(t,e,d,-1);s.contains(t.vertices,S[0])&&(v[b++]=S[0]),b<2&&s.contains(t.vertices,S[1])&&(v[b++]=S[1])}return 0===b&&(v[b++]=h[0]),i.supportCount=b,i},o._overlapAxes=function(e,t,n,o){var i,r,a,s,l,c,u=t.length,d=n.length,p=t[0].x,f=t[0].y,v=n[0].x,m=n[0].y,y=o.length,g=Number.MAX_VALUE,x=0;for(l=0;l<y;l++){var h=o[l],b=h.x,S=h.y,w=p*b+f*S,A=v*b+m*S,P=w,B=A;for(c=1;c<u;c+=1)(s=t[c].x*b+t[c].y*S)>P?P=s:s<w&&(w=s);for(c=1;c<d;c+=1)(s=n[c].x*b+n[c].y*S)>B?B=s:s<A&&(A=s);if((i=(r=P-A)<(a=B-w)?r:a)<g&&(g=i,x=l,i<=0))break}e.axis=o[x],e.overlap=g},o._findSupports=function(e,t,n,o){var r,a,s,l=t.vertices,c=l.length,u=e.position.x,d=e.position.y,p=n.x*o,f=n.y*o,v=l[0],m=v,y=p*(u-m.x)+f*(d-m.y);for(s=1;s<c;s+=1)(a=p*(u-(m=l[s]).x)+f*(d-m.y))<y&&(y=a,v=m);return y=p*(u-(r=l[(c+v.index-1)%c]).x)+f*(d-r.y),p*(u-(m=l[(v.index+1)%c]).x)+f*(d-m.y)<y?(i[0]=v,i[1]=m,i):(i[0]=v,i[1]=r,i)}},function(e,t,n){var o={};e.exports=o;var i=n(16);o.create=function(e,t){var n=e.bodyA,r=e.bodyB,a={id:o.id(n,r),bodyA:n,bodyB:r,collision:e,contacts:[i.create(),i.create()],contactCount:0,separation:0,isActive:!0,isSensor:n.isSensor||r.isSensor,timeCreated:t,timeUpdated:t,inverseMass:0,friction:0,frictionStatic:0,restitution:0,slop:0};return o.update(a,e,t),a},o.update=function(e,t,n){var o=t.supports,i=t.supportCount,r=e.contacts,a=t.parentA,s=t.parentB;e.isActive=!0,e.timeUpdated=n,e.collision=t,e.separation=t.depth,e.inverseMass=a.inverseMass+s.inverseMass,e.friction=a.friction<s.friction?a.friction:s.friction,e.frictionStatic=a.frictionStatic>s.frictionStatic?a.frictionStatic:s.frictionStatic,e.restitution=a.restitution>s.restitution?a.restitution:s.restitution,e.slop=a.slop>s.slop?a.slop:s.slop,e.contactCount=i,t.pair=e;var l=o[0],c=r[0],u=o[1],d=r[1];d.vertex!==l&&c.vertex!==u||(r[1]=c,r[0]=c=d,d=r[1]),c.vertex=l,d.vertex=u},o.setActive=function(e,t,n){t?(e.isActive=!0,e.timeUpdated=n):(e.isActive=!1,e.contactCount=0)},o.id=function(e,t){return e.id<t.id?e.id.toString(36)+":"+t.id.toString(36):t.id.toString(36)+":"+e.id.toString(36)}},function(e,t,n){var o={};e.exports=o;var i=n(3),r=n(2),a=n(7),s=n(1),l=n(11),c=n(0);o._warming=.4,o._torqueDampen=1,o._minLength=1e-6,o.create=function(e){var t=e;t.bodyA&&!t.pointA&&(t.pointA={x:0,y:0}),t.bodyB&&!t.pointB&&(t.pointB={x:0,y:0});var n=t.bodyA?r.add(t.bodyA.position,t.pointA):t.pointA,o=t.bodyB?r.add(t.bodyB.position,t.pointB):t.pointB,i=r.magnitude(r.sub(n,o));t.length=void 0!==t.length?t.length:i,t.id=t.id||c.nextId(),t.label=t.label||"Constraint",t.type="constraint",t.stiffness=t.stiffness||(t.length>0?1:.7),t.damping=t.damping||0,t.angularStiffness=t.angularStiffness||0,t.angleA=t.bodyA?t.bodyA.angle:t.angleA,t.angleB=t.bodyB?t.bodyB.angle:t.angleB,t.plugin={};var a={visible:!0,lineWidth:2,strokeStyle:"#ffffff",type:"line",anchors:!0};return 0===t.length&&t.stiffness>.1?(a.type="pin",a.anchors=!1):t.stiffness<.9&&(a.type="spring"),t.render=c.extend(a,t.render),t},o.preSolveAll=function(e){for(var t=0;t<e.length;t+=1){var n=e[t],o=n.constraintImpulse;n.isStatic||0===o.x&&0===o.y&&0===o.angle||(n.position.x+=o.x,n.position.y+=o.y,n.angle+=o.angle)}},o.solveAll=function(e,t){for(var n=c.clamp(t/c._baseDelta,0,1),i=0;i<e.length;i+=1){var r=e[i],a=!r.bodyA||r.bodyA&&r.bodyA.isStatic,s=!r.bodyB||r.bodyB&&r.bodyB.isStatic;(a||s)&&o.solve(e[i],n)}for(i=0;i<e.length;i+=1)a=!(r=e[i]).bodyA||r.bodyA&&r.bodyA.isStatic,s=!r.bodyB||r.bodyB&&r.bodyB.isStatic,a||s||o.solve(e[i],n)},o.solve=function(e,t){var n=e.bodyA,i=e.bodyB,a=e.pointA,s=e.pointB;if(n||i){n&&!n.isStatic&&(r.rotate(a,n.angle-e.angleA,a),e.angleA=n.angle),i&&!i.isStatic&&(r.rotate(s,i.angle-e.angleB,s),e.angleB=i.angle);var l=a,c=s;if(n&&(l=r.add(n.position,a)),i&&(c=r.add(i.position,s)),l&&c){var u=r.sub(l,c),d=r.magnitude(u);d<o._minLength&&(d=o._minLength);var p,f,v,m,y,g=(d-e.length)/d,x=e.stiffness>=1||0===e.length?e.stiffness*t:e.stiffness*t*t,h=e.damping*t,b=r.mult(u,g*x),S=(n?n.inverseMass:0)+(i?i.inverseMass:0),w=S+((n?n.inverseInertia:0)+(i?i.inverseInertia:0));if(h>0){var A=r.create();v=r.div(u,d),y=r.sub(i&&r.sub(i.position,i.positionPrev)||A,n&&r.sub(n.position,n.positionPrev)||A),m=r.dot(v,y)}n&&!n.isStatic&&(f=n.inverseMass/S,n.constraintImpulse.x-=b.x*f,n.constraintImpulse.y-=b.y*f,n.position.x-=b.x*f,n.position.y-=b.y*f,h>0&&(n.positionPrev.x-=h*v.x*m*f,n.positionPrev.y-=h*v.y*m*f),p=r.cross(a,b)/w*o._torqueDampen*n.inverseInertia*(1-e.angularStiffness),n.constraintImpulse.angle-=p,n.angle-=p),i&&!i.isStatic&&(f=i.inverseMass/S,i.constraintImpulse.x+=b.x*f,i.constraintImpulse.y+=b.y*f,i.position.x+=b.x*f,i.position.y+=b.y*f,h>0&&(i.positionPrev.x+=h*v.x*m*f,i.positionPrev.y+=h*v.y*m*f),p=r.cross(s,b)/w*o._torqueDampen*i.inverseInertia*(1-e.angularStiffness),i.constraintImpulse.angle+=p,i.angle+=p)}}},o.postSolveAll=function(e){for(var t=0;t<e.length;t++){var n=e[t],c=n.constraintImpulse;if(!(n.isStatic||0===c.x&&0===c.y&&0===c.angle)){a.set(n,!1);for(var u=0;u<n.parts.length;u++){var d=n.parts[u];i.translate(d.vertices,c),u>0&&(d.position.x+=c.x,d.position.y+=c.y),0!==c.angle&&(i.rotate(d.vertices,c.angle,n.position),l.rotate(d.axes,c.angle),u>0&&r.rotateAbout(d.position,c.angle,n.position,d.position)),s.update(d.bounds,d.vertices,n.velocity)}c.angle*=o._warming,c.x*=o._warming,c.y*=o._warming}}},o.pointAWorld=function(e){return{x:(e.bodyA?e.bodyA.position.x:0)+(e.pointA?e.pointA.x:0),y:(e.bodyA?e.bodyA.position.y:0)+(e.pointA?e.pointA.y:0)}},o.pointBWorld=function(e){return{x:(e.bodyB?e.bodyB.position.x:0)+(e.pointB?e.pointB.x:0),y:(e.bodyB?e.bodyB.position.y:0)+(e.pointB?e.pointB.y:0)}},o.currentLength=function(e){var t=(e.bodyA?e.bodyA.position.x:0)+(e.pointA?e.pointA.x:0),n=(e.bodyA?e.bodyA.position.y:0)+(e.pointA?e.pointA.y:0),o=t-((e.bodyB?e.bodyB.position.x:0)+(e.pointB?e.pointB.x:0)),i=n-((e.bodyB?e.bodyB.position.y:0)+(e.pointB?e.pointB.y:0));return Math.sqrt(o*o+i*i)}},function(e,t,n){var o={};e.exports=o;var i=n(2),r=n(0);o.fromVertices=function(e){for(var t={},n=0;n<e.length;n++){var o=(n+1)%e.length,a=i.normalise({x:e[o].y-e[n].y,y:e[n].x-e[o].x}),s=0===a.y?1/0:a.x/a.y;t[s=s.toFixed(3).toString()]=a}return r.values(t)},o.rotate=function(e,t){if(0!==t)for(var n=Math.cos(t),o=Math.sin(t),i=0;i<e.length;i++){var r,a=e[i];r=a.x*n-a.y*o,a.y=a.x*o+a.y*n,a.x=r}}},function(e,t,n){var o={};e.exports=o;var i=n(3),r=n(0),a=n(4),s=n(1),l=n(2);o.rectangle=function(e,t,n,o,s){s=s||{};var l={label:"Rectangle Body",position:{x:e,y:t},vertices:i.fromPath("L 0 0 L "+n+" 0 L "+n+" "+o+" L 0 "+o)};if(s.chamfer){var c=s.chamfer;l.vertices=i.chamfer(l.vertices,c.radius,c.quality,c.qualityMin,c.qualityMax),delete s.chamfer}return a.create(r.extend({},l,s))},o.trapezoid=function(e,t,n,o,s,l){l=l||{},s>=1&&r.warn("Bodies.trapezoid: slope parameter must be < 1.");var c,u=n*(s*=.5),d=u+(1-2*s)*n,p=d+u;c=s<.5?"L 0 0 L "+u+" "+-o+" L "+d+" "+-o+" L "+p+" 0":"L 0 0 L "+d+" "+-o+" L "+p+" 0";var f={label:"Trapezoid Body",position:{x:e,y:t},vertices:i.fromPath(c)};if(l.chamfer){var v=l.chamfer;f.vertices=i.chamfer(f.vertices,v.radius,v.quality,v.qualityMin,v.qualityMax),delete l.chamfer}return a.create(r.extend({},f,l))},o.circle=function(e,t,n,i,a){i=i||{};var s={label:"Circle Body",circleRadius:n};a=a||25;var l=Math.ceil(Math.max(10,Math.min(a,n)));return l%2==1&&(l+=1),o.polygon(e,t,l,n,r.extend({},s,i))},o.polygon=function(e,t,n,s,l){if(l=l||{},n<3)return o.circle(e,t,s,l);for(var c=2*Math.PI/n,u="",d=.5*c,p=0;p<n;p+=1){var f=d+p*c,v=Math.cos(f)*s,m=Math.sin(f)*s;u+="L "+v.toFixed(3)+" "+m.toFixed(3)+" "}var y={label:"Polygon Body",position:{x:e,y:t},vertices:i.fromPath(u)};if(l.chamfer){var g=l.chamfer;y.vertices=i.chamfer(y.vertices,g.radius,g.quality,g.qualityMin,g.qualityMax),delete l.chamfer}return a.create(r.extend({},y,l))},o.fromVertices=function(e,t,n,o,c,u,d,p){var f,v,m,y,g,x,h,b,S,w,A=r.getDecomp();for(f=Boolean(A&&A.quickDecomp),o=o||{},m=[],c=void 0!==c&&c,u=void 0!==u?u:.01,d=void 0!==d?d:10,p=void 0!==p?p:.01,r.isArray(n[0])||(n=[n]),S=0;S<n.length;S+=1)if(g=n[S],!(y=i.isConvex(g))&&!f&&r.warnOnce("Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices."),y||!f)g=y?i.clockwiseSort(g):i.hull(g),m.push({position:{x:e,y:t},vertices:g});else{var P=g.map((function(e){return[e.x,e.y]}));A.makeCCW(P),!1!==u&&A.removeCollinearPoints(P,u),!1!==p&&A.removeDuplicatePoints&&A.removeDuplicatePoints(P,p);var B=A.quickDecomp(P);for(x=0;x<B.length;x++){var M=B[x].map((function(e){return{x:e[0],y:e[1]}}));d>0&&i.area(M)<d||m.push({position:i.centre(M),vertices:M})}}for(x=0;x<m.length;x++)m[x]=a.create(r.extend(m[x],o));if(c)for(x=0;x<m.length;x++){var _=m[x];for(h=x+1;h<m.length;h++){var C=m[h];if(s.overlaps(_.bounds,C.bounds)){var k=_.vertices,I=C.vertices;for(b=0;b<_.vertices.length;b++)for(w=0;w<C.vertices.length;w++){var T=l.magnitudeSquared(l.sub(k[(b+1)%k.length],I[w])),R=l.magnitudeSquared(l.sub(k[b],I[(w+1)%I.length]));T<5&&R<5&&(k[b].isInternal=!0,I[w].isInternal=!0)}}}}return m.length>1?(v=a.create(r.extend({parts:m.slice(0)},o)),a.setPosition(v,{x:e,y:t}),v):m[0]}},function(e,t,n){var o={};e.exports=o;var i=n(0),r=n(8);o.create=function(e){return i.extend({bodies:[],collisions:[],pairs:null},e)},o.setBodies=function(e,t){e.bodies=t.slice(0)},o.clear=function(e){e.bodies=[],e.collisions=[]},o.collisions=function(e){var t,n,i=e.pairs,a=e.bodies,s=a.length,l=o.canCollide,c=r.collides,u=e.collisions,d=0;for(a.sort(o._compareBoundsX),t=0;t<s;t++){var p=a[t],f=p.bounds,v=p.bounds.max.x,m=p.bounds.max.y,y=p.bounds.min.y,g=p.isStatic||p.isSleeping,x=p.parts.length,h=1===x;for(n=t+1;n<s;n++){var b=a[n];if((C=b.bounds).min.x>v)break;if(!(m<C.min.y||y>C.max.y)&&(!g||!b.isStatic&&!b.isSleeping)&&l(p.collisionFilter,b.collisionFilter)){var S=b.parts.length;if(h&&1===S)(M=c(p,b,i))&&(u[d++]=M);else for(var w=S>1?1:0,A=x>1?1:0;A<x;A++)for(var P=p.parts[A],B=(f=P.bounds,w);B<S;B++){var M,_=b.parts[B],C=_.bounds;f.min.x>C.max.x||f.max.x<C.min.x||f.max.y<C.min.y||f.min.y>C.max.y||(M=c(P,_,i))&&(u[d++]=M)}}}}return u.length!==d&&(u.length=d),u},o.canCollide=function(e,t){return e.group===t.group&&0!==e.group?e.group>0:0!=(e.mask&t.category)&&0!=(t.mask&e.category)},o._compareBoundsX=function(e,t){return e.bounds.min.x-t.bounds.min.x}},function(e,t,n){var o={};e.exports=o;var i=n(0);o.create=function(e){var t={};return e||i.log("Mouse.create: element was undefined, defaulting to document.body","warn"),t.element=e||document.body,t.absolute={x:0,y:0},t.position={x:0,y:0},t.mousedownPosition={x:0,y:0},t.mouseupPosition={x:0,y:0},t.offset={x:0,y:0},t.scale={x:1,y:1},t.wheelDelta=0,t.button=-1,t.pixelRatio=parseInt(t.element.getAttribute("data-pixel-ratio"),10)||1,t.sourceEvents={mousemove:null,mousedown:null,mouseup:null,mousewheel:null},t.mousemove=function(e){var n=o._getRelativeMousePosition(e,t.element,t.pixelRatio);e.changedTouches&&(t.button=0,e.preventDefault()),t.absolute.x=n.x,t.absolute.y=n.y,t.position.x=t.absolute.x*t.scale.x+t.offset.x,t.position.y=t.absolute.y*t.scale.y+t.offset.y,t.sourceEvents.mousemove=e},t.mousedown=function(e){var n=o._getRelativeMousePosition(e,t.element,t.pixelRatio);e.changedTouches?(t.button=0,e.preventDefault()):t.button=e.button,t.absolute.x=n.x,t.absolute.y=n.y,t.position.x=t.absolute.x*t.scale.x+t.offset.x,t.position.y=t.absolute.y*t.scale.y+t.offset.y,t.mousedownPosition.x=t.position.x,t.mousedownPosition.y=t.position.y,t.sourceEvents.mousedown=e},t.mouseup=function(e){var n=o._getRelativeMousePosition(e,t.element,t.pixelRatio);e.changedTouches&&e.preventDefault(),t.button=-1,t.absolute.x=n.x,t.absolute.y=n.y,t.position.x=t.absolute.x*t.scale.x+t.offset.x,t.position.y=t.absolute.y*t.scale.y+t.offset.y,t.mouseupPosition.x=t.position.x,t.mouseupPosition.y=t.position.y,t.sourceEvents.mouseup=e},t.mousewheel=function(e){t.wheelDelta=Math.max(-1,Math.min(1,e.wheelDelta||-e.detail)),e.preventDefault(),t.sourceEvents.mousewheel=e},o.setElement(t,t.element),t},o.setElement=function(e,t){e.element=t,t.addEventListener("mousemove",e.mousemove,{passive:!0}),t.addEventListener("mousedown",e.mousedown,{passive:!0}),t.addEventListener("mouseup",e.mouseup,{passive:!0}),t.addEventListener("wheel",e.mousewheel,{passive:!1}),t.addEventListener("touchmove",e.mousemove,{passive:!1}),t.addEventListener("touchstart",e.mousedown,{passive:!1}),t.addEventListener("touchend",e.mouseup,{passive:!1})},o.clearSourceEvents=function(e){e.sourceEvents.mousemove=null,e.sourceEvents.mousedown=null,e.sourceEvents.mouseup=null,e.sourceEvents.mousewheel=null,e.wheelDelta=0},o.setOffset=function(e,t){e.offset.x=t.x,e.offset.y=t.y,e.position.x=e.absolute.x*e.scale.x+e.offset.x,e.position.y=e.absolute.y*e.scale.y+e.offset.y},o.setScale=function(e,t){e.scale.x=t.x,e.scale.y=t.y,e.position.x=e.absolute.x*e.scale.x+e.offset.x,e.position.y=e.absolute.y*e.scale.y+e.offset.y},o._getRelativeMousePosition=function(e,t,n){var o,i,r=t.getBoundingClientRect(),a=document.documentElement||document.body.parentNode||document.body,s=void 0!==window.pageXOffset?window.pageXOffset:a.scrollLeft,l=void 0!==window.pageYOffset?window.pageYOffset:a.scrollTop,c=e.changedTouches;return c?(o=c[0].pageX-r.left-s,i=c[0].pageY-r.top-l):(o=e.pageX-r.left-s,i=e.pageY-r.top-l),{x:o/(t.clientWidth/(t.width||t.clientWidth)*n),y:i/(t.clientHeight/(t.height||t.clientHeight)*n)}}},function(e,t,n){var o={};e.exports=o;var i=n(0);o._registry={},o.register=function(e){if(o.isPlugin(e)||i.warn("Plugin.register:",o.toString(e),"does not implement all required fields."),e.name in o._registry){var t=o._registry[e.name],n=o.versionParse(e.version).number,r=o.versionParse(t.version).number;n>r?(i.warn("Plugin.register:",o.toString(t),"was upgraded to",o.toString(e)),o._registry[e.name]=e):n<r?i.warn("Plugin.register:",o.toString(t),"can not be downgraded to",o.toString(e)):e!==t&&i.warn("Plugin.register:",o.toString(e),"is already registered to different plugin object")}else o._registry[e.name]=e;return e},o.resolve=function(e){return o._registry[o.dependencyParse(e).name]},o.toString=function(e){return"string"==typeof e?e:(e.name||"anonymous")+"@"+(e.version||e.range||"0.0.0")},o.isPlugin=function(e){return e&&e.name&&e.version&&e.install},o.isUsed=function(e,t){return e.used.indexOf(t)>-1},o.isFor=function(e,t){var n=e.for&&o.dependencyParse(e.for);return!e.for||t.name===n.name&&o.versionSatisfies(t.version,n.range)},o.use=function(e,t){if(e.uses=(e.uses||[]).concat(t||[]),0!==e.uses.length){for(var n=o.dependencies(e),r=i.topologicalSort(n),a=[],s=0;s<r.length;s+=1)if(r[s]!==e.name){var l=o.resolve(r[s]);l?o.isUsed(e,l.name)||(o.isFor(l,e)||(i.warn("Plugin.use:",o.toString(l),"is for",l.for,"but installed on",o.toString(e)+"."),l._warned=!0),l.install?l.install(e):(i.warn("Plugin.use:",o.toString(l),"does not specify an install function."),l._warned=!0),l._warned?(a.push("🔶 "+o.toString(l)),delete l._warned):a.push("✅ "+o.toString(l)),e.used.push(l.name)):a.push("❌ "+r[s])}a.length>0&&i.info(a.join("  "))}else i.warn("Plugin.use:",o.toString(e),"does not specify any dependencies to install.")},o.dependencies=function(e,t){var n=o.dependencyParse(e),r=n.name;if(!(r in(t=t||{}))){e=o.resolve(e)||e,t[r]=i.map(e.uses||[],(function(t){o.isPlugin(t)&&o.register(t);var r=o.dependencyParse(t),a=o.resolve(t);return a&&!o.versionSatisfies(a.version,r.range)?(i.warn("Plugin.dependencies:",o.toString(a),"does not satisfy",o.toString(r),"used by",o.toString(n)+"."),a._warned=!0,e._warned=!0):a||(i.warn("Plugin.dependencies:",o.toString(t),"used by",o.toString(n),"could not be resolved."),e._warned=!0),r.name}));for(var a=0;a<t[r].length;a+=1)o.dependencies(t[r][a],t);return t}},o.dependencyParse=function(e){return i.isString(e)?(/^[\\w-]+(@(\\*|[\\^~]?\\d+\\.\\d+\\.\\d+(-[0-9A-Za-z-+]+)?))?$/.test(e)||i.warn("Plugin.dependencyParse:",e,"is not a valid dependency string."),{name:e.split("@")[0],range:e.split("@")[1]||"*"}):{name:e.name,range:e.range||e.version}},o.versionParse=function(e){var t=/^(\\*)|(\\^|~|>=|>)?\\s*((\\d+)\\.(\\d+)\\.(\\d+))(-[0-9A-Za-z-+]+)?$/;t.test(e)||i.warn("Plugin.versionParse:",e,"is not a valid version or range.");var n=t.exec(e),o=Number(n[4]),r=Number(n[5]),a=Number(n[6]);return{isRange:Boolean(n[1]||n[2]),version:n[3],range:e,operator:n[1]||n[2]||"",major:o,minor:r,patch:a,parts:[o,r,a],prerelease:n[7],number:1e8*o+1e4*r+a}},o.versionSatisfies=function(e,t){t=t||"*";var n=o.versionParse(t),i=o.versionParse(e);if(n.isRange){if("*"===n.operator||"*"===e)return!0;if(">"===n.operator)return i.number>n.number;if(">="===n.operator)return i.number>=n.number;if("~"===n.operator)return i.major===n.major&&i.minor===n.minor&&i.patch>=n.patch;if("^"===n.operator)return n.major>0?i.major===n.major&&i.number>=n.number:n.minor>0?i.minor===n.minor&&i.patch>=n.patch:i.patch===n.patch}return e===t||"*"===e}},function(e,t){var n={};e.exports=n,n.create=function(e){return{vertex:e,normalImpulse:0,tangentImpulse:0}}},function(e,t,n){var o={};e.exports=o;var i=n(7),r=n(18),a=n(13),s=n(19),l=n(5),c=n(6),u=n(10),d=n(0),p=n(4);o._deltaMax=1e3/60,o.create=function(e){e=e||{};var t=d.extend({positionIterations:6,velocityIterations:4,constraintIterations:2,enableSleeping:!1,events:[],plugin:{},gravity:{x:0,y:1,scale:.001},timing:{timestamp:0,timeScale:1,lastDelta:0,lastElapsed:0,lastUpdatesPerFrame:0}},e);return t.world=e.world||c.create({label:"World"}),t.pairs=e.pairs||s.create(),t.detector=e.detector||a.create(),t.detector.pairs=t.pairs,t.grid={buckets:[]},t.world.gravity=t.gravity,t.broadphase=t.grid,t.metrics={},t},o.update=function(e,t){var n,p=d.now(),f=e.world,v=e.detector,m=e.pairs,y=e.timing,g=y.timestamp;t>o._deltaMax&&d.warnOnce("Matter.Engine.update: delta argument is recommended to be less than or equal to",o._deltaMax.toFixed(3),"ms."),t=void 0!==t?t:d._baseDelta,t*=y.timeScale,y.timestamp+=t,y.lastDelta=t;var x={timestamp:y.timestamp,delta:t};l.trigger(e,"beforeUpdate",x);var h=c.allBodies(f),b=c.allConstraints(f);for(f.isModified&&(a.setBodies(v,h),c.setModified(f,!1,!1,!0)),e.enableSleeping&&i.update(h,t),o._bodiesApplyGravity(h,e.gravity),t>0&&o._bodiesUpdate(h,t),l.trigger(e,"beforeSolve",x),u.preSolveAll(h),n=0;n<e.constraintIterations;n++)u.solveAll(b,t);u.postSolveAll(h);var S=a.collisions(v);s.update(m,S,g),e.enableSleeping&&i.afterCollisions(m.list),m.collisionStart.length>0&&l.trigger(e,"collisionStart",{pairs:m.collisionStart,timestamp:y.timestamp,delta:t});var w=d.clamp(20/e.positionIterations,0,1);for(r.preSolvePosition(m.list),n=0;n<e.positionIterations;n++)r.solvePosition(m.list,t,w);for(r.postSolvePosition(h),u.preSolveAll(h),n=0;n<e.constraintIterations;n++)u.solveAll(b,t);for(u.postSolveAll(h),r.preSolveVelocity(m.list),n=0;n<e.velocityIterations;n++)r.solveVelocity(m.list,t);return o._bodiesUpdateVelocities(h),m.collisionActive.length>0&&l.trigger(e,"collisionActive",{pairs:m.collisionActive,timestamp:y.timestamp,delta:t}),m.collisionEnd.length>0&&l.trigger(e,"collisionEnd",{pairs:m.collisionEnd,timestamp:y.timestamp,delta:t}),o._bodiesClearForces(h),l.trigger(e,"afterUpdate",x),e.timing.lastElapsed=d.now()-p,e},o.merge=function(e,t){if(d.extend(e,t),t.world){e.world=t.world,o.clear(e);for(var n=c.allBodies(e.world),r=0;r<n.length;r++){var a=n[r];i.set(a,!1),a.id=d.nextId()}}},o.clear=function(e){s.clear(e.pairs),a.clear(e.detector)},o._bodiesClearForces=function(e){for(var t=e.length,n=0;n<t;n++){var o=e[n];o.force.x=0,o.force.y=0,o.torque=0}},o._bodiesApplyGravity=function(e,t){var n=void 0!==t.scale?t.scale:.001,o=e.length;if((0!==t.x||0!==t.y)&&0!==n)for(var i=0;i<o;i++){var r=e[i];r.isStatic||r.isSleeping||(r.force.y+=r.mass*t.y*n,r.force.x+=r.mass*t.x*n)}},o._bodiesUpdate=function(e,t){for(var n=e.length,o=0;o<n;o++){var i=e[o];i.isStatic||i.isSleeping||p.update(i,t)}},o._bodiesUpdateVelocities=function(e){for(var t=e.length,n=0;n<t;n++)p.updateVelocities(e[n])}},function(e,t,n){var o={};e.exports=o;var i=n(3),r=n(0),a=n(1);o._restingThresh=2,o._restingThreshTangent=Math.sqrt(6),o._positionDampen=.9,o._positionWarming=.8,o._frictionNormalMultiplier=5,o._frictionMaxStatic=Number.MAX_VALUE,o.preSolvePosition=function(e){var t,n,o,i=e.length;for(t=0;t<i;t++)(n=e[t]).isActive&&(o=n.contactCount,n.collision.parentA.totalContacts+=o,n.collision.parentB.totalContacts+=o)},o.solvePosition=function(e,t,n){var i,a,s,l,c,u,d,p,f=o._positionDampen*(n||1),v=r.clamp(t/r._baseDelta,0,1),m=e.length;for(i=0;i<m;i++)(a=e[i]).isActive&&!a.isSensor&&(l=(s=a.collision).parentA,c=s.parentB,u=s.normal,a.separation=s.depth+u.x*(c.positionImpulse.x-l.positionImpulse.x)+u.y*(c.positionImpulse.y-l.positionImpulse.y));for(i=0;i<m;i++)(a=e[i]).isActive&&!a.isSensor&&(l=(s=a.collision).parentA,c=s.parentB,u=s.normal,p=a.separation-a.slop*v,(l.isStatic||c.isStatic)&&(p*=2),l.isStatic||l.isSleeping||(d=f/l.totalContacts,l.positionImpulse.x+=u.x*p*d,l.positionImpulse.y+=u.y*p*d),c.isStatic||c.isSleeping||(d=f/c.totalContacts,c.positionImpulse.x-=u.x*p*d,c.positionImpulse.y-=u.y*p*d))},o.postSolvePosition=function(e){for(var t=o._positionWarming,n=e.length,r=i.translate,s=a.update,l=0;l<n;l++){var c=e[l],u=c.positionImpulse,d=u.x,p=u.y,f=c.velocity;if(c.totalContacts=0,0!==d||0!==p){for(var v=0;v<c.parts.length;v++){var m=c.parts[v];r(m.vertices,u),s(m.bounds,m.vertices,f),m.position.x+=d,m.position.y+=p}c.positionPrev.x+=d,c.positionPrev.y+=p,d*f.x+p*f.y<0?(u.x=0,u.y=0):(u.x*=t,u.y*=t)}}},o.preSolveVelocity=function(e){var t,n,o=e.length;for(t=0;t<o;t++){var i=e[t];if(i.isActive&&!i.isSensor){var r=i.contacts,a=i.contactCount,s=i.collision,l=s.parentA,c=s.parentB,u=s.normal,d=s.tangent;for(n=0;n<a;n++){var p=r[n],f=p.vertex,v=p.normalImpulse,m=p.tangentImpulse;if(0!==v||0!==m){var y=u.x*v+d.x*m,g=u.y*v+d.y*m;l.isStatic||l.isSleeping||(l.positionPrev.x+=y*l.inverseMass,l.positionPrev.y+=g*l.inverseMass,l.anglePrev+=l.inverseInertia*((f.x-l.position.x)*g-(f.y-l.position.y)*y)),c.isStatic||c.isSleeping||(c.positionPrev.x-=y*c.inverseMass,c.positionPrev.y-=g*c.inverseMass,c.anglePrev-=c.inverseInertia*((f.x-c.position.x)*g-(f.y-c.position.y)*y))}}}}},o.solveVelocity=function(e,t){var n,i,a,s,l=t/r._baseDelta,c=l*l*l,u=-o._restingThresh*l,d=o._restingThreshTangent,p=o._frictionNormalMultiplier*l,f=o._frictionMaxStatic,v=e.length;for(a=0;a<v;a++){var m=e[a];if(m.isActive&&!m.isSensor){var y=m.collision,g=y.parentA,x=y.parentB,h=y.normal.x,b=y.normal.y,S=y.tangent.x,w=y.tangent.y,A=m.inverseMass,P=m.friction*m.frictionStatic*p,B=m.contacts,M=m.contactCount,_=1/M,C=g.position.x-g.positionPrev.x,k=g.position.y-g.positionPrev.y,I=g.angle-g.anglePrev,T=x.position.x-x.positionPrev.x,R=x.position.y-x.positionPrev.y,D=x.angle-x.anglePrev;for(s=0;s<M;s++){var V=B[s],E=V.vertex,L=E.x-g.position.x,F=E.y-g.position.y,O=E.x-x.position.x,H=E.y-x.position.y,q=C-F*I-(T-H*D),j=k+L*I-(R+O*D),U=h*q+b*j,W=S*q+w*j,N=m.separation+U,G=Math.min(N,1),z=(G=N<0?0:G)*P;W<-z||W>z?(i=W>0?W:-W,(n=m.friction*(W>0?1:-1)*c)<-i?n=-i:n>i&&(n=i)):(n=W,i=f);var X=L*b-F*h,Q=O*b-H*h,Y=_/(A+g.inverseInertia*X*X+x.inverseInertia*Q*Q),Z=(1+m.restitution)*U*Y;if(n*=Y,U<u)V.normalImpulse=0;else{var $=V.normalImpulse;V.normalImpulse+=Z,V.normalImpulse>0&&(V.normalImpulse=0),Z=V.normalImpulse-$}if(W<-d||W>d)V.tangentImpulse=0;else{var J=V.tangentImpulse;V.tangentImpulse+=n,V.tangentImpulse<-i&&(V.tangentImpulse=-i),V.tangentImpulse>i&&(V.tangentImpulse=i),n=V.tangentImpulse-J}var K=h*Z+S*n,ee=b*Z+w*n;g.isStatic||g.isSleeping||(g.positionPrev.x+=K*g.inverseMass,g.positionPrev.y+=ee*g.inverseMass,g.anglePrev+=(L*ee-F*K)*g.inverseInertia),x.isStatic||x.isSleeping||(x.positionPrev.x-=K*x.inverseMass,x.positionPrev.y-=ee*x.inverseMass,x.anglePrev-=(O*ee-H*K)*x.inverseInertia)}}}}},function(e,t,n){var o={};e.exports=o;var i=n(9),r=n(0);o.create=function(e){return r.extend({table:{},list:[],collisionStart:[],collisionActive:[],collisionEnd:[]},e)},o.update=function(e,t,n){var o,r,a,s=i.update,l=i.create,c=i.setActive,u=e.table,d=e.list,p=d.length,f=p,v=e.collisionStart,m=e.collisionEnd,y=e.collisionActive,g=t.length,x=0,h=0,b=0;for(a=0;a<g;a++)(r=(o=t[a]).pair)?(r.isActive&&(y[b++]=r),s(r,o,n)):(u[(r=l(o,n)).id]=r,v[x++]=r,d[f++]=r);for(f=0,p=d.length,a=0;a<p;a++)(r=d[a]).timeUpdated>=n?d[f++]=r:(c(r,!1,n),r.collision.bodyA.sleepCounter>0&&r.collision.bodyB.sleepCounter>0?d[f++]=r:(m[h++]=r,delete u[r.id]));d.length!==f&&(d.length=f),v.length!==x&&(v.length=x),m.length!==h&&(m.length=h),y.length!==b&&(y.length=b)},o.clear=function(e){return e.table={},e.list.length=0,e.collisionStart.length=0,e.collisionActive.length=0,e.collisionEnd.length=0,e}},function(e,t,n){var o=e.exports=n(21);o.Axes=n(11),o.Bodies=n(12),o.Body=n(4),o.Bounds=n(1),o.Collision=n(8),o.Common=n(0),o.Composite=n(6),o.Composites=n(22),o.Constraint=n(10),o.Contact=n(16),o.Detector=n(13),o.Engine=n(17),o.Events=n(5),o.Grid=n(23),o.Mouse=n(14),o.MouseConstraint=n(24),o.Pair=n(9),o.Pairs=n(19),o.Plugin=n(15),o.Query=n(25),o.Render=n(26),o.Resolver=n(18),o.Runner=n(27),o.SAT=n(28),o.Sleeping=n(7),o.Svg=n(29),o.Vector=n(2),o.Vertices=n(3),o.World=n(30),o.Engine.run=o.Runner.run,o.Common.deprecated(o.Engine,"run","Engine.run ➤ use Matter.Runner.run(engine) instead")},function(e,t,n){var o={};e.exports=o;var i=n(15),r=n(0);o.name="matter-js",o.version="0.20.0",o.uses=[],o.used=[],o.use=function(){i.use(o,Array.prototype.slice.call(arguments))},o.before=function(e,t){return e=e.replace(/^Matter./,""),r.chainPathBefore(o,e,t)},o.after=function(e,t){return e=e.replace(/^Matter./,""),r.chainPathAfter(o,e,t)}},function(e,t,n){var o={};e.exports=o;var i=n(6),r=n(10),a=n(0),s=n(4),l=n(12),c=a.deprecated;o.stack=function(e,t,n,o,r,a,l){for(var c,u=i.create({label:"Stack"}),d=e,p=t,f=0,v=0;v<o;v++){for(var m=0,y=0;y<n;y++){var g=l(d,p,y,v,c,f);if(g){var x=g.bounds.max.y-g.bounds.min.y,h=g.bounds.max.x-g.bounds.min.x;x>m&&(m=x),s.translate(g,{x:.5*h,y:.5*x}),d=g.bounds.max.x+r,i.addBody(u,g),c=g,f+=1}else d+=r}p+=m+a,d=e}return u},o.chain=function(e,t,n,o,s,l){for(var c=e.bodies,u=1;u<c.length;u++){var d=c[u-1],p=c[u],f=d.bounds.max.y-d.bounds.min.y,v=d.bounds.max.x-d.bounds.min.x,m=p.bounds.max.y-p.bounds.min.y,y={bodyA:d,pointA:{x:v*t,y:f*n},bodyB:p,pointB:{x:(p.bounds.max.x-p.bounds.min.x)*o,y:m*s}},g=a.extend(y,l);i.addConstraint(e,r.create(g))}return e.label+=" Chain",e},o.mesh=function(e,t,n,o,s){var l,c,u,d,p,f=e.bodies;for(l=0;l<n;l++){for(c=1;c<t;c++)u=f[c-1+l*t],d=f[c+l*t],i.addConstraint(e,r.create(a.extend({bodyA:u,bodyB:d},s)));if(l>0)for(c=0;c<t;c++)u=f[c+(l-1)*t],d=f[c+l*t],i.addConstraint(e,r.create(a.extend({bodyA:u,bodyB:d},s))),o&&c>0&&(p=f[c-1+(l-1)*t],i.addConstraint(e,r.create(a.extend({bodyA:p,bodyB:d},s)))),o&&c<t-1&&(p=f[c+1+(l-1)*t],i.addConstraint(e,r.create(a.extend({bodyA:p,bodyB:d},s))))}return e.label+=" Mesh",e},o.pyramid=function(e,t,n,i,r,a,l){return o.stack(e,t,n,i,r,a,(function(t,o,a,c,u,d){var p=Math.min(i,Math.ceil(n/2)),f=u?u.bounds.max.x-u.bounds.min.x:0;if(!(c>p||a<(c=p-c)||a>n-1-c))return 1===d&&s.translate(u,{x:(a+(n%2==1?1:-1))*f,y:0}),l(e+(u?a*f:0)+a*r,o,a,c,u,d)}))},o.newtonsCradle=function(e,t,n,o,a){for(var s=i.create({label:"Newtons Cradle"}),c=0;c<n;c++){var u=l.circle(e+c*(1.9*o),t+a,o,{inertia:1/0,restitution:1,friction:0,frictionAir:1e-4,slop:1}),d=r.create({pointA:{x:e+c*(1.9*o),y:t},bodyB:u});i.addBody(s,u),i.addConstraint(s,d)}return s},c(o,"newtonsCradle","Composites.newtonsCradle ➤ moved to newtonsCradle example"),o.car=function(e,t,n,o,a){var c=s.nextGroup(!0),u=.5*-n+20,d=.5*n-20,p=i.create({label:"Car"}),f=l.rectangle(e,t,n,o,{collisionFilter:{group:c},chamfer:{radius:.5*o},density:2e-4}),v=l.circle(e+u,t+0,a,{collisionFilter:{group:c},friction:.8}),m=l.circle(e+d,t+0,a,{collisionFilter:{group:c},friction:.8}),y=r.create({bodyB:f,pointB:{x:u,y:0},bodyA:v,stiffness:1,length:0}),g=r.create({bodyB:f,pointB:{x:d,y:0},bodyA:m,stiffness:1,length:0});return i.addBody(p,f),i.addBody(p,v),i.addBody(p,m),i.addConstraint(p,y),i.addConstraint(p,g),p},c(o,"car","Composites.car ➤ moved to car example"),o.softBody=function(e,t,n,i,r,s,c,u,d,p){d=a.extend({inertia:1/0},d),p=a.extend({stiffness:.2,render:{type:"line",anchors:!1}},p);var f=o.stack(e,t,n,i,r,s,(function(e,t){return l.circle(e,t,u,d)}));return o.mesh(f,n,i,c,p),f.label="Soft Body",f},c(o,"softBody","Composites.softBody ➤ moved to softBody and cloth examples")},function(e,t,n){var o={};e.exports=o;var i=n(9),r=n(0),a=r.deprecated;o.create=function(e){return r.extend({buckets:{},pairs:{},pairsList:[],bucketWidth:48,bucketHeight:48},e)},o.update=function(e,t,n,i){var r,a,s,l,c,u=n.world,d=e.buckets,p=!1;for(r=0;r<t.length;r++){var f=t[r];if((!f.isSleeping||i)&&(!u.bounds||!(f.bounds.max.x<u.bounds.min.x||f.bounds.min.x>u.bounds.max.x||f.bounds.max.y<u.bounds.min.y||f.bounds.min.y>u.bounds.max.y))){var v=o._getRegion(e,f);if(!f.region||v.id!==f.region.id||i){f.region&&!i||(f.region=v);var m=o._regionUnion(v,f.region);for(a=m.startCol;a<=m.endCol;a++)for(s=m.startRow;s<=m.endRow;s++){l=d[c=o._getBucketId(a,s)];var y=a>=v.startCol&&a<=v.endCol&&s>=v.startRow&&s<=v.endRow,g=a>=f.region.startCol&&a<=f.region.endCol&&s>=f.region.startRow&&s<=f.region.endRow;!y&&g&&g&&l&&o._bucketRemoveBody(e,l,f),(f.region===v||y&&!g||i)&&(l||(l=o._createBucket(d,c)),o._bucketAddBody(e,l,f))}f.region=v,p=!0}}}p&&(e.pairsList=o._createActivePairsList(e))},a(o,"update","Grid.update ➤ replaced by Matter.Detector"),o.clear=function(e){e.buckets={},e.pairs={},e.pairsList=[]},a(o,"clear","Grid.clear ➤ replaced by Matter.Detector"),o._regionUnion=function(e,t){var n=Math.min(e.startCol,t.startCol),i=Math.max(e.endCol,t.endCol),r=Math.min(e.startRow,t.startRow),a=Math.max(e.endRow,t.endRow);return o._createRegion(n,i,r,a)},o._getRegion=function(e,t){var n=t.bounds,i=Math.floor(n.min.x/e.bucketWidth),r=Math.floor(n.max.x/e.bucketWidth),a=Math.floor(n.min.y/e.bucketHeight),s=Math.floor(n.max.y/e.bucketHeight);return o._createRegion(i,r,a,s)},o._createRegion=function(e,t,n,o){return{id:e+","+t+","+n+","+o,startCol:e,endCol:t,startRow:n,endRow:o}},o._getBucketId=function(e,t){return"C"+e+"R"+t},o._createBucket=function(e,t){return e[t]=[]},o._bucketAddBody=function(e,t,n){var o,r=e.pairs,a=i.id,s=t.length;for(o=0;o<s;o++){var l=t[o];if(!(n.id===l.id||n.isStatic&&l.isStatic)){var c=a(n,l),u=r[c];u?u[2]+=1:r[c]=[n,l,1]}}t.push(n)},o._bucketRemoveBody=function(e,t,n){var o,a=e.pairs,s=i.id;t.splice(r.indexOf(t,n),1);var l=t.length;for(o=0;o<l;o++){var c=a[s(n,t[o])];c&&(c[2]-=1)}},o._createActivePairsList=function(e){var t,n,o=e.pairs,i=r.keys(o),a=i.length,s=[];for(n=0;n<a;n++)(t=o[i[n]])[2]>0?s.push(t):delete o[i[n]];return s}},function(e,t,n){var o={};e.exports=o;var i=n(3),r=n(7),a=n(14),s=n(5),l=n(13),c=n(10),u=n(6),d=n(0),p=n(1);o.create=function(e,t){var n=(e?e.mouse:null)||(t?t.mouse:null);n||(e&&e.render&&e.render.canvas?n=a.create(e.render.canvas):t&&t.element?n=a.create(t.element):(n=a.create(),d.warn("MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected")));var i={type:"mouseConstraint",mouse:n,element:null,body:null,constraint:c.create({label:"Mouse Constraint",pointA:n.position,pointB:{x:0,y:0},length:.01,stiffness:.1,angularStiffness:1,render:{strokeStyle:"#90EE90",lineWidth:3}}),collisionFilter:{category:1,mask:4294967295,group:0}},r=d.extend(i,t);return s.on(e,"beforeUpdate",(function(){var t=u.allBodies(e.world);o.update(r,t),o._triggerEvents(r)})),r},o.update=function(e,t){var n=e.mouse,o=e.constraint,a=e.body;if(0===n.button){if(o.bodyB)r.set(o.bodyB,!1),o.pointA=n.position;else for(var c=0;c<t.length;c++)if(a=t[c],p.contains(a.bounds,n.position)&&l.canCollide(a.collisionFilter,e.collisionFilter))for(var u=a.parts.length>1?1:0;u<a.parts.length;u++){var d=a.parts[u];if(i.contains(d.vertices,n.position)){o.pointA=n.position,o.bodyB=e.body=a,o.pointB={x:n.position.x-a.position.x,y:n.position.y-a.position.y},o.angleB=a.angle,r.set(a,!1),s.trigger(e,"startdrag",{mouse:n,body:a});break}}}else o.bodyB=e.body=null,o.pointB=null,a&&s.trigger(e,"enddrag",{mouse:n,body:a})},o._triggerEvents=function(e){var t=e.mouse,n=t.sourceEvents;n.mousemove&&s.trigger(e,"mousemove",{mouse:t}),n.mousedown&&s.trigger(e,"mousedown",{mouse:t}),n.mouseup&&s.trigger(e,"mouseup",{mouse:t}),a.clearSourceEvents(t)}},function(e,t,n){var o={};e.exports=o;var i=n(2),r=n(8),a=n(1),s=n(12),l=n(3);o.collides=function(e,t){for(var n=[],o=t.length,i=e.bounds,s=r.collides,l=a.overlaps,c=0;c<o;c++){var u=t[c],d=u.parts.length,p=1===d?0:1;if(l(u.bounds,i))for(var f=p;f<d;f++){var v=u.parts[f];if(l(v.bounds,i)){var m=s(v,e);if(m){n.push(m);break}}}}return n},o.ray=function(e,t,n,r){r=r||1e-100;for(var a=i.angle(t,n),l=i.magnitude(i.sub(t,n)),c=.5*(n.x+t.x),u=.5*(n.y+t.y),d=s.rectangle(c,u,l,r,{angle:a}),p=o.collides(d,e),f=0;f<p.length;f+=1){var v=p[f];v.body=v.bodyB=v.bodyA}return p},o.region=function(e,t,n){for(var o=[],i=0;i<e.length;i++){var r=e[i],s=a.overlaps(r.bounds,t);(s&&!n||!s&&n)&&o.push(r)}return o},o.point=function(e,t){for(var n=[],o=0;o<e.length;o++){var i=e[o];if(a.contains(i.bounds,t))for(var r=1===i.parts.length?0:1;r<i.parts.length;r++){var s=i.parts[r];if(a.contains(s.bounds,t)&&l.contains(s.vertices,t)){n.push(i);break}}}return n}},function(e,t,n){var o={};e.exports=o;var i=n(4),r=n(0),a=n(6),s=n(1),l=n(5),c=n(2),u=n(14);!function(){var e,t;"undefined"!=typeof window&&(e=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout((function(){e(r.now())}),1e3/60)},t=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.msCancelAnimationFrame),o._goodFps=30,o._goodDelta=1e3/60,o.create=function(e){var t={engine:null,element:null,canvas:null,mouse:null,frameRequestId:null,timing:{historySize:60,delta:0,deltaHistory:[],lastTime:0,lastTimestamp:0,lastElapsed:0,timestampElapsed:0,timestampElapsedHistory:[],engineDeltaHistory:[],engineElapsedHistory:[],engineUpdatesHistory:[],elapsedHistory:[]},options:{width:800,height:600,pixelRatio:1,background:"#14151f",wireframeBackground:"#14151f",wireframeStrokeStyle:"#bbb",hasBounds:!!e.bounds,enabled:!0,wireframes:!0,showSleeping:!0,showDebug:!1,showStats:!1,showPerformance:!1,showBounds:!1,showVelocity:!1,showCollisions:!1,showSeparations:!1,showAxes:!1,showPositions:!1,showAngleIndicator:!1,showIds:!1,showVertexNumbers:!1,showConvexHulls:!1,showInternalEdges:!1,showMousePosition:!1}},n=r.extend(t,e);return n.canvas&&(n.canvas.width=n.options.width||n.canvas.width,n.canvas.height=n.options.height||n.canvas.height),n.mouse=e.mouse,n.engine=e.engine,n.canvas=n.canvas||p(n.options.width,n.options.height),n.context=n.canvas.getContext("2d"),n.textures={},n.bounds=n.bounds||{min:{x:0,y:0},max:{x:n.canvas.width,y:n.canvas.height}},n.controller=o,n.options.showBroadphase=!1,1!==n.options.pixelRatio&&o.setPixelRatio(n,n.options.pixelRatio),r.isElement(n.element)&&n.element.appendChild(n.canvas),n},o.run=function(t){!function i(r){t.frameRequestId=e(i),n(t,r),o.world(t,r),t.context.setTransform(t.options.pixelRatio,0,0,t.options.pixelRatio,0,0),(t.options.showStats||t.options.showDebug)&&o.stats(t,t.context,r),(t.options.showPerformance||t.options.showDebug)&&o.performance(t,t.context,r),t.context.setTransform(1,0,0,1,0,0)}()},o.stop=function(e){t(e.frameRequestId)},o.setPixelRatio=function(e,t){var n=e.options,o=e.canvas;"auto"===t&&(t=f(o)),n.pixelRatio=t,o.setAttribute("data-pixel-ratio",t),o.width=n.width*t,o.height=n.height*t,o.style.width=n.width+"px",o.style.height=n.height+"px"},o.setSize=function(e,t,n){e.options.width=t,e.options.height=n,e.bounds.max.x=e.bounds.min.x+t,e.bounds.max.y=e.bounds.min.y+n,1!==e.options.pixelRatio?o.setPixelRatio(e,e.options.pixelRatio):(e.canvas.width=t,e.canvas.height=n)},o.lookAt=function(e,t,n,o){o=void 0===o||o,t=r.isArray(t)?t:[t],n=n||{x:0,y:0};for(var i={min:{x:1/0,y:1/0},max:{x:-1/0,y:-1/0}},a=0;a<t.length;a+=1){var s=t[a],l=s.bounds?s.bounds.min:s.min||s.position||s,c=s.bounds?s.bounds.max:s.max||s.position||s;l&&c&&(l.x<i.min.x&&(i.min.x=l.x),c.x>i.max.x&&(i.max.x=c.x),l.y<i.min.y&&(i.min.y=l.y),c.y>i.max.y&&(i.max.y=c.y))}var d=i.max.x-i.min.x+2*n.x,p=i.max.y-i.min.y+2*n.y,f=e.canvas.height,v=e.canvas.width/f,m=d/p,y=1,g=1;m>v?g=m/v:y=v/m,e.options.hasBounds=!0,e.bounds.min.x=i.min.x,e.bounds.max.x=i.min.x+d*y,e.bounds.min.y=i.min.y,e.bounds.max.y=i.min.y+p*g,o&&(e.bounds.min.x+=.5*d-d*y*.5,e.bounds.max.x+=.5*d-d*y*.5,e.bounds.min.y+=.5*p-p*g*.5,e.bounds.max.y+=.5*p-p*g*.5),e.bounds.min.x-=n.x,e.bounds.max.x-=n.x,e.bounds.min.y-=n.y,e.bounds.max.y-=n.y,e.mouse&&(u.setScale(e.mouse,{x:(e.bounds.max.x-e.bounds.min.x)/e.canvas.width,y:(e.bounds.max.y-e.bounds.min.y)/e.canvas.height}),u.setOffset(e.mouse,e.bounds.min))},o.startViewTransform=function(e){var t=e.bounds.max.x-e.bounds.min.x,n=e.bounds.max.y-e.bounds.min.y,o=t/e.options.width,i=n/e.options.height;e.context.setTransform(e.options.pixelRatio/o,0,0,e.options.pixelRatio/i,0,0),e.context.translate(-e.bounds.min.x,-e.bounds.min.y)},o.endViewTransform=function(e){e.context.setTransform(e.options.pixelRatio,0,0,e.options.pixelRatio,0,0)},o.world=function(e,t){var n,i=r.now(),d=e.engine,p=d.world,f=e.canvas,v=e.context,y=e.options,g=e.timing,x=a.allBodies(p),h=a.allConstraints(p),b=y.wireframes?y.wireframeBackground:y.background,S=[],w=[],A={timestamp:d.timing.timestamp};if(l.trigger(e,"beforeRender",A),e.currentBackground!==b&&m(e,b),v.globalCompositeOperation="source-in",v.fillStyle="transparent",v.fillRect(0,0,f.width,f.height),v.globalCompositeOperation="source-over",y.hasBounds){for(n=0;n<x.length;n++){var P=x[n];s.overlaps(P.bounds,e.bounds)&&S.push(P)}for(n=0;n<h.length;n++){var B=h[n],M=B.bodyA,_=B.bodyB,C=B.pointA,k=B.pointB;M&&(C=c.add(M.position,B.pointA)),_&&(k=c.add(_.position,B.pointB)),C&&k&&((s.contains(e.bounds,C)||s.contains(e.bounds,k))&&w.push(B))}o.startViewTransform(e),e.mouse&&(u.setScale(e.mouse,{x:(e.bounds.max.x-e.bounds.min.x)/e.options.width,y:(e.bounds.max.y-e.bounds.min.y)/e.options.height}),u.setOffset(e.mouse,e.bounds.min))}else w=h,S=x,1!==e.options.pixelRatio&&e.context.setTransform(e.options.pixelRatio,0,0,e.options.pixelRatio,0,0);!y.wireframes||d.enableSleeping&&y.showSleeping?o.bodies(e,S,v):(y.showConvexHulls&&o.bodyConvexHulls(e,S,v),o.bodyWireframes(e,S,v)),y.showBounds&&o.bodyBounds(e,S,v),(y.showAxes||y.showAngleIndicator)&&o.bodyAxes(e,S,v),y.showPositions&&o.bodyPositions(e,S,v),y.showVelocity&&o.bodyVelocity(e,S,v),y.showIds&&o.bodyIds(e,S,v),y.showSeparations&&o.separations(e,d.pairs.list,v),y.showCollisions&&o.collisions(e,d.pairs.list,v),y.showVertexNumbers&&o.vertexNumbers(e,S,v),y.showMousePosition&&o.mousePosition(e,e.mouse,v),o.constraints(w,v),y.hasBounds&&o.endViewTransform(e),l.trigger(e,"afterRender",A),g.lastElapsed=r.now()-i},o.stats=function(e,t,n){for(var o=e.engine,i=o.world,r=a.allBodies(i),s=0,l=0,c=0;c<r.length;c+=1)s+=r[c].parts.length;var u={Part:s,Body:r.length,Cons:a.allConstraints(i).length,Comp:a.allComposites(i).length,Pair:o.pairs.list.length};for(var d in t.fillStyle="#0e0f19",t.fillRect(l,0,302.5,44),t.font="12px Arial",t.textBaseline="top",t.textAlign="right",u){var p=u[d];t.fillStyle="#aaa",t.fillText(d,l+55,8),t.fillStyle="#eee",t.fillText(p,l+55,26),l+=55}},o.performance=function(e,t){var n=e.engine,i=e.timing,a=i.deltaHistory,s=i.elapsedHistory,l=i.timestampElapsedHistory,c=i.engineDeltaHistory,u=i.engineUpdatesHistory,p=i.engineElapsedHistory,f=n.timing.lastUpdatesPerFrame,v=n.timing.lastDelta,m=d(a),y=d(s),g=d(c),x=d(u),h=d(p),b=d(l)/m||0,S=Math.round(m/v),w=1e3/m||0,A=10,P=69;t.fillStyle="#0e0f19",t.fillRect(0,50,442,34),o.status(t,A,P,60,4,a.length,Math.round(w)+" fps",w/o._goodFps,(function(e){return a[e]/m-1})),o.status(t,82,P,60,4,c.length,v.toFixed(2)+" dt",o._goodDelta/v,(function(e){return c[e]/g-1})),o.status(t,154,P,60,4,u.length,f+" upf",Math.pow(r.clamp(x/S||1,0,1),4),(function(e){return u[e]/x-1})),o.status(t,226,P,60,4,p.length,h.toFixed(2)+" ut",1-f*h/o._goodFps,(function(e){return p[e]/h-1})),o.status(t,298,P,60,4,s.length,y.toFixed(2)+" rt",1-y/o._goodFps,(function(e){return s[e]/y-1})),o.status(t,370,P,60,4,l.length,b.toFixed(2)+" x",b*b*b,(function(e){return(l[e]/a[e]/b||0)-1}))},o.status=function(e,t,n,o,i,a,s,l,c){e.strokeStyle="#888",e.fillStyle="#444",e.lineWidth=1,e.fillRect(t,n+7,o,1),e.beginPath(),e.moveTo(t,n+7-i*r.clamp(.4*c(0),-2,2));for(var u=0;u<o;u+=1)e.lineTo(t+u,n+7-(u<a?i*r.clamp(.4*c(u),-2,2):0));e.stroke(),e.fillStyle="hsl("+r.clamp(25+95*l,0,120)+",100%,60%)",e.fillRect(t,n-7,4,4),e.font="12px Arial",e.textBaseline="middle",e.textAlign="right",e.fillStyle="#eee",e.fillText(s,t+o,n-5)},o.constraints=function(e,t){for(var n=t,o=0;o<e.length;o++){var i=e[o];if(i.render.visible&&i.pointA&&i.pointB){var a,s,l=i.bodyA,u=i.bodyB;if(a=l?c.add(l.position,i.pointA):i.pointA,"pin"===i.render.type)n.beginPath(),n.arc(a.x,a.y,3,0,2*Math.PI),n.closePath();else{if(s=u?c.add(u.position,i.pointB):i.pointB,n.beginPath(),n.moveTo(a.x,a.y),"spring"===i.render.type)for(var d,p=c.sub(s,a),f=c.perp(c.normalise(p)),v=Math.ceil(r.clamp(i.length/5,12,20)),m=1;m<v;m+=1)d=m%2==0?1:-1,n.lineTo(a.x+p.x*(m/v)+f.x*d*4,a.y+p.y*(m/v)+f.y*d*4);n.lineTo(s.x,s.y)}i.render.lineWidth&&(n.lineWidth=i.render.lineWidth,n.strokeStyle=i.render.strokeStyle,n.stroke()),i.render.anchors&&(n.fillStyle=i.render.strokeStyle,n.beginPath(),n.arc(a.x,a.y,3,0,2*Math.PI),n.arc(s.x,s.y,3,0,2*Math.PI),n.closePath(),n.fill())}}},o.bodies=function(e,t,n){var o,i,r,a,s=n,l=(e.engine,e.options),c=l.showInternalEdges||!l.wireframes;for(r=0;r<t.length;r++)if((o=t[r]).render.visible)for(a=o.parts.length>1?1:0;a<o.parts.length;a++)if((i=o.parts[a]).render.visible){if(l.showSleeping&&o.isSleeping?s.globalAlpha=.5*i.render.opacity:1!==i.render.opacity&&(s.globalAlpha=i.render.opacity),i.render.sprite&&i.render.sprite.texture&&!l.wireframes){var u=i.render.sprite,d=v(e,u.texture);s.translate(i.position.x,i.position.y),s.rotate(i.angle),s.drawImage(d,d.width*-u.xOffset*u.xScale,d.height*-u.yOffset*u.yScale,d.width*u.xScale,d.height*u.yScale),s.rotate(-i.angle),s.translate(-i.position.x,-i.position.y)}else{if(i.circleRadius)s.beginPath(),s.arc(i.position.x,i.position.y,i.circleRadius,0,2*Math.PI);else{s.beginPath(),s.moveTo(i.vertices[0].x,i.vertices[0].y);for(var p=1;p<i.vertices.length;p++)!i.vertices[p-1].isInternal||c?s.lineTo(i.vertices[p].x,i.vertices[p].y):s.moveTo(i.vertices[p].x,i.vertices[p].y),i.vertices[p].isInternal&&!c&&s.moveTo(i.vertices[(p+1)%i.vertices.length].x,i.vertices[(p+1)%i.vertices.length].y);s.lineTo(i.vertices[0].x,i.vertices[0].y),s.closePath()}l.wireframes?(s.lineWidth=1,s.strokeStyle=e.options.wireframeStrokeStyle,s.stroke()):(s.fillStyle=i.render.fillStyle,i.render.lineWidth&&(s.lineWidth=i.render.lineWidth,s.strokeStyle=i.render.strokeStyle,s.stroke()),s.fill())}s.globalAlpha=1}},o.bodyWireframes=function(e,t,n){var o,i,r,a,s,l=n,c=e.options.showInternalEdges;for(l.beginPath(),r=0;r<t.length;r++)if((o=t[r]).render.visible)for(s=o.parts.length>1?1:0;s<o.parts.length;s++){for(i=o.parts[s],l.moveTo(i.vertices[0].x,i.vertices[0].y),a=1;a<i.vertices.length;a++)!i.vertices[a-1].isInternal||c?l.lineTo(i.vertices[a].x,i.vertices[a].y):l.moveTo(i.vertices[a].x,i.vertices[a].y),i.vertices[a].isInternal&&!c&&l.moveTo(i.vertices[(a+1)%i.vertices.length].x,i.vertices[(a+1)%i.vertices.length].y);l.lineTo(i.vertices[0].x,i.vertices[0].y)}l.lineWidth=1,l.strokeStyle=e.options.wireframeStrokeStyle,l.stroke()},o.bodyConvexHulls=function(e,t,n){var o,i,r,a=n;for(a.beginPath(),i=0;i<t.length;i++)if((o=t[i]).render.visible&&1!==o.parts.length){for(a.moveTo(o.vertices[0].x,o.vertices[0].y),r=1;r<o.vertices.length;r++)a.lineTo(o.vertices[r].x,o.vertices[r].y);a.lineTo(o.vertices[0].x,o.vertices[0].y)}a.lineWidth=1,a.strokeStyle="rgba(255,255,255,0.2)",a.stroke()},o.vertexNumbers=function(e,t,n){var o,i,r,a=n;for(o=0;o<t.length;o++){var s=t[o].parts;for(r=s.length>1?1:0;r<s.length;r++){var l=s[r];for(i=0;i<l.vertices.length;i++)a.fillStyle="rgba(255,255,255,0.2)",a.fillText(o+"_"+i,l.position.x+.8*(l.vertices[i].x-l.position.x),l.position.y+.8*(l.vertices[i].y-l.position.y))}}},o.mousePosition=function(e,t,n){var o=n;o.fillStyle="rgba(255,255,255,0.8)",o.fillText(t.position.x+"  "+t.position.y,t.position.x+5,t.position.y-5)},o.bodyBounds=function(e,t,n){var o=n,i=(e.engine,e.options);o.beginPath();for(var r=0;r<t.length;r++){if(t[r].render.visible)for(var a=t[r].parts,s=a.length>1?1:0;s<a.length;s++){var l=a[s];o.rect(l.bounds.min.x,l.bounds.min.y,l.bounds.max.x-l.bounds.min.x,l.bounds.max.y-l.bounds.min.y)}}i.wireframes?o.strokeStyle="rgba(255,255,255,0.08)":o.strokeStyle="rgba(0,0,0,0.1)",o.lineWidth=1,o.stroke()},o.bodyAxes=function(e,t,n){var o,i,r,a,s=n,l=(e.engine,e.options);for(s.beginPath(),i=0;i<t.length;i++){var c=t[i],u=c.parts;if(c.render.visible)if(l.showAxes)for(r=u.length>1?1:0;r<u.length;r++)for(o=u[r],a=0;a<o.axes.length;a++){var d=o.axes[a];s.moveTo(o.position.x,o.position.y),s.lineTo(o.position.x+20*d.x,o.position.y+20*d.y)}else for(r=u.length>1?1:0;r<u.length;r++)for(o=u[r],a=0;a<o.axes.length;a++)s.moveTo(o.position.x,o.position.y),s.lineTo((o.vertices[0].x+o.vertices[o.vertices.length-1].x)/2,(o.vertices[0].y+o.vertices[o.vertices.length-1].y)/2)}l.wireframes?(s.strokeStyle="indianred",s.lineWidth=1):(s.strokeStyle="rgba(255, 255, 255, 0.4)",s.globalCompositeOperation="overlay",s.lineWidth=2),s.stroke(),s.globalCompositeOperation="source-over"},o.bodyPositions=function(e,t,n){var o,i,r,a,s=n,l=(e.engine,e.options);for(s.beginPath(),r=0;r<t.length;r++)if((o=t[r]).render.visible)for(a=0;a<o.parts.length;a++)i=o.parts[a],s.arc(i.position.x,i.position.y,3,0,2*Math.PI,!1),s.closePath();for(l.wireframes?s.fillStyle="indianred":s.fillStyle="rgba(0,0,0,0.5)",s.fill(),s.beginPath(),r=0;r<t.length;r++)(o=t[r]).render.visible&&(s.arc(o.positionPrev.x,o.positionPrev.y,2,0,2*Math.PI,!1),s.closePath());s.fillStyle="rgba(255,165,0,0.8)",s.fill()},o.bodyVelocity=function(e,t,n){var o=n;o.beginPath();for(var r=0;r<t.length;r++){var a=t[r];if(a.render.visible){var s=i.getVelocity(a);o.moveTo(a.position.x,a.position.y),o.lineTo(a.position.x+s.x,a.position.y+s.y)}}o.lineWidth=3,o.strokeStyle="cornflowerblue",o.stroke()},o.bodyIds=function(e,t,n){var o,i,r=n;for(o=0;o<t.length;o++)if(t[o].render.visible){var a=t[o].parts;for(i=a.length>1?1:0;i<a.length;i++){var s=a[i];r.font="12px Arial",r.fillStyle="rgba(255,255,255,0.5)",r.fillText(s.id,s.position.x+10,s.position.y-10)}}},o.collisions=function(e,t,n){var o,i,r,a,s=n,l=e.options;for(s.beginPath(),r=0;r<t.length;r++)if((o=t[r]).isActive)for(i=o.collision,a=0;a<o.contactCount;a++){var c=o.contacts[a].vertex;s.rect(c.x-1.5,c.y-1.5,3.5,3.5)}for(l.wireframes?s.fillStyle="rgba(255,255,255,0.7)":s.fillStyle="orange",s.fill(),s.beginPath(),r=0;r<t.length;r++)if((o=t[r]).isActive&&(i=o.collision,o.contactCount>0)){var u=o.contacts[0].vertex.x,d=o.contacts[0].vertex.y;2===o.contactCount&&(u=(o.contacts[0].vertex.x+o.contacts[1].vertex.x)/2,d=(o.contacts[0].vertex.y+o.contacts[1].vertex.y)/2),i.bodyB===i.supports[0].body||!0===i.bodyA.isStatic?s.moveTo(u-8*i.normal.x,d-8*i.normal.y):s.moveTo(u+8*i.normal.x,d+8*i.normal.y),s.lineTo(u,d)}l.wireframes?s.strokeStyle="rgba(255,165,0,0.7)":s.strokeStyle="orange",s.lineWidth=1,s.stroke()},o.separations=function(e,t,n){var o,i,r,a,s,l=n,c=e.options;for(l.beginPath(),s=0;s<t.length;s++)if((o=t[s]).isActive){r=(i=o.collision).bodyA;var u=1;(a=i.bodyB).isStatic||r.isStatic||(u=.5),a.isStatic&&(u=0),l.moveTo(a.position.x,a.position.y),l.lineTo(a.position.x-i.penetration.x*u,a.position.y-i.penetration.y*u),u=1,a.isStatic||r.isStatic||(u=.5),r.isStatic&&(u=0),l.moveTo(r.position.x,r.position.y),l.lineTo(r.position.x+i.penetration.x*u,r.position.y+i.penetration.y*u)}c.wireframes?l.strokeStyle="rgba(255,165,0,0.5)":l.strokeStyle="orange",l.stroke()},o.inspector=function(e,t){e.engine;var n,o=e.selected,i=e.render,r=i.options;if(r.hasBounds){var a=i.bounds.max.x-i.bounds.min.x,s=i.bounds.max.y-i.bounds.min.y,l=a/i.options.width,c=s/i.options.height;t.scale(1/l,1/c),t.translate(-i.bounds.min.x,-i.bounds.min.y)}for(var u=0;u<o.length;u++){var d=o[u].data;switch(t.translate(.5,.5),t.lineWidth=1,t.strokeStyle="rgba(255,165,0,0.9)",t.setLineDash([1,2]),d.type){case"body":n=d.bounds,t.beginPath(),t.rect(Math.floor(n.min.x-3),Math.floor(n.min.y-3),Math.floor(n.max.x-n.min.x+6),Math.floor(n.max.y-n.min.y+6)),t.closePath(),t.stroke();break;case"constraint":var p=d.pointA;d.bodyA&&(p=d.pointB),t.beginPath(),t.arc(p.x,p.y,10,0,2*Math.PI),t.closePath(),t.stroke()}t.setLineDash([]),t.translate(-.5,-.5)}null!==e.selectStart&&(t.translate(.5,.5),t.lineWidth=1,t.strokeStyle="rgba(255,165,0,0.6)",t.fillStyle="rgba(255,165,0,0.1)",n=e.selectBounds,t.beginPath(),t.rect(Math.floor(n.min.x),Math.floor(n.min.y),Math.floor(n.max.x-n.min.x),Math.floor(n.max.y-n.min.y)),t.closePath(),t.stroke(),t.fill(),t.translate(-.5,-.5)),r.hasBounds&&t.setTransform(1,0,0,1,0,0)};var n=function(e,t){var n=e.engine,i=e.timing,r=i.historySize,a=n.timing.timestamp;i.delta=t-i.lastTime||o._goodDelta,i.lastTime=t,i.timestampElapsed=a-i.lastTimestamp||0,i.lastTimestamp=a,i.deltaHistory.unshift(i.delta),i.deltaHistory.length=Math.min(i.deltaHistory.length,r),i.engineDeltaHistory.unshift(n.timing.lastDelta),i.engineDeltaHistory.length=Math.min(i.engineDeltaHistory.length,r),i.timestampElapsedHistory.unshift(i.timestampElapsed),i.timestampElapsedHistory.length=Math.min(i.timestampElapsedHistory.length,r),i.engineUpdatesHistory.unshift(n.timing.lastUpdatesPerFrame),i.engineUpdatesHistory.length=Math.min(i.engineUpdatesHistory.length,r),i.engineElapsedHistory.unshift(n.timing.lastElapsed),i.engineElapsedHistory.length=Math.min(i.engineElapsedHistory.length,r),i.elapsedHistory.unshift(i.lastElapsed),i.elapsedHistory.length=Math.min(i.elapsedHistory.length,r)},d=function(e){for(var t=0,n=0;n<e.length;n+=1)t+=e[n];return t/e.length||0},p=function(e,t){var n=document.createElement("canvas");return n.width=e,n.height=t,n.oncontextmenu=function(){return!1},n.onselectstart=function(){return!1},n},f=function(e){var t=e.getContext("2d");return(window.devicePixelRatio||1)/(t.webkitBackingStorePixelRatio||t.mozBackingStorePixelRatio||t.msBackingStorePixelRatio||t.oBackingStorePixelRatio||t.backingStorePixelRatio||1)},v=function(e,t){var n=e.textures[t];return n||((n=e.textures[t]=new Image).src=t,n)},m=function(e,t){var n=t;/(jpg|gif|png)$/.test(t)&&(n="url("+t+")"),e.canvas.style.background=n,e.canvas.style.backgroundSize="contain",e.currentBackground=t}}()},function(e,t,n){var o={};e.exports=o;var i=n(5),r=n(17),a=n(0);!function(){o._maxFrameDelta=1e3/15,o._frameDeltaFallback=1e3/60,o._timeBufferMargin=1.5,o._elapsedNextEstimate=1,o._smoothingLowerBound=.1,o._smoothingUpperBound=.9,o.create=function(e){var t=a.extend({delta:1e3/60,frameDelta:null,frameDeltaSmoothing:!0,frameDeltaSnapping:!0,frameDeltaHistory:[],frameDeltaHistorySize:100,frameRequestId:null,timeBuffer:0,timeLastTick:null,maxUpdates:null,maxFrameTime:1e3/30,lastUpdatesDeferred:0,enabled:!0},e);return t.fps=0,t},o.run=function(e,t){return e.timeBuffer=o._frameDeltaFallback,function n(i){e.frameRequestId=o._onNextFrame(e,n),i&&e.enabled&&o.tick(e,t,i)}(),e},o.tick=function(t,n,s){var l=a.now(),c=t.delta,u=0,d=s-t.timeLastTick;if((!d||!t.timeLastTick||d>Math.max(o._maxFrameDelta,t.maxFrameTime))&&(d=t.frameDelta||o._frameDeltaFallback),t.frameDeltaSmoothing){t.frameDeltaHistory.push(d),t.frameDeltaHistory=t.frameDeltaHistory.slice(-t.frameDeltaHistorySize);var p=t.frameDeltaHistory.slice(0).sort(),f=t.frameDeltaHistory.slice(p.length*o._smoothingLowerBound,p.length*o._smoothingUpperBound);d=e(f)||d}t.frameDeltaSnapping&&(d=1e3/Math.round(1e3/d)),t.frameDelta=d,t.timeLastTick=s,t.timeBuffer+=t.frameDelta,t.timeBuffer=a.clamp(t.timeBuffer,0,t.frameDelta+c*o._timeBufferMargin),t.lastUpdatesDeferred=0;var v=t.maxUpdates||Math.ceil(t.maxFrameTime/c),m={timestamp:n.timing.timestamp};i.trigger(t,"beforeTick",m),i.trigger(t,"tick",m);for(var y=a.now();c>0&&t.timeBuffer>=c*o._timeBufferMargin;){i.trigger(t,"beforeUpdate",m),r.update(n,c),i.trigger(t,"afterUpdate",m),t.timeBuffer-=c,u+=1;var g=a.now()-l,x=a.now()-y,h=g+o._elapsedNextEstimate*x/u;if(u>=v||h>t.maxFrameTime){t.lastUpdatesDeferred=Math.round(Math.max(0,t.timeBuffer/c-o._timeBufferMargin));break}}n.timing.lastUpdatesPerFrame=u,i.trigger(t,"afterTick",m),t.frameDeltaHistory.length>=100&&(t.lastUpdatesDeferred&&Math.round(t.frameDelta/c)>v?a.warnOnce("Matter.Runner: runner reached runner.maxUpdates, see docs."):t.lastUpdatesDeferred&&a.warnOnce("Matter.Runner: runner reached runner.maxFrameTime, see docs."),void 0!==t.isFixed&&a.warnOnce("Matter.Runner: runner.isFixed is now redundant, see docs."),(t.deltaMin||t.deltaMax)&&a.warnOnce("Matter.Runner: runner.deltaMin and runner.deltaMax were removed, see docs."),0!==t.fps&&a.warnOnce("Matter.Runner: runner.fps was replaced by runner.delta, see docs."))},o.stop=function(e){o._cancelNextFrame(e)},o._onNextFrame=function(e,t){if("undefined"==typeof window||!window.requestAnimationFrame)throw new Error("Matter.Runner: missing required global window.requestAnimationFrame.");return e.frameRequestId=window.requestAnimationFrame(t),e.frameRequestId},o._cancelNextFrame=function(e){if("undefined"==typeof window||!window.cancelAnimationFrame)throw new Error("Matter.Runner: missing required global window.cancelAnimationFrame.");window.cancelAnimationFrame(e.frameRequestId)};var e=function(e){for(var t=0,n=e.length,o=0;o<n;o+=1)t+=e[o];return t/n||0}}()},function(e,t,n){var o={};e.exports=o;var i=n(8),r=n(0).deprecated;o.collides=function(e,t){return i.collides(e,t)},r(o,"collides","SAT.collides ➤ replaced by Collision.collides")},function(e,t,n){var o={};e.exports=o;n(1);var i=n(0);o.pathToVertices=function(e,t){"undefined"==typeof window||"SVGPathSeg"in window||i.warn("Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required.");var n,r,a,s,l,c,u,d,p,f,v,m=[],y=0,g=0,x=0;t=t||15;var h=function(e,t,n){var o=n%2==1&&n>1;if(!p||e!=p.x||t!=p.y){p&&o?(f=p.x,v=p.y):(f=0,v=0);var i={x:f+e,y:v+t};!o&&p||(p=i),m.push(i),g=f+e,x=v+t}},b=function(e){var t=e.pathSegTypeAsLetter.toUpperCase();if("Z"!==t){switch(t){case"M":case"L":case"T":case"C":case"S":case"Q":g=e.x,x=e.y;break;case"H":g=e.x;break;case"V":x=e.y}h(g,x,e.pathSegType)}};for(o._svgPathToAbsolute(e),a=e.getTotalLength(),c=[],n=0;n<e.pathSegList.numberOfItems;n+=1)c.push(e.pathSegList.getItem(n));for(u=c.concat();y<a;){if((l=c[e.getPathSegAtLength(y)])!=d){for(;u.length&&u[0]!=l;)b(u.shift());d=l}switch(l.pathSegTypeAsLetter.toUpperCase()){case"C":case"T":case"S":case"Q":case"A":s=e.getPointAtLength(y),h(s.x,s.y,0)}y+=t}for(n=0,r=u.length;n<r;++n)b(u[n]);return m},o._svgPathToAbsolute=function(e){for(var t,n,o,i,r,a,s=e.pathSegList,l=0,c=0,u=s.numberOfItems,d=0;d<u;++d){var p=s.getItem(d),f=p.pathSegTypeAsLetter;if(/[MLHVCSQTA]/.test(f))"x"in p&&(l=p.x),"y"in p&&(c=p.y);else switch("x1"in p&&(o=l+p.x1),"x2"in p&&(r=l+p.x2),"y1"in p&&(i=c+p.y1),"y2"in p&&(a=c+p.y2),"x"in p&&(l+=p.x),"y"in p&&(c+=p.y),f){case"m":s.replaceItem(e.createSVGPathSegMovetoAbs(l,c),d);break;case"l":s.replaceItem(e.createSVGPathSegLinetoAbs(l,c),d);break;case"h":s.replaceItem(e.createSVGPathSegLinetoHorizontalAbs(l),d);break;case"v":s.replaceItem(e.createSVGPathSegLinetoVerticalAbs(c),d);break;case"c":s.replaceItem(e.createSVGPathSegCurvetoCubicAbs(l,c,o,i,r,a),d);break;case"s":s.replaceItem(e.createSVGPathSegCurvetoCubicSmoothAbs(l,c,r,a),d);break;case"q":s.replaceItem(e.createSVGPathSegCurvetoQuadraticAbs(l,c,o,i),d);break;case"t":s.replaceItem(e.createSVGPathSegCurvetoQuadraticSmoothAbs(l,c),d);break;case"a":s.replaceItem(e.createSVGPathSegArcAbs(l,c,p.r1,p.r2,p.angle,p.largeArcFlag,p.sweepFlag),d);break;case"z":case"Z":l=t,c=n}"M"!=f&&"m"!=f||(t=l,n=c)}}},function(e,t,n){var o={};e.exports=o;var i=n(6);n(0);o.create=i.create,o.add=i.add,o.remove=i.remove,o.clear=i.clear,o.addComposite=i.addComposite,o.addBody=i.addBody,o.addConstraint=i.addConstraint}])}));
</script>

  <!-- Game modules -->
  <script type="text/javascript">/* js/config.js */
/* ═══════════════════════════════════════════════
   PLINKO∞ — Game Configuration & Constants
   ═══════════════════════════════════════════════ */

const CONFIG = {
  // ── Physics ──
  GRAVITY: 1.2,
  BALL_RADIUS: 6,
  PEG_RADIUS: 4,
  BALL_RESTITUTION: 0.4,
  BALL_FRICTION: 0.05,
  BALL_DENSITY: 0.002,
  PEG_FRICTION: 0.1,
  WALL_THICKNESS: 100,

  // ── Board ──
  MIN_ROWS: 10,
  MAX_ROWS: 10,
  SLOT_HEIGHT: 48,
  BOARD_PADDING_TOP: 0.06,    // % of board height
  BOARD_PADDING_BOTTOM: 0.12, // % of board height (for slots)
  BOARD_PADDING_SIDE: 0.05,   // % of board width

  // ── Timing ──
  BASE_DROP_INTERVAL: 2000,    // ms between auto drops
  MIN_DROP_INTERVAL: 200,
  SAVE_INTERVAL: 10000,        // auto-save every 10s
  TICK_RATE: 50,               // economy tick every 50ms
  FEVER_DURATION: 15000,       // 15 sec fever mode
  MAX_BALLS_ON_BOARD: 200,

  // ── Economy ──
  BASE_BET: 1,                // Each "1x" pays 1 coin
  SLOT_MULTIPLIERS: {
    // Custom 14-bin layout for 10 rows
    // Pegs end at 13 -> 14 bins
    // EV: ~1.01x
    10: [
      8, 4, 3, 1.5, 0.75, 0.5, 0.2, 0.2, 0.5, 0.75, 1.5, 3, 4, 8
    ],
  },

  // ── Prestige ──
  PRESTIGE_THRESHOLD: 100000,   // minimum coins earned to prestige
  PRESTIGE_SCALING: 1.5,

  // ── Offline ──
  MAX_OFFLINE_HOURS: 12,
  OFFLINE_EFFICIENCY: 0.5,     // 50% of online rate

  // ── Fever ──
  FEVER_TRIGGER: 5,            // consecutive high-value hits
  FEVER_MULTIPLIER: 3,

  // ── Gems ──
  GEM_DAILY_BASE: 5,
  GEM_PRESTIGE_BONUS: 10,

  // ── Frenzy ──
  FRENZY_PAYOUT_MULTIPLIER: 2,
  FRENZY_DROP_MULTIPLIER: 3,
  WEEKLY_STREAK_DAYS: 7,
};

// Slot type classification
// Slot type classification
function getSlotType(mult) {
  if (mult >= 100) return 'tier-5';
  if (mult >= 25) return 'tier-4';
  if (mult >= 10) return 'tier-3';
  if (mult >= 3) return 'tier-2';
  if (mult >= 1) return 'tier-1';
  return 'tier-0';
}

// Number formatting
function formatNumber(n) {
  if (n >= 1e12) return n.toExponential(2).replace('e+', 'e'); // 3 sig figs: 1.23e12
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e4) return (n / 1e3).toFixed(1) + 'K';
  if (n >= 1000) return n.toLocaleString();
  if (n % 1 !== 0) return n.toFixed(1);
  return String(Math.floor(n));
}

// Compact number for costs
function formatCost(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(1) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(Math.floor(n));
}

</script>
  <script type="text/javascript">/* js/state.js */
/* ═══════════════════════════════════════════════
   PLINKO∞ — Game State Manager
   ═══════════════════════════════════════════════ */

const SAVE_KEY = 'plinko_infinity_save';

// Default fresh state
function getDefaultState() {
    return {
        // Currencies
        coins: 1000,
        gems: 0,
        totalCoinsEarned: 0,
        totalCoinsAllTime: 0,

        // Betting
        currentBet: 1,
        totalCoinsBet: 0,

        // Board
        boardRows: 10,

        // Upgrades (levels)
        upgrades: {
            ballRate: 0,
            dropSpeed: 0,
            ballMultiplier: 0,
            multiBall: 0,
            slotBoost: 0,
            offlineEarnings: 0,
            gemBinMultiplier: 0,
            gemDropRateMultiplier: 1,
            gemEventDurationBonus: 0,
        },

        // Prestige
        prestigeLevel: 0,
        prestigeTokens: 0,
        prestigeUpgrades: {},

        // Stats
        totalBallsDropped: 0,
        totalPrestigeCount: 0,
        highestCombo: 0,
        feverCount: 0,

        // Daily
        dailyStreak: 0,
        lastDailyClaim: null,
        lastDailyChallengeDate: null,
        dailyChallengeProgress: {},
        dailyChallengesClaimed: {},
        challengeProgress: {},

        // Weekly (Frenzy reward)
        weeklyLoginStreak: 0,
        lastLoginDateKey: null,
        frenzyTokens: 1,

        // Settings
        settings: {
            audioEnabled: true,
            animationsEnabled: true,
            autoDropEnabled: true,
            volume: 0.5,
            tutorialSeen: false,
            bettingUnlocked: false,
        },

        // Runtime (not saved)
        lastSaveTime: Date.now(),
        lastOnlineTime: Date.now(),
    };
}

// Active game state
let gameState = getDefaultState();

// ── Save / Load ──
function saveGame() {
    const saveData = { ...gameState };
    saveData.lastSaveTime = Date.now();
    saveData.lastOnlineTime = Date.now();
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    } catch (e) {
        console.warn('Failed to save:', e);
    }
}

function loadGame() {
    try {
        // Force reset if URL has ?reset=true
        if (window.location.search.includes('reset=true')) {
            localStorage.removeItem(SAVE_KEY);
            return false;
        }

        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        const saved = JSON.parse(raw);
        // Merge with defaults to handle new fields
        const defaults = getDefaultState();
        gameState = { ...defaults, ...saved };
        gameState.upgrades = { ...defaults.upgrades, ...(saved.upgrades || {}) };
        gameState.prestigeUpgrades = { ...defaults.prestigeUpgrades, ...(saved.prestigeUpgrades || {}) };
        gameState.challengeProgress = { ...defaults.challengeProgress, ...(saved.challengeProgress || {}) };
        gameState.dailyChallengeProgress = saved.dailyChallengeProgress || {};
        gameState.dailyChallengesClaimed = saved.dailyChallengesClaimed || {};
        gameState.lastDailyChallengeDate = saved.lastDailyChallengeDate || null;
        gameState.weeklyLoginStreak = saved.weeklyLoginStreak ?? 0;
        gameState.lastLoginDateKey = saved.lastLoginDateKey ?? null;
        gameState.frenzyTokens = saved.frenzyTokens !== undefined ? saved.frenzyTokens : 1;
        gameState.settings = { ...defaults.settings, ...(saved.settings || {}) };
        return true;
    } catch (e) {
        console.warn('Failed to load save:', e);
        return false;
    }
}

function resetGame() {
    gameState = getDefaultState();
    localStorage.removeItem(SAVE_KEY);
}

// ── Computed Getters ──

// Ball Rate: each level makes drops 25% faster
function getDropInterval() {
    const base = CONFIG.BASE_DROP_INTERVAL;
    const level = gameState.upgrades.ballRate || 0;
    const gemMult = gameState.upgrades.gemDropRateMultiplier || 1;
    let interval = (base * Math.pow(0.75, level)) / gemMult;
    if (runtimeState.feverActive) interval /= CONFIG.FEVER_MULTIPLIER;
    if (runtimeState.frenzyActive) interval /= (CONFIG.FRENZY_DROP_MULTIPLIER || 3);
    return Math.max(CONFIG.MIN_DROP_INTERVAL, interval);
}

// Drop Speed: increases ball fall velocity
function getDropSpeedMultiplier() {
    const level = gameState.upgrades.dropSpeed || 0;
    return 1 + level * 0.10; // +10% per level
}

// Ball Multiplier: chance for 10x golden ball (base 1%, +0.8% per level, cap 25%)
function getLuckyBallChance() {
    const level = gameState.upgrades.ballMultiplier || 0;
    return Math.min(0.25, 0.01 + level * 0.008);
}

// Multi-Ball: chance to split on peg hit (1% per level, cap 30%)
function getMultiBallChance() {
    const level = gameState.upgrades.multiBall || 0;
    return Math.min(0.30, level * 0.01);
}

// Slot Boost: +1% payout per level
// Slot Boost: +5% compounded per level (1.05^level)
function getSlotBoostMultiplier() {
    const level = gameState.upgrades.slotBoost || 0;
    return Math.pow(1.05, level);
}

// Global multiplier (combines slot boost + prestige + fever)
function getGlobalMultiplier() {
    let mult = 1;

    // Prestige multiplier
    if (gameState.prestigeUpgrades.globalMult) {
        mult *= 1 + (gameState.prestigeUpgrades.globalMult * 0.5);
    }

    // Slot boost
    mult *= getSlotBoostMultiplier();

    // Gem Bin Boost: +10% per level (1.10^level), max 5 levels = ~1.61×
    if (gameState.upgrades.gemBinMultiplier) {
        mult *= Math.pow(1.10, gameState.upgrades.gemBinMultiplier);
    }

    // Frenzy Mode (weekly reward)
    if (runtimeState.frenzyActive && CONFIG.FRENZY_PAYOUT_MULTIPLIER) {
        mult *= CONFIG.FRENZY_PAYOUT_MULTIPLIER;
    }

    return mult;
}

// Offline rate: base rate * offline efficiency * (1 + offlineEarnings level * 0.01)
function getOfflineRate() {
    const baseRate = getCoinsPerSecond();
    const level = gameState.upgrades.offlineEarnings || 0;
    const efficiency = CONFIG.OFFLINE_EFFICIENCY * (1 + level * 0.01);
    return baseRate * Math.min(efficiency, 1.0);
}

// Always 1 dropper, always 1 ball per drop (no longer upgradeable)
function getDropperCount() {
    return 1;
}

function getBallCount() {
    return 1;
}

function getBoardRows() {
    return CONFIG.MIN_ROWS;
}

function getCoinsPerSecond() {
    const interval = getDropInterval();
    const droppers = getDropperCount();
    const ballsPerDrop = getBallCount();
    const dropsPerSec = (1000 / interval) * droppers;
    const ballsPerSec = dropsPerSec * ballsPerDrop;

    // Average multiplier across slots
    const rows = getBoardRows();
    const multipliers = CONFIG.SLOT_MULTIPLIERS[rows] || CONFIG.SLOT_MULTIPLIERS[10];
    const avgMult = multipliers.reduce((a, b) => a + b, 0) / multipliers.length;

    return ballsPerSec * CONFIG.BASE_BET * avgMult * getGlobalMultiplier();
}

function getBallsPerSecond() {
    const interval = getDropInterval();
    const droppers = getDropperCount();
    const ballsPerDrop = getBallCount();
    return ((1000 / interval) * droppers * ballsPerDrop);
}

// Runtime (not saved) ──
const runtimeState = {
    feverActive: false,
    feverTimer: null,
    frenzyActive: false,
    frenzyTimer: null,
    frenzyBallValue: 0,
    frenzyCountdownInterval: null,
    ballCapOverride: 0,
    consecutiveHighHits: 0,
    lastSlotHit: -1,
    jackpotSlot: -1,
    activeBalls: 0,
    coinPopQueue: [],
    recentCps: [],
    smoothCps: 0,
    lastToastTime: 0, // Track last error toast time
};

</script>
  <script type="text/javascript">/* js/upgrades.js */
/* ═══════════════════════════════════════════════
   PLINKO∞ — Upgrade Definitions & Logic
   ═══════════════════════════════════════════════ */

const UPGRADES = {
    // ── Ball Upgrades ──
    ballRate: {
        name: '⚡ Ball Rate',
        desc: 'Auto-drop fires faster',
        category: 'ball',
        maxLevel: 100,
        baseCost: 5000,
        costScale: 2.0,
        effect: (lvl) => \`Drop every \${(2000 * Math.pow(0.95, lvl) / 1000).toFixed(2)}s\`,
    },
    dropSpeed: {
        name: '🚀 Drop Speed',
        desc: 'Balls fall faster',
        category: 'ball',
        maxLevel: 100,
        baseCost: 5000,
        costScale: 2.0,
        effect: (lvl) => \`+\${lvl * 5}% fall speed\`,
    },
    ballMultiplier: {
        name: '🍀 Ball Multiplier',
        desc: 'Chance for 10× payout balls',
        category: 'ball',
        maxLevel: 100,
        baseCost: 5000,
        costScale: 2.0,
        effect: (lvl) => \`\${Math.min(15, lvl * 0.5).toFixed(1)}% chance\`,
    },
    multiBall: {
        name: '🌀 Multi-Ball',
        desc: 'Balls split chance',
        category: 'ball',
        maxLevel: 100,
        baseCost: 5000,
        costScale: 2.0,
        effect: (lvl) => \`\${Math.min(25, lvl * 0.5)}% split chance\`,
    },

    // ── Board Upgrades ──
    slotBoost: {
        name: '💰 Slot Boost',
        desc: 'All slots pay +1% per level',
        category: 'board',
        maxLevel: 100,
        baseCost: 100000,
        costScale: 2.0,
        effect: (lvl) => \`×\${Math.pow(1.01, lvl).toFixed(2)} payout\`,
    },

    // ── Passive Upgrades ──
    offlineEarnings: {
        name: '🌙 Offline Earnings',
        desc: 'Earn while away',
        category: 'passive',
        maxLevel: 100,
        baseCost: 5000,
        costScale: 2.0,
        effect: (lvl) => \`+\${lvl * 3}% offline income\`,
    },
};

// ── Cost Calculation ──
function getUpgradeCost(upgradeId) {
    const u = UPGRADES[upgradeId];
    const level = gameState.upgrades[upgradeId] || 0;
    if (level >= u.maxLevel) return Infinity;

    let cost = u.baseCost * Math.pow(u.costScale, level);

    // Prestige cost reduction
    if (gameState.prestigeUpgrades.costReduction) {
        // Safe cap at 75% reduction to prevent negative costs for high levels
        const reduction = Math.min(0.75, gameState.prestigeUpgrades.costReduction * 0.08);
        cost *= (1 - reduction);
    }

    return Math.max(1, Math.ceil(cost));
}

// ── Purchase ──
function purchaseUpgrade(upgradeId) {
    const u = UPGRADES[upgradeId];
    const level = gameState.upgrades[upgradeId] || 0;
    if (level >= u.maxLevel) return false;

    const cost = getUpgradeCost(upgradeId);
    if (gameState.coins < cost) return false;

    gameState.coins = Math.max(0, gameState.coins - cost);
    gameState.upgrades[upgradeId] = level + 1;

    return true;
}

// ── Check affordability ──
function canAfford(upgradeId) {
    const cost = getUpgradeCost(upgradeId);
    return gameState.coins >= cost;
}

function isMaxed(upgradeId) {
    const u = UPGRADES[upgradeId];
    return (gameState.upgrades[upgradeId] || 0) >= u.maxLevel;
}

// ── Count affordable upgrades ──
function countAffordableUpgrades() {
    let count = 0;
    for (const id in UPGRADES) {
        if (!isMaxed(id) && canAfford(id)) count++;
    }
    return count;
}

</script>
  <script type="text/javascript">/* js/prestige.js */
/* ═══════════════════════════════════════════════
   PLINKO∞ — Prestige System
   ═══════════════════════════════════════════════ */

const PRESTIGE_UPGRADES = [
    {
        id: 'globalMult',
        name: 'Global Multiplier',
        icon: '🌟',
        desc: '+50% coin earnings per level',
        maxLevel: 20,
        cost: (lvl) => 1 + lvl * 2,
    },
    {
        id: 'startBalls',
        name: 'Head Start',
        icon: '🎱',
        desc: 'Start with extra ball count levels',
        maxLevel: 5,
        cost: (lvl) => 2 + lvl * 3,
    },
    {
        id: 'costReduction',
        name: 'Discount Master',
        icon: '💸',
        desc: '-8% upgrade costs per level',
        maxLevel: 8,
        cost: (lvl) => 2 + lvl * 2,
    },
    {
        id: 'critBoost',
        name: 'Lucky Strike',
        icon: '⚡',
        desc: 'Critical hits pay 200x instead of 100x',
        maxLevel: 1,
        cost: () => 15,
    },
    {
        id: 'offlineBoost',
        name: 'Night Shift',
        icon: '🌙',
        desc: '+10% offline earning rate per level',
        maxLevel: 5,
        cost: (lvl) => 2 + lvl * 2,
    },
];

// ── Prestige Token Calculation ──
function calculatePrestigeTokens() {
    const earned = gameState.totalCoinsEarned;
    if (earned < CONFIG.PRESTIGE_THRESHOLD) return 0;
    // Base 5 tokens at threshold, scales with coins and prestige level
    return Math.floor(5 * Math.sqrt(earned / CONFIG.PRESTIGE_THRESHOLD) * (1 + gameState.prestigeLevel * 0.2));
}

// ── Can Prestige ──
function canPrestige() {
    return gameState.totalCoinsEarned >= CONFIG.PRESTIGE_THRESHOLD;
}

// ── Perform Prestige ──
function performPrestige() {
    const tokens = calculatePrestigeTokens();
    if (tokens <= 0) return false;

    // Award tokens
    gameState.prestigeTokens += tokens;
    gameState.prestigeLevel++;
    gameState.totalPrestigeCount++;
    gameState.gems += CONFIG.GEM_PRESTIGE_BONUS;

    // Reset progress (keep prestige upgrades, settings, gem upgrades)
    const savedPrestige = { ...gameState.prestigeUpgrades };
    const savedTokens = gameState.prestigeTokens;
    const savedLevel = gameState.prestigeLevel;
    const savedGems = gameState.gems;
    const savedPrestigeCount = gameState.totalPrestigeCount;
    const savedAllTime = gameState.totalCoinsAllTime + gameState.totalCoinsEarned;
    const savedBalls = gameState.totalBallsDropped;
    const savedFever = gameState.feverCount;
    const savedHighCombo = gameState.highestCombo;
    const savedDaily = gameState.dailyStreak;
    const savedLastDaily = gameState.lastDailyClaim;
    const savedSettings = { ...gameState.settings };
    const savedFrenzyTokens = gameState.frenzyTokens || 0;
    const savedGemBin = gameState.upgrades.gemBinMultiplier || 0;
    const savedGemDrop = gameState.upgrades.gemDropRateMultiplier || 1;
    const savedGemEvent = gameState.upgrades.gemEventDurationBonus || 0;

    // Reset to defaults
    const fresh = getDefaultState();
    gameState = fresh;

    // Restore prestige data
    gameState.prestigeUpgrades = savedPrestige;
    gameState.prestigeTokens = savedTokens;
    gameState.prestigeLevel = savedLevel;
    gameState.gems = savedGems;
    gameState.totalPrestigeCount = savedPrestigeCount;
    gameState.totalCoinsAllTime = savedAllTime;
    gameState.totalBallsDropped = savedBalls;
    gameState.feverCount = savedFever;
    gameState.highestCombo = savedHighCombo;
    gameState.dailyStreak = savedDaily;
    gameState.lastDailyClaim = savedLastDaily;
    gameState.settings = savedSettings;
    gameState.frenzyTokens = savedFrenzyTokens;

    // Restore gem shop upgrades (paid with premium currency, shouldn't reset)
    gameState.upgrades.gemBinMultiplier = savedGemBin;
    gameState.upgrades.gemDropRateMultiplier = savedGemDrop;
    gameState.upgrades.gemEventDurationBonus = savedGemEvent;

    // Prestige bonus: start with ball rate levels
    if (savedPrestige.startBalls) {
        gameState.upgrades.ballRate = Math.min(savedPrestige.startBalls, UPGRADES.ballRate.maxLevel);
    }

    // Starting coins: 0 on prestige (you earned prestige tokens instead)
    gameState.coins = 0;

    saveGame();
    return true;
}

// ── Buy Prestige Upgrade ──
function buyPrestigeUpgrade(upgradeId) {
    const pu = PRESTIGE_UPGRADES.find(u => u.id === upgradeId);
    if (!pu) return false;

    const currentLevel = gameState.prestigeUpgrades[upgradeId] || 0;
    if (currentLevel >= pu.maxLevel) return false;

    const cost = pu.cost(currentLevel);
    if (gameState.prestigeTokens < cost) return false;

    gameState.prestigeTokens -= cost;
    gameState.prestigeUpgrades[upgradeId] = currentLevel + 1;

    saveGame();
    return true;
}

</script>
  <script type="text/javascript">/* js/events.js */
/* ═══════════════════════════════════════════════
   PLINKO∞ — Event System
   ═══════════════════════════════════════════════ */

// ── Event Definitions ──
const EVENTS = {
    ball_evolution: {
        id: 'ball_evolution',
        name: '🧬 Ball Evolution',
        desc: 'Balls gain multiplier from peg hits (up to 4×)',
        cost: 20000,
        duration: 30000,
        cooldown: 300000,
        idleSafe: false,
        effects: { perPegHit: 0.05, maxBonus: 3.0 },
    },
    bin_roulette: {
        id: 'bin_roulette',
        name: '🎰 Bin Roulette',
        desc: 'Bin values reroll every 2.5s (0.6×–1.8× range)',
        cost: 20000,
        duration: 30000,
        cooldown: 300000,
        idleSafe: true,
        effects: { rerollInterval: 2500, minMult: 0.6, maxMult: 1.8 },
    },
    hyper_ball_storm: {
        id: 'hyper_ball_storm',
        name: '🌪️ Hyper Ball Storm',
        desc: '8× spawn rate, 3× max balls, −15% drop speed',
        cost: 20000,
        duration: 30000,
        cooldown: 300000,
        idleSafe: true,
        effects: { spawnRateMult: 8.0, maxBallsMult: 3.0, dropSpeedMod: -0.15 },
    },
    edge_singularity: {
        id: 'edge_singularity',
        name: '🌀 Edge Singularity',
        desc: 'Gravity wells pull balls toward high-value edges',
        cost: 20000,
        duration: 30000,
        cooldown: 300000,
        idleSafe: false,
        effects: { edgePullStrength: 0.9, maxEdgeForce: 1.2 },
    },
    peg_cascade: {
        id: 'peg_cascade',
        name: '💥 Peg Cascade',
        desc: 'Pegs shatter on hit, awarding bonus coins',
        cost: 20000,
        duration: 30000,
        cooldown: 300000,
        idleSafe: true,
        effects: { pegDestructible: true, basePegBonus: 2 },
    },
};

// ── Event Runtime State ──
const eventState = {
    activeEvent: null,       // id of currently active event, or null
    activeEndTime: 0,        // timestamp when active event ends
    cooldownEndTime: 0,      // timestamp when global cooldown ends
    binRouletteTimer: null,  // interval for bin roulette rerolls
    binRouletteValues: null, // current roulette multiplier overrides
    stormDropTimer: null,    // interval for hyper ball storm extra spawns
    destroyedPegs: new Set(), // indices of destroyed pegs (peg cascade)
    savedMaxBalls: 0,        // original MAX_BALLS_ON_BOARD before storm
};

// ── Query Helpers ──
function isEventActive(eventId) {
    if (!eventId) return eventState.activeEvent !== null;
    return eventState.activeEvent === eventId;
}

function isAnyEventActive() {
    return eventState.activeEvent !== null && Date.now() < eventState.activeEndTime;
}

function isEventOnCooldown() {
    return Date.now() < eventState.cooldownEndTime;
}

function getEventTimeRemaining() {
    if (!isAnyEventActive()) return 0;
    return Math.max(0, eventState.activeEndTime - Date.now());
}

function getCooldownRemaining() {
    if (!isEventOnCooldown()) return 0;
    return Math.max(0, eventState.cooldownEndTime - Date.now());
}

function resetEventCooldowns() {
    eventState.cooldownEndTime = 0;
    if (typeof renderEventsPanel === 'function') renderEventsPanel();
}

// ── Activate Event ──
function activateEvent(eventId) {
    const ev = EVENTS[eventId];
    if (!ev) return false;

    // Block if another event is active
    if (isAnyEventActive()) return false;

    // Block if on cooldown
    if (isEventOnCooldown()) return false;

    // Check cost
    if (gameState.coins < ev.cost) return false;

    // Deduct coins
    gameState.coins -= ev.cost;

    // Set active
    eventState.activeEvent = eventId;
    const bonus = (gameState.upgrades.gemEventDurationBonus || 0) * 1000;
    eventState.activeEndTime = Date.now() + ev.duration + bonus;
    eventState.cooldownEndTime = Date.now() + ev.duration + bonus + ev.cooldown;

    // Apply event-specific setup
    switch (eventId) {
        case 'ball_evolution':
            // Mark all current balls with pegHits tracker
            for (const ball of balls) {
                if (ball.pegHits === undefined) ball.pegHits = 0;
            }
            break;

        case 'bin_roulette':
            startBinRoulette();
            break;

        case 'hyper_ball_storm':
            startHyperStorm();
            break;

        case 'edge_singularity':
            // Physics forces applied in updatePhysics tick
            break;

        case 'peg_cascade':
            eventState.destroyedPegs.clear();
            break;
    }

    // Visual feedback
    showEventActivation(ev);

    return true;
}

// ── End Event (called when duration expires) ──
function endActiveEvent() {
    const eventId = eventState.activeEvent;
    if (!eventId) return;

    // Set active to null BEFORE cleanup so that state checks inside cleanup (like getDropInterval) see it as inactive
    eventState.activeEvent = null;
    eventState.activeEndTime = 0;

    // Cleanup event-specific state
    switch (eventId) {
        case 'bin_roulette':
            stopBinRoulette();
            break;

        case 'hyper_ball_storm':
            stopHyperStorm();
            break;

        case 'peg_cascade':
            // Respawn destroyed pegs
            respawnDestroyedPegs();
            break;
    }

    // Update UI
    if (typeof renderEventsPanel === 'function') renderEventsPanel();
}

// ── Tick (called every frame from updatePhysics) ──
function tickEvents() {
    // Check if active event has expired
    if (eventState.activeEvent !== null && Date.now() >= eventState.activeEndTime) {
        endActiveEvent();
    }
}

// ═══════════════════════════════════════════
// Event-Specific Implementations
// ═══════════════════════════════════════════

// ── Ball Evolution ──
function getBallEvolutionMultiplier(ball) {
    if (!isEventActive('ball_evolution')) return 1;
    const hits = ball.pegHits || 0;
    const bonus = Math.min(hits * EVENTS.ball_evolution.effects.perPegHit, EVENTS.ball_evolution.effects.maxBonus);
    return 1 + bonus;
}

// ── Bin Roulette ──
function startBinRoulette() {
    const ev = EVENTS.bin_roulette;
    rerollBinValues();
    eventState.binRouletteTimer = setInterval(() => {
        rerollBinValues();
    }, ev.effects.rerollInterval);
}

function rerollBinValues() {
    const ev = EVENTS.bin_roulette;
    // Get base multipliers
    const rows = typeof getBoardRows === 'function' ? getBoardRows() : 10;
    const baseMultipliers = CONFIG.SLOT_MULTIPLIERS[rows] || CONFIG.SLOT_MULTIPLIERS[10];

    // Clone and shuffle the base multipliers to mix up high/low values positions
    const shuffled = [...baseMultipliers];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Apply random multiplier scale to the shuffled values
    eventState.binRouletteValues = shuffled.map(base => {
        const roll = ev.effects.minMult + Math.random() * (ev.effects.maxMult - ev.effects.minMult);
        return +(base * roll).toFixed(2);
    });

    // Update slot tray visually
    if (typeof renderSlotTray === 'function') {
        renderRouletteSlotTray();
    }
}

function renderRouletteSlotTray() {
    const tray = document.getElementById('slotTray');
    if (!tray || !eventState.binRouletteValues) return;

    tray.innerHTML = '';
    const boost = typeof getGlobalMultiplier === 'function' ? getGlobalMultiplier() : 1;

    eventState.binRouletteValues.forEach((val, i) => {
        const slot = document.createElement('div');
        const displayVal = +(val * boost).toFixed(2);
        const type = typeof getSlotType === 'function' ? getSlotType(displayVal) : 'center';
        slot.className = 'slot ' + type + ' roulette-flash';

        slot.innerHTML = \`<span class="mult">\${displayVal >= 1000 ? formatCost(displayVal) : formatNumber(displayVal)}</span><span class="x">×</span>\`;
        tray.appendChild(slot);
    });
}

function stopBinRoulette() {
    if (eventState.binRouletteTimer) {
        clearInterval(eventState.binRouletteTimer);
        eventState.binRouletteTimer = null;
    }
    eventState.binRouletteValues = null;
    // Re-render normal slot tray
    if (typeof renderSlotTray === 'function') {
        const rows = typeof getBoardRows === 'function' ? getBoardRows() : 10;
        renderSlotTray(rows);
    }
}

function getBinRouletteValue(slotIndex) {
    if (!isEventActive('bin_roulette') || !eventState.binRouletteValues) return null;
    return eventState.binRouletteValues[slotIndex] || null;
}

// ── Hyper Ball Storm ──
function startHyperStorm() {
    const ev = EVENTS.hyper_ball_storm;

    // Save and increase max balls
    eventState.savedMaxBalls = CONFIG.MAX_BALLS_ON_BOARD;
    CONFIG.MAX_BALLS_ON_BOARD = Math.floor(CONFIG.MAX_BALLS_ON_BOARD * ev.effects.maxBallsMult);

    // Restart auto-droppers with faster rate
    if (typeof stopAutoDroppers === 'function') stopAutoDroppers();
    if (typeof startAutoDroppers === 'function') startAutoDroppers();

    // Additional rapid-fire spawner
    const stormInterval = Math.max(30, getDropInterval() / ev.effects.spawnRateMult);
    eventState.stormDropTimer = setInterval(() => {
        if (runtimeState.activeBalls < CONFIG.MAX_BALLS_ON_BOARD) {
            const x = boardWidth / 2 + (Math.random() - 0.5) * boardWidth * 0.3;
            spawnBall(x, 15);
        }
    }, stormInterval);
}

function stopHyperStorm() {
    // Restore max balls
    if (eventState.savedMaxBalls > 0) {
        CONFIG.MAX_BALLS_ON_BOARD = eventState.savedMaxBalls;
        eventState.savedMaxBalls = 0;
    }

    // Stop storm spawner
    if (eventState.stormDropTimer) {
        clearInterval(eventState.stormDropTimer);
        eventState.stormDropTimer = null;
    }

    // Restart auto-droppers at normal rate
    if (typeof stopAutoDroppers === 'function') stopAutoDroppers();
    if (typeof startAutoDroppers === 'function') startAutoDroppers();
}

function getStormDropSpeedMod() {
    if (!isEventActive('hyper_ball_storm')) return 0;
    return EVENTS.hyper_ball_storm.effects.dropSpeedMod;
}

// ── Edge Singularity ──
function applyEdgeSingularity(ball) {
    if (!isEventActive('edge_singularity')) return;

    const ev = EVENTS.edge_singularity;
    const x = ball.position.x;

    // Distance to nearest edge
    const distLeft = x;
    const distRight = boardWidth - x;
    const nearestEdgeDist = Math.min(distLeft, distRight);

    if (nearestEdgeDist < 1) return; // Avoid division by zero

    // Pull toward nearest edge
    const pullStrength = ev.effects.edgePullStrength;
    const maxForce = ev.effects.maxEdgeForce;

    let forceX = pullStrength / nearestEdgeDist;
    forceX = Math.min(forceX, maxForce);

    // Scale down to physics-appropriate force magnitude
    forceX *= 0.0001;

    // Direction: toward nearest edge
    const direction = distLeft < distRight ? -1 : 1;

    Matter.Body.applyForce(ball, ball.position, { x: forceX * direction, y: 0 });
}

// ── Peg Cascade ──
function handlePegCascadeHit(peg) {
    if (!isEventActive('peg_cascade')) return;
    if (eventState.destroyedPegs.has(peg.pegIndex)) return;

    // Mark as destroyed
    eventState.destroyedPegs.add(peg.pegIndex);

    // Award bonus coins
    const bonus = EVENTS.peg_cascade.effects.basePegBonus * (typeof getSlotBoostMultiplier === 'function' ? getSlotBoostMultiplier() : 1);
    const rounded = Math.round(bonus);
    gameState.coins += rounded;
    gameState.totalCoinsEarned += rounded;

    // Remove peg from physics
    if (typeof world !== 'undefined') {
        Matter.World.remove(world, peg);
    }

    // Visual: hide the peg position
    if (pegPositions[peg.pegIndex]) {
        pegPositions[peg.pegIndex].destroyed = true;
        pegPositions[peg.pegIndex].lit = 1; // Flash before disappearing
    }

    // Sparkle burst effect
    if (typeof particleBurst === 'function') {
        particleBurst(peg.position.x, peg.position.y, '#fbbf24', 6);
    }
}

function respawnDestroyedPegs() {
    // Rebuild the board to restore all pegs
    eventState.destroyedPegs.clear();
    if (typeof rebuildBoard === 'function') {
        rebuildBoard();
    }
}

function isPegDestroyed(pegIndex) {
    return eventState.destroyedPegs.has(pegIndex);
}

// ── Visual Feedback ──
function showEventActivation(ev) {
    // Screen shake
    if (typeof screenShake === 'function') {
        screenShake(6);
    }

    // Particle burst at board center
    if (typeof particleBurst === 'function') {
        const bEl = document.getElementById('plinkoBoard');
        if (bEl) {
            const r = bEl.getBoundingClientRect();
            particleBurst(r.width / 2, r.height / 2, '#38bdf8', 20);
        }
    }

    // Flash event banner
    const banner = document.getElementById('eventBanner');
    if (banner) {
        banner.textContent = \`⚡ \${ev.name} ACTIVE ⚡\`;
        banner.classList.add('show');
        setTimeout(() => banner.classList.remove('show'), 2500);
    }
}

// ── Events Panel UI ──
function renderEventsPanel() {
    const container = document.getElementById('eventCards');
    if (!container) return;

    // Clear container first
    container.innerHTML = '';

    // Render all events
    Object.values(EVENTS).forEach(ev => {
        const id = ev.id;
        const isActive = isEventActive(id);
        const onCooldown = isEventOnCooldown() && !isActive;
        const canBuy = gameState.coins >= ev.cost && !isAnyEventActive() && !isEventOnCooldown();

        const card = document.createElement('div');
        card.className = 'event-card';
        // Add classes for styling states (dimmed if cooldown, highlighted if active, etc)
        if (isActive) card.classList.add('event-active');
        if (onCooldown) card.classList.add('event-cooldown');
        if (canBuy) card.classList.add('event-affordable');

        let statusHTML = '';
        if (isActive) {
            const remaining = Math.ceil(getEventTimeRemaining() / 1000);
            statusHTML = \`<div class="event-status active">⏱ \${remaining}s remaining</div>\`;
        } else if (onCooldown) {
            const cdRemaining = Math.ceil(getCooldownRemaining() / 1000);
            const mins = Math.floor(cdRemaining / 60);
            const secs = cdRemaining % 60;
            statusHTML = \`<div class="event-status cooldown">🕐 \${mins}:\${String(secs).padStart(2, '0')} cooldown</div>\`;
        } else {
            statusHTML = \`<div class="event-cost \${canBuy ? '' : 'unaffordable'}">🪙 \${formatCost(ev.cost)}</div>\`;
        }

        const idleTag = ev.idleSafe
            ? '<span class="event-tag idle-safe">✓ Idle-Safe</span>'
            : '<span class="event-tag active-only">⚠ Active Only</span>';

        card.innerHTML = \`
            <div class="event-header">
                <span class="event-name">\${ev.name}</span>
                \${idleTag}
            </div>
            <div class="event-desc">\${ev.desc}</div>
            <div class="event-duration">Duration: \${(ev.duration / 1000) + (gameState.upgrades.gemEventDurationBonus || 0)}s</div>
            <div class="event-footer">
                \${statusHTML}
            </div>
        \`;

        if (canBuy) {
            card.addEventListener('click', () => {
                if (activateEvent(id)) {
                    renderEventsPanel(); // Re-render to show active state immediately
                }
            });
        }

        container.appendChild(card);
    });
}

</script>
  <script type="text/javascript">/* js/board.js */
/* ═══════════════════════════════════════════════
   PLINKO∞ — Physics Board (Matter.js)
   ═══════════════════════════════════════════════ */

let engine, world, render;
let boardWidth = 500;
let boardHeight = 600;
let pegs = [];
let walls = [];
let balls = [];
let slots = [];
let slotSensorBodies = [];
let pegPositions = [];
let lastRowPegXCoords = [];

// ── Initialize Physics Engine ──
function initPhysics() {
    engine = Matter.Engine.create({
        gravity: { x: 0, y: CONFIG.GRAVITY },
    });
    world = engine.world;

    // Reduce position iterations for performance with many balls
    engine.positionIterations = 6;
    engine.velocityIterations = 4;
}

// ── Build / Rebuild the Board ──
function rebuildBoard() {
    const canvas = document.getElementById('gameCanvas');
    const boardEl = document.getElementById('plinkoBoard');
    if (!boardEl || !canvas) return;

    const rect = boardEl.getBoundingClientRect();
    boardWidth = rect.width;
    boardHeight = rect.height;

    // Clear existing bodies
    Matter.World.clear(world, false);
    pegs = [];
    walls = [];
    balls = [];
    slotSensorBodies = [];
    pegPositions = [];
    lastRowPegXCoords = [];

    const numRows = 10;
    const slotH = CONFIG.SLOT_HEIGHT;
    const padTop = boardHeight * CONFIG.BOARD_PADDING_TOP;
    const padBot = slotH + 10;
    const padSide = boardWidth * CONFIG.BOARD_PADDING_SIDE;
    const usableH = boardHeight - padTop - padBot;
    const usableW = boardWidth - padSide * 2;

    // ── Triangular peg grid ──
    // For 12 bins, the last row needs 13 pegs (bins = spaces between consecutive pegs).
    // Each row has one more peg than the previous, creating a proper staggered triangle.
    // Row 0: 4 pegs, Row 1: 5, ... Row 9: 13 pegs.
    const numSlots = 14;
    const lastRowPegCount = numSlots + 1;  // 15
    const firstRowPegCount = lastRowPegCount - (numRows - 1); // 4

    // Uniform horizontal spacing based on the widest (last) row
    const dx = usableW / (lastRowPegCount - 1);
    const dy = usableH / (numRows - 1);

    // ── Create pegs ──
    const pegOpts = {
        isStatic: true,
        restitution: CONFIG.BALL_RESTITUTION,
        friction: CONFIG.PEG_FRICTION,
        circleRadius: CONFIG.PEG_RADIUS,
        label: 'peg',
    };

    for (let r = 0; r < numRows; r++) {
        const rowY = padTop + r * dy;
        const cols = firstRowPegCount + r; // 4, 5, 6, ..., 13
        const rowWidth = (cols - 1) * dx;
        const xStart = (boardWidth - rowWidth) / 2;

        for (let c = 0; c < cols; c++) {
            const pegX = xStart + c * dx;
            const peg = Matter.Bodies.circle(pegX, rowY, CONFIG.PEG_RADIUS, pegOpts);
            peg.pegIndex = pegPositions.length;
            pegs.push(peg);
            pegPositions.push({ x: pegX, y: rowY, lit: 0 });

            if (r === numRows - 1) {
                lastRowPegXCoords.push(pegX);
            }
        }
    }

    Matter.World.add(world, pegs);

    // ── Create boundary walls ──
    const wallOpts = { isStatic: true, restitution: 0.3, friction: 0.1, render: { visible: false } };

    // Far left/right fallback walls
    walls.push(Matter.Bodies.rectangle(
        -CONFIG.WALL_THICKNESS / 2, boardHeight / 2,
        CONFIG.WALL_THICKNESS, boardHeight * 5,
        { isStatic: true, restitution: 0.1, friction: 0.8, render: { visible: false } }
    ));
    walls.push(Matter.Bodies.rectangle(
        boardWidth + CONFIG.WALL_THICKNESS / 2, boardHeight / 2,
        CONFIG.WALL_THICKNESS, boardHeight * 5,
        { isStatic: true, restitution: 0.1, friction: 0.8, render: { visible: false } }
    ));

    // Bottom floor
    walls.push(Matter.Bodies.rectangle(
        boardWidth / 2, boardHeight + CONFIG.WALL_THICKNESS / 2,
        boardWidth, CONFIG.WALL_THICKNESS, wallOpts
    ));

    Matter.World.add(world, walls);

    // ── Angled side walls following the peg triangle edges ──
    // These walls run just outside the outermost pegs, angling from the narrow
    // top row down to the wide bottom row, preventing balls from escaping.
    const firstPegRow0X = (boardWidth - (firstRowPegCount - 1) * dx) / 2;
    const lastPegRow0X = firstPegRow0X + (firstRowPegCount - 1) * dx;
    const firstPegLastRowX = lastRowPegXCoords[0];
    const lastPegLastRowX = lastRowPegXCoords[lastRowPegXCoords.length - 1];

    const wallLength = Math.sqrt(usableH * usableH + Math.pow(firstPegRow0X - firstPegLastRowX, 2)) + 40;
    const wallThickness = 8;

    // Left angled wall
    const leftWallAngle = Math.atan2(
        firstPegRow0X - firstPegLastRowX,
        usableH
    );
    const leftWallCenterX = (firstPegRow0X + firstPegLastRowX) / 2 - dx * 0.3;
    const leftWallCenterY = padTop + usableH / 2;
    const leftWall = Matter.Bodies.rectangle(
        leftWallCenterX, leftWallCenterY,
        wallThickness, wallLength,
        { isStatic: true, restitution: 0.5, friction: 0.1, render: { visible: false }, angle: leftWallAngle }
    );

    // Right angled wall (mirror of left)
    const rightWallCenterX = (lastPegRow0X + lastPegLastRowX) / 2 + dx * 0.3;
    const rightWall = Matter.Bodies.rectangle(
        rightWallCenterX, leftWallCenterY,
        wallThickness, wallLength,
        { isStatic: true, restitution: 0.5, friction: 0.1, render: { visible: false }, angle: -leftWallAngle }
    );

    walls.push(leftWall, rightWall);
    Matter.World.add(world, [leftWall, rightWall]);

    // ── Create slot dividers and sensors aligned with last-row pegs ──
    // Dividers sit at each last-row peg's x-position
    const dividerOpts = { isStatic: true, restitution: 0.2, friction: 0.3, render: { visible: false } };
    for (let i = 0; i < lastRowPegXCoords.length; i++) {
        const divX = lastRowPegXCoords[i];
        const divider = Matter.Bodies.rectangle(
            divX, boardHeight - slotH / 2 - 2,
            2, slotH - 4,
            dividerOpts
        );
        Matter.World.add(world, [divider]);
    }

    // Slot sensors sit between consecutive last-row pegs
    for (let i = 0; i < numSlots; i++) {
        const leftPegX = lastRowPegXCoords[i];
        const rightPegX = lastRowPegXCoords[i + 1];
        const sensorX = (leftPegX + rightPegX) / 2;
        const sensorW = (rightPegX - leftPegX) - 4;
        const sensor = Matter.Bodies.rectangle(
            sensorX, boardHeight - slotH + 8,
            sensorW, 12,
            { isStatic: true, isSensor: true, label: 'slot_' + i }
        );
        sensor.slotIndex = i;
        slotSensorBodies.push(sensor);
    }
    Matter.World.add(world, slotSensorBodies);

    // Render slot tray HTML
    renderSlotTray(numRows);

    // ── Collision events ──
    Matter.Events.off(engine); // Clear old events
    Matter.Events.on(engine, 'collisionStart', handleCollisions);
}

// ── Handle Collisions ──
function handleCollisions(event) {
    const pairs = event.pairs;

    for (const pair of pairs) {
        const { bodyA, bodyB } = pair;

        // Ball hitting peg
        if ((bodyA.label === 'peg' && bodyB.label === 'ball') ||
            (bodyB.label === 'peg' && bodyA.label === 'ball')) {
            const peg = bodyA.label === 'peg' ? bodyA : bodyB;
            const ball = bodyA.label === 'ball' ? bodyA : bodyB;

            // Light up peg
            if (peg.pegIndex !== undefined && pegPositions[peg.pegIndex]) {
                pegPositions[peg.pegIndex].lit = 1;
            }

            // Sparkle effect
            if (typeof spawnSparkle === 'function') {
                spawnSparkle(peg.position.x, peg.position.y);
            }

            // Audio: Peg Hit
            if (window.AudioEngine) {
                const yPct = peg.position.y / boardHeight;
                window.AudioEngine.pegHit(yPct, ball.isLucky);
            }

            // Multi-ball split
            if (gameState.upgrades.multiBall > 0 && !ball.hasSplit) {
                const splitChance = getMultiBallChance();
                if (Math.random() < splitChance && runtimeState.activeBalls < CONFIG.MAX_BALLS_ON_BOARD) {
                    ball.hasSplit = true;
                    spawnBall(ball.position.x, ball.position.y, ball.isLucky);
                }
            }

            // Peg Cascade Event
            if (typeof handlePegCascadeHit === 'function') {
                handlePegCascadeHit(peg);
            }

            // Ball Evolution tracking
            if (ball.pegHits !== undefined) {
                ball.pegHits++;
            }
        }

        // Ball hitting slot sensor
        const slotBody = [bodyA, bodyB].find(b => b.label && b.label.startsWith('slot_'));
        const ballBody = [bodyA, bodyB].find(b => b.label === 'ball');

        if (slotBody && ballBody && !ballBody.scored) {
            ballBody.scored = true;
            // Disable further collisions immediately to prevent double-counting or floor bounces
            if (ballBody.collisionFilter) {
                ballBody.collisionFilter.mask = 0;
            }
            const slotIdx = slotBody.slotIndex;
            handleSlotHit(slotIdx, ballBody);
        }
    }
}

// ── Handle Ball Landing in Slot ──
function handleSlotHit(slotIndex, ballBody) {
    const rows = getBoardRows();
    const multipliers = CONFIG.SLOT_MULTIPLIERS[rows] || CONFIG.SLOT_MULTIPLIERS[4];
    let mult = multipliers[slotIndex] || 1;

    // Roulette multiplier override
    if (typeof getBinRouletteValue === 'function') {
        const rouletteVal = getBinRouletteValue(slotIndex);
        if (rouletteVal !== null) mult = rouletteVal;
    }

    // Lucky ball bonus
    const isLucky = ballBody.isLucky;
    if (isLucky) mult *= 10;

    // Ball Evolution Event
    if (typeof getBallEvolutionMultiplier === 'function') {
        mult *= getBallEvolutionMultiplier(ballBody);
    }

    // Global multiplier
    const globalMult = getGlobalMultiplier();

    // Calculate winnings based on bet amount
    const betAmount = ballBody.betAmount || 1;
    const winnings = Math.round(betAmount * mult * globalMult);

    // Award winnings
    gameState.coins += winnings;
    gameState.totalCoinsEarned += winnings;

    // Daily challenges: earn_coins, land_edge, land_center, land_high
    if (typeof recordDailyProgress === 'function') {
        recordDailyProgress('earn_coins', winnings);
        const numSlots = (multipliers && multipliers.length) || 14;
        if (slotIndex === 0 || slotIndex === numSlots - 1) recordDailyProgress('land_edge', 1);
        // Center slots for 14 bins are indexes 4 through 9 (the < 1.0 bins)
        if (slotIndex >= 4 && slotIndex <= 9) recordDailyProgress('land_center', 1);
        const baseMult = multipliers[slotIndex] || 1;
        if (baseMult >= 10) recordDailyProgress('land_high', 1);
    }

    // Track CPS
    runtimeState.recentCps.push({ amount: winnings, time: Date.now() });

    // Fever tracking removed

    // Visual effects
    // Critical if lucky ball OR high multiplier (>= 10)
    const isCritical = isLucky || mult >= 10;

    if (typeof showSlotHit === 'function') {
        showSlotHit(slotIndex, winnings, mult >= 3, isCritical);
    }

    // Haptic Feedback (No haptic for peg hits, only slots)
    if (typeof triggerHaptic === 'function') {
        if (isCritical) {
            triggerHaptic('heavy');
        } else if (mult >= 3) {
            triggerHaptic('medium');
        } else {
            triggerHaptic('light'); // Very subtle for 0.2x / 0.5x / 1x
        }
    }

    // Audio: Slot Hit
    if (window.AudioEngine) {
        // Simple tier logic: mult > 10 is high tier
        const tier = mult > 9 ? 3 : (mult > 2 ? 1 : 0);
        window.AudioEngine.slotHit(isLucky, tier);
    }

    // Slot flash
    const slotEls = document.querySelectorAll('.slot');
    if (slotEls[slotIndex]) {
        slotEls[slotIndex].classList.remove('hit');
        void slotEls[slotIndex].offsetWidth; // reflow to restart animation
        slotEls[slotIndex].classList.add('hit');
    }

    // Coin chip pulse
    const chip = document.getElementById('coinChip');
    if (chip) {
        chip.classList.remove('pulse');
        void chip.offsetWidth;
        chip.classList.add('pulse');
    }

    // Remove ball after a brief moment
    setTimeout(() => {
        removeBall(ballBody);
    }, 200);
}

// ── Affordable bet for N balls (so total cost <= coins) ──
function getAffordableBetForBalls(numBalls) {
    const coins = gameState.coins || 0;
    const currentBet = gameState.currentBet || 1;
    const maxPerBall = Math.floor(coins / Math.max(1, numBalls));
    return Math.min(currentBet, Math.max(1, maxPerBall));
}

// ── Spawn a Ball ──
function spawnBall(x, y, forceGolden, betAmount) {
    if (runtimeState.activeBalls >= CONFIG.MAX_BALLS_ON_BOARD) return null;

    // Use provided bet amount or fall back to current bet from game state
    const actualBet = betAmount || gameState.currentBet || 1;

    // Check if player has enough coins to place this bet
    if (gameState.coins < actualBet) {
        // Not enough coins - show feedback with throttling (once every 10s)
        const now = Date.now();
        if (now - (runtimeState.lastToastTime || 0) > 10000) {
            if (typeof showToast === 'function') {
                showToast('Not enough coins!', 'error');
            }
            runtimeState.lastToastTime = now;
        }
        return null;
    }

    // Deduct bet amount
    gameState.coins -= actualBet;
    gameState.totalCoinsBet += actualBet;

    // Visual Dropper Animation - Trigger only if spawned near center (manual or auto)
    // Visual Dropper: Move to spawn X and fire
    const nozzle = document.querySelector('.dropper-nozzle');
    if (nozzle) {
        // Move nozzle to ball X (clamped to board width)
        const spawnX = x || boardWidth / 2;
        // nozzle is absolute in .plinko-board. 
        // We used left: 50% in CSS, now we override it
        nozzle.style.left = spawnX + 'px';

        // Trigger animation
        nozzle.classList.remove('active');
        void nozzle.offsetWidth; // trigger reflow
        nozzle.classList.add('active');
    }

    const isLucky = forceGolden || (Math.random() < getLuckyBallChance());

    // Audio: Drop
    if (window.AudioEngine) {
        window.AudioEngine.drop();
    }

    // Sub-pixel jitter (0.1px) is invisible but prevents "perfect" physics paths
    // without it, every ball would follow the exact same left/right path
    const dropX = x || boardWidth / 2 + (Math.random() - 0.5) * 0.1;
    const dropY = y || 15;

    const ball = Matter.Bodies.circle(dropX, dropY, CONFIG.BALL_RADIUS, {
        restitution: CONFIG.BALL_RESTITUTION,
        friction: CONFIG.BALL_FRICTION,
        density: CONFIG.BALL_DENSITY,
        label: 'ball',
    });

    ball.isLucky = isLucky;
    ball.scored = false;
    ball.hasSplit = false;
    ball.spawnTime = Date.now();
    ball.pegHits = 0;
    ball.trailPoints = [];
    ball.betAmount = actualBet; // Store bet amount on the ball

    // Pinpoint drop: zero horizontal velocity
    // Apply drop speed upgrade
    const speedMult = typeof getDropSpeedMultiplier === 'function' ? getDropSpeedMultiplier() : 1;
    Matter.Body.setVelocity(ball, { x: 0, y: 1.0 * speedMult });

    balls.push(ball);
    Matter.World.add(world, [ball]);
    runtimeState.activeBalls++;
    gameState.totalBallsDropped++;

    if (typeof recordDailyProgress === 'function') recordDailyProgress('drop_ball', 1);

    return ball;
}

// ── Remove a Ball ──
function removeBall(ball) {
    Matter.World.remove(world, ball);
    const idx = balls.indexOf(ball);
    if (idx > -1) balls.splice(idx, 1);
    runtimeState.activeBalls = Math.max(0, runtimeState.activeBalls - 1);
}

// ── Clean up stuck/old balls ──
function cleanupBalls() {
    const now = Date.now();
    const toRemove = [];

    for (const ball of balls) {
        // Remove balls that are too old (stuck) or fell off screen
        if (now - ball.spawnTime > 15000 || ball.position.y > boardHeight + 50) {
            if (!ball.scored) {
                // Give minimum payout for stuck balls
                const rows = getBoardRows();
                const multipliers = CONFIG.SLOT_MULTIPLIERS[rows] || CONFIG.SLOT_MULTIPLIERS[4];
                const midSlot = Math.floor(multipliers.length / 2);
                handleSlotHit(midSlot, ball);
            }
            toRemove.push(ball);
        }
    }

    for (const ball of toRemove) {
        removeBall(ball);
    }
}

// ── Auto-drop system ──
let dropTimers = [];

function startAutoDroppers() {
    stopAutoDroppers();
    if (!gameState.settings.autoDropEnabled && !(typeof runtimeState !== 'undefined' && runtimeState.frenzyActive)) return;

    const dropperCount = getDropperCount();
    const interval = getDropInterval();
    const ballsPerDrop = getBallCount();

    for (let d = 0; d < dropperCount; d++) {
        const offset = d * (interval / dropperCount); // Stagger droppers

        const timerId = setTimeout(() => {
            const innerTimer = setInterval(() => {
                for (let b = 0; b < ballsPerDrop; b++) {
                    const dropperX = getDropperX(d, dropperCount);
                    // Use current bet for auto-dropped balls
                    setTimeout(() => spawnBall(dropperX, 15, false, gameState.currentBet), b * 80);
                }
                // Flash dropper indicator
                flashDropper(d);
            }, getDropInterval());
            dropTimers.push(innerTimer);
        }, offset);
        dropTimers.push(timerId);
    }
}

function stopAutoDroppers() {
    for (const t of dropTimers) {
        clearTimeout(t);
        clearInterval(t);
    }
    dropTimers = [];
}

function getDropperX(index, total) {
    // ALWAYS return the exact center, regardless of how many droppers are active
    return boardWidth / 2;
}

function flashDropper(index) {
    const indicators = document.querySelectorAll('.drop-indicator');
    if (indicators[index]) {
        indicators[index].classList.add('firing');
        setTimeout(() => indicators[index].classList.remove('firing'), 150);
    }
}

// ── Update physics step ──
function updatePhysics(delta) {
    if (typeof tickEvents === 'function') tickEvents();

    if (engine) {
        Matter.Engine.update(engine, delta);
    }

    // Centering Bias: Nudges balls toward center to achieve requested probabilities
    // (1k bin = 0.0001%, 100 bin = 0.1%, 25 bin = 1%)
    const centerX = boardWidth / 2;
    for (const ball of balls) {
        const distFromCenter = ball.position.x - centerX;
        const absDist = Math.abs(distFromCenter);

        if (absDist > 5) {
            // Enhanced Centering Bias: Stronger pull to ensure more balls land in middle bins
            // Combination of Cubic (strong at edges) + Linear (constant nudge)
            const pullStrength = (0.00015 * Math.pow(absDist / centerX, 3)) + (0.00005 * (absDist / centerX));
            const forceX = distFromCenter > 0 ? -pullStrength : pullStrength;
            Matter.Body.applyForce(ball, ball.position, { x: forceX, y: 0 });
        }

        // Apply event-specific forces
        if (typeof applyEdgeSingularity === 'function') applyEdgeSingularity(ball);

        // Store trail points for active balls
        if (!ball.trailPoints) ball.trailPoints = [];
        ball.trailPoints.push({ x: ball.position.x, y: ball.position.y, t: Date.now() });
        // Keep only last 8 trail points
        if (ball.trailPoints.length > 8) ball.trailPoints.shift();
    }

    // Fade peg lights
    for (const p of pegPositions) {
        if (p.lit > 0) p.lit = Math.max(0, p.lit - 0.04);
    }
}

// ── Ball Storm (shop): 50 balls at a bet you can afford ──
function triggerBallStorm() {
    const count = 50;
    const bet = getAffordableBetForBalls(count);
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            if (runtimeState.activeBalls >= CONFIG.MAX_BALLS_ON_BOARD) return;
            const x = boardWidth / 2 + (Math.random() - 0.5) * 0.1;
            spawnBall(x, 15, false, bet);
        }, i * 80);
    }
}

</script>
  <script type="text/javascript">/* js/renderer.js */
/* ═══════════════════════════════════════════════
   PLINKO — Canvas Renderer (Pixel Arcade)
   ═══════════════════════════════════════════════ */

let ctx;
let canvasW, canvasH, dpr;

// Pixel scale — render at low res, CSS upscales with image-rendering: pixelated for chunky look
const PIXEL_SCALE = 0.35;

function initRenderer() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    dpr = window.devicePixelRatio || 1;
    createBallSprites();
}

// ── Sprite Caching ──
let ballSprite = null;
let luckyBallSprite = null;

function createBallSprites() {
    const r = CONFIG.BALL_RADIUS;
    const size = (r + 4) * 2;

    // 1. Normal Ball — bright cyan, high contrast
    ballSprite = document.createElement('canvas');
    ballSprite.width = size;
    ballSprite.height = size;
    const ctx1 = ballSprite.getContext('2d');
    ctx1.imageSmoothingEnabled = false;
    const c = size / 2;

    // Glow — bright
    const glow = ctx1.createRadialGradient(c, c, r * 0.2, c, c, r + 3);
    glow.addColorStop(0, 'rgba(0, 229, 255, 0.5)');
    glow.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx1.fillStyle = glow;
    ctx1.beginPath();
    ctx1.arc(c, c, r + 3, 0, Math.PI * 2);
    ctx1.fill();

    // Body — solid bright fill
    const grad1 = ctx1.createRadialGradient(c - 1, c - 1, 0, c, c, r);
    grad1.addColorStop(0, '#FFFFFF');
    grad1.addColorStop(0.3, '#80F0FF');
    grad1.addColorStop(1, '#00E5FF');
    ctx1.fillStyle = grad1;
    ctx1.beginPath();
    ctx1.arc(c, c, r, 0, Math.PI * 2);
    ctx1.fill();

    // Hard specular highlight
    ctx1.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx1.beginPath();
    ctx1.arc(c - 1.5, c - 2.5, r * 0.2, 0, Math.PI * 2);
    ctx1.fill();

    // 2. Lucky Ball — bright gold
    luckyBallSprite = document.createElement('canvas');
    luckyBallSprite.width = size * 2;
    luckyBallSprite.height = size * 2;
    const ctx2 = luckyBallSprite.getContext('2d');
    ctx2.imageSmoothingEnabled = false;
    const c2 = size;

    // Golden Glow
    const glow2 = ctx2.createRadialGradient(c2, c2, r * 0.3, c2, c2, r * 3);
    glow2.addColorStop(0, 'rgba(255, 215, 64, 0.4)');
    glow2.addColorStop(1, 'rgba(255, 215, 64, 0)');
    ctx2.fillStyle = glow2;
    ctx2.beginPath();
    ctx2.arc(c2, c2, r * 3, 0, Math.PI * 2);
    ctx2.fill();

    // Body — solid gold
    const grad2 = ctx2.createRadialGradient(c2 - 1, c2 - 1, 0, c2, c2, r);
    grad2.addColorStop(0, '#FFFFFF');
    grad2.addColorStop(0.3, '#FFEA80');
    grad2.addColorStop(1, '#FFD740');
    ctx2.fillStyle = grad2;
    ctx2.beginPath();
    ctx2.arc(c2, c2, r, 0, Math.PI * 2);
    ctx2.fill();

    // Highlight
    ctx2.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx2.beginPath();
    ctx2.arc(c2 - 1.5, c2 - 2.5, r * 0.2, 0, Math.PI * 2);
    ctx2.fill();
}

function resizeCanvas() {
    const canvas = document.getElementById('gameCanvas');
    const boardEl = document.getElementById('plinkoBoard');
    if (!canvas || !boardEl) return;

    const rect = boardEl.getBoundingClientRect();

    // Guard: if the board hasn't laid out yet, retry after a frame
    if (rect.width < 10 || rect.height < 10) {
        requestAnimationFrame(resizeCanvas);
        return;
    }

    canvasW = rect.width;
    canvasH = rect.height;

    // Render at lower resolution for the chunky pixel look
    const renderScale = dpr * PIXEL_SCALE;
    canvas.width = Math.floor(canvasW * renderScale);
    canvas.height = Math.floor(canvasH * renderScale);

    if (ctx) {
        ctx.setTransform(renderScale, 0, 0, renderScale, 0, 0);
        ctx.imageSmoothingEnabled = false;
    }
}

// ── Main render frame ──
function renderFrame() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasW, canvasH);
    drawPegs();
    drawTrails();
    drawBalls();
}

// ── Draw Pegs — bright against dark board ──
function drawPegs() {
    for (const peg of pegPositions) {
        // Skip pegs destroyed by Peg Cascade event
        if (peg.destroyed) continue;

        const lit = peg.lit;

        if (lit > 0.01) {
            const glow = lit;
            ctx.save();

            // Bright glow burst
            const gradient = ctx.createRadialGradient(peg.x, peg.y, 0, peg.x, peg.y, 12 * glow);
            gradient.addColorStop(0, \`rgba(0, 229, 255, \${0.6 * glow})\`);
            gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, 12 * glow, 0, Math.PI * 2);
            ctx.fill();

            // White-hot center
            ctx.fillStyle = \`rgba(255, 255, 255, \${0.95 * glow})\`;
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, CONFIG.PEG_RADIUS + 0.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        } else {
            // Normal peg — visible bright dots against dark board
            ctx.save();

            // Solid fill — brighter for contrast
            ctx.fillStyle = 'rgba(168, 160, 216, 0.45)';
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, CONFIG.PEG_RADIUS, 0, Math.PI * 2);
            ctx.fill();

            // Center dot highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, CONFIG.PEG_RADIUS * 0.3, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }
}

// ── Draw Ball Trails — bright streaks ──
function drawTrails() {
    const now = Date.now();

    for (const ball of balls) {
        if (!ball.trailPoints || ball.trailPoints.length < 2) continue;

        const color = ball.isLucky
            ? 'rgba(255, 215, 64, '
            : 'rgba(0, 229, 255, ';

        for (let i = 0; i < ball.trailPoints.length - 1; i++) {
            const pt = ball.trailPoints[i];
            const age = now - pt.t;
            if (age > 300) continue;

            const alpha = Math.max(0, 0.4 * (1 - age / 300));
            const size = CONFIG.BALL_RADIUS * (1 - age / 300) * 0.6;

            ctx.fillStyle = color + alpha + ')';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ── Draw Balls ──
function drawBalls() {
    for (const ball of balls) {
        if (!ball.position) continue;
        const x = ball.position.x;
        const y = ball.position.y;

        if (ball.isLucky && luckyBallSprite) {
            const size = luckyBallSprite.width;
            ctx.drawImage(luckyBallSprite, Math.floor(x - size / 2), Math.floor(y - size / 2));
        } else if (ballSprite) {
            const size = ballSprite.width;
            ctx.drawImage(ballSprite, Math.floor(x - size / 2), Math.floor(y - size / 2));
        }
    }
}

</script>
  <script type="text/javascript">/* js/effects.js */
/* ═══════════════════════════════════════════════
   PLINKO∞ — Visual Effects
   ═══════════════════════════════════════════════ */

// ── Spawn Sparkle on Peg Hit ──
// ── Spawn Sparkle on Peg Hit ──
function spawnSparkle(x, y) {
    // Throttle: only 30% of hits create a visual sparkle to save DOM perf
    if (Math.random() > 0.3) return;

    const board = document.getElementById('plinkoBoard');
    if (!board) return;

    // Hard limit: if too many sparkles, don't add more
    if (board.childElementCount > 100) return;

    const el = document.createElement('div');
    el.className = 'peg-sparkle';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    board.appendChild(el);

    setTimeout(() => el.remove(), 350);
}

// ── Haptic Feedback (Vibration) ──
function triggerHaptic(type) {
    if (!navigator.vibrate) return;

    // Check if settings allow haptics (assuming audioToggle covers "Sound & Feedback")
    // Or we could add a specific haptic toggle. For now, we'll respect the global "Animations" or "Audio" setting?
    // Let's assume haptics are always on if supported, unless user explicitly disabled (UI needs update later).
    // For now, we'll just run it.

    switch (type) {
        case 'light':
            navigator.vibrate(10); // Very short tick
            break;
        case 'medium':
            navigator.vibrate(25); // Noticeable bump
            break;
        case 'heavy':
            navigator.vibrate([50, 50, 50]); // Double bump
            break;
        case 'success':
            navigator.vibrate([30, 30, 30]);
            break;
        case 'warning':
            navigator.vibrate([50, 100, 50]);
            break;
    }
}

// ── Show Coin Pop on Slot Hit (Floating Text) ──
function showSlotHit(slotIndex, coins, isBig, isCritical) {
    const board = document.getElementById('plinkoBoard');
    const slotEls = document.querySelectorAll('.slot');
    if (!board || !slotEls[slotIndex]) return;

    // Performance limit - strict for small hits, loose for big/crits
    if (!isBig && !isCritical && board.childElementCount > 150) return;

    // Throttle small wins unless they are critical
    if (!isBig && !isCritical && coins < 5 && Math.random() > 0.5) return;

    const slotEl = slotEls[slotIndex];
    const boardRect = board.getBoundingClientRect();
    const slotRect = slotEl.getBoundingClientRect();

    const pop = document.createElement('div');
    // Base class
    let className = 'coin-pop';
    let text = '+' + formatNumber(coins);

    // Styling logic
    if (isCritical) {
        className += ' crit'; // CSS needs to define this, or we set style inline
        text = '🔥 +' + formatNumber(coins);
        pop.style.fontSize = '14px';
        pop.style.color = '#FFD740'; // Gold
        pop.style.fontWeight = '800';
        pop.style.textShadow = '0 0 8px rgba(255, 215, 64, 0.8)';
        pop.style.zIndex = '100';
    } else if (isBig) {
        className += ' big';
        pop.style.fontSize = '12px';
        pop.style.color = '#3EE87F'; // Green/Success
        pop.style.fontWeight = '700';
    }

    pop.className = className;
    pop.textContent = text;

    // Center text on slot
    pop.style.left = (slotRect.left - boardRect.left + slotRect.width / 2) + 'px';
    pop.style.top = (slotRect.top - boardRect.top - 12) + 'px'; // Float a bit higher

    board.appendChild(pop);

    // Animation duration depends on importance
    const duration = isCritical ? 1500 : 1000;

    // Use Web Animations API for smoother float if critical
    if (isCritical) {
        pop.animate([
            { transform: 'translate(-50%, 0) scale(0.5)', opacity: 0 },
            { transform: 'translate(-50%, -20px) scale(1.5)', opacity: 1, offset: 0.2 },
            { transform: 'translate(-50%, -80px) scale(1)', opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            fill: 'forwards'
        });
    } else {
        // Fallback to CSS animation 'coinFloat' defined in style.css, but with inline override if needed
        // Since we didn't add .crit styles to CSS, we rely on js inline styles + standard animation
        // We'll leave the standard CSS animation for non-crit
    }

    setTimeout(() => pop.remove(), duration);
}

// ── Fever Mode ──
function triggerFever() {
    if (runtimeState.feverActive) return;

    runtimeState.feverActive = true;
    runtimeState.consecutiveHighHits = 0;
    gameState.feverCount++;

    const duration = CONFIG.FEVER_DURATION;

    // Banner
    const banner = document.getElementById('feverBanner');
    if (banner) {
        banner.classList.add('show');
        setTimeout(() => banner.classList.remove('show'), 2500);
    }

    // Board glow
    const board = document.getElementById('plinkoBoard');
    if (board) board.classList.add('fever-active');

    // Overlay
    const overlay = document.getElementById('feverOverlay');
    if (overlay) overlay.classList.add('active');

    // Speed up auto-droppers during fever
    stopAutoDroppers();
    startAutoDroppers(); // Will recalculate with fever multiplier active

    // End fever
    runtimeState.feverTimer = setTimeout(() => {
        runtimeState.feverActive = false;
        if (board) board.classList.remove('fever-active');
        if (overlay) overlay.classList.remove('active');
        stopAutoDroppers();
        startAutoDroppers();
    }, duration);
}

// ── Frenzy Mode (weekly login reward) ──
// Shows animated randomizer → then starts frenzy with free balls + countdown timer
function triggerFrenzy() {
    if (typeof runtimeState === 'undefined' || typeof gameState === 'undefined') return;
    if (runtimeState.frenzyActive) return;
    if (!gameState.frenzyTokens || gameState.frenzyTokens < 1) return;

    gameState.frenzyTokens -= 1;
    if (typeof saveGame === 'function') saveGame();

    // ── Calculate ranges ──
    // Duration: 10-45 seconds
    const minDuration = 10;
    const maxDuration = 45;

    // Ball value: if coins >= 100k, range is 100 to 1% of balance. Otherwise 100-1000.
    const minValue = 100;
    let maxValue = 1000;
    if (gameState.coins >= 100000) {
        maxValue = Math.max(1000, Math.floor(gameState.coins * 0.01));
    }

    // ── Show Randomizer Overlay ──
    const overlay = document.getElementById('frenzyRandomizer');
    const durationEl = document.getElementById('frenzyDurationValue');
    const valueEl = document.getElementById('frenzyValueValue');
    const statusEl = document.getElementById('frenzyRandomizerStatus');

    if (!overlay || !durationEl || !valueEl) {
        // Fallback: just start frenzy directly
        startFrenzyPhase(25000, 500);
        return;
    }

    overlay.style.display = 'flex';
    statusEl.textContent = 'Randomizing...';

    // ── Animated Randomizer (slot-machine style) ──
    let spinCount = 0;
    const totalSpins = 30; // ~1.5 seconds of spinning
    const spinInterval = 50; // ms per tick

    const spinTimer = setInterval(() => {
        spinCount++;
        // Random display values (visual only)
        const randDur = Math.floor(Math.random() * (maxDuration - minDuration + 1)) + minDuration;
        const randVal = Math.floor(Math.random() * (maxValue - minValue + 1) / 50) * 50 + minValue;
        durationEl.textContent = randDur;
        valueEl.textContent = typeof formatNumber === 'function' ? formatNumber(randVal) : randVal;

        // Slow down near the end
        if (spinCount >= totalSpins) {
            clearInterval(spinTimer);

            // ── Final Results ──
            const finalDuration = Math.floor(Math.random() * (maxDuration - minDuration + 1)) + minDuration;
            const finalValue = Math.floor(Math.random() * (maxValue - minValue + 1) / 50) * 50 + minValue;

            durationEl.textContent = finalDuration;
            valueEl.textContent = typeof formatNumber === 'function' ? formatNumber(finalValue) : finalValue;
            statusEl.textContent = '🎉 LOCKED IN!';

            // Add "locked" animation
            durationEl.classList.add('locked');
            valueEl.classList.add('locked');

            // After a beat, close overlay and start frenzy
            setTimeout(() => {
                overlay.style.display = 'none';
                durationEl.classList.remove('locked');
                valueEl.classList.remove('locked');
                startFrenzyPhase(finalDuration * 1000, finalValue);
            }, 1200);
        }
    }, spinInterval);
}

// ── Actual Frenzy Execution ──
function startFrenzyPhase(durationMs, ballValue) {
    runtimeState.frenzyActive = true;
    runtimeState.frenzyBallValue = ballValue; // Store for use in spawnBall override

    // Banner flash
    const banner = document.getElementById('frenzyBanner');
    if (banner) {
        banner.classList.add('show');
        setTimeout(() => banner.classList.remove('show'), 2500);
    }

    // Board glow
    const board = document.getElementById('plinkoBoard');
    if (board) board.classList.add('frenzy-active');

    // Restart droppers with frenzy speed
    if (typeof stopAutoDroppers === 'function') stopAutoDroppers();
    if (typeof startAutoDroppers === 'function') startAutoDroppers();

    // ── Countdown Timer ──
    const timerEl = document.getElementById('frenzyTimer');
    const timerText = document.getElementById('frenzyTimerText');
    if (timerEl) timerEl.style.display = 'flex';

    const endTime = Date.now() + durationMs;
    runtimeState.frenzyCountdownInterval = setInterval(() => {
        const remaining = Math.max(0, endTime - Date.now());
        const secs = Math.ceil(remaining / 1000);
        if (timerText) timerText.textContent = secs + 's';

        if (remaining <= 0) {
            clearInterval(runtimeState.frenzyCountdownInterval);
            runtimeState.frenzyCountdownInterval = null;
            endFrenzy();
        }
    }, 100);

    // ── Safety timeout ──
    if (runtimeState.frenzyTimer) clearTimeout(runtimeState.frenzyTimer);
    runtimeState.frenzyTimer = setTimeout(() => {
        if (runtimeState.frenzyActive) endFrenzy();
    }, durationMs + 500);

    if (typeof saveGame === 'function') saveGame();
}

function endFrenzy() {
    runtimeState.frenzyActive = false;
    runtimeState.frenzyBallValue = 0;

    const board = document.getElementById('plinkoBoard');
    if (board) board.classList.remove('frenzy-active');

    const timerEl = document.getElementById('frenzyTimer');
    if (timerEl) timerEl.style.display = 'none';

    if (runtimeState.frenzyCountdownInterval) {
        clearInterval(runtimeState.frenzyCountdownInterval);
        runtimeState.frenzyCountdownInterval = null;
    }

    if (runtimeState.frenzyTimer) {
        clearTimeout(runtimeState.frenzyTimer);
        runtimeState.frenzyTimer = null;
    }

    if (typeof stopAutoDroppers === 'function') stopAutoDroppers();
    if (typeof startAutoDroppers === 'function') startAutoDroppers();

    // Show "Frenzy Over" toast
    if (typeof showToast === 'function') showToast('⚡ Frenzy Over!', 'info');

    // Re-render daily view to update token count
    if (typeof renderDailyView === 'function') renderDailyView();
}

if (typeof window !== 'undefined') window.triggerFrenzy = triggerFrenzy;

// ── Screen Shake (for big wins) ──
function screenShake(intensity) {
    const app = document.getElementById('app');
    if (!app) return;

    const duration = 300;
    const start = Date.now();

    function shakeFrame() {
        const elapsed = Date.now() - start;
        if (elapsed > duration) {
            app.style.transform = '';
            return;
        }

        const progress = elapsed / duration;
        const decay = 1 - progress;
        const x = (Math.random() - 0.5) * intensity * decay;
        const y = (Math.random() - 0.5) * intensity * decay;
        app.style.transform = \`translate(\${x}px, \${y}px)\`;

        requestAnimationFrame(shakeFrame);
    }

    requestAnimationFrame(shakeFrame);
}

// ── Particle Burst (for upgrades/prestige) ──
function particleBurst(x, y, color, count) {
    const board = document.getElementById('plinkoBoard') || document.body;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = \`
      position: absolute;
      width: 4px; height: 4px;
      border-radius: 50%;
      background: \${color};
      box-shadow: 0 0 6px \${color};
      left: \${x}px; top: \${y}px;
      pointer-events: none;
      z-index: 50;
    \`;

        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 40 + Math.random() * 60;
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;

        board.appendChild(particle);

        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: \`translate(\${dx}px, \${dy}px) scale(0)\`, opacity: 0 }
        ], {
            duration: 500 + Math.random() * 300,
            easing: 'ease-out',
            fill: 'forwards'
        });

        setTimeout(() => particle.remove(), 900);
    }
}

// ── Confetti Burst (UI Feedback) ──
function spawnConfetti(x, y) {
    const count = 16;
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#FFFFFF', '#A8E6CF'];

    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'confetti';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const velocity = 30 + Math.random() * 80;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        // Use Web Animations API
        el.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: \`translate(\${tx}px, \${ty}px) rotate(\${Math.random() * 720}deg)\`, opacity: 0 }
        ], {
            duration: 700 + Math.random() * 500,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            fill: 'forwards'
        });

        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1200);
    }
}

</script>
  <script type="text/javascript">/* js/ui.js */
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

        slot.innerHTML = \`<span class="mult">\${displayVal}</span><span class="x">×</span>\`;
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
        label.textContent = \`AUTO-DROP ×\${count} · \${bps}/s\`;
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
        : \`<span class="upgrade-level">Lv \${level}</span>\`;

    const progressPct = maxed ? 100 : (level / u.maxLevel) * 100;
    const fillClass = maxed ? 'upgrade-progress-fill maxed-fill' : 'upgrade-progress-fill';

    const costLabel = maxed
        ? '<div class="upgrade-cost" style="color:var(--gold)">✓ Done</div>'
        : \`<div class="upgrade-cost \${affordable ? '' : 'unaffordable'}">🪙 \${formatCost(cost)}</div>\`;

    const effectLine = !compact && !maxed
        ? \`<div class="upgrade-effect">→ \${u.effect(level + 1)}</div>\`
        : (maxed ? \`<div class="upgrade-effect" style="color:var(--gold)">→ \${u.effect(level)}</div>\` : '');

    card.innerHTML = \`
    <div class="upgrade-header">
      <span class="upgrade-name">\${u.name}</span>
      \${levelLabel}
    </div>
    \${!compact ? \`<div class="upgrade-desc">\${u.desc}</div>\` : ''}
    \${effectLine}
    <div class="upgrade-footer">
      <div class="upgrade-progress"><div class="\${fillClass}" style="width:\${progressPct}%"></div></div>
      \${costLabel}
    </div>
  \`;

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
                el.textContent = \`Reset for \${tokens} token\${tokens !== 1 ? 's' : ''}\`;
            } else {
                const needed = CONFIG.PRESTIGE_THRESHOLD - gameState.totalCoinsEarned;
                el.textContent = \`Need \${formatNumber(Math.max(0, needed))} more coins\`;
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
                statusEl.textContent = \`\${ev.name} — \${remaining}s left\`;
                statusEl.style.color = 'var(--accent2)';
            } else if (isEventOnCooldown()) {
                const cdSec = Math.ceil(getCooldownRemaining() / 1000);
                const mins = Math.floor(cdSec / 60);
                const secs = cdSec % 60;
                statusEl.textContent = \`Cooldown: \${mins}:\${String(secs).padStart(2, '0')}\`;
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
        resetSub.textContent = \`Earn \${tokens} token\${tokens !== 1 ? 's' : ''}\`;
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

        card.innerHTML = \`
      <div class="prestige-upgrade-icon">\${pu.icon}</div>
      <div class="prestige-upgrade-info">
        <div class="prestige-upgrade-name">\${pu.name} \${maxed ? '(MAX)' : \`Lv \${level}\`}</div>
        <div class="prestige-upgrade-desc">\${pu.desc}</div>
      </div>
      <div class="prestige-upgrade-cost \${maxed ? 'owned-label' : ''}">\${maxed ? '✓' : \`⭐ \${cost}\`}</div>
    \`;

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
            if (confirm(\`Prestige Reset?\\n\\nYou'll earn \${tokens} Prestige Token(s).\\nYour coins and upgrades will reset, but prestige bonuses are permanent.\\n\\nContinue?\`)) {
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
    const timeStr = hours > 0 ? \`\${hours}h \${mins}m\` : \`\${mins}m\`;

    const isLoss = coins < 0;
    const absCoins = Math.abs(coins);
    const verb = isLoss ? 'Lost' : 'Earned';
    const color = isLoss ? 'var(--danger)' : 'var(--gold)';
    const sign = isLoss ? '-' : '+';

    msg.innerHTML = \`\${verb} <strong style="color:\${color}">\${sign}\${formatNumber(Math.floor(absCoins))} coins</strong> while away (\${timeStr})\`;
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
    overlay.innerHTML = \`
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
    \`;

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
    toast.style.cssText = \`
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: \${type === 'error' ? 'var(--danger)' : 'var(--accent1)'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-family: var(--font-pixel);
        font-size: 12px;
        z-index: 10000;
        animation: toastSlide 0.3s ease;
    \`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Remove after 2 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlide 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

</script>
  <script type="text/javascript">/* js/tutorial.js */
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
            const tab = document.querySelector(\`.tab[data-view="\${step.view}"]\`);
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
        content.innerHTML = \`
            <div class="tutorial-step-content">
                <span class="tutorial-icon">\${step.icon}</span>
                <h3 class="tutorial-title">\${step.title}</h3>
                <p class="tutorial-text">\${step.text}</p>
            </div>
        \`;

        // Render dots
        dotsContainer.innerHTML = '';
        TUTORIAL_STEPS.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = \`tutorial-dot \${i === currentStep ? 'active' : ''}\`;
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

</script>
  <script type="text/javascript">/* js/daily.js */
/* ═══════════════════════════════════════════════
   PLINKO∞ — Daily Rewards & Challenges
   ═══════════════════════════════════════════════ */

const DAILY_REWARDS = [
    { icon: '🪙', reward: '500 Coins', type: 'coins', amount: 500 },
    { icon: '🪙', reward: '1K Coins', type: 'coins', amount: 1000 },
    { icon: '💎', reward: '5 Gems', type: 'gems', amount: 5 },
    { icon: '🪙', reward: '2K Coins', type: 'coins', amount: 2000 },
    { icon: '🪙', reward: '5K Coins', type: 'coins', amount: 5000 },
    { icon: '💎', reward: '15 Gems', type: 'gems', amount: 15 },
    { icon: '🎁', reward: '10K+25💎', type: 'both', coins: 10000, gems: 25 },
];

// Pool of 50 daily challenges — cycled by day. progressKey: drop_ball | earn_coins | land_edge | land_center | land_high
const DAILY_CHALLENGE_POOL = [
    { id: 'dc_1', name: 'Edge Runner', desc: 'Land 5 balls in edge slots', target: 5, rewardType: 'gems', rewardAmount: 3, progressKey: 'land_edge' },
    { id: 'dc_2', name: 'Ball Storm', desc: 'Drop 50 balls', target: 50, rewardType: 'coins', rewardAmount: 2000, progressKey: 'drop_ball' },
    { id: 'dc_3', name: 'Money Maker', desc: 'Earn 10K coins', target: 10000, rewardType: 'gems', rewardAmount: 5, progressKey: 'earn_coins' },
    { id: 'dc_4', name: 'Dropper', desc: 'Drop 25 balls', target: 25, rewardType: 'coins', rewardAmount: 500, progressKey: 'drop_ball' },
    { id: 'dc_5', name: 'Edge Master', desc: 'Land 10 balls in edge slots', target: 10, rewardType: 'gems', rewardAmount: 8, progressKey: 'land_edge' },
    { id: 'dc_6', name: 'Coin Collector', desc: 'Earn 5K coins', target: 5000, rewardType: 'coins', rewardAmount: 1000, progressKey: 'earn_coins' },
    { id: 'dc_7', name: 'Center Shot', desc: 'Land 8 balls in center slots', target: 8, rewardType: 'gems', rewardAmount: 4, progressKey: 'land_center' },
    { id: 'dc_8', name: 'Heavy Hitter', desc: 'Land 5 balls in high-value slots (10×+)', target: 5, rewardType: 'gems', rewardAmount: 6, progressKey: 'land_high' },
    { id: 'dc_9', name: 'Ball Rain', desc: 'Drop 100 balls', target: 100, rewardType: 'coins', rewardAmount: 5000, progressKey: 'drop_ball' },
    { id: 'dc_10', name: 'Big Earner', desc: 'Earn 25K coins', target: 25000, rewardType: 'gems', rewardAmount: 10, progressKey: 'earn_coins' },
    { id: 'dc_11', name: 'Edge Seeker', desc: 'Land 3 balls in edge slots', target: 3, rewardType: 'coins', rewardAmount: 1500, progressKey: 'land_edge' },
    { id: 'dc_12', name: 'Quick Drops', desc: 'Drop 15 balls', target: 15, rewardType: 'coins', rewardAmount: 300, progressKey: 'drop_ball' },
    { id: 'dc_13', name: 'Pocket Change', desc: 'Earn 2K coins', target: 2000, rewardType: 'coins', rewardAmount: 500, progressKey: 'earn_coins' },
    { id: 'dc_14', name: 'Center Focus', desc: 'Land 5 balls in center slots', target: 5, rewardType: 'coins', rewardAmount: 800, progressKey: 'land_center' },
    { id: 'dc_15', name: 'High Roller', desc: 'Land 3 balls in high-value slots', target: 3, rewardType: 'gems', rewardAmount: 4, progressKey: 'land_high' },
    { id: 'dc_16', name: 'Mass Drop', desc: 'Drop 200 balls', target: 200, rewardType: 'gems', rewardAmount: 7, progressKey: 'drop_ball' },
    { id: 'dc_17', name: 'Rich', desc: 'Earn 50K coins', target: 50000, rewardType: 'gems', rewardAmount: 15, progressKey: 'earn_coins' },
    { id: 'dc_18', name: 'Edge Pro', desc: 'Land 15 balls in edge slots', target: 15, rewardType: 'gems', rewardAmount: 12, progressKey: 'land_edge' },
    { id: 'dc_19', name: 'Steady Drops', desc: 'Drop 75 balls', target: 75, rewardType: 'coins', rewardAmount: 3000, progressKey: 'drop_ball' },
    { id: 'dc_20', name: 'Earn 20K', desc: 'Earn 20K coins', target: 20000, rewardType: 'coins', rewardAmount: 4000, progressKey: 'earn_coins' },
    { id: 'dc_21', name: 'Center King', desc: 'Land 12 balls in center slots', target: 12, rewardType: 'gems', rewardAmount: 6, progressKey: 'land_center' },
    { id: 'dc_22', name: 'Lucky Slots', desc: 'Land 8 balls in high-value slots', target: 8, rewardType: 'gems', rewardAmount: 9, progressKey: 'land_high' },
    { id: 'dc_23', name: 'Drizzle', desc: 'Drop 10 balls', target: 10, rewardType: 'coins', rewardAmount: 200, progressKey: 'drop_ball' },
    { id: 'dc_24', name: 'Small Stack', desc: 'Earn 1K coins', target: 1000, rewardType: 'coins', rewardAmount: 400, progressKey: 'earn_coins' },
    { id: 'dc_25', name: 'Edges Only', desc: 'Land 7 balls in edge slots', target: 7, rewardType: 'gems', rewardAmount: 5, progressKey: 'land_edge' },
    { id: 'dc_26', name: 'Hundred Club', desc: 'Drop 100 balls', target: 100, rewardType: 'gems', rewardAmount: 5, progressKey: 'drop_ball' },
    { id: 'dc_27', name: '30K Earned', desc: 'Earn 30K coins', target: 30000, rewardType: 'gems', rewardAmount: 8, progressKey: 'earn_coins' },
    { id: 'dc_28', name: 'Middle Path', desc: 'Land 10 balls in center slots', target: 10, rewardType: 'coins', rewardAmount: 2000, progressKey: 'land_center' },
    { id: 'dc_29', name: 'Premium Bins', desc: 'Land 10 balls in high-value slots', target: 10, rewardType: 'gems', rewardAmount: 11, progressKey: 'land_high' },
    { id: 'dc_30', name: 'Mega Drop', desc: 'Drop 300 balls', target: 300, rewardType: 'gems', rewardAmount: 10, progressKey: 'drop_ball' },
    { id: 'dc_31', name: 'Fortune', desc: 'Earn 75K coins', target: 75000, rewardType: 'gems', rewardAmount: 20, progressKey: 'earn_coins' },
    { id: 'dc_32', name: 'Edge Legend', desc: 'Land 20 balls in edge slots', target: 20, rewardType: 'gems', rewardAmount: 15, progressKey: 'land_edge' },
    { id: 'dc_33', name: 'Light Rain', desc: 'Drop 30 balls', target: 30, rewardType: 'coins', rewardAmount: 600, progressKey: 'drop_ball' },
    { id: 'dc_34', name: '15K Coins', desc: 'Earn 15K coins', target: 15000, rewardType: 'coins', rewardAmount: 2500, progressKey: 'earn_coins' },
    { id: 'dc_35', name: 'Center Ace', desc: 'Land 15 balls in center slots', target: 15, rewardType: 'gems', rewardAmount: 8, progressKey: 'land_center' },
    { id: 'dc_36', name: 'High Value', desc: 'Land 12 balls in high-value slots', target: 12, rewardType: 'gems', rewardAmount: 12, progressKey: 'land_high' },
    { id: 'dc_37', name: 'Downpour', desc: 'Drop 150 balls', target: 150, rewardType: 'coins', rewardAmount: 4000, progressKey: 'drop_ball' },
    { id: 'dc_38', name: '40K Earned', desc: 'Earn 40K coins', target: 40000, rewardType: 'gems', rewardAmount: 12, progressKey: 'earn_coins' },
    { id: 'dc_39', name: 'Edge Hunter', desc: 'Land 8 balls in edge slots', target: 8, rewardType: 'coins', rewardAmount: 2500, progressKey: 'land_edge' },
    { id: 'dc_40', name: 'Ball Flood', desc: 'Drop 250 balls', target: 250, rewardType: 'gems', rewardAmount: 8, progressKey: 'drop_ball' },
    { id: 'dc_41', name: '50K Coins', desc: 'Earn 50K coins', target: 50000, rewardType: 'coins', rewardAmount: 8000, progressKey: 'earn_coins' },
    { id: 'dc_42', name: 'Center Pro', desc: 'Land 6 balls in center slots', target: 6, rewardType: 'gems', rewardAmount: 3, progressKey: 'land_center' },
    { id: 'dc_43', name: 'Jackpot Feel', desc: 'Land 6 balls in high-value slots', target: 6, rewardType: 'gems', rewardAmount: 5, progressKey: 'land_high' },
    { id: 'dc_44', name: 'Steady Flow', desc: 'Drop 60 balls', target: 60, rewardType: 'coins', rewardAmount: 1500, progressKey: 'drop_ball' },
    { id: 'dc_45', name: '8K Earned', desc: 'Earn 8K coins', target: 8000, rewardType: 'gems', rewardAmount: 4, progressKey: 'earn_coins' },
    { id: 'dc_46', name: 'Sides', desc: 'Land 4 balls in edge slots', target: 4, rewardType: 'coins', rewardAmount: 1000, progressKey: 'land_edge' },
    { id: 'dc_47', name: 'Center Star', desc: 'Land 20 balls in center slots', target: 20, rewardType: 'gems', rewardAmount: 10, progressKey: 'land_center' },
    { id: 'dc_48', name: 'Elite Bins', desc: 'Land 15 balls in high-value slots', target: 15, rewardType: 'gems', rewardAmount: 14, progressKey: 'land_high' },
    { id: 'dc_49', name: '500 Balls', desc: 'Drop 500 balls', target: 500, rewardType: 'gems', rewardAmount: 25, progressKey: 'drop_ball' },
    { id: 'dc_50', name: '100K Club', desc: 'Earn 100K coins', target: 100000, rewardType: 'gems', rewardAmount: 30, progressKey: 'earn_coins' },
];

function getTodayDateKey() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function getYesterdayDateKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// Call once per game load. Updates weekly streak and grants frenzy token at 7 days.
function processWeeklyLogin() {
    const today = getTodayDateKey();
    if (gameState.lastLoginDateKey === today) return; // Already counted today

    const yesterday = getYesterdayDateKey();
    const last = gameState.lastLoginDateKey;
    let streak = gameState.weeklyLoginStreak || 0;

    if (last === yesterday) {
        streak += 1;
    } else {
        streak = 1; // Missed a day or first time
    }

    const required = (typeof CONFIG !== 'undefined' && CONFIG.WEEKLY_STREAK_DAYS) ? CONFIG.WEEKLY_STREAK_DAYS : 7;
    if (streak >= required) {
        gameState.frenzyTokens = (gameState.frenzyTokens || 0) + 1;
        streak = 0; // Reset so they can earn again next week
    }

    gameState.weeklyLoginStreak = streak;
    gameState.lastLoginDateKey = today;
    saveGame();
}

function ensureDailyChallengeState() {
    const today = getTodayDateKey();
    if (gameState.lastDailyChallengeDate !== today) {
        gameState.lastDailyChallengeDate = today;
        gameState.dailyChallengeProgress = {};
        gameState.dailyChallengesClaimed = {};
    }
}

// Deterministic pick of 3 unique challenges for the day (cycled from pool of 50)
function getTodaysChallenges() {
    ensureDailyChallengeState();
    const today = getTodayDateKey();
    let seed = 0;
    for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i);
    const poolLen = DAILY_CHALLENGE_POOL.length;
    const indices = [];
    for (let i = 0; i < 3; i++) {
        let idx = (seed + i * 17 + i * i * 7) % poolLen;
        while (indices.includes(idx)) idx = (idx + 1) % poolLen;
        indices.push(idx);
    }
    return indices.map(i => ({ ...DAILY_CHALLENGE_POOL[i] }));
}

function isDailyAvailable() {
    if (!gameState.lastDailyClaim) return true;
    const last = new Date(gameState.lastDailyClaim);
    return last.toDateString() !== new Date().toDateString();
}

function claimDaily(event) {
    if (!isDailyAvailable()) return false;

    const dayIndex = (gameState.dailyStreak || 0) % DAILY_REWARDS.length;
    const r = DAILY_REWARDS[dayIndex];

    if (r.type === 'coins') {
        gameState.coins += r.amount;
    } else if (r.type === 'gems') {
        gameState.gems += r.amount;
    } else if (r.type === 'both') {
        gameState.coins += r.coins;
        gameState.gems += r.gems;
    }

    gameState.dailyStreak = (gameState.dailyStreak || 0) + 1;
    gameState.lastDailyClaim = new Date().toISOString();

    saveGame();

    // Visual & Audio feedback
    if (event && event.currentTarget) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        if (typeof spawnConfetti === 'function') spawnConfetti(x, y);
        if (typeof particleBurst === 'function') {
            const color = r.type === 'gems' ? '#00E5FF' : (r.type === 'coins' ? '#FFD740' : '#FF6B81');
            particleBurst(x, y, color, 15);
        }
        if (window.AudioEngine && typeof window.AudioEngine.upgradeBuy === 'function') {
            window.AudioEngine.upgradeBuy();
        }
    }

    return true;
}

// Call this when the player does something that counts toward a challenge. 
function recordDailyProgress(progressKey, amount) {
    if (!progressKey || amount <= 0) return;
    ensureDailyChallengeState();
    const challenges = getTodaysChallenges();
    let anyCompleted = false;
    for (const c of challenges) {
        if (c.progressKey !== progressKey) continue;
        if (gameState.dailyChallengesClaimed[c.id]) continue;

        const cur = gameState.dailyChallengeProgress[c.id] || 0;
        if (cur >= c.target) continue; // Already completed but not yet claimed

        const next = Math.min(c.target, cur + amount);
        gameState.dailyChallengeProgress[c.id] = next;

        if (next >= c.target) {
            anyCompleted = true;
        }
    }
    if (anyCompleted || amount > 0) saveGame();
    if (anyCompleted && typeof updateStatsPanel === 'function') updateStatsPanel();
    if (anyCompleted && typeof renderDailyView === 'function') renderDailyView();
}

function claimDailyChallenge(challengeId, event) {
    const challenges = getTodaysChallenges();
    const c = challenges.find(ch => ch.id === challengeId);
    if (!c) return;

    const p = gameState.dailyChallengeProgress[c.id] || 0;
    if (p < c.target || gameState.dailyChallengesClaimed[c.id]) return;

    // Award reward
    if (c.rewardType === 'coins') gameState.coins += c.rewardAmount;
    else if (c.rewardType === 'gems') gameState.gems += c.rewardAmount;

    gameState.dailyChallengesClaimed[c.id] = true;
    saveGame();

    // Visual & Audio feedback
    if (event && event.currentTarget) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        if (typeof spawnConfetti === 'function') spawnConfetti(x, y);
        if (typeof particleBurst === 'function') {
            const color = c.rewardType === 'gems' ? '#00E5FF' : '#FFD740';
            particleBurst(x, y, color, 12);
        }
        if (window.AudioEngine && typeof window.AudioEngine.upgradeBuy === 'function') {
            window.AudioEngine.upgradeBuy();
        }
    }

    if (typeof updateStatsPanel === 'function') updateStatsPanel();
    renderDailyView();
}

function renderDailyView() {
    const grid = document.getElementById('dailyGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const currentDay = (gameState.dailyStreak || 0) % DAILY_REWARDS.length;
    const available = isDailyAvailable();

    DAILY_REWARDS.forEach((r, i) => {
        const d = document.createElement('div');
        d.className = 'daily-day';

        if (i < currentDay || (i === currentDay && !available)) {
            d.classList.add('claimed');
        } else if (i === currentDay && available) {
            d.classList.add('available');
        } else {
            d.classList.add('locked');
        }

        d.innerHTML = \`
            <div class="daily-day-num">Day \${i + 1}</div>
            <div class="daily-day-icon">\${r.icon}</div>
            <div class="daily-day-reward">\${r.reward}</div>
            \${(i === currentDay && available) ? '<div class="daily-claim-prompt">TAP!</div>' : ''}
        \`;

        if (i === currentDay && available) {
            d.addEventListener('click', (e) => {
                if (claimDaily(e)) {
                    renderDailyView();
                    updateStatsPanel();
                }
            });
        }
        grid.appendChild(d);
    });

    const badge = document.getElementById('dailyBadge');
    if (badge) badge.style.display = (available || hasUnclaimedChallenges()) ? '' : 'none';

    // Weekly Streak & Frenzy Mode (ensure section exists so it's always visible)
    let weeklySection = document.getElementById('weeklyFrenzySection');
    if (!weeklySection) {
        weeklySection = document.createElement('div');
        weeklySection.id = 'weeklyFrenzySection';
        weeklySection.className = 'weekly-frenzy-section';
        const dailyGrid = document.getElementById('dailyGrid');
        if (dailyGrid && dailyGrid.parentNode) {
            dailyGrid.parentNode.insertBefore(weeklySection, dailyGrid);
        }
    }
    const required = (typeof CONFIG !== 'undefined' && CONFIG.WEEKLY_STREAK_DAYS) ? CONFIG.WEEKLY_STREAK_DAYS : 7;
    const streak = gameState.weeklyLoginStreak || 0;
    const tokens = gameState.frenzyTokens || 0;
    const frenzyActive = typeof runtimeState !== 'undefined' && runtimeState.frenzyActive;
    weeklySection.innerHTML = \`
        <div class="category-label">⚡ Frenzy Mode — Weekly Reward</div>
        <div class="weekly-streak-card">
            <div class="weekly-streak-text">Randomized 10-45s of 3× faster drops + FREE high-value balls (100-1K+ coins each). Log in 7 days in a row to earn more.</div>
            <div class="weekly-streak-progress"><span class="weekly-streak-count">\${streak}/\${required}</span> days this week</div>
            \${tokens > 0 && !frenzyActive ? \`
                <button type="button" class="frenzy-activate-btn" id="frenzyActivateBtn">
                    ⚡ Activate Frenzy (\${tokens} left)
                </button>
            \` : frenzyActive ? '<div class="frenzy-active-label">Frenzy active on board!</div>' : '<div class="frenzy-locked-label">Earn more by logging in 7 days in a row</div>'}
        </div>
    \`;
    const btn = document.getElementById('frenzyActivateBtn');
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            var fn = typeof window.triggerFrenzy === 'function' ? window.triggerFrenzy : (typeof triggerFrenzy === 'function' ? triggerFrenzy : null);
            if (!fn) return;
            fn();
            var boardTab = document.querySelector('.tab[data-view="boardView"]');
            if (boardTab) boardTab.click();
            renderDailyView();
            if (typeof updateStatsPanel === 'function') updateStatsPanel();
        });
    }

    // Daily challenges (3 per day from pool of 50)
    const container = document.getElementById('dailyChallenges');
    if (!container) return;
    container.innerHTML = '';
    const challenges = getTodaysChallenges();
    for (const c of challenges) {
        const p = gameState.dailyChallengeProgress[c.id] || 0;
        const claimed = !!gameState.dailyChallengesClaimed[c.id];
        const completed = p >= c.target;
        const pct = Math.min(100, (p / c.target) * 100);
        const rewardStr = c.rewardType === 'gems' ? \`💎 \${c.rewardAmount}\` : \`🪙 \${typeof formatNumber === 'function' ? formatNumber(c.rewardAmount) : c.rewardAmount}\`;

        const card = document.createElement('div');
        let cardClass = 'challenge-card';
        if (claimed) cardClass += ' challenge-claimed';
        else if (completed) cardClass += ' challenge-completed';

        card.className = cardClass;
        card.innerHTML = \`
            <div class="challenge-header">
                <span class="challenge-name">\${claimed ? '✅' : (completed ? '✨' : '🎯')} \${c.name}</span>
                <span class="challenge-reward">\${rewardStr}</span>
            </div>
            <div class="challenge-progress-bar">
                <div class="challenge-progress-fill" style="width:\${pct}%"></div>
            </div>
            <div class="challenge-text">
                \${c.desc} — \${Math.min(p, c.target)}/\${c.target}
                \${claimed ? ' (Claimed)' : (completed ? ' <span class="claim-prompt">— TAP TO CLAIM!</span>' : '')}
            </div>
        \`;

        if (completed && !claimed) {
            card.addEventListener('click', (e) => claimDailyChallenge(c.id, e));
        }

        container.appendChild(card);
    }
}

function hasUnclaimedChallenges() {
    ensureDailyChallengeState();
    const challenges = getTodaysChallenges();
    return challenges.some(c => {
        const p = gameState.dailyChallengeProgress[c.id] || 0;
        const claimed = !!gameState.dailyChallengesClaimed[c.id];
        return p >= c.target && !claimed;
    });
}

</script>
  <script type="text/javascript">/* js/shop.js */
/* ═══════════════════════════════════════════════
   PLINKO∞ — Shop
   ═══════════════════════════════════════════════ */

const SHOP_ITEMS = [
    { id: 'coin_small', icon: '🪙', name: 'Coin Pack S', desc: '5,000 Coins', price: '💎 10', cost: 10, type: 'gems', give: 'coins', amount: 5000 },
    { id: 'coin_med', icon: '💰', name: 'Coin Pack M', desc: '25,000 Coins', price: '💎 40', cost: 40, type: 'gems', give: 'coins', amount: 25000 },
    { id: 'coin_lg', icon: '🏦', name: 'Coin Pack L', desc: '100,000 Coins', price: '💎 120', cost: 120, type: 'gems', give: 'coins', amount: 100000 },
    { id: 'bin_doubler', icon: '🎰', name: 'Bin Doubler', desc: 'Permanently double all bin values', price: '💎 100', cost: 100, type: 'gems', give: 'upgrade' },
    { id: 'drop_doubler', icon: '⚡', name: 'Drop Doubler', desc: 'Permanently double ball drop rate', price: '💎 20', cost: 20, type: 'gems', give: 'upgrade' },
    { id: 'event_extender', icon: '⏱️', name: 'Event Extender', desc: 'All events last +15s (Max 5m)', price: '💎 20', cost: 20, type: 'gems', give: 'upgrade' },
    { id: 'ball_storm', icon: '🌪️', name: 'Ball Storm', desc: '50 balls drop sequentially (Bet: 10)', price: '💎 15', cost: 15, type: 'gems', give: 'storm', amount: 50 },
    { id: 'lucky_pack', icon: '🍀', name: 'Lucky Pack', desc: '10 guaranteed golden balls', price: '💎 20', cost: 20, type: 'gems', give: 'lucky', amount: 10 },
    { id: 'fever_now', icon: '🔥', name: 'Instant Fever', desc: 'Trigger Fever Mode now!', price: '💎 25', cost: 25, type: 'gems', give: 'fever', amount: 1 },
];

function renderShopView() {
    const container = document.getElementById('shopItems');
    if (!container) return;
    container.innerHTML = '';

    // ── Special: Premium + Free in one row (2 columns) ──
    if (window.Monetization) {
        const specialSection = document.createElement('div');
        specialSection.className = 'shop-section';
        specialSection.innerHTML = '<div class="category-label shop-label-special">⭐ Special</div>';
        const specialGrid = document.createElement('div');
        specialGrid.className = 'shop-grid shop-grid-2';

        if (!window.Monetization.isPremium) {
            const noAdsBtn = document.createElement('div');
            noAdsBtn.className = 'shop-item premium-item remove-ads-btn';
            noAdsBtn.innerHTML = \`
                <div class="shop-item-icon">🚫</div>
                <div class="shop-item-name">No Ads</div>
                <div class="shop-item-desc">Remove ads & support dev</div>
                <div class="shop-item-price">$9.99</div>
            \`;
            noAdsBtn.addEventListener('click', () => window.Monetization.purchaseNoAds());
            specialGrid.appendChild(noAdsBtn);
        }
        const watchAdBtn = document.createElement('div');
        watchAdBtn.className = 'shop-item ad-item';
        watchAdBtn.innerHTML = \`
            <div class="shop-item-icon">🎁</div>
            <div class="shop-item-name">Watch Ad</div>
            <div class="shop-item-desc">+50 Balls free</div>
            <div class="shop-item-price">FREE</div>
        \`;
        watchAdBtn.addEventListener('click', () => {
            window.Monetization.showRewardedAd(() => {
                const n = 50;
                const bet = typeof getAffordableBetForBalls === 'function' ? getAffordableBetForBalls(n) : Math.min(gameState.currentBet || 1, Math.max(1, Math.floor((gameState.coins || 0) / n)));
                for (let i = 0; i < n; i++) setTimeout(() => spawnBall(null, 15, false, bet), i * 50);
                alert('Reward: +50 Balls delivered!');
            }, () => alert('Ad cancelled - no reward.'));
        });
        specialGrid.appendChild(watchAdBtn);
        specialSection.appendChild(specialGrid);
        container.appendChild(specialSection);
    }

    // ── Gem Shop ──
    const gemSection = document.createElement('div');
    gemSection.className = 'shop-section';
    gemSection.innerHTML = '<div class="category-label">💎 Gem Shop</div>';

    const grid = document.createElement('div');
    grid.className = 'shop-grid shop-grid-4';

    for (const item of SHOP_ITEMS) {
        // ... (existing item logic)
        const el = document.createElement('div');
        el.className = 'shop-item';
        const affordable = gameState.gems >= item.cost;
        if (!affordable) el.classList.add('shop-item-unaffordable');
        const style = affordable ? '' : '';

        el.innerHTML = \`
      <div class="shop-item-icon">\${item.icon}</div>
      <div class="shop-item-name">\${item.name}</div>
      <div class="shop-item-desc">\${item.desc}</div>
      <div class="shop-item-price" style="\${style}">\${item.price}</div>
    \`;
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
                if (typeof triggerBallStorm === 'function') triggerBallStorm();
            } else if (item.give === 'lucky') {
                const n = item.amount || 10;
                const bet = typeof getAffordableBetForBalls === 'function' ? getAffordableBetForBalls(n) : Math.min(gameState.currentBet || 1, Math.max(1, Math.floor((gameState.coins || 0) / n)));
                for (let i = 0; i < n; i++) {
                    setTimeout(() => spawnBall(null, 15, true, bet), i * 100);
                }
            } else if (item.give === 'fever') {
                if (typeof triggerFever === 'function') triggerFever();
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
    buyGemsGrid.className = 'shop-grid shop-grid-3';

    const GEM_PACKS = [
        { amount: 10, price: '2.99' },
        { amount: 50, price: '12.99' },
        { amount: 100, price: '24.99' }
    ];

    GEM_PACKS.forEach(pack => {
        const el = document.createElement('div');
        el.className = 'shop-item';
        el.innerHTML = \`
            <div class="shop-item-icon">💎</div>
            <div class="shop-item-name">\${pack.amount} Gems</div>
            <div class="shop-item-desc">Premium currency for upgrades</div>
            <div class="shop-item-price">$\${pack.price}</div>
        \`;
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

</script>
  <script type="text/javascript">/* js/audio.js */
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
        if (!this.ctx || !this.enabled) return;

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
        if (!this.ctx || !this.enabled) return;
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
        if (!this.enabled) return;
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
        if (!this.ctx || !this.enabled) return;
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
        if (!this.enabled) return;
        // Quick subtle "cha-ching" or rise
        this.playChime(880, 0.15);
        setTimeout(() => this.playChime(1760, 0.1), 50);
    },

    prestige() {
        // Deep reset sound
        if (!this.ctx || !this.enabled) return;
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

</script>
  <script type="text/javascript">/* js/monetization.js */
/* ═══════════════════════════════════════════════
   PLINKO∞ — Monetization (RevenueCat & Ads)
   ═══════════════════════════════════════════════ */

const Monetization = {
    // Configuration
    REVENUECAT_API_KEY: 'test_FecausrHExPmUXyZUWXPFeFoDNM', // Provided key
    ADSENSE_PUB_ID: 'ca-pub-2818023938860764',
    ADMOB_BANNER_ID_IOS: 'ca-app-pub-2818023938860764/6854620013',
    ADMOB_INTERSTITIAL_ID_IOS: 'ca-app-pub-2818023938860764/5541538346',
    ADMOB_REWARDED_ID_IOS: 'ca-app-pub-2818023938860764/3280937594',
    ENTITLEMENT_ID: 'premium',

    // State
    isPremium: false,
    lastAdTime: 0,
    adTimer: null,
    INTERSTITIAL_INTERVAL: 120000, // 2 minutes

    // RevenueCat Instance
    rc: null,

    init() {
        // Load local state
        const saved = localStorage.getItem('plinko_premium');
        if (saved === 'true') {
            this.isPremium = true;
        }

        // Always update UI (shows/hides banner, etc.)
        this.updateUI();

        // Start intermittent ad timer
        this.startIntermittentAds();

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

    startIntermittentAds() {
        if (this.adTimer) clearInterval(this.adTimer);
        this.adTimer = setInterval(() => {
            const now = Date.now();
            if (!this.isPremium && now - this.lastAdTime > this.INTERSTITIAL_INTERVAL) {
                // Only show if user is active/tab is focused?
                if (document.visibilityState === 'visible') {
                    this.showAd();
                }
            }
        }, 10000); // Check every 10s
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
        const productId = \`gems_\${amount}\`;
        console.log(\`Monetization: Purchasing \${productId} ($\${price})...\`);

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
                const success = confirm(\`Simulate successful purchase of \${amount} Gems?\`);
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

        const banner = document.getElementById('adBanner');
        if (banner) {
            if (this.isPremium) {
                banner.classList.remove('active');
                banner.style.display = 'none';

                // Hide native banner if applicable
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'HIDE_BANNER' }));
                }
            } else {
                banner.classList.add('active');
                banner.style.display = 'flex';

                // Trigger native banner if applicable
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'SHOW_BANNER',
                        adUnitId: this.ADMOB_BANNER_ID_IOS,
                        position: 'bottom'
                    }));
                }
                // Else: we rely on AdSense Auto Ads for web
            }
        }

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

        this.lastAdTime = Date.now();
        console.log('Monetization: Showing Interstitial Ad...');

        // 1. Try Native Bridge (iOS App)
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'SHOW_INTERSTITIAL',
                adUnitId: this.ADMOB_INTERSTITIAL_ID_IOS
            }));

            // Assume success or wait for callback? 
            // For simplicity in hybrid, we often just let the native view take over.
            // But we should probably pause game/sounds.
            if (onComplete) onComplete(true);
            return;
        }

        // 2. Fallback to Web Simulator (or AdSense Auto Ads if they trigger)
        this.createAdOverlay('Interstitial Ad', onComplete);
    },

    showRewardedAd(onReward, onCancel) {
        console.log('Monetization: Showing Rewarded Ad...');

        // 1. Try Native Bridge (iOS App)
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'SHOW_REWARDED',
                adUnitId: this.ADMOB_REWARDED_ID_IOS
            }));

            // Register a one-time listener for the reward callback from native
            // This is a simplified approach; a robust one would handle event IDs.
            const rewardListener = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'REWARDED_AD_COMPLETE') {
                        if (data.rewarded) {
                            if (onReward) onReward();
                        } else {
                            if (onCancel) onCancel();
                        }
                        window.removeEventListener('message', rewardListener);
                    }
                } catch (e) { }
            };
            window.addEventListener('message', rewardListener);
            return;
        }

        // 2. Standard Web Fallback (Simulator)
        // Standard AdSense (pub-only) cannot trigger a real rewarded video easily.
        // We use the simulator to ensure the user gets the functional reward.
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
        overlay.innerHTML = \`
            <div class="ad-content">
                <h2>\${title}</h2>
                <div class="ad-placeholder">
                    [ ADVERTISEMENT ]<br>
                    <small>Simulating 5s duration...</small>
                </div>
                <div class="ad-timer">5</div>
                <button class="ad-close-btn" disabled>Close</button>
            </div>
        \`;
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
                timerEl.textContent = isRewarded ? 'Reward Granted' : 'Ad Completed';
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

</script>
  <script type="text/javascript">/* js/main.js */
/* ═══════════════════════════════════════════════
   PLINKO∞ — Main Game Loop
   ═══════════════════════════════════════════════ */

let lastFrameTime = 0;
let saveTimer = 0;
let uiRefreshTimer = 0;
let cleanupTimer = 0;

// ── Boot sequence ──
function boot() {
    console.log('%c PLINKO∞ ', 'background: linear-gradient(135deg, #c084fc, #38bdf8); color: white; font-size: 18px; font-weight: bold; padding: 8px 16px; border-radius: 8px;');

    // Apply theme (in case script in head didn’t run) and init settings panel
    // Load saved game first so theme/settings are available
    const hadSave = loadGame();

    if (typeof initSettings === 'function') initSettings();

    // Initialize physics
    initPhysics();

    // Initialize renderer
    initRenderer();

    // Initialize audio
    if (window.AudioEngine) window.AudioEngine.init();

    // Initialize monetization
    if (window.Monetization) window.Monetization.init();

    // Build the board
    rebuildBoard();
    resizeCanvas();

    // Render initial UI
    renderDroppers();
    renderQuickUpgrades();
    renderUpgradesView();
    updateStatsPanel();

    // Initialize interactions
    initTabs();
    initPrestigeButton();
    initManualDrop();
    if (typeof initTutorial === 'function') initTutorial();

    if (typeof renderDailyView === 'function') renderDailyView();

    // Hard Reset Handler
    const hardResetBtn = document.getElementById('hardResetBtn');
    if (hardResetBtn) {
        hardResetBtn.addEventListener('click', () => {
            if (confirm('⚠️ HARD RESET ⚠️\\n\\nThis will permanently delete ALL progress, coins, and prestige levels.\\n\\nAre you absolutely sure?')) {
                // Remove save listeners to prevent writing back old data during reload
                // Clear all storage
                localStorage.clear();

                // Clear Service Worker Caches
                if ('caches' in window) {
                    caches.keys().then(names => {
                        for (let name of names) caches.delete(name);
                    });
                }

                // Unregister Service Workers
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(registrations => {
                        for (let registration of registrations) registration.unregister();
                    });
                }

                // Force a hard reload with a reset flag
                window.location.href = window.location.origin + window.location.pathname + '?reset=true';
            }
        });
    }

    // Calculate offline earnings
    if (hadSave) {
        calculateOfflineEarnings();
    }

    // Check daily badge
    if (isDailyAvailable()) {
        const badge = document.getElementById('dailyBadge');
        if (badge) { badge.textContent = '!'; badge.style.display = ''; }
    }

    // Weekly login streak (Frenzy reward)
    if (typeof processWeeklyLogin === 'function') processWeeklyLogin();

    // Start auto-droppers
    startAutoDroppers();

    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        rebuildBoard();
    });

    // ═══ iOS-Specific Handlers ═══

    // Prevent iOS context menu / callout on long-press
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Prevent pull-to-refresh and bounce scrolling
    document.addEventListener('touchmove', (e) => {
        // Allow scrolling inside panel-scroll, side-panel, and allow taps on HUD/tab bar
        if (!e.target.closest('.panel-scroll') && !e.target.closest('.side-panel') && !e.target.closest('.hud') && !e.target.closest('.tab-bar')) {
            e.preventDefault();
        }
    }, { passive: false });

    // Prevent double-tap zoom on iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });

    // Handle app being backgrounded / foregrounded (iOS task switching)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            // App sent to background — save immediately
            gameState.lastOnlineTime = Date.now();
            saveGame();
        } else if (document.visibilityState === 'visible') {
            // App brought back — calculate offline earnings
            calculateOfflineEarnings();
            gameState.lastOnlineTime = Date.now();
            // Restart auto-droppers (timers may have been throttled)
            stopAutoDroppers();
            startAutoDroppers();
            // Rebuild board in case orientation changed
            resizeCanvas();
            rebuildBoard();
        }
    });

    // Handle iOS orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            resizeCanvas();
            rebuildBoard();
        }, 200); // Short delay to let iOS settle the new dimensions
    });

    // Request Wake Lock to prevent screen dimming during gameplay
    requestWakeLock();

    // Start game loop
    lastFrameTime = performance.now();
    requestAnimationFrame(gameLoop);

    // Initialize background effects
    initBackgroundEffects();

    // Periodic save
    setInterval(() => saveGame(), CONFIG.SAVE_INTERVAL);

    // Save on tab close
    window.addEventListener('beforeunload', () => saveGame());

    // Also save on page hide (more reliable on iOS)
    window.addEventListener('pagehide', () => saveGame());

    console.log('Game booted successfully!');
}

// ── Background Effects ──
function initBackgroundEffects() {
    const container = document.getElementById('bgSparkles');
    if (!container) return;

    const count = 30;
    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'bg-sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 3 + 's';
        sparkle.style.animationDuration = 2 + Math.random() * 3 + 's';
        container.appendChild(sparkle);
    }
}

// ── Offline earnings calculation ──
function calculateOfflineEarnings() {
    const lastTime = gameState.lastOnlineTime || gameState.lastSaveTime;
    if (!lastTime) return;

    const now = Date.now();
    const elapsed = now - lastTime;
    const minAway = 60000; // must be away 1+ minutes

    if (elapsed < minAway) return;

    const maxMs = CONFIG.MAX_OFFLINE_HOURS * 3600000;
    const clampedElapsed = Math.min(elapsed, maxMs);
    const offlineRate = getOfflineRate();
    const earned = offlineRate * (clampedElapsed / 1000);

    if (earned > 0) {
        gameState.coins += earned;
        gameState.totalCoinsEarned += earned;
        showOfflineEarnings(earned, clampedElapsed);
    }
}

// ── Main game loop ──
function gameLoop(timestamp) {
    const delta = Math.min(timestamp - lastFrameTime, 50);
    lastFrameTime = timestamp;

    // Update physics
    updatePhysics(delta);

    // Render frame
    renderFrame();

    // Periodic UI updates (every 500ms)
    uiRefreshTimer += delta;
    if (uiRefreshTimer >= 500) {
        uiRefreshTimer = 0;
        updateStatsPanel();
    }

    // Periodic cleanup (every 3s)
    cleanupTimer += delta;
    if (cleanupTimer >= 3000) {
        cleanupTimer = 0;
        cleanupBalls();
        refreshUpgradeUI();
    }

    requestAnimationFrame(gameLoop);
}

// ── Start the game when DOM is ready ──
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}

// ── Wake Lock (prevents screen dimming during gameplay) ──
let wakeLock = null;

async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', () => {
                console.log('Wake Lock released');
            });
            console.log('Wake Lock acquired');
        }
    } catch (err) {
        // Wake lock can fail silently — that's fine
        console.log('Wake Lock not available:', err.message);
    }
}

// Re-acquire wake lock when app comes back to foreground
document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && !wakeLock) {
        await requestWakeLock();
    }
});


</script>

  <!-- Service Worker Registration -->
  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').then(() => {
        console.log('Service Worker registered');
      }).catch(err => console.warn('SW registration failed:', err));
    }
  </script>
</body>

</html>`;