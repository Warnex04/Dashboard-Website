document.getElementById('upload-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('file-input');
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
                createScatterPlot(results.data);
                
                // Call the bar charts creation function
                createBarCharts(results.data);
            }
        });
    } else {
        alert('Please select a CSV file first.');
    }
});

function createScatterPlot(data) {
    // Clear any previous scatter plots
    const existingCanvas = document.getElementById('scatterPlot');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    const canvas = document.createElement('canvas');
    canvas.id = 'scatterPlot';
    document.body.appendChild(canvas);

    // Filter and map the data for each variety
    const setosaData = data.filter(item => item.variety.trim() === 'Setosa').map(item => ({
        x: item['sepal.length'],
        y: item['sepal.width']
    }));
    const versicolorData = data.filter(item => item.variety.trim() === 'Versicolor').map(item => ({
        x: item['sepal.length'],
        y: item['sepal.width']
    }));
    const virginicaData = data.filter(item => item.variety.trim() === 'Virginica').map(item => ({
        x: item['sepal.length'],
        y: item['sepal.width']
    }));

    const scatterData = {
        datasets: [{
            label: 'Setosa',
            data: setosaData,
            backgroundColor: 'rgba(255, 99, 132, 0.4)',
            borderColor: 'rgba(255, 99, 132, 1)'
        }, {
            label: 'Versicolor',
            data: versicolorData,
            backgroundColor: 'rgba(54, 162, 235, 0.4)',
            borderColor: 'rgba(54, 162, 235, 1)'
        }, {
            label: 'Virginica',
            data: virginicaData,
            backgroundColor: 'rgba(75, 192, 192, 0.4)',
            borderColor: 'rgba(75, 192, 192, 1)'
        }]
    };

    new Chart(canvas, {
        type: 'scatter',
        data: scatterData,
        options: {
            scales: {
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        borderColor: 'white'
                    },
                    title: {
                        display: true,
                        text: 'Sepal Length (cm)',
                        color: 'white'
                    }
                },
                y: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        borderColor: 'white'
                    },
                    title: {
                        display: true,
                        text: 'Sepal Width (cm)',
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

function createBarCharts(data) {
    // Aggregate data for each species
    const species = ['Setosa', 'Versicolor', 'Virginica'];
    const features = ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width']; // Use friendly names
    const operations = ['Mean', 'Sum', 'Min', 'Max']; // Array of operations for naming
    const speciesData = species.map(speciesName => {
      return features.map(feature => {
        // Perform the data aggregation here
        // This example assumes you're calculating the mean
        const filteredData = data.filter(item => item.variety.trim() === speciesName);
        const sum = filteredData.reduce((acc, curr) => acc + curr[feature.toLowerCase().replace(' ', '.')], 0);
        return sum / filteredData.length; // mean
      });
    });
  
    // Create a bar chart for each feature with the operation name
    features.forEach((feature, index) => {
      const canvasId = `chart${index + 1}`;
      const canvas = document.getElementById(canvasId);
      if (!canvas) {
        console.error(`Canvas with id ${canvasId} not found.`);
        return;
      }
      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: species,
          datasets: speciesData.map((data, speciesIndex) => ({
            label: species[speciesIndex],
            data: [data[index]], // each dataset has only one value per species for this feature
            backgroundColor: `rgba(${255 - speciesIndex * 100}, ${99 + speciesIndex * 100}, ${132 + speciesIndex * 100}, 1)`,
            borderColor: `rgba(${255 - speciesIndex * 100}, ${99 + speciesIndex * 100}, ${132 + speciesIndex * 100}, 1)`,
            grouped: true
          }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins:{
                legend: {
                    title:{
                        display: true,
                        text: `${operations[index]} of ${feature}`,
                        color: 'white'
                    },
                    display: true,
                    position: 'top',
                    maxHeight: 60,
                    maxWidth: 60,
                    labels: {
                      usePointStyle: true,
                      padding: 4,
                      color:'white',
                      font: {
                        size: 14, // Set initial font size
                      }
                    }
                  }
            },
            scales:{
                x:{
                    ticks:{
                        display: false
                    },
                    grid:{
                        color: 'white'
                    }
                },
                y:{
                    grid:{
                        color: 'white'
                    },
                    title:{
                        display: false
                    },
                    ticks:{
                        color: 'white'
                    }
                }
            }

            
        }
      });
    });
  }
  