import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const ServiceCard = ({ service, onNewRequest, onViewDetails, onToggleFavorite, isFavorite = false }) => {
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
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(service);
            }}
            className={`p-2 rounded-full transition-all duration-200 ${
              isFavorite 
                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-yellow-600'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <ApperIcon 
              name="Star" 
              size={16} 
              className={isFavorite ? 'fill-current' : ''} 
            />
          </motion.button>
          <Badge 
            variant={getBadgeVariant(service.requestCount)}
            className="font-semibold"
          >
            {service.requestCount}
          </Badge>
        </div>
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