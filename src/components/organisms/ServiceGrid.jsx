import React from "react";
import { motion } from "framer-motion";
import ServiceCard from "@/components/molecules/ServiceCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const ServiceGrid = ({ 
  services, 
  loading, 
  error, 
  onNewRequest, 
  onViewDetails, 
  onToggleFavorite,
  favorites = [],
  onRetry 
}) => {
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (!services || services.length === 0) {
    return (
      <Empty
        title="No services found"
        description="No verification services match your current filters. Try adjusting your search criteria."
        actionText="Clear Filters"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {services.map((service, index) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
<ServiceCard
            service={service}
            onNewRequest={onNewRequest}
            onViewDetails={onViewDetails}
            onToggleFavorite={onToggleFavorite}
            isFavorite={favorites.includes(service.Id)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ServiceGrid;