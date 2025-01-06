document.addEventListener('DOMContentLoaded', function() {
    fetch('notices.txt')
    .then(response => response.text())
    .then(data => {
        const notices = data.split('\n').filter(line => line.trim() !== '');
        const noticeList = document.getElementById('notice-list');

        // Reverse the order to display newest notices first
        notices.reverse().forEach((notice, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${notices.length - index}. ${notice}`;
            noticeList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error fetching the notices file:', error));
});
