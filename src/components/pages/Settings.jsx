import React, { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/organisms/Layout";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { toast } from "react-toastify";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    companyName: "ComplianceHub Ltd",
    contactEmail: "admin@compliancehub.com",
    apiKey: "ch_live_xxxxxxxxxx",
    webhookUrl: "",
    notifications: {
      email: true,
      sms: false,
      browser: true
    }
  });

  const tabs = [
    { id: "general", label: "General", icon: "Settings" },
    { id: "notifications", label: "Notifications", icon: "Bell" },
    { id: "api", label: "API Settings", icon: "Code" },
    { id: "billing", label: "Billing", icon: "CreditCard" }
  ];

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Name
        </label>
        <Input
          value={settings.companyName}
          onChange={(e) => setSettings({...settings, companyName: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Email
        </label>
        <Input
          type="email"
          value={settings.contactEmail}
          onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
        />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(settings.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 capitalize">{key} Notifications</h4>
              <p className="text-sm text-gray-500">Receive notifications via {key}</p>
            </div>
            <button
              onClick={() => setSettings({
                ...settings,
                notifications: { ...settings.notifications, [key]: !value }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? "bg-red-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApiSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          API Key
        </label>
        <div className="flex space-x-2">
          <Input value={settings.apiKey} readOnly />
          <Button variant="outline">Regenerate</Button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Webhook URL
        </label>
        <Input
          value={settings.webhookUrl}
          onChange={(e) => setSettings({...settings, webhookUrl: e.target.value})}
          placeholder="https://your-app.com/webhooks/compliance"
        />
      </div>
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Plan</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">Professional</p>
            <p className="text-gray-600">£99/month • Unlimited requests</p>
          </div>
          <Button variant="outline">Upgrade Plan</Button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tabs Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-red-100 text-red-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.label} Settings
                </h2>
              </div>

              {activeTab === "general" && renderGeneralSettings()}
              {activeTab === "notifications" && renderNotificationSettings()}
              {activeTab === "api" && renderApiSettings()}
              {activeTab === "billing" && renderBillingSettings()}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <Button onClick={handleSave}>
                    <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;