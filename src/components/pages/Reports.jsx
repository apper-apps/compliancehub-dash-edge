import React from "react";
import { motion } from "framer-motion";
import Layout from "@/components/organisms/Layout";
import ApperIcon from "@/components/ApperIcon";

const Reports = () => {
  const reportTypes = [
    {
      title: "Request Summary",
      description: "Overview of all verification requests by status and service type",
      icon: "BarChart3",
      color: "blue"
    },
    {
      title: "Compliance Audit",
      description: "Detailed compliance report for regulatory requirements",
      icon: "Shield",
      color: "green"
    },
    {
      title: "Performance Metrics",
      description: "Service performance and processing time analytics",
      icon: "TrendingUp",
      color: "purple"
    },
    {
      title: "Cost Analysis",
      description: "Breakdown of verification costs by service and time period",
      icon: "DollarSign",
      color: "red"
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">
            Generate detailed reports and analyze your verification data
          </p>
        </motion.div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTypes.map((report, index) => (
            <motion.div
              key={report.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg bg-${report.color}-100`}>
                  <ApperIcon name={report.icon} className={`w-6 h-6 text-${report.color}-600`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{report.description}</p>
                  <div className="flex items-center mt-4 text-red-600 group-hover:text-red-700">
                    <span className="text-sm font-medium">Generate Report</span>
                    <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Reports;