document.addEventListener('DOMContentLoaded', function() {
    fetchNews();
});

async function fetchNews() {
    const container = document.getElementById('news-list');

    try {
        const response = await fetch('news.json');
        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            // Sort by date, newest first
            const sorted = data.articles.sort((a, b) => new Date(b.date) - new Date(a.date));

            container.innerHTML = '';
            sorted.forEach(article => {
                container.appendChild(createNewsCard(article));
            });
        } else {
            container.innerHTML = '<p>Ingen nyheter tilgjengelig.</p>';
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        container.innerHTML = '<p>Kunne ikke laste nyheter. Prøv igjen senere.</p>';
    }
}

function createNewsCard(article) {
    const card = document.createElement('article');
    card.className = 'news-card';

    const date = new Date(article.date);
    const dateStr = date.toLocaleDateString('no-NO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    card.innerHTML = `
        <div class="news-meta">
            <span class="news-date">${dateStr}</span>
            <span class="news-author">Av ${article.author}</span>
        </div>
        <h3>${article.title}</h3>
        <p>${article.content}</p>
    `;

    return card;
}
