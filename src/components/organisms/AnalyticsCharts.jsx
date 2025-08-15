import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Chart from "react-apexcharts";
import Loading from "@/components/ui/Loading";

const AnalyticsCharts = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <Loading />
          </div>
        ))}
      </div>
    );
  }

  // Sales Trend Chart Configuration
  const salesTrendOptions = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#3b82f6', '#10b981'],
    xaxis: {
      categories: data.salesTrend.map(item => item.month),
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        },
        formatter: (value) => `$${value}K`
      }
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 3
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value}K`
      }
    }
  };

  const salesTrendSeries = [
    {
      name: 'Sales',
      data: data.salesTrend.map(item => item.sales)
    },
    {
      name: 'Orders',
      data: data.salesTrend.map(item => item.orders)
    }
  ];

  // Revenue by Category Chart Configuration
  const revenueDonutOptions = {
    chart: {
      type: 'donut',
      height: 300
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    labels: data.revenueByCategory.map(item => item.category),
    legend: {
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Revenue',
              formatter: () => `$${data.revenueByCategory.reduce((sum, item) => sum + item.value, 0)}K`
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value}K`
      }
    }
  };

  const revenueDonutSeries = data.revenueByCategory.map(item => item.value);

  // Conversion Funnel Chart Configuration
  const conversionFunnelOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        distributed: true
      }
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
    xaxis: {
      categories: data.conversionFunnel.map(item => item.stage),
      labels: {
        formatter: (value) => `${value}%`
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        }
      }
    },
    grid: {
      borderColor: '#e5e7eb'
    },
    legend: { show: false },
    tooltip: {
      y: {
        formatter: (value, { dataPointIndex }) => {
          const item = data.conversionFunnel[dataPointIndex];
          return `${value}% (${item.count.toLocaleString()} users)`;
        }
      }
    }
  };

  const conversionFunnelSeries = [{
    data: data.conversionFunnel.map(item => item.percentage)
  }];

  return (
    <div className="space-y-6">
      {/* Sales & Orders Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sales & Orders Trend</h3>
            <p className="text-sm text-gray-600">Monthly sales performance and order volume</p>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <ApperIcon name="TrendingUp" size={20} />
            <span className="text-sm font-medium">+12.5% vs last period</span>
          </div>
        </div>
        <Chart 
          options={salesTrendOptions} 
          series={salesTrendSeries} 
          type="line" 
          height={300} 
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue by Category</h3>
            <p className="text-sm text-gray-600">Distribution of revenue across different categories</p>
          </div>
          <Chart 
            options={revenueDonutOptions} 
            series={revenueDonutSeries} 
            type="donut" 
            height={300} 
          />
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Conversion Funnel</h3>
            <p className="text-sm text-gray-600">User journey through conversion stages</p>
          </div>
          <Chart 
            options={conversionFunnelOptions} 
            series={conversionFunnelSeries} 
            type="bar" 
            height={300} 
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;