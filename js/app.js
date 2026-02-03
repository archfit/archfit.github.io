/**
 * ArchFit Landing Page - Interactive JavaScript
 * Handles animations, demos, and user interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    initDynamicDate();
    initDemoTabs();
    initReadinessDemo();
    initLoadDemo();
    initRecoveryDemo();
    initPrinciples();
    initScrollAnimations();
    initNavigation();
}

/* ========================================
   Dynamic Date
   ======================================== */

function initDynamicDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

/* ========================================
   Demo Tabs
   ======================================== */

function initDemoTabs() {
    const tabs = document.querySelectorAll('.demo-tab');
    const panels = document.querySelectorAll('.demo-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetDemo = this.dataset.demo;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show target panel
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetDemo + '-demo') {
                    panel.classList.add('active');
                }
            });

            handleDemoPanelActivated(targetDemo);
        });
    });

    // Ensure first panel gets any activation logic.
    const activeTab = document.querySelector('.demo-tab.active');
    if (activeTab) {
        handleDemoPanelActivated(activeTab.dataset.demo);
    }
}

function handleDemoPanelActivated(demoKey) {
    if (demoKey === 'load') {
        animateLoadChart();
    }
}

/* ========================================
   Readiness Demo
   ======================================== */

function initReadinessDemo() {
    const demoScore = document.getElementById('demoScore');
    const demoStatus = document.getElementById('demoStatus');
    const readinessBullets = document.getElementById('readinessBullets');
    const resultProgress = document.getElementById('resultProgress');
    const choiceButtons = document.querySelectorAll('.choice-btn');

    if (!demoScore || !demoStatus || !readinessBullets || !resultProgress || choiceButtons.length === 0) {
        return;
    }

    const state = {
        goal: getActiveChoiceValue('goal') || 'maintain',
        sleep: getActiveChoiceValue('sleep') || 'typical',
        recovery: getActiveChoiceValue('recovery') || 'typical',
        load: getActiveChoiceValue('load') || 'typical',
        stress: getActiveChoiceValue('stress') || 'typical'
    };

    function getPoints(value, positiveWhenHigh = true) {
        if (value === 'typical') return 1;
        if (value === 'high') return positiveWhenHigh ? 2 : 0;
        if (value === 'low') return positiveWhenHigh ? 0 : 2;
        return 1;
    }

    function getActiveChoiceValue(choiceKey) {
        const btn = document.querySelector(`.choice-btn.active[data-choice="${choiceKey}"]`);
        return btn ? btn.dataset.value : null;
    }

    function setActiveButton(clickedBtn) {
        const group = clickedBtn.closest('.choice-buttons');
        if (!group) return;
        group.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('active'));
        clickedBtn.classList.add('active');
    }

    function computeReadiness() {
        // Intentionally qualitative: no visible weights, no numeric internals.
        const sleepPts = getPoints(state.sleep, true);
        const recoveryPts = getPoints(state.recovery, true);
        const loadPts = getPoints(state.load, false); // heavy load reduces readiness
        const stressPts = getPoints(state.stress, false); // high stress reduces readiness

        const total = sleepPts + recoveryPts + loadPts + stressPts; // 0..8

        if (total >= 7) return { label: 'Great', status: 'Great', color: '#34C759', percent: 86 };
        if (total >= 5) return { label: 'Good', status: 'Good', color: '#007AFF', percent: 72 };
        if (total >= 3) return { label: 'Moderate', status: 'Moderate', color: '#FF9500', percent: 52 };
        return { label: 'Low', status: 'Low', color: '#FF3B30', percent: 34 };
    }

    function render() {
        const result = computeReadiness();

        demoScore.textContent = result.label;
        demoStatus.textContent = result.status;
        demoStatus.style.background = result.color + '20';
        demoStatus.style.color = result.color;
        resultProgress.style.stroke = result.color;

        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (result.percent / 100) * circumference;
        resultProgress.style.strokeDashoffset = offset;

        // Bullet guidance: keep it non-technical and high level.
        const bullets = [];

        if (result.status === 'Great') {
            bullets.push('Strong day to move your goal forward.');
            bullets.push('Keep the warm-up solid and stay consistent.');
        } else if (result.status === 'Good') {
            bullets.push('Good day for normal training.');
            bullets.push('If you’re unsure, start easy and build.');
        } else if (result.status === 'Moderate') {
            bullets.push('Consider an easier session or shorter intensity.');
            bullets.push('Prioritize sleep, hydration, and an extended warm-up.');
        } else {
            bullets.push('Keep it light today — recovery-focused work is best.');
            bullets.push('Aim for a calm day: movement, mobility, early night.');
        }

        // Add one contextual nudge without exposing calculations.
        if (state.sleep === 'low') bullets[0] = 'Short sleep: keep intensity conservative today.';
        if (state.recovery === 'low') bullets[0] = 'Recovery signals look down: favor light training today.';
        if (state.load === 'high') bullets[0] = 'Recent training is heavy: consider a lighter day.';
        if (state.stress === 'high') bullets[0] = 'High stress: keep training simple and controlled.';

        if (state.goal === 'build') {
            bullets[1] = 'Build steadily: add small progress, avoid spikes.';
        }
        if (state.goal === 'maintain') {
            bullets[1] = 'Maintain the habit: keep today simple and repeatable.';
        }
        if (state.goal === 'peak') {
            bullets[1] = 'Save higher intensity for your best readiness day.';
        }

        readinessBullets.innerHTML = bullets.slice(0, 2).map(t => `<li>${t}</li>`).join('');
    }

    choiceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setActiveButton(btn);
            const choiceKey = btn.dataset.choice;
            const value = btn.dataset.value;
            if (choiceKey && value) {
                state[choiceKey] = value;
                render();
            }
        });
    });

    render();
}

