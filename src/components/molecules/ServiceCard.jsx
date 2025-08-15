import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const ServiceCard = ({ service, onNewRequest, onViewDetails }) => {
  const getBadgeVariant = (count) => {
    if (count < 0) return "error";
    if (count === 0) return "default";
    return "red";
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200 cursor-pointer"
      onClick={() => onViewDetails(service)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
          <ApperIcon name={service.icon} className="w-6 h-6 text-red-600" />
        </div>
        <Badge 
          variant={getBadgeVariant(service.requestCount)}
          className="font-semibold"
        >
          {service.requestCount}
        </Badge>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {service.name}
      </h3>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {service.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span className="flex items-center">
          <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
          {service.processingTime}
        </span>
        <span className="font-medium text-gray-900">
          £{service.cost}
        </span>
      </div>

      <Button
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onNewRequest(service);
        }}
        className="w-full"
      >
        <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
        New Request
      </Button>
    </motion.div>
  );
};

export default ServiceCard;