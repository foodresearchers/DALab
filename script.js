document.addEventListener('DOMContentLoaded', function() {
    fetch('responses.csv')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.text();
    })
    .then(data => {
        console.log('CSV Data:', data);
        const rows = data.split('\n').slice(1); // Skip header row
        const researchers = {};

        rows.forEach(row => {
            const cols = row.split(',');
            if (cols.length < 9) return; // Skip incomplete rows

            const researcher = {
                name: cols[1] ? cols[1].toLowerCase().trim() : 'N/A', // Name
                id: cols[2] || 'N/A', // Student ID
                batch: cols[3] || 'N/A', // Batch
                email: cols[4] || 'N/A', // Email
                interest: cols[5] || 'N/A', // Research interest
                designation: cols[6] || 'N/A', // Current Designation
                type: cols[7] ? cols[7].toLowerCase().trim() : 'N/A', // Current Researcher or Alumni?
                img: cols[8] ? `https://drive.google.com/uc?export=view&id=${cols[8].split('id=')[1]}` : null // Extract image ID and convert to viewable link
            };

            if (!researchers[researcher.batch]) {
                researchers[researcher.batch] = [];
            }
            researchers[researcher.batch].push(researcher);
        });

        console.log('Researchers Object:', researchers);

        Object.keys(researchers).forEach(batch => {
            console.log(`Processing batch: ${batch}`);
            const batchGroup = document.createElement('div');
            batchGroup.innerHTML = `<h3>${batch}</h3>`;

            researchers[batch].forEach(researcher => {
                console.log(`Creating card for researcher: ${researcher.name}`);
                const card = document.createElement('div');
                card.classList.add('card');
