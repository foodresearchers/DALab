document.addEventListener('DOMContentLoaded', function() {
    fetch('responses.csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1);
        const researchers = {};

        rows.forEach(row => {
            const cols = row.split(',');
            if (cols.length < 8) return; // Skip incomplete rows

            const matchString = (str, searchStr) => str.toLowerCase().includes(searchStr.toLowerCase().trim());

            const researcher = {
                name: cols[1].toLowerCase().trim(), // Skip timestamp
                id: cols[2],
                batch: cols[3],
                email: cols[4],
                interest: cols[5],
                designation: cols[6],
                type: cols[7].toLowerCase().trim(),
                img: cols[8] ? cols[8].trim() : `images/${cols[1].replace(/\s+/g, '').toLowerCase()}.jpg` // Match image by name or use provided URL
            };

            if (!researchers[researcher.batch]) {
                researchers[researcher.batch] = [];
            }
            researchers[researcher.batch].push(researcher);
        });

        Object.keys(researchers).forEach(batch => {
            const batchGroup = document.createElement('div');
            batchGroup.innerHTML = `<h3>${batch}</h3>`;

            researchers[batch].forEach(researcher => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <img src="${researcher.img}" alt="${researcher.name}">
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
    });
});
