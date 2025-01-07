document.addEventListener('DOMContentLoaded', function() {
    fetch('projects/projects.csv')
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
            const ongoingProjects = document.getElementById('ongoing-projects');
            const finishedProjects = document.getElementById('finished-projects');

            rows.forEach(cols => {
                if (cols.length < 9) {
                    console.error('Incomplete row:', cols);
                    return; // Skip incomplete rows
                }

                const project = {
                    timestamp: cols[0],
                    title: cols[1],
                    productName: cols[2],
                    description: cols[3],
                    status: cols[4],
                    publisher: cols[5],
                    doi: cols[6],
                    studentId: cols[7],
                    image: `projects/images/${cols[8]}`
                };

                const projectDiv = document.createElement('div');
                projectDiv.classList.add('project');
                projectDiv.innerHTML = `
                    <img src="${project.image}" alt="${project.title}" onerror="this.onerror=null; this.src='projects/images/default.jpg';">
                    <div class="project-info">
                        <h4>${project.title}</h4>
                        <p>${project.description}</p>
                        <p>Publisher: ${project.publisher}</p>
                        <p><a href="${project.doi}" target="_blank">DOI</a></p>
                        <p>Timestamp: ${project.timestamp}</p>
                    </div>
                    <div class="researcher-card" id="researcher-${project.studentId}"></div>
                `;

                if (project.status === 'Ongoing') {
                    ongoingProjects.appendChild(projectDiv);
                } else if (project.status === 'Finished') {
                    finishedProjects.appendChild(projectDiv);
                }

                // Load researcher data (assuming researcher data is available)
                fetch('responses.csv')
                    .then(response => response.text())
                    .then(data => {
                        const rows = parseCSV(data).slice(1); // Skip the header row
                        rows.forEach(researcherCols => {
                            if (researcherCols[2] === project.studentId) {
                                const researcherCard = document.getElementById(`researcher-${project.studentId}`);
                                if (researcherCard) {
                                    researcherCard.innerHTML = `
                                        <div class="card">
                                            <img src="images/researchers/${researcherCols[2]}.jpg" alt="${researcherCols[1]}" onerror="this.onerror=null; this.src='images/researchers/default.png';">
                                            <h3>${researcherCols[1]}</h3>
                                            <p><span class="label">Email:</span> ${researcherCols[4]}</p>
                                            <p><span class="label">Research Interest:</span> ${researcherCols[5]}</p>
                                            <p><span class="label">Designation:</span> ${researcherCols[7]}</p>
                                            <p><span class="label">Publications (Scopus Indexed):</span> ${researcherCols[8]}</p>
                                            <p><a href="${researcherCols[9]}" target="_blank">Google Scholar</a></p>
                                            <p><a href="${researcherCols[10]}" target="_blank">LinkedIn</a></p>
                                        </div>
                                    `;
                                }
                            }
                        });
                    })
                    .catch(error => console.error('Error fetching researcher data:', error));
            });
        })
        .catch(error => console.error('Error fetching project data:', error));
});

function handleImageError(image) {
    if (!image.src.endsWith('default.jpg')) {
        image.src = 'projects/images/default.jpg';
    } else {
        console.error('Default image not found, breaking loop.');
        image.src = ''; // Ensure the loop breaks by setting src to empty
    }
}
