document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Functionality
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

    // 2. Active Navigation State Tracking on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 120)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 3. Dynamic Real-time Tech News Feed API Implementation
    const fetchTechNews = async () => {
        const newsContainer = document.getElementById('news-container');
        try {
            const response = await fetch('https://dev.to/api/articles?tag=computerscience&per_page=3');
            if (!response.ok) throw new Error('Network response evaluation failed.');
            
            const articles = await response.json();
            newsContainer.innerHTML = ''; 

            articles.forEach(article => {
                const card = document.createElement('div');
                card.className = 'article-card';
                
                const tagsHTML = article.tag_list
                    .slice(0, 3)
                    .map(tag => `<span class="tag">#${tag}</span>`)
                    .join('');

                card.innerHTML = `
                    <div>
                        <div class="article-tags">${tagsHTML}</div>
                        <h3>${escapeHTML(article.title)}</h3>
                        <p>${escapeHTML(article.description || 'Click read more to inspect this technical update.')}</p>
                    </div>
                    <a href="${article.url}" target="_blank" class="article-link">Read Article <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                `;
                newsContainer.appendChild(card);
            });
        } catch (error) {
            console.error('Error fetching dynamic news:', error);
            renderFallbackNews();
        }
    };

    const renderFallbackNews = () => {
        const newsContainer = document.getElementById('news-container');
        const fallbacks = [
            {
                title: "Optimizing High-Performance Compute Pipelines in 2026",
                desc: "An architectural review exploring core cache management efficiencies and instruction parsing variations.",
                tags: ['performance', 'architecture'],
                url: "https://dev.to"
            },
            {
                title: "The Shift toward Distributed Cryptographic Consensus Protocols",
                desc: "Analyzing secure multi-party compute layers across real-time electronic ledger topologies.",
                tags: ['security', 'cryptography'],
                url: "https://dev.to"
            },
            {
                title: "Advanced Regularized Normalization Patches in DBMS Engines",
                desc: "How next-generation transactional query decoders evaluate execution cost-metrics natively.",
                tags: ['databases', 'systems'],
                url: "https://dev.to"
            }
        ];

        newsContainer.innerHTML = '';
        fallbacks.forEach(item => {
            const card = document.createElement('div');
            card.className = 'article-card';
            const tagsHTML = item.tags.map(t => `<span class="tag">#${t}</span>`).join('');
            card.innerHTML = `
                <div>
                    <div class="article-tags">${tagsHTML}</div>
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                </div>
                <a href="${item.url}" target="_blank" class="article-link">Read Article <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
            `;
            newsContainer.appendChild(card);
        });
    };

    const escapeHTML = (str) => {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    };

    fetchTechNews();

    // 4. Client-Side Query Validation
    const queryForm = document.getElementById('queryForm');
    const formStatus = document.getElementById('formStatus');

    queryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        formStatus.textContent = "Processing message transmitting sequences...";
        formStatus.className = "form-status success";
        formStatus.classList.remove('hidden');

        const name = document.getElementById('name').value;
        const subject = document.getElementById('subject').value;

        setTimeout(() => {
            formStatus.textContent = `Thank you, ${name}. Your message regarding "${subject}" was recorded successfully!`;
            formStatus.className = "form-status success";
            queryForm.reset();
        }, 1200);
    });
});
