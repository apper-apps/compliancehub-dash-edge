import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/organisms/Layout";
import StatsOverview from "@/components/organisms/StatsOverview";
import ServiceGrid from "@/components/organisms/ServiceGrid";
import FilterPanel from "@/components/molecules/FilterPanel";
import NewRequestModal from "@/components/organisms/NewRequestModal";
import SearchBar from "@/components/molecules/SearchBar";
import { servicesService } from "@/services/api/servicesService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "All",
    status: "all",
    dateRange: { start: "", end: "" }
  });

  // Stats calculation
  const stats = {
    totalRequests: services.reduce((sum, service) => sum + Math.max(0, service.requestCount), 0),
    pendingRequests: services.filter(service => service.requestCount > 0).length,
    completedRequests: services.filter(service => service.requestCount === 0).length,
    activeServices: services.length
  };

  const loadServices = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await servicesService.getAll();
      setServices(data);
      setFilteredServices(data);
    } catch (err) {
      setError("Failed to load verification services");
      console.error("Error loading services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    let filtered = [...services];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category !== "All") {
      filtered = filtered.filter(service => service.category === filters.category);
    }

    // Apply status filter
    if (filters.status !== "all") {
      switch (filters.status) {
        case "pending":
          filtered = filtered.filter(service => service.requestCount > 0);
          break;
        case "active":
          filtered = filtered.filter(service => service.requestCount > 0);
          break;
        case "completed":
          filtered = filtered.filter(service => service.requestCount === 0);
          break;
      }
    }

    setFilteredServices(filtered);
  }, [services, searchTerm, filters]);

  const handleNewRequest = (service) => {
    setSelectedService(service);
    setIsNewRequestModalOpen(true);
  };

  const handleViewDetails = (service) => {
    toast.info(`Viewing details for ${service.name}`);
  };

  const handleSubmitRequest = async (requestData) => {
    try {
      // Update service request count
      const updatedServices = services.map(service => 
        service.id === requestData.serviceId
          ? { ...service, requestCount: service.requestCount + 1 }
          : service
      );
      setServices(updatedServices);
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      category: "All",
      status: "all",
      dateRange: { start: "", end: "" }
    });
    setSearchTerm("");
  };

  const totalPendingRequests = stats.totalRequests;

  return (
    <Layout onSearch={setSearchTerm} totalPendingRequests={totalPendingRequests}>
      <div className="space-y-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verification Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your compliance and verification requests from one central location
          </p>
        </motion.div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Mobile Search */}
        <div className="md:hidden">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search services..."
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Services Grid */}
          <div className="lg:col-span-3">
            <ServiceGrid
              services={filteredServices}
              loading={loading}
              error={error}
              onNewRequest={handleNewRequest}
              onViewDetails={handleViewDetails}
              onRetry={loadServices}
            />
          </div>
        </div>

        {/* New Request Modal */}
        <NewRequestModal
          isOpen={isNewRequestModalOpen}
          onClose={() => setIsNewRequestModalOpen(false)}
          service={selectedService}
          onSubmit={handleSubmitRequest}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;