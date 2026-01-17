document.addEventListener('DOMContentLoaded', function() {
    fetchHobby();
});

async function fetchHobby() {
    const container = document.getElementById('hobby-list');

    try {
        const response = await fetch('hobby_gallery.json');
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            // Sort by date, newest first
            const sorted = data.items.sort((a, b) => new Date(b.date) - new Date(a.date));

            container.innerHTML = '<div class="hobby-grid"></div>';
            const grid = container.querySelector('.hobby-grid');

            sorted.forEach(item => {
                grid.appendChild(createHobbyCard(item));
            });
        } else {
            container.innerHTML = '<p>Ingen prosjekter tilgjengelig.</p>';
        }
    } catch (error) {
        console.error('Error fetching hobby items:', error);
        container.innerHTML = '<p>Kunne ikke laste galleri. Prøv igjen senere.</p>';
    }
}

function createHobbyCard(item) {
    const card = document.createElement('div');
    card.className = 'hobby-card';

    const date = new Date(item.date);
    const dateStr = date.toLocaleDateString('no-NO', {
        month: 'long',
        year: 'numeric'
    });

    card.innerHTML = `
        <div class="hobby-image">
            <div class="hobby-placeholder">
                <span>${item.game}</span>
            </div>
        </div>
        <div class="hobby-content">
            <h3>${item.title}</h3>
            <p class="hobby-artist">Av ${item.artist}</p>
            <p class="hobby-description">${item.description}</p>
            <div class="hobby-meta">
                <span class="hobby-game">${item.game}</span>
                <span class="hobby-date">${dateStr}</span>
            </div>
        </div>
    `;

    return card;
}
