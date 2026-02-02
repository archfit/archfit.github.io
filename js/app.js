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
            bullets.push('Strong day for normal training or a quality session.');
            bullets.push('Stay consistent and keep the warm-up solid.');
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

function initLoadDemo() {
    // Load demo is visual-only for this landing page.
    // Bars animate when the tab is activated.
}

function animateLoadChart() {
    const recentBar = document.querySelector('.chart-bar.acute .bar-fill');
    const baselineBar = document.querySelector('.chart-bar.chronic .bar-fill');
    
    if (recentBar && baselineBar) {
        // Keep values arbitrary (visual only).
        recentBar.style.height = '62%';
        baselineBar.style.height = '78%';
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
            if (recoveryRecommendation && intensity && recommendations[intensity]) {
                recoveryRecommendation.textContent = recommendations[intensity];
            }
        });
    });
}

/* ========================================
   Scroll Animations
   ======================================== */

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.vision-card, .tech-card, .feature-card, .principle, .arch-layer'
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
