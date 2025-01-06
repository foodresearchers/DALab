document.addEventListener('DOMContentLoaded', function() {
    fetch('responses.csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n').slice(1); // Skip the header row
        const currentResearchers = {};
        const formerResearchers = {};

        rows.forEach(row => {
            const cols = row.split(',').map(col => col.trim().replace(/^"|"$/g, ''));
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
                    const card[_{{{CITATION{{{_1{](https://github.com/buribalazs/smooth-drag-order/tree/7b40d21d076c3e31765f61481f537beaf4c5ec9f/README.md)[_{{{CITATION{{{_2{](https://github.com/kayoJr/dr-hibist/tree/c241f017119cd4eadbc2a65b99d3faf7d5b947f1/index.php)
