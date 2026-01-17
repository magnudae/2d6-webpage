document.addEventListener('DOMContentLoaded', function() {
    fetchTournaments();
});

async function fetchTournaments() {
    const container = document.getElementById('tournaments-list');

    try {
        const response = await fetch('tournament_info.json');
        const data = await response.json();

        if (data.tournaments && data.tournaments.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const upcoming = data.tournaments.filter(t => new Date(t.date_from) >= today);
            const past = data.tournaments.filter(t => new Date(t.date_from) < today);

            // Sort upcoming by date (soonest first)
            upcoming.sort((a, b) => new Date(a.date_from) - new Date(b.date_from));
            // Sort past by date (most recent first)
            past.sort((a, b) => new Date(b.date_from) - new Date(a.date_from));

            container.innerHTML = '';

            // Upcoming tournaments section
            const upcomingSection = document.createElement('div');
            upcomingSection.className = 'tournaments-section';
            upcomingSection.innerHTML = '<h3 class="section-title">Kommende turneringer</h3>';

            if (upcoming.length > 0) {
                upcoming.forEach(tournament => {
                    upcomingSection.appendChild(createTournamentCard(tournament, false));
                });
            } else {
                upcomingSection.innerHTML += '<div class="tournament-card"><p>Ingen kommende turneringer annonsert ennå. Følg med!</p></div>';
            }
            container.appendChild(upcomingSection);

            // Past tournaments section
            if (past.length > 0) {
                const pastSection = document.createElement('div');
                pastSection.className = 'tournaments-section past-tournaments';
                pastSection.innerHTML = '<h3 class="section-title">Tidligere turneringer</h3>';

                past.forEach(tournament => {
                    pastSection.appendChild(createTournamentCard(tournament, true));
                });
                container.appendChild(pastSection);
            }
        } else {
            container.innerHTML = '<div class="tournament-card"><h3>Ingen turneringer</h3><p>Følg med her for informasjon om kommende turneringer.</p></div>';
        }
    } catch (error) {
        console.error('Error fetching tournaments:', error);
        container.innerHTML = '<div class="tournament-card"><h3>Kunne ikke laste turneringer</h3><p>Prøv igjen senere.</p></div>';
    }
}

function createTournamentCard(tournament, isPast) {
    const card = document.createElement('div');
    card.className = isPast ? 'tournament-card past' : 'tournament-card';

    const dateStr = formatDateRange(tournament.date_from, tournament.date_to);

    let html = `
        <p class="date">${dateStr}</p>
        <h3>${tournament.name}</h3>
        <p>${tournament.information}</p>
        <p class="location"><strong>Sted:</strong> ${tournament.place}</p>
        <p class="address">${tournament.address}</p>
    `;

    if (isPast && tournament.winner && tournament.winner !== 'TBA') {
        html += `<div class="results">`;
        html += `<p class="winner"><strong>Vinner:</strong> ${tournament.winner}</p>`;
        if (tournament.runner_up) {
            html += `<p class="runner-up"><strong>2. plass:</strong> ${tournament.runner_up}</p>`;
        }
        if (tournament.participants) {
            html += `<p class="participants"><strong>Deltakere:</strong> ${tournament.participants}</p>`;
        }
        html += `</div>`;
    } else if (!isPast) {
        html += `<p class="winner"><strong>Vinner:</strong> ${tournament.winner}</p>`;
    }

    card.innerHTML = html;
    return card;
}

function formatDateRange(from, to) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (from === to) {
        return fromDate.toLocaleDateString('no-NO', options);
    }

    const fromOptions = { day: 'numeric', month: 'long' };
    return `${fromDate.toLocaleDateString('no-NO', fromOptions)} - ${toDate.toLocaleDateString('no-NO', options)}`;
}
