// Chart.register(BoxPlotController)
$(document).ready(function(){
  $('form input').change(function () {
    $('form p').text(this.files.length + " file(s) selected");
  });
});

document.getElementById('dragForm').addEventListener('submit', function(event) {
    event.preventDefault();
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
                createScatterPlot(results.data);
                
                // Call the bar charts creation function
                createBarCharts(results.data);

                // Call the pie charts creation function
                createPieChart(results.data)

                // Call the radar charts creation function
                createRadarChart(results.data)

                // Call the Boxplot charts creation function
                // createBoxPlots(results.data)
            }
        });
    } else {
        alert('Please select a CSV file first.');
    }
});

function createScatterPlot(data) {
    // Clear any previous scatter plots
    let container = document.querySelector('.scatterplot');
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }
    const canvas = document.createElement('canvas');
    canvas.id = 'scatterPlot';
    container.appendChild(canvas); // Append to the div with class 'scatterplot'

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

  function createPieChart(data) {
    // Assume we have an array of species with their corresponding counts
    const speciesCount = data.reduce((acc, item) => {
        acc[item.variety] = (acc[item.variety] || 0) + 1;
        return acc;
    }, {});

    // Convert the species count into a format suitable for the pie chart
    const pieChartData = {
        labels: Object.keys(speciesCount),
        datasets: [{
            data: Object.values(speciesCount),
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                // ...more colors for other categories
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                // ...more colors for other categories
            ],
            borderWidth: 1
        }]
    };

    // Get or create the canvas element
    let canvas = document.getElementById('pieChart1');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'pieChart1';
        document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');

    // If there's already a chart instance, destroy it to ensure a fresh start
    if (window.myPieChart instanceof Chart) {
        window.myPieChart.destroy();
    }

    // Create the pie chart
    window.myPieChart = new Chart(ctx, {
        type: 'pie',
        data: pieChartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // or any color you need
                    }
                },
                title: {
                    display: true,
                    text: 'Species Distribution',
                    color: 'white'
                }
            }
        }
    });
}

function createRadarChart(data) {
    // Aggregate data for each species as in createBarCharts
    const species = ['Setosa', 'Versicolor', 'Virginica'];
    const features = ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'];
  
    const speciesData = species.map(speciesName => {
      return features.map(feature => {
        const filteredData = data.filter(item => item.variety.trim() === speciesName);
        const sum = filteredData.reduce((acc, curr) => acc + curr[feature.toLowerCase().replace(' ', '.')], 0);
        return sum / filteredData.length; // mean
      });
    });
  
    // Convert to a format suitable for radar chart
    const radarChartData = {
      labels: features,
      datasets: speciesData.map((data, index) => ({
        label: species[index],
        data: data,
        fill: true,
        backgroundColor: `rgba(${255 - index * 100}, ${99 + index * 50}, ${132 + index * 50}, 0.3)`,
        borderColor: `rgba(${255 - index * 100}, ${99 + index * 50}, ${132 + index * 50}, 1)`,
        pointBackgroundColor: `rgba(${255 - index * 100}, ${99 + index * 50}, ${132 + index * 50}, 1)`,
        pointBorderColor: 'white'
      }))
    };
  
    // Get or create the canvas element
    let canvas = document.getElementById('radarChart');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'radarChart';
      document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
  
    // If there's already a chart instance, destroy it to ensure a fresh start
    if (window.myRadarChart instanceof Chart) {
      window.myRadarChart.destroy();
    }
  
    // Create the radar chart
    window.myRadarChart = new Chart(ctx, {
      type: 'radar',
      data: radarChartData,
      options: {
        elements: {
          line: {
            borderWidth: 3
          }
        },
        scales: {
          r: {
            angleLines: {
              display: false
            },
            suggestedMin: 0,
            suggestedMax: 5,
            ticks: {
              backdropColor: 'rgba(255, 255, 255, 0)',
              color: 'white'
            },
            grid:{
                color: 'rgba(255,255,255,0.6)'

            },
            pointLabels:{
                color:'white'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'white' // Change as needed
            }
          },
          title: {
            display: true,
            text: 'Average Feature Comparison by Species',
            color: 'white' // Change as needed
          }
        }
      }
    });
  }

