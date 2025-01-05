document.addEventListener('DOMContentLoaded', function() {
    fetch('responses.csv')
    .then(response => response.text())
    .then(data => {
        console.log('CSV Data:', data);
        const rows = data.split('\n').slice(1); // Skip header row
        const researchers = {};

        rows.forEach(row => {
            const cols = row.split(',');
            if (cols.length < 9) return; // Skip incomplete rows

            const researcher = {
                name: cols[1].toLowerCase().trim(), // Name
                id: cols[2] || 'N/A', // Student ID
                batch: cols[3] || 'N/A', // Batch
                email: cols[4] || 'N/A', // Email
                interest: cols[5] || 'N/A', // Research interest
                designation: cols[6] || 'N/A', // Current Designation
                type: cols[7].toLowerCase().trim(), // Current Researcher or Alumni?
                img: cols[8] ? cols[8].trim() : null // Profile image or null if absent
            };

            if (!researchers[researcher.batch]) {
                researchers[researcher.batch] = [];
            }
            researchers[researcher.batch].push(researcher);
        });

        console.log('Researchers Object:', researchers);

        Object.keys(researchers).forEach(batch => {
            const batchGroup = document.createElement('div');
            batchGroup.innerHTML = `<h3>${batch}</h3>`;

            researchers[batch].forEach(researcher => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    ${researcher.img ? `<img src="${researcher.img}" alt="${researcher.name}">` : ''}
                    <h3>${researcher.name}</h3>
                    <p>Designation: ${researcher.designation}</p>
                    <p>ID: ${researcher.id}</p>
                    <p>Batch: ${researcher.batch}</p>
                    <p>Email: ${researcher.email}</p>
                    <p>Research Interest: ${researcher.interest}</p>
                `;
                batchGroup.appendChild(card);
            });

            if (researchers[batch][0].type.includes('current')) {
                document.getElementById('current-researchers').appendChild(batchGroup);
            } else if (researchers[batch][0].type.includes('alumni')) {
                document.getElementById('alumni').appendChild(batchGroup);
            }
        });
    })
    .catch(error => console.error('Error fetching the CSV file:', error));
});
