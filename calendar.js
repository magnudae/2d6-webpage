let allEvents = [];

document.addEventListener('DOMContentLoaded', function() {
    fetchEvents();
    setupFilters();
});

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            renderEvents(filter);
        });
    });
}

async function fetchEvents() {
    const container = document.getElementById('calendar-list');

    try {
        const response = await fetch('events.json');
        const data = await response.json();

        if (data.events && data.events.length > 0) {
            allEvents = data.events;
            renderEvents('all');
        } else {
            container.innerHTML = '<p>Ingen arrangementer tilgjengelig.</p>';
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        container.innerHTML = '<p>Kunne ikke laste arrangementer. Prøv igjen senere.</p>';
    }
}

function renderEvents(filter) {
    const container = document.getElementById('calendar-list');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = allEvents;
    if (filter !== 'all') {
        filtered = allEvents.filter(e => e.type === filter);
    }

    // Filter to upcoming events and sort by date
    filtered = filtered
        .filter(e => new Date(e.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (filtered.length === 0) {
        container.innerHTML = '<p class="no-events">Ingen kommende arrangementer i denne kategorien.</p>';
        return;
    }

    container.innerHTML = '';
    filtered.forEach(event => {
        container.appendChild(createEventCard(event));
    });
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = `event-card event-${event.type}`;

    const date = new Date(event.date);
    const dateStr = date.toLocaleDateString('no-NO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    let dateDisplay = dateStr;
    if (event.date_end) {
        const endDate = new Date(event.date_end);
        const endStr = endDate.toLocaleDateString('no-NO', {
            day: 'numeric',
            month: 'long'
        });
        dateDisplay = `${date.toLocaleDateString('no-NO', { day: 'numeric', month: 'long' })} - ${endStr}`;
    }

    const typeLabels = {
        tournament: 'Turnering',
        gamenight: 'Spillkveld',
        hobby: 'Hobby',
        league: 'Liga',
        social: 'Sosialt',
        beginner: 'Nybegynner'
    };

    card.innerHTML = `
        <div class="event-date">
            <span class="event-day">${date.getDate()}</span>
            <span class="event-month">${date.toLocaleDateString('no-NO', { month: 'short' })}</span>
        </div>
        <div class="event-details">
            <span class="event-type">${typeLabels[event.type] || event.type}</span>
            <h3>${event.name}</h3>
            <p>${event.description}</p>
            <div class="event-meta">
                ${event.time ? `<span class="event-time">Kl. ${event.time}</span>` : ''}
                <span class="event-location">${event.location}</span>
                ${event.recurring ? '<span class="event-recurring">Ukentlig</span>' : ''}
            </div>
        </div>
    `;

    return card;
}
