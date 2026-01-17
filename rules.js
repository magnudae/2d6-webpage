document.addEventListener('DOMContentLoaded', function() {
    fetchRules();
});

async function fetchRules() {
    const container = document.getElementById('rules-list');

    try {
        const response = await fetch('rules.json');
        const data = await response.json();

        if (data.sections && data.sections.length > 0) {
            container.innerHTML = '';

            data.sections.forEach(section => {
                container.appendChild(createRulesSection(section));
            });
        } else {
            container.innerHTML = '<p>Ingen regler tilgjengelig.</p>';
        }
    } catch (error) {
        console.error('Error fetching rules:', error);
        container.innerHTML = '<p>Kunne ikke laste regler. Prøv igjen senere.</p>';
    }
}

function createRulesSection(section) {
    const sectionEl = document.createElement('div');
    sectionEl.className = 'rules-section';

    let rulesHTML = '<ol class="rules-list">';
    section.rules.forEach(rule => {
        rulesHTML += `<li>${rule}</li>`;
    });
    rulesHTML += '</ol>';

    sectionEl.innerHTML = `
        <h3>${section.title}</h3>
        ${rulesHTML}
    `;

    return sectionEl;
}
