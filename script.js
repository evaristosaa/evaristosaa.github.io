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

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
});

// Animate on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections except hero
document.querySelectorAll('section:not(.hero)').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Dynamic year in footer
const footerYear = document.querySelector('.footer p');
if (footerYear) {
    footerYear.innerHTML = footerYear.innerHTML.replace('2026', new Date().getFullYear());
}

// AI News fetcher
async function fetchAINews() {
    const container = document.getElementById('news-container');
    
    try {
        // Fetch from Hacker News
        const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const storyIds = await topStoriesRes.json();
        
        const news = [];
        const aiKeywords = ['ai ', 'gpt', 'llm', 'chatgpt', 'claude', 'gemini', 
                           'machine learning', 'ml ', 'neural', 'openai', 
                           'anthropic', 'deepmind', 'artificial intelligence'];
        
        // Fetch first 50 stories and filter AI-related
        for (const id of storyIds.slice(0, 50)) {
            try {
                const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                const story = await res.json();
                
                if (story && story.title) {
                    const title = story.title.toLowerCase();
                    const isAI = aiKeywords.some(keyword => title.includes(keyword));
                    
                    if (isAI) {
                        news.push({
                            title: story.title,
                            url: story.url || `https://news.ycombinator.com/item?id=${id}`,
                            date: new Date(story.time * 1000).toLocaleDateString('es-ES'),
                            source: 'Hacker News',
                            description: story.text ? story.text.replace(/<[^>]*>/g, '').slice(0, 150) + '...' : ''
                        });
                    }
                    
                    if (news.length >= 6) break;
                }
            } catch (err) {
                continue;
            }
        }
        
        // Render news
        if (news.length > 0) {
            container.innerHTML = news.map(item => `
                <div class="news-card">
                    <div class="news-meta">
                        <span class="news-source-badge">${item.source}</span>
                        <span>${item.date}</span>
                    </div>
                    <h3><a href="${item.url}" target="_blank" rel="noopener">${item.title}</a></h3>
                    ${item.description ? `<p class="news-description">${item.description}</p>` : ''}
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p style="text-align: center; color: var(--gray);">No se encontraron noticias de IA recientes.</p>';
        }
    } catch (error) {
        container.innerHTML = '<p style="text-align: center; color: var(--gray);">Error al cargar noticias. Intenta de nuevo más tarde.</p>';
        console.error('Error fetching AI news:', error);
    }
}

// Refresh button
const refreshBtn = document.getElementById('refresh-news');
if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
        const container = document.getElementById('news-container');
        container.innerHTML = `
            <div class="news-loading">
                <div class="spinner"></div>
                <p>Cargando noticias...</p>
            </div>
        `;
        fetchAINews();
    });
}

// Load news on page load
if (document.getElementById('news-container')) {
    fetchAINews();
}

console.log('🤖 Portfolio by Evaristo Saá | Built with OpenClaw');
