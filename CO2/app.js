const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

class SearchEmissionsTracker {
  constructor() {
    this.dailyStats = new Map();
    this.currentDate = new Date().toISOString().split('T')[0];
    this.initializeDay();
    
    // Data center energy mix (example values)
    this.energyMix = {
      renewable: 0.60,  // 60% renewable energy
      nonRenewable: 0.40  // 40% non-renewable energy
    };
    
    // Carbon intensity factors (kg CO2 per kWh)
    this.carbonIntensity = {
      renewable: 0.025,
      nonRenewable: 0.685
    };
  }

  initializeDay() {
    if (!this.dailyStats.has(this.currentDate)) {
      this.dailyStats.set(this.currentDate, {
        totalSearches: 0,
        currentSearchesPerSecond: 1500,
        totalEnergyUsed: 0,  // in kWh
        totalCarbonEmitted: 0,  // in kg
        searchHistory: [],
        peakSearchRate: 0,
        averageSearchDuration: 0,
        searchDurations: []
      });
    }
  }

  calculateSearchEnergy(complexity = 1) {
    // Energy per search in kWh (based on complexity)
    const baseEnergy = 0.0003;  // Base energy for a simple search
    return baseEnergy * complexity;
  }

  calculateEmissions() {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    
    // Check if we need to start tracking a new day
    if (date !== this.currentDate) {
      this.currentDate = date;
      this.initializeDay();
    }

    const stats = this.dailyStats.get(this.currentDate);
    
    // Simulate realistic search variations based on time of day
    const hour = now.getHours();
    const baseRate = 15000; // Base searches per second
    const timeMultiplier = Math.sin((hour / 24) * Math.PI) + 1.5; // Daily pattern
    const randomVariation = (Math.random() * 2000) - 1000;
    
    stats.currentSearchesPerSecond = Math.max(
      1000, 
      Math.floor(baseRate * timeMultiplier + randomVariation)
    );

    // Update total searches
    stats.totalSearches += stats.currentSearchesPerSecond;
    
    // Calculate energy and emissions
    const energyPerSearch = this.calculateSearchEnergy();
    const newEnergy = stats.currentSearchesPerSecond * energyPerSearch;
    
    // Calculate emissions based on energy mix
    const renewableEmissions = newEnergy * this.energyMix.renewable * this.carbonIntensity.renewable;
    const nonRenewableEmissions = newEnergy * this.energyMix.nonRenewable * this.carbonIntensity.nonRenewable;
    const totalNewEmissions = renewableEmissions + nonRenewableEmissions;
    
    // Update statistics
    stats.totalEnergyUsed += newEnergy;
    stats.totalCarbonEmitted += totalNewEmissions;
    stats.peakSearchRate = Math.max(stats.peakSearchRate, stats.currentSearchesPerSecond);
    
    // Calculate average search duration (simulated)
    const currentDuration = 0.5 + (Math.random() * 0.5);
    stats.searchDurations.push(currentDuration);
    if (stats.searchDurations.length > 100) stats.searchDurations.shift();
    stats.averageSearchDuration = stats.searchDurations.reduce((a, b) => a + b) / stats.searchDurations.length;

    return {
      date: this.currentDate,
      totalSearches: Math.round(stats.totalSearches),
      currentSearchesPerSecond: Math.round(stats.currentSearchesPerSecond),
      totalEnergyUsed: stats.totalEnergyUsed.toFixed(2),
      carbonEmissions: {
        perSecond: totalNewEmissions.toFixed(6),
        perMinute: (totalNewEmissions * 60).toFixed(6),
        perHour: (totalNewEmissions * 3600).toFixed(6),
        total: stats.totalCarbonEmitted.toFixed(6)
      },
      peakSearchRate: stats.peakSearchRate,
      averageSearchDuration: stats.averageSearchDuration.toFixed(2),
      energyMix: this.energyMix
    };
  }
}

const tracker = new SearchEmissionsTracker();

app.get('/api/search-data', (req, res) => {
  const data = tracker.calculateEmissions();
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
