document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Grain Overlay & Smooth Scroll Container
    const grain = document.createElement('div');
    grain.className = 'grain-overlay';
    document.body.appendChild(grain);

    // 2. State Management
    const themeToggle = document.getElementById('theme-toggle');
    const rtlToggle = document.getElementById('rtl-toggle');
    const navbar = document.querySelector('.navbar');
    
    // Initial State Application
    const currentTheme = localStorage.getItem('theme') || 'light';
    const currentDir = localStorage.getItem('dir') || 'ltr';

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    if (currentDir === 'rtl') {
        document.documentElement.setAttribute('dir', 'rtl');
    }

    // Theme logic
    const updateThemeIcon = (isDark) => {
        const icon = themeToggle?.querySelector('i');
        if (icon) {
            icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
        }
    };

    // Apply initial icon
    updateThemeIcon(currentTheme === 'dark');
    
    themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
    });

    // RTL logic
    rtlToggle?.addEventListener('click', () => {
        const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
        const newDir = isRTL ? 'ltr' : 'rtl';
        document.documentElement.setAttribute('dir', newDir);
        localStorage.setItem('dir', newDir);
    });

    // 3. Navbar Scroll State
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // 4. Digital Sand Physics (Canvas)
    class SandParticle {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.reset();
        }

        reset() {
            this.x = Math.random() * this.canvas.width;
            this.y = Math.random() * this.canvas.height;
            this.size = Math.random() * 2 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.color = document.body.classList.contains('dark-mode') ? '#B8A79B' : '#D4C1A5';
        }

        update(mouse) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = 150;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < maxDistance) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 20;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 20;
                }
            }
        }

        draw() {
            this.ctx.fillStyle = this.color;
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }

    // 4. Global Digital Sand Physics Overlay
    const globalSandCanvas = document.createElement('canvas');
    globalSandCanvas.id = 'global-sand-particles';
    globalSandCanvas.style.position = 'fixed';
    globalSandCanvas.style.top = '0';
    globalSandCanvas.style.left = '0';
    globalSandCanvas.style.width = '100vw';
    globalSandCanvas.style.height = '100vh';
    globalSandCanvas.style.pointerEvents = 'none';
    globalSandCanvas.style.zIndex = '9998'; // Above content, below grain
    document.body.appendChild(globalSandCanvas);

    const initGlobalSandEffect = () => {
        const canvas = globalSandCanvas;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 300); // Scale with screen, max 300
            for (let i = 0; i < particleCount; i++) {
                particles.push(new SandParticle(canvas));
            }
        };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        // Touch support for mobile
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        }, { passive: true });

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update(mouse);
                p.draw();
            });
            requestAnimationFrame(animate);
        };

        resize();
        animate();
        window.addEventListener('resize', resize);
    };

    initGlobalSandEffect();

    // 5. Reveal Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        observer.observe(el);
    });
 
    // 6. Back to Top Button (Excluded on specific pages)
    const excludedPages = ['dashboard.html', 'login.html', 'register.html'];
    const isExcluded = excludedPages.some(page => window.location.pathname.includes(page));

    if (!isExcluded) {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTopBtn);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});