import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { servicesService } from "@/services/api/servicesService";
import { analyticsService } from "@/services/api/analyticsService";
import { messagingService } from "@/services/api/messagingService";
import { toast } from "react-toastify";
import StatsOverview from "@/components/organisms/StatsOverview";
import AnalyticsCharts from "@/components/organisms/AnalyticsCharts";
import MessagingPanel from "@/components/organisms/MessagingPanel";
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

  // KPI Stats with sparklines
  const [kpiStats, setKpiStats] = useState({
    users: { value: 0, trend: [], change: 0 },
    sales: { value: 0, trend: [], change: 0 },
    revenue: { value: 0, trend: [], change: 0 },
    bounceRate: { value: 0, trend: [], change: 0 }
  });

  // Analytics data
  const [analyticsData, setAnalyticsData] = useState({
    salesTrend: [],
    revenueByCategory: [],
    conversionFunnel: [],
    loading: true
  });

  // Messaging data
  const [messaging, setMessaging] = useState({
    messages: [],
    onlineUsers: [],
    unreadCount: 0,
    loading: true
  });

  // Legacy stats for compatibility
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    averageProcessingTime: 0,
    activeServices: 0
  });
  // Load stats data
const loadKpiStats = async () => {
    try {
      const data = await analyticsService.getKpiStats();
      setKpiStats(data);
    } catch (error) {
      console.error("Error loading KPI stats:", error);
      toast.error("Failed to load KPI statistics");
    }
  };

  const loadAnalyticsData = async () => {
    try {
      setAnalyticsData(prev => ({ ...prev, loading: true }));
      const [salesTrend, revenueByCategory, conversionFunnel] = await Promise.all([
        analyticsService.getSalesTrend(),
        analyticsService.getRevenueByCategory(),
        analyticsService.getConversionFunnel()
      ]);
      
      setAnalyticsData({
        salesTrend,
        revenueByCategory,
        conversionFunnel,
        loading: false
      });
    } catch (error) {
      console.error("Error loading analytics data:", error);
      setAnalyticsData(prev => ({ ...prev, loading: false }));
      toast.error("Failed to load analytics data");
    }
  };

  const loadMessagingData = async () => {
    try {
      setMessaging(prev => ({ ...prev, loading: true }));
      const [messages, onlineUsers] = await Promise.all([
        messagingService.getRecentMessages(),
        messagingService.getOnlineUsers()
      ]);
      
      const unreadCount = messages.filter(msg => !msg.isRead && msg.senderId !== 'current-user').length;
      
      setMessaging({
        messages,
        onlineUsers,
        unreadCount,
        loading: false
      });
    } catch (error) {
      console.error("Error loading messaging data:", error);
      setMessaging(prev => ({ ...prev, loading: false }));
      toast.error("Failed to load messaging data");
    }
  };

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

  const sendMessage = async (messageText) => {
    try {
      const newMessage = await messagingService.sendMessage({
        text: messageText,
        senderId: 'current-user',
        senderName: 'You',
        timestamp: new Date().toISOString()
      });
      
      setMessaging(prev => ({
        ...prev,
        messages: [newMessage, ...prev.messages]
      }));
      
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  useEffect(() => {
    loadServices();
    loadStats();
    loadKpiStats();
    loadAnalyticsData();
    loadMessagingData();
  }, []);

  // Real-time updates for messaging (simulate every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      loadMessagingData();
    }, 30000);

    return () => clearInterval(interval);
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
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time insights, KPI tracking, and business intelligence for your compliance operations
          </p>
        </motion.div>

        {/* KPI Summary Cards with Sparklines */}
        <StatsOverview kpiStats={kpiStats} />

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Charts Section */}
          <div className="xl:col-span-3 space-y-8">
            {/* Analytics Charts */}
            <AnalyticsCharts 
              data={analyticsData}
              loading={analyticsData.loading}
            />

            {/* Mobile Search */}
            <div className="md:hidden">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search services..."
              />
            </div>

            {/* Services Section - Condensed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Quick Service Access</h2>
                <div className="flex items-center space-x-4">
                  <div className="hidden md:block">
                    <SearchBar
                      value={searchTerm}
                      onChange={setSearchTerm}
                      placeholder="Search services..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Filter Panel - Horizontal */}
                <div className="lg:col-span-1">
                  <FilterPanel
                    filters={filters}
                    onFilterChange={setFilters}
                    onClearFilters={handleClearFilters}
                  />
                </div>

                {/* Services Grid - Compact */}
                <div className="lg:col-span-2">
                  <ServiceGrid
                    services={filteredServices.slice(0, 4)}
                    loading={loading}
                    error={error}
                    onNewRequest={handleNewRequest}
                    onViewDetails={handleViewDetails}
                    onRetry={loadServices}
                    compact={true}
                  />
                  {filteredServices.length > 4 && (
                    <div className="mt-4 text-center">
                      <button 
                        onClick={() => window.location.href = '/services'}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View all {filteredServices.length} services →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Messaging Panel */}
          <div className="xl:col-span-1">
            <MessagingPanel
              messages={messaging.messages}
              onlineUsers={messaging.onlineUsers}
              unreadCount={messaging.unreadCount}
              loading={messaging.loading}
              onSendMessage={sendMessage}
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