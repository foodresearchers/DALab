document.addEventListener('DOMContentLoaded', function() {
    fetch('responses.csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1); // Skip the header row
        const researchers = [];

        rows.forEach(row => {
            const cols = row.split(',');
            if (cols.length < 4) return; // Skip incomplete rows

            const researcher = {
                name: cols[1].trim(), // Name
                batch: cols[3].trim() // Batch
            };

            researchers.push(researcher);
        });

        const container = document.createElement('div');

        researchers.forEach(researcher => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <h3>${researcher.name}</h3>
                <p>Batch: ${researcher.batch}</p>
            `;
            container.appendChild(card);
        });

        document.getElementById('researchers').appendChild(container);
    })
    .catch(error => console.error('Error fetching the CSV file:', error));
});
