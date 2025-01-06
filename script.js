document.addEventListener('DOMContentLoaded', function() {
    fetch('responses.csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1); // Skip the header row
        const batchGroups = {};

        rows.forEach(row => {
            const cols = row.split(',');
            if (cols.length < 4) return; // Skip incomplete rows

            const researcher = {
                name: cols[1].trim(), // Name
                batch: cols[3].trim() // Batch
            };

            if (!batchGroups[researcher.batch]) {
                batchGroups[researcher.batch] = [];
            }
            batchGroups[researcher.batch].push(researcher);
        });

        console.log('Batch Groups:', batchGroups);

        Object.keys(batchGroups).forEach(batch => {
            const batchGroup = document.createElement('div');
            batchGroup.innerHTML = `<h3>${batch}</h3>`;

            batchGroups[batch].forEach(researcher => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <h3>${researcher.name}</h3>
                `;
                batchGroup.appendChild(card);
            });

            document.getElementById('researchers').appendChild(batchGroup);
        });
    })
    .catch(error => console.error('Error fetching the CSV file:', error));
});
