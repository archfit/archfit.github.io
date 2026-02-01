/**
 * ArchFit Landing Page - Interactive JavaScript
 * Handles animations, demos, and user interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    initDynamicDate();
    initAnimatedCounters();
    initDemoTabs();
    initReadinessDemo();
    initACWRDemo();
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
   Animated Counters
   ======================================== */

function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startValue + (target - startValue) * easeOut);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
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
        });
    });
}

/* ========================================
   Readiness Demo
   ======================================== */

function initReadinessDemo() {
    const sleepSlider = document.getElementById('sleepSlider');
    const hrvSlider = document.getElementById('hrvSlider');
    const hrSlider = document.getElementById('hrSlider');
    const loadSlider = document.getElementById('loadSlider');
    
    const sleepValue = document.getElementById('sleepValue');
    const hrvValueEl = document.getElementById('hrvValue');
    const hrValueEl = document.getElementById('hrValue');
    const loadValueEl = document.getElementById('loadValue');
    
    const demoScore = document.getElementById('demoScore');
    const demoStatus = document.getElementById('demoStatus');
    const resultProgress = document.getElementById('resultProgress');
    
    const factorBars = document.querySelectorAll('.factor-bar .factor-fill');
    const factorValues = document.querySelectorAll('.factor-bar .factor-value');
    
    function calculateReadiness() {
        const sleep = parseFloat(sleepSlider.value);
        const hrv = parseInt(hrvSlider.value);
        const hr = parseInt(hrSlider.value);
        const load = parseInt(loadSlider.value);
        
        // Update display values
        sleepValue.textContent = sleep + 'h';
        hrvValueEl.textContent = hrv;
        hrValueEl.textContent = hr;
        loadValueEl.textContent = load;
        
        // Calculate readiness score (simplified algorithm)
        const sleepScore = Math.min((sleep / 8) * 100, 100);
        const hrvScore = Math.min((hrv / 50) * 100, 100);
        const loadScore = Math.max(100 - (load / 6), 0);
        const hrScore = Math.min((80 - hr) / 30 * 100, 100);
        
        const readiness = Math.round(
            sleepScore * 0.35 + 
            hrvScore * 0.30 + 
            loadScore * 0.20 + 
            hrScore * 0.15
        );
        
        // Update score display
        animateValue(demoScore, parseInt(demoScore.textContent), readiness, 300);
        
        // Update progress ring
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (readiness / 100) * circumference;
        resultProgress.style.strokeDashoffset = offset;
        
        // Update color based on score
        let color, status;
        if (readiness >= 80) {
            color = '#34C759';
            status = 'Optimal';
        } else if (readiness >= 60) {
            color = '#007AFF';
            status = 'Good';
        } else if (readiness >= 40) {
            color = '#FF9500';
            status = 'Moderate';
        } else {
            color = '#FF3B30';
            status = 'Low';
        }
        
        resultProgress.style.stroke = color;
        demoStatus.textContent = status;
        demoStatus.style.background = color + '20';
        demoStatus.style.color = color;
        
        // Update factor bars
        factorBars[0].style.width = sleepScore + '%';
        factorBars[1].style.width = hrvScore + '%';
        factorBars[2].style.width = loadScore + '%';
        
        factorValues[0].textContent = Math.round(sleepScore) + '%';
        factorValues[1].textContent = Math.round(hrvScore) + '%';
        factorValues[2].textContent = Math.round(loadScore) + '%';
    }
    
    // Add event listeners
    [sleepSlider, hrvSlider, hrSlider, loadSlider].forEach(slider => {
        slider.addEventListener('input', calculateReadiness);
    });
    
    // Initialize
    calculateReadiness();
}

/* ========================================
   ACWR Demo
   ======================================== */

function initACWRDemo() {
    // ACWR demo is visual-only for this landing page
    // Animated bars on tab switch
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.classList.contains('active')) {
                animateACWRChart();
            }
        });
    });
    
    const acwrPanel = document.getElementById('acwr-demo');
    if (acwrPanel) {
        observer.observe(acwrPanel);
    }
}

function animateACWRChart() {
    const acuteBar = document.querySelector('.chart-bar.acute .bar-fill');
    const chronicBar = document.querySelector('.chart-bar.chronic .bar-fill');
    
    if (acuteBar && chronicBar) {
        acuteBar.style.height = '60%';
        chronicBar.style.height = '80%';
    }
}

/* ========================================
   Recovery Demo
   ======================================== */

function initRecoveryDemo() {
    const recoveryButtons = document.querySelectorAll('.recovery-btn');
    const timelineProgress = document.getElementById('timelineProgress');
    const recoveryTimeMarker = document.getElementById('recoveryTimeMarker');
    const recoveryRecommendation = document.getElementById('recoveryRecommendation');
    
    const recommendations = {
        light: 'Light activity recommended. Your recovery is nearly complete. Consider an easy recovery session.',
        moderate: 'Moderate workout is ideal. Your body has recovered sufficiently for normal training.',
        hard: 'Hard training is an option, but ensure proper warm-up. Monitor your recovery metrics closely.',
        extreme: 'Extreme caution advised. Your body needs more recovery time. Consider active recovery only.'
    };
    
    recoveryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const intensity = this.dataset.intensity;
            const time = parseInt(this.dataset.time);
            
            // Update active state
            recoveryButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update timeline
            const progress = (time / 48) * 100;
            timelineProgress.style.width = progress + '%';
            recoveryTimeMarker.textContent = time + 'h';
            
            // Update recommendation
            recoveryRecommendation.textContent = recommendations[intensity];
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
   Smooth Scroll Reveal
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
   Parallax Effects
   ======================================== */

function initParallax() {
    const orbs = document.querySelectorAll('.gradient-orb');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        orbs.forEach((orb, index) => {
            const speed = 0.1 + (index * 0.05);
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

initParallax();

/* ========================================
   Button Hover Effects
   ======================================== */

document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

/* ========================================
   Card Hover Effects
   ======================================== */

document.querySelectorAll('.vision-card, .tech-card, .feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

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
    
    // Create mobile menu button if it doesn't exist
    if (!document.querySelector('.mobile-menu-btn') && window.innerWidth <= 768) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background: var(--gray-100);
            border: none;
            border-radius: var(--radius-md);
            font-size: 1.25rem;
            color: var(--gray-700);
            cursor: pointer;
        `;
        
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
        });
        
        navbar.querySelector('.nav-actions').before(menuBtn);
        
        // Add mobile styles
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .nav-links {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: var(--white);
                    flex-direction: column;
                    padding: var(--space-md);
                    display: none;
                    box-shadow: var(--shadow-lg);
                }
                
                .nav-links.mobile-open {
                    display: flex;
                }
                
                .nav-link {
                    width: 100%;
                    padding: var(--space-md);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

initMobileMenu();
window.addEventListener('resize', initMobileMenu);
