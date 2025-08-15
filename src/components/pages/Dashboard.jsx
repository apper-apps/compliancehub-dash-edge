import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { servicesService } from "@/services/api/servicesService";
import { analyticsService } from "@/services/api/analyticsService";
import { messagingService } from "@/services/api/messagingService";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import AnalyticsCharts from "@/components/organisms/AnalyticsCharts";
import StatsOverview from "@/components/organisms/StatsOverview";
import NewRequestModal from "@/components/organisms/NewRequestModal";
import ServiceGrid from "@/components/organisms/ServiceGrid";
import Layout from "@/components/organisms/Layout";
import MessagingPanel from "@/components/organisms/MessagingPanel";
import FilterPanel from "@/components/molecules/FilterPanel";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ServiceCard from "@/components/molecules/ServiceCard";
const Dashboard = () => {
const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
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

  // Quick Actions data
  const quickActions = [
    {
      id: 1,
      title: "Add Product",
      icon: "Plus",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700"
    },
    {
      id: 2,
      title: "Generate Invoice",
      icon: "FileText",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700"
    },
    {
      id: 3,
      title: "Send Notification",
      icon: "Bell",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700"
    },
    {
      id: 4,
      title: "Export Report",
      icon: "Download",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700"
    }
  ];

  // Tasks & Calendar data
  const upcomingTasks = [
    {
      id: 1,
      title: "Review compliance audit",
      dueDate: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes from now
      priority: "High"
    },
    {
      id: 2,
      title: "Update service documentation",
      dueDate: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      priority: "Medium"
    },
    {
      id: 3,
      title: "Schedule team meeting",
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      priority: "Low"
    },
    {
      id: 4,
      title: "Process pending requests",
      dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      priority: "High"
    },
    {
      id: 5,
      title: "Generate monthly reports",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      priority: "Medium"
    }
  ];
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

  // Quick Actions handlers
  const handleQuickAction = (actionTitle) => {
    switch (actionTitle) {
      case "Add Product":
        toast.success("Add Product feature initiated");
        break;
      case "Generate Invoice":
        toast.success("Invoice generation started");
        break;
      case "Send Notification":
        toast.success("Notification sent successfully");
        break;
      case "Export Report":
        toast.success("Report export initiated");
        break;
      default:
        toast.info(`${actionTitle} action triggered`);
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'default';
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
    loadFavorites();
  }, []);

  // Real-time updates for messaging (simulate every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      loadMessagingData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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

// Get favorite services
  const favoriteServices = services.filter(service => favorites.includes(service.Id));

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

        {/* Quick Actions Grid */}
<div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${action.color} ${action.hoverColor} rounded-xl p-6 text-white cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl`}
                onClick={() => handleQuickAction(action.title)}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 bg-white/20 rounded-full">
                    <ApperIcon name={action.icon} size={24} />
                  </div>
                  <span className="font-medium text-sm text-center">{action.title}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Frequently Accessed Services */}
        {favoriteServices.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Frequently Accessed Services</h2>
              <div className="flex items-center text-sm text-gray-500">
                <ApperIcon name="Star" size={16} className="mr-1 fill-current text-yellow-500" />
                {favoriteServices.length} saved
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteServices.map((service, index) => (
                <motion.div
                  key={service.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ServiceCard
                    service={service}
                    onNewRequest={handleNewRequest}
                    onViewDetails={handleViewDetails}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={true}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks & Calendar Widget */}
        <div className="mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Tasks & Calendar</h2>
                <ApperIcon name="Calendar" size={20} className="text-gray-500" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-medium text-gray-900 mb-4">Upcoming Deadlines</h3>
              <div className="space-y-4">
                {upcomingTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <ApperIcon 
                          name={task.priority === 'High' ? 'AlertTriangle' : task.priority === 'Medium' ? 'Clock' : 'CheckCircle2'} 
                          size={16} 
                          className={
                            task.priority === 'High' ? 'text-red-500' : 
                            task.priority === 'Medium' ? 'text-yellow-500' : 
                            'text-green-500'
                          }
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <p className="text-xs text-gray-500">
                          Due {formatDistanceToNow(task.dueDate, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getPriorityBadgeVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="outline" className="w-full">
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Add New Task
                </Button>
              </div>
            </div>
          </div>
        </div>

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
                        className="text-blue-600 hover:text-blue-800 font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-md"
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