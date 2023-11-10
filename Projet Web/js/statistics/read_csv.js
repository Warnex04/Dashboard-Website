function readCSVFile() {
    var files = document.querySelector('#file').files;
    //const fileInput = document.getElementById('file-post');
    //const file = fileInput.files[0];

    if (files.length > 0) {

        // Selected file
        var file = files[0];

        // FileReader Object
        var reader = new FileReader();

        // Read file as string 
        reader.readAsText(file);

        // Load event
        reader.onload = function (event) {
        // Read file data
        var csvdata = event.target.result;

        // Split by line break to get rows Array
        var rowData = csvdata.split('\n');


        // Get the filterList element
        const filterList = document.getElementById('filterList');

        // Create header row
        var headerColData = rowData[0].split(',');
        headerColData.forEach((columnName, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('nav-item');

            const link = document.createElement('a');
            link.classList.add('nav-link', 'd-flex', 'align-items-center', 'gap-2');
            link.href = '#'; // Replace with actual link if needed

            const svgIcon = document.createElement('svg');
            svgIcon.classList.add('bi');
            svgIcon.innerHTML = '<use xlink:href="#file-earmark-text"/>';

            const textNode = document.createTextNode(columnName);

            link.appendChild(svgIcon);
            link.appendChild(textNode);
            listItem.appendChild(link);
            filterList.appendChild(listItem);
        });

            // <table > <thead>
            var theadEl = document.getElementById('tblcsvdata').getElementsByTagName('thead')[0];
            theadEl.innerHTML = "";

            // Create header row
            var headerRow = theadEl.insertRow();

            // Split by comma (,) to get column Array from the first row
            var headerColData = rowData[0].split(',');

            // Loop through the header column Array
            for (var col = 0; col < headerColData.length; col++) {

                // Insert a cell at the end of the header row
                var newHeaderCell = headerRow.insertCell();
                newHeaderCell.innerHTML = headerColData[col];

            }

            // <table > <tbody>
            var tbodyEl = document.getElementById('tblcsvdata').getElementsByTagName('tbody')[0];
            tbodyEl.innerHTML = "";

            // Loop on the row Array (start from 1 to skip the header row)
            for (var row = 1; row < rowData.length; row++) {

                // Insert a row at the end of table
                var newRow = tbodyEl.insertRow();

                // Split by comma (,) to get column Array
                var rowColData = rowData[row].split(',');

                // Loop on the row column Array
                for (var col = 0; col < rowColData.length; col++) {

                    // Insert a cell at the end of the row
                    var newCell = newRow.insertCell();
                    newCell.innerHTML = rowColData[col];

                }

            }
        };

    } else {
        alert("Please select a file.");
    }

}
