// Existing content from script.js
// Function to toggle the mobile menu
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    // Remove any inline display styles first
    navLinks.style.removeProperty('display');
    
    const computedDisplay = window.getComputedStyle(navLinks).display;
    console.log("Computed display style before toggle:", computedDisplay);

    if (computedDisplay === 'flex') {
        navLinks.style.display = 'none';
        console.log("Nav links hidden");
    } else {
        navLinks.style.display = 'flex';
        console.log("Nav links shown");
    }

    // Log the final computed display style
    console.log("Computed display style after toggle:", window.getComputedStyle(navLinks).display);
}

document.addEventListener('DOMContentLoaded', function() {
    // Existing logic for hero images and mobile menu toggle
    if (document.querySelector('.hero-image')) {
        let slideIndex = 0;
        const slides = document.querySelectorAll(".hero-image");
        const dots = document.querySelectorAll(".nav-dot");

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active', 'previous', 'next');
                if (i === index) {
                    slide.classList.add('active');
                } else if (i === (index - 1 + slides.length) % slides.length) {
                    slide.classList.add('previous');
                } else if (i === (index + 1) % slides.length) {
                    slide.classList.add('next');
                }
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            slideIndex = index;
        }

        function nextSlide() {
            slideIndex = (slideIndex + 1) % slides.length;
            showSlide(slideIndex);
        }

        // Add event listeners to dots for changing slides
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });

        showSlide(slideIndex);
        setInterval(nextSlide, 8000);
    }

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    // Notices logic from notices.js
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

    // Researchers loading logic (for researchers page)
    if (document.getElementById('current-researchers') || document.getElementById('former-researchers')) {
        fetch('responses.csv')
            .then(response => response.text())
            .then(data => {
                // Parse CSV while properly handling fields that contain commas
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

                    const container = document.getElementById(containerId);
                    if (!container) {
                        console.error(`Container with ID "${containerId}" not found.`);
                        return;
                    }

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

                        container.appendChild(batchGroup);
                    });
                };

                appendResearchers(currentResearchers, 'current-researchers');
                appendResearchers(formerResearchers, 'former-researchers');
            })
            .catch(error => console.error('Error fetching the CSV file:', error));
    }
});