/* ========================================
   Load Demo
   ======================================== */

let updateLoadDemo = null;

function initLoadDemo() {
    const sessionsRange = document.getElementById('sessionsRange');
    const intensityRange = document.getElementById('intensityRange');
    const sessionsValue = document.getElementById('sessionsValue');
    const intensityValue = document.getElementById('intensityValue');
    const recentBar = document.querySelector('.chart-bar.acute .bar-fill');
    const baselineBar = document.querySelector('.chart-bar.chronic .bar-fill');
    const loadStatus = document.getElementById('loadStatus');
    const zones = document.querySelectorAll('.load-zone');

    if (!sessionsRange || !intensityRange || !sessionsValue || !intensityValue || !recentBar || !baselineBar || !loadStatus) {
        return;
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function intensityLabel(value) {
        if (value === 1) return 'Easy';
        if (value === 3) return 'Hard';
        return 'Steady';
    }

    function update() {
        const sessions = parseInt(sessionsRange.value, 10);
        const intensity = parseInt(intensityRange.value, 10);

        sessionsValue.textContent = String(sessions);
        intensityValue.textContent = intensityLabel(intensity);

        const recent = clamp(30 + sessions * 8 + intensity * 6, 35, 95);
        const baseline = clamp(50 + intensity * 10 + (sessions - 4) * 4, 45, 90);

        recentBar.style.height = `${recent}%`;
        baselineBar.style.height = `${baseline}%`;

        let statusKey = 'balanced';
        if (recent > baseline + 8) statusKey = 'overreaching';
        if (recent < baseline - 8) statusKey = 'building';

        const statusLabels = {
            balanced: { label: 'Balanced', color: '#22C55E' },
            building: { label: 'Building', color: '#F59E0B' },
            overreaching: { label: 'Overreaching', color: '#EF4444' }
        };

        const status = statusLabels[statusKey];
        loadStatus.textContent = status.label;
        loadStatus.style.color = status.color;

        zones.forEach(zone => {
            const key = zone.dataset.zone;
            zone.classList.toggle('is-active', key === statusKey);
        });
    }

    sessionsRange.addEventListener('input', update);
    intensityRange.addEventListener('input', update);
    update();
    updateLoadDemo = update;
}

function animateLoadChart() {
    if (typeof updateLoadDemo === 'function') {
        updateLoadDemo();
    }
}

/* ========================================
   Recovery Demo
   ======================================== */

function initRecoveryDemo() {
    const recoveryButtons = document.querySelectorAll('.recovery-btn');
    const timelineFill = document.getElementById('timelineFill');
    const recoveryTimeMarker = document.getElementById('recoveryTimeMarker');
    const recoveryRecommendation = document.getElementById('recoveryRecommendation');
    const metaButtons = document.querySelectorAll('.meta-btn');
    
    const recommendations = {
        light: 'Light activity recommended. Your recovery is nearly complete. Consider an easy recovery session.',
        moderate: 'Moderate workout is ideal. Your body has recovered sufficiently for normal training.',
        hard: 'Hard training is an option, but ensure proper warm-up. Monitor your recovery metrics closely.',
        extreme: 'Extreme caution advised. Your body needs more recovery time. Consider active recovery only.'
    };

    const timingLabel = {
        soon: 'Soon',
        later: 'Later',
        tomorrow: 'Tomorrow',
        multi: 'Later'
    };

    const timingPercent = {
        soon: 35,
        later: 55,
        tomorrow: 75,
        multi: 92
    };

    let timeMinutes = 20;

    function updateRecommendation(intensity) {
        if (!recoveryRecommendation || !intensity) return;

        const base = recommendations[intensity] ?? recommendations.moderate;
        let timeNote = 'Aim for a compact session with a long warm-up.';

        if (timeMinutes >= 45) {
            timeNote = 'You have time — add easy volume and finish with mobility.';
        } else if (timeMinutes >= 30) {
            timeNote = 'Steady session fits well with a focused warm-up.';
        }

        recoveryRecommendation.textContent = `${base} ${timeNote}`;
    }
    
    recoveryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const intensity = this.dataset.intensity;
            const timeKey = this.dataset.time;
            
            // Update active state
            recoveryButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update timeline
            const progress = timingPercent[timeKey] ?? 55;
            if (timelineFill) timelineFill.style.width = progress + '%';
            if (recoveryTimeMarker) recoveryTimeMarker.textContent = timingLabel[timeKey] ?? 'Later';
            
            // Update recommendation
            updateRecommendation(intensity);
        });
    });

    metaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            metaButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            timeMinutes = parseInt(btn.dataset.minutes ?? '20', 10);

            const activeRecovery = document.querySelector('.recovery-btn.active');
            updateRecommendation(activeRecovery ? activeRecovery.dataset.intensity : 'moderate');
        });
    });

    const activeRecovery = document.querySelector('.recovery-btn.active');
    updateRecommendation(activeRecovery ? activeRecovery.dataset.intensity : 'moderate');
}

