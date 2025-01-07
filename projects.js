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
                if (cols.length < 8) return; // Skip incomplete rows

                const project = {
                    title: cols[0],
                    productName: cols[1],
                    description: cols[2],
                    status: cols[3],
                    publisher: cols[4],
                    doi: cols[5],
                    studentId: cols[6],
                    image: `projects/images/${cols[1]}.jpg`
                };

                const projectDiv = document.createElement('div');
                projectDiv.classList.add('project');
                projectDiv.innerHTML = `
                    <img src="${project.image}" alt="${project.title}">
                    <div class="project-info">
                        <h4>${project.title}</h4>
                        <p>${project.description}</p>
                        <p>Publisher: ${project.publisher}</p>
                        <p><a href="${project.doi}" target="_blank">DOI</a></p>
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
                                researcherCard.innerHTML = `
                                    <div class="card">
                                        <img src="images/researchers/${researcherCols[2]}.jpg" alt="${researcherCols[1]}" onerror="this.onerror=null; this.src='images/researchers/${researcherCols[2]}.png';">
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
                        });
                    })
                    .catch(error => console.error('Error fetching the CSV file:', error));
            });
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
});
