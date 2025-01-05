document.addEventListener('DOMContentLoaded', function() {
    fetch('responses.csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1);
        const researchers = {};

        rows.forEach(row => {
            const cols = row.split(',');
            if (cols.length < 8) return; // Skip incomplete rows
            const researcher = {
                name: cols[0].toLowerCase().trim(),
                id: cols[1],
                batch: cols[2],
                email: cols[3],
                interest: cols[4],
                designation: cols[5],
                type: cols[6],
                img: cols[7].toLowerCase().trim()
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
                // Assume the images are stored with names in lowercase and without spaces
                const imageName = researcher.name.replace(/\s+/g, '');
                const imgPath = researcher.img || `images/${imageName}.jpg`;

                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <img src="${imgPath}" alt="${researcher.name}">
                    <h3>${researcher.name}</h3>
                    <p>Designation: ${researcher.designation}</p>
                    <p>ID: ${researcher.id}</p>
                    <p>Batch: ${researcher.batch}</p>
                    <p>Email: ${researcher.email}</p>
                    <p>Research Interest: ${researcher.interest}</p>
                `;
                batchGroup.appendChild(card);
            });

            if (researchers[batch][0].type === 'current') {
                document.getElementById('current-researchers').appendChild(batchGroup);
            } else if (researchers[batch][0].type === 'alumni') {
                document.getElementById('alumni').appendChild(batchGroup);
            }
        });
    });
});
