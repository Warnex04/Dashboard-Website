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