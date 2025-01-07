document.addEventListener('DOMContentLoaded', function() {
    fetch('notices.txt')
    .then(response => response.text())
    .then(data => {
        const notices = data.split('\n').filter(line => line.trim() !== '');
        const noticeList = document.getElementById('notice-list');

        // Reverse the order to display newest notices first
        notices.reverse().forEach((notice, index) => {
            // Remove the leading number and any leading spaces
            const cleanNotice = notice.replace(/^\d+\.\s*/, '');
            const listItem = document.createElement('li');
            listItem.textContent = cleanNotice;
            noticeList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error fetching the notices file:', error));
});
