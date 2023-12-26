document.getElementById('jsonFile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            try {
                const json = JSON.parse(content);
                displayDataInTable(json);
            } catch (error) {
                console.error('Invalid JSON file.', error);
            }
        };
        reader.readAsText(file);
    } else {
        console.error('Please upload a valid JSON file.');
    }
});

function displayDataInTable(data) {
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');

    // Clear previous table contents
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    // Assuming all objects have the same structure, use the keys from the first object for the table headers
    if (data.length > 0) {
        const firstItem = data[0];
        const headers = Object.keys(firstItem);
        
        // Create header row
        headers.forEach(header => {
            const headerCell = document.createElement('th');
            headerCell.textContent = header;
            tableHeader.appendChild(headerCell);
        });

        // Create table rows for each object in the JSON array
        data.forEach(item => {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const cell = document.createElement('td');
                cell.textContent = item[header];
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });
    }
}

// Create a button to add a new row to the table
const addButton = document.createElement('button');
addButton.textContent = 'Add';
addButton.addEventListener('click', function() {
    // Get the headers from the table
    const headers = Array.from(document.querySelectorAll('#tableHeader th')).map(th => th.textContent);

    // Create a new row with empty cells
    const newRow = document.createElement('tr');
    headers.forEach(header => {
        const newCell = document.createElement('td');
        newCell.contentEditable = true; // Make the cell editable
        newRow.appendChild(newCell);
    });

    // Append the new row to the table body
    document.getElementById('tableBody').appendChild(newRow);
});
document.body.appendChild(addButton);

// Create a button to delete the selected row from the table
const deleteButton = document.createElement('button');
deleteButton.textContent = 'Delete';
deleteButton.addEventListener('click', function() {
    // Get the selected row from the table
    const selectedRow = document.querySelector('#tableBody tr.selected');

    // If there is a selected row, remove it from the table body
    if (selectedRow) {
        document.getElementById('tableBody').removeChild(selectedRow);
    } else {
        alert('Please select a row to delete.');
    }
});
document.body.appendChild(deleteButton);

// Create a button to save the table data to a JSON file
const saveButton = document.createElement('button');
saveButton.textContent = 'Save';
saveButton.addEventListener('click', function() {
    // Get the headers and the rows from the table
    const headers = Array.from(document.querySelectorAll('#tableHeader th')).map(th => th.textContent);
    const rows = Array.from(document.querySelectorAll('#tableBody tr'));

    // Create an array of objects from the table data
    const data = rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent);
        const obj = {};
        headers.forEach((header, i) => {
            obj[header] = cells[i];
        });
        return obj;
    });

    // Convert the array to a JSON string
    const json = JSON.stringify(data, null, 2);

    // Create a blob from the JSON string
    const blob = new Blob([json], {type: 'application/json'});

    // Create a URL from the blob
    const url = URL.createObjectURL(blob);

    // Create a link to download the JSON file
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    link.click();

    // Revoke the URL
    URL.revokeObjectURL(url);
});
document.body.appendChild(saveButton);

// Add a click event listener to the table body to select a row
document.getElementById('tableBody').addEventListener('click', function(event) {
    // Get the clicked row
    const row = event.target.parentNode;

    // Remove the selected class from any previous row
    const previousRow = document.querySelector('#tableBody tr.selected');
    if (previousRow) {
        previousRow.classList.remove('selected');
    }

    // Add the selected class to the clicked row
    row.classList.add('selected');
});
