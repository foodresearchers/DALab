document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded');
    
    fetch('responses.csv')
    .then(response => {
        console.log('Fetching CSV file');
        return response.text();
    })
    .then(data => {
        console.log('CSV file fetched');
        const rows = data.split('\n').slice(1); // Skip the header row
        const currentResearchers = {};
        const formerResearchers = {};

        rows.forEach(row => {
            const cols = row.split(',');
            console.log('Processing row:', cols);

            if (cols.length < 12) {
                console.log('Skipping incomplete row:', row);
                return; // Skip incomplete rows
            }

            const researcher = {
                name: cols[1].trim(), // Name
                id: cols[2].trim(), // Student ID
                batch: cols[3].trim(), // Batch
                email: cols[4].trim(), // Email
                interest: cols[5].trim(), // Research interest
                type: cols[6].trim(), // Current or Former Researcher?
                designation: cols[7].trim(), // Current Designation
                publications: cols[8].trim(), // Number of Publications (Scopus Indexed)
                scholarAccount: cols[9].trim(), // Google Scholar Account
                linkedInAccount: cols[10].trim(), // LinkedIn Account
                img: `images/researchers/${cols[2].trim()}.jpg` // Fetch image by student ID
            };

            console.log('Researcher object created:', researcher);

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

        console.log('Current Researchers:', currentResearchers);
        console.log('Former Researchers:', formerResearchers);

        const appendResearchers = (category, containerId) => {
            if (Object.keys(category).length === 0) {
                console.log(`No researchers found for ${containerId}`);
                return;
            }

            Object.keys(category).forEach(batch => {
                const batchGroup = document.createElement('div');
                batchGroup.innerHTML = `<h3>${batch} Batch</h3>`;

                category[batch].forEach(research
