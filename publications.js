document.addEventListener('DOMContentLoaded', function() {
    fetch('publications/publications.txt')
    .then(response => response.text())
    .then(data => {
        const publications = data.split('\n').filter(line => line.trim() !== '');
        const publicationsList = document.getElementById('publications-list');
        const totalPublications = document.getElementById('total-publications');
        const years = {};

        publications.forEach(pub => {
            const parts = pub.split('. ');
            const citation = parts[1].trim();
            const year = citation.match(/, (\d{4})\.$/)[1]; // Extracting the year from the citation

            if (!years[year]) {
                years[year] = [];
            }

            years[year].push(citation);
        });

        const sortedYears = Object.keys(years).sort((a, b) => b - a);

        totalPublications.textContent = publications.length;

        sortedYears.forEach(year => {
            const yearHeading = document.createElement('h3');
            yearHeading.textContent = year;

            const yearPublications = document.createElement('ul');

            years[year].forEach((citation, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${index + 1}. ${citation}`;
                yearPublications.appendChild(listItem);
            });

            publicationsList.appendChild(yearHeading);
            publicationsList.appendChild(yearPublications);
        });
    })
    .catch(error => console.error('Error fetching the publications file:', error));
});
