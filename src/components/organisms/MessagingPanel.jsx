import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import { formatDistanceToNow } from "date-fns";

const MessagingPanel = ({ 
  messages = [], 
  onlineUsers = [], 
  unreadCount = 0, 
  loading = false,
  onSendMessage 
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && onSendMessage) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const quickReplies = [
    "Thanks for the update!",
    "I'll review this shortly",
    "Can we schedule a call?",
    "Please send more details"
  ];

  const handleQuickReply = (reply) => {
    if (onSendMessage) {
      onSendMessage(reply);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 h-96">
        <Loading />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg border border-gray-200 h-fit sticky top-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <ApperIcon name="MessageSquare" className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900">Messages</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ApperIcon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            className="w-4 h-4 text-gray-600" 
          />
        </button>
      </div>

      {/* Online Users */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">
            {onlineUsers.length} online
          </span>
        </div>
        <div className="flex -space-x-2">
          {onlineUsers.slice(0, 5).map((user) => (
            <div
              key={user.id}
              className="relative w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden"
              title={user.name}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full"></div>
            </div>
          ))}
          {onlineUsers.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
              +{onlineUsers.length - 5}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Messages */}
            <div className="max-h-80 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="MessageCircle" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No messages yet</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.senderId === 'current-user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {message.senderAvatar ? (
                        <img
                          src={message.senderAvatar}
                          alt={message.senderName}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                          {message.senderName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className={`flex-1 max-w-xs ${
                      message.senderId === 'current-user' ? 'text-right' : ''
                    }`}>
                      <div className={`rounded-lg p-3 ${
                        message.senderId === 'current-user'
                          ? 'bg-blue-500 text-white ml-auto'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {message.senderName} • {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Reply Buttons */}
            <div className="p-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2 mb-4">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 text-sm"
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  <ApperIcon name="Send" size={16} />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MessagingPanel;