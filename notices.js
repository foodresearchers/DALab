document.addEventListener('DOMContentLoaded', function() {
    // Fetch notices data from text file and display cards
    fetch('notices.txt')
    .then(response => response.text())
    .then(data => {
        const notices = data.trim().split('\n').filter(line => line.trim() !== '');

        const appendNotices = (notices, containerId) => {
            if (!notices || notices.length === 0) return;

            notices.forEach(notice => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <p>${notice}</p>
                `;
                document.getElementById(containerId).appendChild(card);
            });
        };

        appendNotices(notices, 'notices');
    })
    .catch(error => console.error('Error fetching the notices file:', error));
});
