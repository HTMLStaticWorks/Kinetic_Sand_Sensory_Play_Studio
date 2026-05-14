document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const rtlToggle = document.getElementById('rtl-toggle');
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        bodyElement.classList.add('dark-mode');
    }

    // Initialize RTL from localStorage
    const savedRTL = localStorage.getItem('rtl');
    if (savedRTL === 'true') {
        htmlElement.setAttribute('dir', 'rtl');
    } else {
        htmlElement.setAttribute('dir', 'ltr');
    }

    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            bodyElement.classList.toggle('dark-mode');
            if (bodyElement.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // RTL toggle functionality
    if (rtlToggle) {
        rtlToggle.addEventListener('click', () => {
            if (htmlElement.getAttribute('dir') === 'rtl') {
                htmlElement.setAttribute('dir', 'ltr');
                localStorage.setItem('rtl', 'false');
            } else {
                htmlElement.setAttribute('dir', 'rtl');
                localStorage.setItem('rtl', 'true');
            }
        });
    }

    // Parallax effect for elements with .parallax-bg
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    let tickingParallax = false;

    function applyParallax() {
        parallaxElements.forEach(element => {
            const speed = 0.5; // Adjust parallax speed
            const yPos = -(window.scrollY * speed);
            element.style.backgroundPositionY = `${yPos}px`;
        });
        tickingParallax = false;
    }

    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            if (!tickingParallax) {
                window.requestAnimationFrame(applyParallax);
                tickingParallax = true;
            }
        });
        window.addEventListener('resize', () => {
            if (!tickingParallax) {
                window.requestAnimationFrame(applyParallax);
                tickingParallax = true;
            }
        });
        applyParallax(); // Apply on load
    }

    // Floating Particles Effect
    class Particle {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = 'rgba(255, 255, 255, 0.8)'; // White particles
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.size > 0.2) this.size -= 0.01;

            if (this.x > this.canvas.width || this.x < 0) {
                this.speedX *= -1;
            }
            if (this.y > this.canvas.height || this.y < 0) {
                this.speedY *= -1;
            }
        }

        draw() {
            this.ctx.fillStyle = this.color;
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    function initParticles(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

        let particlesArray = [];
        const numberOfParticles = 100;

        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle(canvas));
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            particlesArray = []; // Reinitialize particles on resize
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle(canvas));
            }
        });

        animateParticles();
    }

    initParticles('hero-particles');
    initParticles('hero-particles-2');

    // Smooth Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal-item');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the item needs to be visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });
});