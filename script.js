document.addEventListener('DOMContentLoaded', function() {
    fetch('responses.csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1); // Skip the header row
        const currentResearchers = {};
        const formerResearchers = {};

        rows.forEach(row => {
            const cols = row.split(',');
            if (cols.length < 12) return; // Skip incomplete rows

            const researcher = {
                name: cols[1].trim(), // Name
                id: cols[2].trim(), // Student ID
                batch: cols[3].trim(), // Batch
                email: cols[4].trim(), // Email
                interest: cols[5].trim(), // Research interest
                type: cols[6].trim(), // Current or Former Researcher?
                designation: cols[7].trim(), // Current Designation
                publications: cols[8].trim(), // Number of Publications (Scopus Indexed)
                scholarAccount: cols[9].trim(), // Google Scholar Account
                linkedInAccount: cols[10].trim(), // LinkedIn Account
                img: `images/researchers/${cols[2].trim()}.jpg` // Fetch image by student ID
            };

            if (researcher.type === 'Current') {
                if (!currentResearchers[researcher.batch]) {
                    currentResearchers[researcher.batch] = [];
                }
                currentResearchers[researcher.batch].push(researcher);
            } else if (researcher.type === 'Former') {
                if (!formerResearchers[researcher.batch]) {
                    formerResearchers[researcher.batch] = [];
                }
                formerResearchers[researcher.batch].push(researcher);
            }
        });

        console.log('Current Researchers:', currentResearchers);
        console.log('Former Researchers:', formerResearchers);

        const appendResearchers = (category, containerId) => {
            Object.keys(category).forEach(batch => {
                const batchGroup = document.createElement('div');
                batchGroup.innerHTML = `<h3>${batch} Batch</h3>`;

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
                        <p>Publications: ${researcher.publications}</p>
                        <p><a href="${researcher.scholarAccount}" target="_blank">Google Scholar</a></p>
                        <p><a href="${researcher.linkedInAccount}" target="_blank">LinkedIn</a></p>
                        <p>${researcher.type}</p>
                    `;
                    batchGroup.appendChild(card);
                });

                document.getElementById(containerId).appendChild(batchGroup);
            });
        };

        appendResearchers(currentResearchers, 'current-researchers');
        appendResearchers(formerResearchers, 'former-researchers');
    })
    .catch(error => console.error('Error fetching the CSV file:', error));
});
