import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StatsOverview = ({ stats }) => {
const kpiCards = [
    {
      title: "Users",
      value: stats?.users?.value || 0,
      icon: "Users",
      color: "blue",
      trend: stats?.users?.trend || [],
      change: stats?.users?.change || 0,
      suffix: ""
    },
    {
      title: "Sales",
      value: stats?.sales?.value || 0,
      icon: "ShoppingCart",
      color: "green",
      trend: stats?.sales?.trend || [],
      change: stats?.sales?.change || 0,
      suffix: ""
    },
    {
      title: "Revenue",
      value: stats?.revenue?.value || 0,
      icon: "DollarSign",
      color: "purple",
      trend: stats?.revenue?.trend || [],
      change: stats?.revenue?.change || 0,
      suffix: "K",
      prefix: "$"
    },
    {
      title: "Bounce Rate",
      value: stats?.bounceRate?.value || 0,
      icon: "TrendingDown",
      color: "red",
      trend: stats?.bounceRate?.trend || [],
      change: stats?.bounceRate?.change || 0,
      suffix: "%"
    }
  ];

const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600 text-blue-600 bg-blue-50",
      green: "from-green-500 to-green-600 text-green-600 bg-green-50",
      purple: "from-purple-500 to-purple-600 text-purple-600 bg-purple-50",
      red: "from-red-500 to-red-600 text-red-600 bg-red-50"
    };
    return colors[color] || colors.blue;
  };

  const renderSparkline = (trend, color) => {
    if (!trend || trend.length === 0) return null;
    
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min || 1;
    
    const points = trend.map((value, index) => {
      const x = (index / (trend.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 16;
      return `${x},${y}`;
    }).join(' ');

    const strokeColor = color === 'blue' ? '#3b82f6' : 
                       color === 'green' ? '#10b981' :
                       color === 'purple' ? '#8b5cf6' : '#ef4444';

    return (
      <svg width="60" height="20" className="opacity-75">
        <polyline
          points={points}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiCards.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {kpi.title}
              </p>
              <div className="flex items-baseline space-x-1">
                {kpi.prefix && (
                  <span className="text-2xl font-bold text-gray-900">
                    {kpi.prefix}
                  </span>
                )}
                <span className="text-3xl font-bold text-gray-900">
                  {kpi.value.toLocaleString()}
                </span>
                {kpi.suffix && (
                  <span className="text-xl font-bold text-gray-900">
                    {kpi.suffix}
                  </span>
                )}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${getColorClasses(kpi.color).split(" ")[2]}`}>
              <ApperIcon 
                name={kpi.icon} 
                className={`w-5 h-5 ${getColorClasses(kpi.color).split(" ")[1]}`}
              />
            </div>
          </div>
          
          <div className="flex items-end justify-between">
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${
                kpi.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {kpi.change >= 0 ? '+' : ''}{kpi.change}%
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
            {renderSparkline(kpi.trend, kpi.color)}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsOverview;