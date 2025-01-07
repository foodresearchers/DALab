document.addEventListener('DOMContentLoaded', function() {
    // Fetch researchers data and display cards
    fetch('responses.csv')
    .then(response => response.text())
    .then(data => {
        const parseCSV = (text) => {
            const rows = text.trim().split('\n').map(row => {
                const result = [];
                let quoted = false, field = '';
                for (let char of row) {
                    if (char === '"') {
                        quoted = !quoted;
                    } else if (char === ',' && !quoted) {
                        result.push(field.trim());
                        field = '';
                    } else {
                        field += char;
                    }
                }
                result.push(field.trim());
                return result;
            });
            return rows;
        };

        const rows = parseCSV(data).slice(1); // Skip the header row
        const currentResearchers = {};
        const formerResearchers = {};

        rows.forEach(cols => {
            if (cols.length < 12) return; // Skip incomplete rows

            const researcher = {
                name: cols[1],
                id: cols[2],
                batch: cols[3],
                email: cols[4],
                interest: cols[5],
                type: cols[6],
                designation: cols[7],
                publications: cols[8],
                scholarAccount: cols[9],
                linkedInAccount: cols[10],
                imgJPG: `images/researchers/${cols[2]}.jpg`,
                imgPNG: `images/researchers/${cols[2]}.png`
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

        const appendResearchers = (category, containerId) => {
            if (!category || Object.keys(category).length === 0) return;

            Object.keys(category).forEach(batch => {
                const batchGroup = document.createElement('div');
                batchGroup.innerHTML = `<h3>${batch} Batch</h3>`;

                category[batch].forEach(researcher => {
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.innerHTML = `
                        <img src="${researcher.imgJPG}" alt="${researcher.name}" onerror="this.onerror=null; this.src='${researcher.imgPNG}';">
                        <h3>${researcher.name}</h3>
                        <p><span class="label">Email:</span> ${researcher.email}</p>
                        <p><span class="label">Research Interest:</span> ${researcher.interest}</p>
                        <p><span class="label">Designation:</span> ${researcher.designation}</p>
                        <p><span class="label">Publications (Scopus Indexed):</span> ${researcher.publications}</p>
                        <p><a href="${researcher.scholarAccount}" target="_blank">Google Scholar</a></p>
                        <p><a href="${researcher.linkedInAccount}" target="_blank">LinkedIn</a></p>
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

    // Fetch notices data and display cards
    fetch('notices.csv')
    .then(response => response.text())
    .then(data => {
        const parseCSV = (text) => {
            const rows = text.trim().split('\n').map(row => {
                const result = [];
                let quoted = false, field = '';
                for (let char of row) {
                    if (char === '"') {
                        quoted = !quoted;
                    } else if (char === ',' && !quoted) {
                        result.push(field.trim());
                        field = '';
                    } else {
                        field += char;
                    }
                }
                result.push(field.trim());
                return result;
            });
            return rows;
        };

        const rows = parseCSV(data).slice(1); // Skip the header row

        const appendNotices = (notices, containerId) => {
            if (!notices || notices.length === 0) return;

            notices.forEach(notice => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <h3>${notice[0]}</h3>
                    <p>${notice[1]}</p>
                `;
                document.getElementById(containerId).appendChild(card);
            });
        };

        appendNotices(rows, 'notices');
    })
    .catch(error => console.error('Error fetching the CSV file:', error));
});
