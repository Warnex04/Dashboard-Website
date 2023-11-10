// Chart.register(BoxPlotController)
$(document).ready(function(){
  $('form input').change(function () {
    $('form p').text(this.files.length + " file(s) selected");
  });
});

document.getElementById('dragForm').addEventListener('submit', function(event) {
    event.preventDefault();
    //readCSVFile()
    
    const fileInput = document.getElementById('file-post');
    const file = fileInput.files[0];

    if (file) {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: function(results) {
                console.log(results);
                if (results.data.length === 0 || results.errors.length > 0) {
                    alert('No data to display or there was an error parsing the CSV.');
                    return;
                }
                
                

                
                // Call the scatter plot creation function
                //createScatterPlot(results.data);
                
                // Call the bar charts creation function
                //createBarCharts(results.data);

                // Call the pie charts creation function
                //createPieChart(results.data)

                // Call the radar charts creation function
                //createRadarChart(results.data)

                // Call the Boxplot charts creation function
                // createBoxPlots(results.data)
            }
        });
    } else {
        alert('Please select a CSV file first.');
    }
});

