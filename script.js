document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded');
    
    fetch('responses.csv')
    .then(response => {
        console.log('Fetching CSV file');
        return response.text();
    })
    .then(data => {
        console.log('CSV file fetched');
        const rows = data.split('\n').slice(1); // Skip the header row
        const currentResearchers = {};
        const formerResearchers = {};

        rows.forEach(row => {
            const cols = row.split(',').map(col => col.trim().replace(/^"|"$/g, ''));
            console.log('Processing row:', cols);

            if (cols.length < 12) {
                console.log('Skipping incomplete row:', row);
                return; // Skip incomplete rows
            }

            const researcher = {
                name: cols[1], // Name
                id: cols[2], // Student ID
                batch: cols[3], // Batch
                email: cols[4], // Email
                interest: cols[5], // Research interest
                type: cols[6], // Current or Former Researcher?
                designation: cols[7], // Current Designation
                publications: cols[8], // Number of Publications (Scopus Indexed)
                scholarAccount: cols[9], // Google Scholar Account
                linkedInAccount: cols[10], // LinkedIn Account
                img: `images/researchers/${cols[2]}.jpg` // Fetch image by student ID
            };

            console.log('Researcher object created:', researcher);

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
            if (Object.keys(category).length === 0) {
                console.log(`No researchers found for ${containerId}`);
                return;
            }

            Object.keys(category).forEach(batch => {
                const batchGroup = document.createElement('div');
                batchGroup.innerHTML = `<h3>${batch} Batch</h3>`;

                category[batch].forEach(researcher => {
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.innerHTML = `
                        ${researcher.img ? `<img src="${researcher.img}" alt="${researcher.name}" onerror="this.style.display='none'">` : ''}
                        <h3>${researcher.name}</h3>
                        <p>Student ID: ${researcher.id}</p>
                        <p>Batch: ${researcher.batch}</p>
                        <p>Email: ${researcher.email}</p>
                        <p>Research Interest: ${researcher.interest}</p>
                        <p>Designation: ${researcher.designation}</p>
                        <p>Publications (Scopus Indexed): ${researcher.publications}</p>
                        <p><a href="${researcher.scholarAccount}" target="_blank">Google Scholar</a></p>
                        <p><a href="${researcher.linkedInAccount}" target="_blank">LinkedIn</a></p>
                    `;
                    console.log('Card HTML:', card.innerHTML);
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
