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
        const uniqueCitations = new Set();

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
                    const titleMatch = citation.match(/(.*?)\.\s(.*?)\.\s/);
                    if (titleMatch) {
                        const authors = titleMatch[1].trim();
                        const boldTitle = `<b>${titleMatch[2].trim()}</b>`;
                        const updatedCitation = `${authors}. ${boldTitle}. ${citation.replace(titleMatch[0], '')}`;

                        // Check for duplicates
                        if (!uniqueCitations.has(updatedCitation)) {
                            uniqueCitations.add(updatedCitation);
                            years[year].push(updatedCitation);
                        }
                    } else {
                        years[year].push(citation);
                    }
                }
            }
        });

        const sortedYears = Object.keys(years).sort((a, b) => b - a);
        totalPublications.textContent = publications.length;

