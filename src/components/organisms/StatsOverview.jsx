import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StatsOverview = ({ stats }) => {
const statCards = [
    {
      title: "Total Pending Requests",
      value: stats?.pendingRequests || 0,
      icon: "Clock",
      color: "yellow",
      trend: `${stats?.pendingRequests || 0} active`
    },
    {
      title: "Completed Verifications",
      value: stats?.completedRequests || 0,
      icon: "CheckCircle",
      color: "green",
      trend: `${stats?.completedRequests || 0} verified`
    },
    {
      title: "Average Processing Time",
      value: `${stats?.averageProcessingTime || 0}d`,
      icon: "Timer",
      color: "blue",
      trend: "days avg"
    },
    {
      title: "Active Services",
      value: stats?.activeServices || 0,
      icon: "Shield",
      color: "red",
      trend: `${stats?.activeServices || 0} in use`
    }
  ];

const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600 text-blue-600",
      yellow: "from-yellow-500 to-yellow-600 text-yellow-600",
      green: "from-green-500 to-green-600 text-green-600",
      red: "from-red-500 to-red-600 text-red-600"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stat.value.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {stat.trend} from last month
              </p>
            </div>
            <div className={`p-3 rounded-lg bg-gradient-to-br ${getColorClasses(stat.color).split(" ")[0]} ${getColorClasses(stat.color).split(" ")[1]} bg-opacity-10`}>
              <ApperIcon 
                name={stat.icon} 
                className={`w-6 h-6 ${getColorClasses(stat.color).split(" ")[2]}`}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsOverview;