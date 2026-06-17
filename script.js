document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SMART ANIMATION INJECTOR (No HTML changes needed!)
    // This automatically finds your sections and makes them animate on scroll.
    const sectionsToAnimate = document.querySelectorAll('.hero-content, .education-card, .section-title-wrapper, .guide-card, .contact-info, .contact-form-wrapper');
    
    sectionsToAnimate.forEach((element, index) => {
        element.classList.add('animate-on-scroll');
        // Add a slight delay to grid items so they load sequentially
        if (element.classList.contains('guide-card')) {
            if (index % 3 === 1) element.classList.add('delay-1');
            if (index % 3 === 2) element.classList.add('delay-2');
        }
    });

    // 2. INTERSECTION OBSERVER (Triggers the animations when visible)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // 3. Mobile Menu Functionality
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');

    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-xmark');
        });
    });

    // 4. Dynamic Real-time Tech News Feed API
    const fetchTechNews = async () => {
        const newsContainer = document.getElementById('news-container');
        try {
            const response = await fetch('https://dev.to/api/articles?tag=computerscience&per_page=3');
            if (!response.ok) throw new Error('Network failed.');
            
            const articles = await response.json();
            newsContainer.innerHTML = ''; 

            articles.forEach((article, index) => {
                const card = document.createElement('div');
                card.className = `article-card animate-on-scroll`;
                if (index === 1) card.classList.add('delay-1');
                if (index === 2) card.classList.add('delay-2');
                
                const tagsHTML = article.tag_list.slice(0, 3).map(tag => `<span class="tag">#${tag}</span>`).join('');

                card.innerHTML = `
                    <div>
                        <div class="article-tags">${tagsHTML}</div>
                        <h3>${escapeHTML(article.title)}</h3>
                        <p>${escapeHTML(article.description || 'Click read more.')}</p>
                    </div>
                    <a href="${article.url}" target="_blank" class="article-link">Read Article <i class="fa-solid fa-arrow-right"></i></a>
                `;
                newsContainer.appendChild(card);
                observer.observe(card); // Animate dynamically loaded cards
            });
        } catch (error) {
            console.error('API Error:', error);
            newsContainer.innerHTML = '<p style="color:var(--text-light)">Failed to load news feed. Please try again later.</p>';
        }
    };

    const escapeHTML = (str) => {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    };

    fetchTechNews();

    // 5. Contact Form Simulation
    const queryForm = document.getElementById('queryForm');
    const formStatus = document.getElementById('formStatus');

    queryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        formStatus.textContent = "Processing...";
        formStatus.className = "form-status success";
        formStatus.classList.remove('hidden');

        const name = document.getElementById('name').value;
        const subject = document.getElementById('subject').value;

        const submitBtn = queryForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            formStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, ${name}. Your query regarding "${subject}" was recorded!`;
            queryForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
});
