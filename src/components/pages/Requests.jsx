import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { requestsService } from "@/services/api/requestsService";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Layout from "@/components/organisms/Layout";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [statusFilter, setStatusFilter] = useState("all");
  const [sortState, setSortState] = useState({ field: 'createdAt', direction: 'desc' });
  const loadRequests = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await requestsService.getAll();
      setRequests(data);
    } catch (err) {
      setError("Failed to load requests");
      console.error("Error loading requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

const sortData = (data, field, direction) => {
    return [...data].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];
      
      // Handle date fields
      if (field === 'createdAt' || field === 'completedAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      // Handle string fields
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredAndSortedRequests = sortData(
    statusFilter === "all" ? requests : requests.filter(request => request.status === statusFilter),
    sortState.field,
    sortState.direction
  );

  const handleSort = (field) => {
    setSortState(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (field) => {
    if (sortState.field !== field) return 'ChevronsUpDown';
    return sortState.direction === 'asc' ? 'ChevronUp' : 'ChevronDown';
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "completed": return "green";
      case "pending": return "yellow";
      case "active": return "blue";
      case "rejected": return "red";
      default: return "default";
    }
  };

  const getUrgencyBadgeVariant = (urgency) => {
    switch (urgency) {
      case "urgent": return "red";
      case "priority": return "yellow";
      case "standard": return "blue";
      default: return "default";
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Error message={error} onRetry={loadRequests} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Requests</h1>
          <p className="text-gray-600">
            Track and manage all your verification requests
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "active", "completed", "rejected"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "primary" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status === "all" ? "All Requests" : status}
            </Button>
          ))}
        </div>

        {/* Requests Table */}
{filteredAndSortedRequests.length === 0 ? (
          <Empty
            title="No requests found"
            description="No verification requests match the selected filter."
            actionText="Clear Filter"
            onAction={() => setStatusFilter("all")}
          />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('candidateName')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Applicant</span>
                        <ApperIcon name={getSortIcon('candidateName')} size={14} />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('serviceName')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Service Type</span>
                        <ApperIcon name={getSortIcon('serviceName')} size={14} />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('reference')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Reference</span>
                        <ApperIcon name={getSortIcon('reference')} size={14} />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        <ApperIcon name={getSortIcon('status')} size={14} />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('urgency')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Urgency</span>
                        <ApperIcon name={getSortIcon('urgency')} size={14} />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Request Date</span>
                        <ApperIcon name={getSortIcon('createdAt')} size={14} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedRequests.map((request, index) => (
                    <motion.tr
                      key={request.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {request.candidateName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.candidateEmail}
                          </div>
                          <div className="text-xs text-gray-400">
                            {request.candidatePhone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {request.serviceName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {request.reference}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusBadgeVariant(request.status)}>
                          {request.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getUrgencyBadgeVariant(request.urgency)}>
                          {request.urgency}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-900">
                            {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(request.createdAt), 'HH:mm')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {/* View details functionality */}}
                          >
                            <ApperIcon name="Eye" size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {/* Edit functionality */}}
                          >
                            <ApperIcon name="Edit" size={16} />
                          </Button>
                          {request.documents && request.documents.length > 0 && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {/* View documents functionality */}}
                            >
                              <ApperIcon name="FileText" size={16} />
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Requests;