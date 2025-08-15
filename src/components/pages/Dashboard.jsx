import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { servicesService } from "@/services/api/servicesService";
import { toast } from "react-toastify";
import StatsOverview from "@/components/organisms/StatsOverview";
import NewRequestModal from "@/components/organisms/NewRequestModal";
import ServiceGrid from "@/components/organisms/ServiceGrid";
import Layout from "@/components/organisms/Layout";
import FilterPanel from "@/components/molecules/FilterPanel";
import SearchBar from "@/components/molecules/SearchBar";

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

// Stats state
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    averageProcessingTime: 0,
    activeServices: 0
  });

  // Load stats data
  const loadStats = async () => {
    try {
      // Import requestsService if not already imported
      const { requestsService } = await import("@/services/api/requestsService");
      
      // Get real request data for KPI calculations
      const requests = await requestsService.getAll();
      
      const pendingRequests = requests.filter(req => 
        req.status === 'pending' || req.status === 'active'
      ).length;
      
      const completedRequests = requests.filter(req => 
        req.status === 'completed'
      ).length;
      
      // Calculate average processing time for completed requests
      const completedWithTimes = requests.filter(req => 
        req.status === 'completed' && req.createdAt && req.completedAt
      );
      
      let averageProcessingTime = 0;
      if (completedWithTimes.length > 0) {
        const totalProcessingTime = completedWithTimes.reduce((sum, req) => {
          const created = new Date(req.createdAt);
          const completed = new Date(req.completedAt);
          return sum + (completed - created);
        }, 0);
        averageProcessingTime = Math.round(totalProcessingTime / completedWithTimes.length / (1000 * 60 * 60 * 24)); // Convert to days
      }
      
      // Get services with active requests
      const activeServiceIds = new Set(
        requests.filter(req => req.status === 'pending' || req.status === 'active')
          .map(req => req.serviceId)
      );

      setStats({
        totalRequests: requests.length,
        pendingRequests,
        completedRequests,
        averageProcessingTime,
        activeServices: activeServiceIds.size
      });
    } catch (error) {
      console.error("Error loading stats:", error);
      // Keep default stats values on error
    }
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
    loadStats();
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