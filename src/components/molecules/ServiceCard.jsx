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
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 cursor-pointer group relative overflow-hidden"
      onClick={() => onViewDetails(service)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-red-100 via-red-200 to-pink-100 rounded-xl shadow-lg group-hover:shadow-red-200/50 transition-shadow duration-300">
            <ApperIcon name={service.icon} className="w-7 h-7 text-red-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
<div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.15, rotate: 12 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(service);
              }}
              className={`p-2.5 rounded-xl transition-all duration-300 shadow-md ${
                isFavorite 
                  ? 'bg-gradient-to-br from-yellow-100 to-orange-100 text-yellow-600 hover:from-yellow-200 hover:to-orange-200 shadow-yellow-200/50' 
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 hover:from-gray-200 hover:to-gray-300 hover:text-yellow-600'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <ApperIcon 
                name="Star" 
                size={16} 
                className={`transition-colors duration-200 ${isFavorite ? 'fill-current' : ''}`} 
              />
            </motion.button>
            <Badge 
              variant={getBadgeVariant(service.requestCount)}
              className="font-semibold px-3 py-1 text-xs shadow-sm"
            >
              {service.requestCount}
            </Badge>
          </div>
        </div>

<h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-700 transition-colors duration-300">
          {service.name}
        </h3>

<p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {service.description}
        </p>

<div className="flex items-center justify-between text-sm text-gray-500 mb-5 bg-gray-50/50 rounded-lg p-3">
          <span className="flex items-center">
            <ApperIcon name="Clock" className="w-4 h-4 mr-2 text-blue-500" />
            <span className="font-medium">{service.processingTime}</span>
          </span>
          <span className="font-bold text-lg text-gray-900 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            £{service.cost}
          </span>
        </div>

<Button
          size="md"
          onClick={(e) => {
            e.stopPropagation();
            onNewRequest(service);
          }}
          className="w-full shadow-lg hover:shadow-xl group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-pink-600 transform group-hover:scale-105 transition-all duration-300"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>
    </motion.div>
  );
};

export default ServiceCard;