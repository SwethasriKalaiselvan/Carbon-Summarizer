document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const elements = {
    currentDate: document.querySelector('#current-date span'),
    totalSearches: document.getElementById('total-searches'),
    currentSearches: document.getElementById('current-searches'),
    peakSearchRate: document.getElementById('peak-search-rate'),
    totalEnergy: document.getElementById('total-energy'),
    carbonPerSecond: document.getElementById('carbon-per-second'),
    carbonPerHour: document.getElementById('carbon-per-hour'),
    totalCarbonEmitted: document.getElementById('total-carbon-emitted'),
    renewableProgress: document.getElementById('renewable-progress'),
    nonRenewableProgress: document.getElementById('non-renewable-progress'),
    impactEquivalents: document.getElementById('impact-equivalents'),
    emissionChart: document.getElementById('emission-chart')
  };

  // Chart initialization
  let emissionChart;
  const maxDataPoints = 50;
  const chartData = {
    labels: [],
    emissions: []
  };

  function initializeChart() {
    emissionChart = new Chart(elements.emissionChart, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Carbon Emissions (kg CO₂/s)',
          data: [],
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'kg CO₂ per second'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          }
        }
      }
    });
  }

  function updateChart(timestamp, emission) {
    if (chartData.labels.length >= maxDataPoints) {
      chartData.labels.shift();
      chartData.emissions.shift();
    }
    
    chartData.labels.push(timestamp);
    chartData.emissions.push(emission);

    emissionChart.data.labels = chartData.labels;
    emissionChart.data.datasets[0].data = chartData.emissions;
    emissionChart.update();
  }

  function calculateEnvironmentalEquivalents(carbonKg) {
    return [
      {
        metric: 'Tree Days',
        value: Math.round(carbonKg / 0.0218),
        description: 'Days of carbon absorption by a mature tree'
      },
      {
        metric: 'Car Miles',
        value: Math.round(carbonKg * 2.32),
        description: 'Equivalent miles driven by an average car'
      },
      {
        metric: 'Smartphone Charges',
        value: Math.round(carbonKg * 1250),
        description: 'Number of full smartphone charges'
      }
    ];
  }

  function updateEnvironmentalEquivalents(carbonKg) {
    const equivalents = calculateEnvironmentalEquivalents(carbonKg);
    elements.impactEquivalents.innerHTML = equivalents.map(eq => `
      <div class="data-item">
        <p>${eq.metric}</p>
        <span>${eq.value.toLocaleString()}</span>
        <small>${eq.description}</small>
      </div>
    `).join('');
  }

  function updateDisplay(data) {
    // Update date
    elements.currentDate.textContent = new Date().toLocaleDateString();
    
    // Update statistics
    elements.totalSearches.textContent = parseInt(data.totalSearches).toLocaleString();
    elements.currentSearches.textContent = parseInt(data.currentSearchesPerSecond).toLocaleString();
    elements.peakSearchRate.textContent = parseInt(data.peakSearchRate).toLocaleString();
    elements.totalEnergy.textContent = parseFloat(data.totalEnergyUsed).toFixed(2);
    
    // Update carbon emissions
    elements.carbonPerSecond.textContent = parseFloat(data.carbonEmissions.perSecond).toFixed(6);
    elements.carbonPerHour.textContent = parseFloat(data.carbonEmissions.perHour).toFixed(2);
    elements.totalCarbonEmitted.textContent = parseFloat(data.carbonEmissions.total).toFixed(2);
    
    // Update energy mix visualization
    elements.renewableProgress.style.width = `${data.energyMix.renewable * 100}%`;
    elements.nonRenewableProgress.style.width = `${data.energyMix.nonRenewable * 100}%`;
    
    // Update environmental equivalents
    updateEnvironmentalEquivalents(parseFloat(data.carbonEmissions.total));
    
    // Update chart
    updateChart(new Date().toLocaleTimeString(), parseFloat(data.carbonEmissions.perSecond));
  }

  function fetchData() {
    fetch('/api/search-data')
      .then(response => response.json())
      .then(updateDisplay)
      .catch(error => console.error('Error fetching data:', error));
  }

  // Initialize
  initializeChart();
  fetchData();
  setInterval(fetchData, 5000);
});