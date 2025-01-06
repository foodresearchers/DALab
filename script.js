document.addEventListener('DOMContentLoaded', function() {
    fetch('responses.csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1); // Skip the header row
        const currentResearchers = {};
        const alumni = {};

        rows.forEach(row => {
            const cols = row.split(',');
            if (cols.length < 9) return; // Skip incomplete rows

            const researcher = {
                name: cols[1].trim(), // Name
                id: cols[2].trim(), // Student ID
                batch: cols[3].trim(), // Batch
                email: cols[4].trim(), // Email
                interest: cols[5].trim(), // Research interest
                designation: cols[6].trim(), // Current Designation
                type: cols[7].trim().toLowerCase(), // Current Researcher or Alumni?
                img: `images/researchers/${cols[2].trim()}.jpg` // Fetch image by student ID
            };

            if (researcher.type.includes('current')) {
                if (!currentResearchers[researcher.batch]) {
                    currentResearchers[researcher.batch] = [];
                }
                currentResearchers[researcher.batch].push(researcher);
            } else if (researcher.type.includes('alumni')) {
                if (!alumni[researcher.batch]) {
                    alumni[researcher.batch] = [];
                }
                alumni[researcher.batch].push(researcher);
            }
        });

        console.log('Current Researchers:', currentResearchers);
        console.log('Alumni:', alumni);

        const appendResearchers = (category, containerId) => {
            Object.keys(category).forEach(batch => {
                const batchGroup = document.createElement('div');
                batchGroup.innerHTML = `<h3>${batch}</h3>`;

                category[batch].forEach(researcher => {
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.innerHTML = `
                        ${researcher.img ? `<img src="${researcher.img}" alt="${researcher.name}" onerror="this.style.display='none'">` : ''}
                        <h3>${researcher.name}</h3>
                        <p>ID: ${researcher.id}</p>
                        <p>Batch: ${researcher.batch}</p>
                        <p>Email: ${researcher.email}</p>
                        <p>Research Interest: ${researcher.interest}</p>
                        <p>Designation: ${researcher.designation}</p>
                        <p>${researcher.type}</p>
                    `;
                    batchGroup.appendChild(card);
                });

                document.getElementById(containerId).appendChild(batchGroup);
            });
        };

        appendResearchers(currentResearchers, 'current-researchers');
        appendResearchers(alumni, 'alumni');
    })
    .catch(error => console.error('Error fetching the CSV file:', error));
});
