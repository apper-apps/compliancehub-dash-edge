import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/organisms/Layout";
import ServiceGrid from "@/components/organisms/ServiceGrid";
import { servicesService } from "@/services/api/servicesService";
import { toast } from "react-toastify";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const loadServices = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await servicesService.getAll();
      setServices(data);
    } catch (err) {
      setError("Failed to load services");
      console.error("Error loading services:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load favorites from localStorage
  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem('favoriteServices');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Save favorites to localStorage
  const saveFavorites = (newFavorites) => {
    try {
      localStorage.setItem('favoriteServices', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
      toast.error('Failed to save favorites');
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = (service) => {
    const isFavorite = favorites.includes(service.Id);
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter(id => id !== service.Id);
      toast.success(`Removed ${service.name} from favorites`);
    } else {
      newFavorites = [...favorites, service.Id];
      toast.success(`Added ${service.name} to favorites`);
    }
    
    saveFavorites(newFavorites);
  };

  useEffect(() => {
    loadServices();
    loadFavorites();
  }, []);

  const handleNewRequest = (service) => {
    toast.info(`Starting new request for ${service.name}`);
  };

  const handleViewDetails = (service) => {
    toast.info(`Viewing details for ${service.name}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Services</h1>
          <p className="text-gray-600">
            Browse all available verification and compliance services
          </p>
        </motion.div>

        {/* Services Grid */}
        <ServiceGrid
          services={services}
          loading={loading}
          error={error}
          onNewRequest={handleNewRequest}
          onViewDetails={handleViewDetails}
          onToggleFavorite={handleToggleFavorite}
          favorites={favorites}
          onRetry={loadServices}
        />
      </div>
    </Layout>
  );
};

export default Services;