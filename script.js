// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Observe cards individually for staggered effect
document.querySelectorAll('.project-card, .skill-category, .stat, .timeline-item, .contact-card').forEach((el, index) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(el);
});

// Parallax effect for hero gradient
window.addEventListener('scroll', () => {
    const heroGradient = document.querySelector('.hero::before');
    if (heroGradient) {
        const scrolled = window.scrollY;
        heroGradient.style.transform = `rotate(${scrolled * 0.1}deg) scale(1.1)`;
    }
});

// Cursor trail effect (optional, modern touch)
const createCursorTrail = () => {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateTrail = () => {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        
        requestAnimationFrame(animateTrail);
    };

    animateTrail();
};

// Only create cursor trail on desktop
if (window.innerWidth > 768) {
    // Disabled by default, uncomment to enable:
    // createCursorTrail();
}

// Add glow effect to hovered links
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// Dynamic year in footer
const footerYear = document.querySelector('.footer p');
if (footerYear) {
    footerYear.innerHTML = footerYear.innerHTML.replace('2026', new Date().getFullYear());
}

// Typing effect for hero subtitle (optional)
const subtitleElement = document.querySelector('.hero-subtitle');
if (subtitleElement && false) { // Set to true to enable
    const originalText = subtitleElement.textContent;
    subtitleElement.textContent = '';
    let charIndex = 0;

    const typeChar = () => {
        if (charIndex < originalText.length) {
            subtitleElement.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, 50);
        }
    };

    setTimeout(typeChar, 500);
}

// Stats counter animation
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        const increment = target / 50;
        let current = 0;
        
        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target + (stat.textContent.includes('+') ? '+' : '');
            }
        };
        
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statObserver.observe(stat.closest('.stat'));
    });
};

animateStats();

// Add floating animation to hero elements
const addFloatingAnimation = () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        let position = 0;
        const float = () => {
            position += 0.01;
            heroContent.style.transform = `translateY(${Math.sin(position) * 10}px)`;
            requestAnimationFrame(float);
        };
        float();
    }
};

addFloatingAnimation();

// Console easter egg
console.log('%c🤖 Portfolio by Evaristo Saá', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cBuilt with OpenClaw + Modern Web Technologies', 'font-size: 14px; color: #8b5cf6;');
console.log('%c💼 Looking for opportunities? Let\'s connect!', 'font-size: 14px; color: #10b981;');

// Performance: Lazy load images (if any added later)
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for older browsers
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}
