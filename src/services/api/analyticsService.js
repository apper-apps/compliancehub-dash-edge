const DELAY_MS = 400;

// Generate mock sparkline data
const generateSparklineData = (length = 12) => {
  return Array.from({ length }, () => Math.floor(Math.random() * 100) + 20);
};

// Mock KPI data
const mockKpiStats = {
  users: {
    value: 8432,
    trend: generateSparklineData(),
    change: 12.5
  },
  sales: {
    value: 1247,
    trend: generateSparklineData(),
    change: 8.3
  },
  revenue: {
    value: 156.7,
    trend: generateSparklineData(),
    change: -2.1
  },
  bounceRate: {
    value: 24.8,
    trend: generateSparklineData(),
    change: -5.2
  }
};

// Mock sales trend data
const mockSalesTrend = [
  { month: 'Jan', sales: 45, orders: 125 },
  { month: 'Feb', sales: 52, orders: 142 },
  { month: 'Mar', sales: 48, orders: 138 },
  { month: 'Apr', sales: 61, orders: 156 },
  { month: 'May', sales: 55, orders: 149 },
  { month: 'Jun', sales: 67, orders: 178 },
  { month: 'Jul', sales: 72, orders: 192 },
  { month: 'Aug', sales: 68, orders: 184 },
  { month: 'Sep', sales: 75, orders: 201 },
  { month: 'Oct', sales: 82, orders: 219 },
  { month: 'Nov', sales: 79, orders: 207 },
  { month: 'Dec', sales: 88, orders: 235 }
];

// Mock revenue by category data
const mockRevenueByCategory = [
  { category: 'Compliance', value: 85.2 },
  { category: 'Verification', value: 64.8 },
  { category: 'Audit', value: 42.1 },
  { category: 'Consulting', value: 28.5 },
  { category: 'Training', value: 15.4 }
];

// Mock conversion funnel data
const mockConversionFunnel = [
  { stage: 'Website Visitors', percentage: 100, count: 15420 },
  { stage: 'Sign-ups', percentage: 15.2, count: 2344 },
  { stage: 'Active Users', percentage: 8.7, count: 1342 },
  { stage: 'Paid Customers', percentage: 3.4, count: 524 }
];

export const analyticsService = {
  async getKpiStats() {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    
    // Simulate real-time updates
    const updatedStats = { ...mockKpiStats };
    Object.keys(updatedStats).forEach(key => {
      const variance = (Math.random() - 0.5) * 10; // ±5% variance
      updatedStats[key] = {
        ...updatedStats[key],
        value: Math.max(0, mockKpiStats[key].value + variance),
        trend: generateSparklineData()
      };
    });
    
    return updatedStats;
  },

  async getSalesTrend() {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    return [...mockSalesTrend];
  },

  async getRevenueByCategory() {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    return [...mockRevenueByCategory];
  },

  async getConversionFunnel() {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    return [...mockConversionFunnel];
  },

  async getRealtimeMetrics() {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    
    return {
      activeUsers: Math.floor(Math.random() * 500) + 200,
      currentSessions: Math.floor(Math.random() * 150) + 50,
      bounceRate: (Math.random() * 10 + 20).toFixed(1),
      avgSessionDuration: `${Math.floor(Math.random() * 3 + 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
    };
  }
};