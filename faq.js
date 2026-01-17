document.addEventListener('DOMContentLoaded', function() {
    fetchFAQ();
});

async function fetchFAQ() {
    const container = document.getElementById('faq-list');

    try {
        const response = await fetch('faq.json');
        const data = await response.json();

        if (data.questions && data.questions.length > 0) {
            // Group by category
            const categories = {};
            data.questions.forEach(q => {
                if (!categories[q.category]) {
                    categories[q.category] = [];
                }
                categories[q.category].push(q);
            });

            container.innerHTML = '';

            // Render each category
            Object.keys(categories).forEach(category => {
                const section = document.createElement('div');
                section.className = 'faq-category';
                section.innerHTML = `<h3 class="category-title">${category}</h3>`;

                categories[category].forEach(q => {
                    section.appendChild(createFAQItem(q));
                });

                container.appendChild(section);
            });
        } else {
            container.innerHTML = '<p>Ingen spørsmål tilgjengelig.</p>';
        }
    } catch (error) {
        console.error('Error fetching FAQ:', error);
        container.innerHTML = '<p>Kunne ikke laste FAQ. Prøv igjen senere.</p>';
    }
}

function createFAQItem(question) {
    const item = document.createElement('div');
    item.className = 'faq-item';

    item.innerHTML = `
        <div class="faq-question">
            <h4>${question.question}</h4>
            <span class="faq-toggle">+</span>
        </div>
        <div class="faq-answer">
            <p>${question.answer}</p>
        </div>
    `;

    // Add click toggle for accordion
    const questionEl = item.querySelector('.faq-question');
    questionEl.addEventListener('click', () => {
        item.classList.toggle('active');
        const toggle = item.querySelector('.faq-toggle');
        toggle.textContent = item.classList.contains('active') ? '−' : '+';
    });

    return item;
}
