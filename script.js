document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Custom Cyber Cursor ---
    const cursor = document.querySelector('.cyber-cursor');
    const trail = document.querySelector('.cyber-cursor-trail');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    if (window.matchMedia("(pointer: fine)").matches) {
        let trailX = window.innerWidth / 2;
        let trailY = window.innerHeight / 2;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        const animateTrail = () => {
            trailX += (mouseX - trailX) * 0.15;
            trailY += (mouseY - trailY) * 0.15;
            trail.style.left = trailX + 'px';
            trail.style.top = trailY + 'px';
            requestAnimationFrame(animateTrail);
        };
        animateTrail();

        document.querySelectorAll('a, button, .glass-card, input, textarea, .core-reactor').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    // --- 2. LIVE BACKGROUND 1: Warp Speed Starfield ---
    const warpCanvas = document.getElementById('warpCanvas');
    const wCtx = warpCanvas.getContext('2d');
    warpCanvas.width = window.innerWidth;
    warpCanvas.height = window.innerHeight;

    let stars = [];
    const numStars = 400;
    const centerX = warpCanvas.width / 2;
    const centerY = warpCanvas.height / 2;

    class Star {
        constructor() {
            this.x = Math.random() * warpCanvas.width - centerX;
            this.y = Math.random() * warpCanvas.height - centerY;
            this.z = Math.random() * warpCanvas.width;
            this.pz = this.z;
        }
        update() {
            this.z = this.z - 5; // Speed
            if (this.z < 1) {
                this.z = warpCanvas.width;
                this.x = Math.random() * warpCanvas.width - centerX;
                this.y = Math.random() * warpCanvas.height - centerY;
                this.pz = this.z;
            }
        }
        draw() {
            let sx = (this.x / this.z) * warpCanvas.width + centerX;
            let sy = (this.y / this.z) * warpCanvas.height + centerY;
            let px = (this.x / this.pz) * warpCanvas.width + centerX;
            let py = (this.y / this.pz) * warpCanvas.height + centerY;

            this.pz = this.z;

            wCtx.beginPath();
            wCtx.moveTo(px, py);
            wCtx.lineTo(sx, sy);
            wCtx.strokeStyle = `rgba(176, 0, 255, ${1 - this.z / warpCanvas.width})`; // Purple hue
            wCtx.lineWidth = (1 - this.z / warpCanvas.width) * 3;
            wCtx.stroke();
        }
    }
    for (let i = 0; i < numStars; i++) stars.push(new Star());

    const animateWarp = () => {
        wCtx.fillStyle = 'rgba(2, 2, 4, 0.4)'; // Trail effect
        wCtx.fillRect(0, 0, warpCanvas.width, warpCanvas.height);
        stars.forEach(star => { star.update(); star.draw(); });
        requestAnimationFrame(animateWarp);
    };
    animateWarp();

    // --- 3. LIVE BACKGROUND 2: Interactive Cyber Network ---
    const netCanvas = document.getElementById('networkCanvas');
    const nCtx = netCanvas.getContext('2d');
    netCanvas.width = window.innerWidth;
    netCanvas.height = window.innerHeight;

    let particles = [];
    const numParticles = Math.min(100, window.innerWidth / 15);

    class Particle {
        constructor() {
            this.x = Math.random() * netCanvas.width;
            this.y = Math.random() * netCanvas.height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.radius = Math.random() * 2 + 1;
        }
        update() {
            // Move
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off walls
            if (this.x < 0 || this.x > netCanvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > netCanvas.height) this.vy *= -1;

            // Mouse interaction (repel)
            let dx = mouseX - this.x;
            let dy = mouseY - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                this.x -= dx * 0.05;
                this.y -= dy * 0.05;
            }
        }
        draw() {
            nCtx.beginPath();
            nCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            nCtx.fillStyle = '#00e5ff';
            nCtx.fill();
        }
    }
    for (let i = 0; i < numParticles; i++) particles.push(new Particle());

    const animateNetwork = () => {
        nCtx.clearRect(0, 0, netCanvas.width, netCanvas.height);
        
        particles.forEach(p => { p.update(); p.draw(); });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    nCtx.beginPath();
                    nCtx.strokeStyle = `rgba(0, 229, 255, ${1 - distance/120})`;
                    nCtx.lineWidth = 1;
                    nCtx.moveTo(particles[i].x, particles[i].y);
                    nCtx.lineTo(particles[j].x, particles[j].y);
                    nCtx.stroke();
                }
            }
            
            // Connect to mouse
            let mDx = particles[i].x - mouseX;
            let mDy = particles[i].y - mouseY;
            let mDist = Math.sqrt(mDx * mDx + mDy * mDy);
            if(mDist < 200) {
                nCtx.beginPath();
                nCtx.strokeStyle = `rgba(176, 0, 255, ${1 - mDist/200})`; // Purple to mouse
                nCtx.lineWidth = 1.5;
                nCtx.moveTo(particles[i].x, particles[i].y);
                nCtx.lineTo(mouseX, mouseY);
                nCtx.stroke();
            }
        }
        requestAnimationFrame(animateNetwork);
    };
    animateNetwork();

    // --- 4. LIVE Hacker Terminal Logs ---
    const termContainer = document.getElementById('liveTerminalLogs');
    const techPhrases = [
        "Establishing secure socket...",
        "Bypassing firewall protocols [OK]",
        "Decrypting RC5 payload...",
        "Executing SQL injection mitigation",
        "Analyzing DBMS Normalization schemas",
        "Routing through proxy node 7A...",
        "Graph theory matrices compiling...",
        "GATE CS parameters loaded [477]",
        "Connection stabilized at IIT Bhilai",
        "Warning: Intrusion detected. Rerouting..."
    ];

    setInterval(() => {
        const p = document.createElement('p');
        p.className = 'log-line';
        const time = new Date().toISOString().split('T')[1].slice(0,-1);
        p.innerText = `[${time}] ${techPhrases[Math.floor(Math.random() * techPhrases.length)]}`;
        termContainer.appendChild(p);
        if (termContainer.childElementCount > 15) {
            termContainer.removeChild(termContainer.firstChild);
        }
    }, 1200);

    // Handle Window Resize
    window.addEventListener('resize', () => {
        warpCanvas.width = window.innerWidth;
        warpCanvas.height = window.innerHeight;
        netCanvas.width = window.innerWidth;
        netCanvas.height = window.innerHeight;
    });

    // --- 5. Mobile Navbar ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    const icon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-xmark');
        });
    });

    // --- 6. Cyber Form Submission ---
    const queryForm = document.getElementById('queryForm');
    const formStatus = document.getElementById('formStatus');

    queryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        formStatus.textContent = "UPLOADING DATA PAYLOAD TO MAINFRAME...";
        formStatus.className = "form-status";
        formStatus.classList.remove('hidden');

        const btn = queryForm.querySelector('button');
        const ogText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ENCRYPTING...';
        
        setTimeout(() => {
            formStatus.innerHTML = `[ <i class="fa-solid fa-check"></i> UPLOAD COMPLETE. PING SUCCESSFUL. ]`;
            queryForm.reset();
            btn.innerHTML = ogText;
        }, 2500);
    });
});
