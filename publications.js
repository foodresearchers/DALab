document.addEventListener('DOMContentLoaded', function() {
    const publicationList = document.getElementById('publication-list');
    const totalPublicationsElem = document.getElementById('total-publications');

    fetch('publications/publications.txt')
        .then(response => response.text())
        .then(data => {
            const publications = data.split('\n').filter(line => line.trim() !== '');
            const years = {};
