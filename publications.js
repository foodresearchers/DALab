document.addEventListener('DOMContentLoaded', function() {
    const publicationsList = document.getElementById('publications-list');
    const totalPublications = document.getElementById('total-publications');

    if (!publicationsList || !totalPublications) {
        console.error('Error: Required HTML elements not found.');
        return;
    }

    fetch('publications/publications.txt')
    .then(response => response.text())
    .then(data => {
        const publications = data.split('\n').filter(line => line.trim() !== '');
        const years = {};

        publications.forEach(pub => {
            const parts = pub.split('. ');
            if (parts.length > 1) {
                const citation = parts.slice(1).join('. ').trim();
                const yearMatch = citation.match(/\((\d{4})\)/); // Extracting the year from the citation

                if (yearMatch) {
                    const year = yearMatch[1];

                    if (!years[year]) {
                        years[year] = [];
                    }

                    // Extracting the title and making it bold
                    const titleMatch = citation.match(/^(.*?\.)(.*?)(\. .*)$/);
                    if (titleMatch) {
                        const boldTitle = `<b>${titleMatch[2].trim()}</b>`;
                        const updatedCitation = `${titleMatch[1]} ${boldTitle}${titleMatch[3]}`;
                        years[year].push(updatedCitation);
                    } else {
                        years[year].push(citation);
                    }
                }
            }
        });

        const sortedYears = Object.keys(years).sort((a, b) => b - a);
        totalPublications.textContent = publications.length;

        sortedYears.forEach(year => {
            const yearHeading = document.createElement('h3');
            yearHeading.textContent = year;

            const yearPublications = document.createElement('ul');

            years[year].forEach(citation => {
                const listItem = document.createElement('li');
                listItem.innerHTML = citation; // Using innerHTML to include bold tags
                yearPublications.appendChild(listItem);
            });

            publicationsList.appendChild(yearHeading);
            publicationsList.appendChild(yearPublications);
        });
    })
    .catch(error => console.error('Error fetching the publications file:', error));
});