/* ========================================
   Principles Interaction
   ======================================== */

function initPrinciples() {
    const cards = document.querySelectorAll('.principle-card');
    if (cards.length === 0) return;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const nextActive = !card.classList.contains('is-active');
            cards.forEach(c => {
                c.classList.remove('is-active');
                c.setAttribute('aria-expanded', 'false');
                const extra = c.querySelector('.principle-extra');
                if (extra) extra.setAttribute('aria-hidden', 'true');
            });

            if (nextActive) {
                card.classList.add('is-active');
                card.setAttribute('aria-expanded', 'true');
                const extra = card.querySelector('.principle-extra');
                if (extra) extra.setAttribute('aria-hidden', 'false');
            }
        });
    });
}

/* ========================================
   Scroll Animations
   ======================================== */

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.vision-card, .tech-card, .feature-card, .principle-card, .arch-layer'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
}

/* ========================================
   Navigation
   ======================================== */

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav on scroll
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(section => navObserver.observe(section));
}

/* ========================================
   Utility Functions
   ======================================== */

function animateValue(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 2);
        const current = Math.round(start + range * easeProgress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/* ========================================
   Smooth Scroll Reveal (unused helpers)
   ======================================== */

function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 150;
        
        if (revealTop < windowHeight - revealPoint) {
            reveal.classList.add('revealed');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

/* ========================================
   Loading Animation
   ======================================== */

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger hero animations
    const heroBadge = document.querySelector('.hero-badge');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroStats = document.querySelector('.hero-stats');
    const heroActions = document.querySelector('.hero-actions');
    
    if (heroBadge) {
        heroBadge.style.opacity = '0';
        setTimeout(() => {
            heroBadge.style.transition = 'opacity 0.5s ease';
            heroBadge.style.opacity = '1';
        }, 100);
    }
    
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 0.5s ease';
            heroTitle.style.opacity = '1';
        }, 200);
    }
    
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        setTimeout(() => {
            heroSubtitle.style.transition = 'opacity 0.5s ease';
            heroSubtitle.style.opacity = '1';
        }, 400);
    }
    
    if (heroStats) {
        heroStats.style.opacity = '0';
        setTimeout(() => {
            heroStats.style.transition = 'opacity 0.5s ease';
            heroStats.style.opacity = '1';
        }, 600);
    }
    
    if (heroActions) {
        heroActions.style.opacity = '0';
        setTimeout(() => {
            heroActions.style.transition = 'opacity 0.5s ease';
            heroActions.style.opacity = '1';
        }, 800);
    }
});

/* ========================================
   Mobile Menu Toggle (for smaller screens)
   ======================================== */

function initMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    if (!navbar || !navLinks || !navActions) return;
    
    const isMobile = window.innerWidth <= 768;
    let menuBtn = document.querySelector('.mobile-menu-btn');

    if (!isMobile) {
        if (menuBtn) menuBtn.remove();
        navLinks.classList.remove('mobile-open');
        navActions.classList.remove('mobile-actions-hidden');
        return;
    }

    // Create mobile menu button if it doesn't exist
    if (!menuBtn) {
        menuBtn = document.createElement('button');
        menuBtn.type = 'button';
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.setAttribute('aria-label', 'Toggle navigation menu');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('mobile-open');
            menuBtn.setAttribute('aria-expanded', String(isOpen));
        });

        // Close on nav item click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Close when tapping outside
        document.addEventListener('click', (e) => {
            if (!navLinks.classList.contains('mobile-open')) return;
            const target = e.target;
            if (target instanceof Node && (navbar.contains(target))) return;
            navLinks.classList.remove('mobile-open');
            menuBtn.setAttribute('aria-expanded', 'false');
        });

        navActions.before(menuBtn);
    }
}

initMobileMenu();
window.addEventListener('resize', initMobileMenu);
