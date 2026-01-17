document.addEventListener('DOMContentLoaded', function() {
    fetchGames();
});

async function fetchGames() {
    const container = document.getElementById('games-list');

    try {
        const response = await fetch('game_systems.json');
        const data = await response.json();

        if (data.systems && data.systems.length > 0) {
            container.innerHTML = '<div class="games-grid"></div>';
            const grid = container.querySelector('.games-grid');

            data.systems.forEach(system => {
                grid.appendChild(createGameCard(system));
            });
        } else {
            container.innerHTML = '<p>Ingen spillsystemer tilgjengelig.</p>';
        }
    } catch (error) {
        console.error('Error fetching games:', error);
        container.innerHTML = '<p>Kunne ikke laste spillsystemer. Prøv igjen senere.</p>';
    }
}

function createGameCard(system) {
    const card = document.createElement('div');
    card.className = 'game-card';

    let tagsHTML = '';
    if (system.beginner_friendly) {
        tagsHTML += '<span class="tag beginner">Nybegynnervennlig</span>';
    }
    tagsHTML += `<span class="tag">${system.game_time}</span>`;
    tagsHTML += `<span class="tag">${system.players} spillere</span>`;

    card.innerHTML = `
        <h3>${system.name}</h3>
        <p class="game-description">${system.description}</p>
        <div class="game-meta">
            <p><strong>Skala:</strong> ${system.scale}</p>
            <p><strong>Popularitet i klubben:</strong> ${system.popularity}</p>
        </div>
        <div class="game-tags">
            ${tagsHTML}
        </div>
    `;

    return card;
}
