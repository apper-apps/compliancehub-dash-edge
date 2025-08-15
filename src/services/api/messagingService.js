const DELAY_MS = 300;

// Mock users data
const mockUsers = [
  { id: 1, name: 'Sarah Chen', avatar: null, status: 'online' },
  { id: 2, name: 'Mike Johnson', avatar: null, status: 'online' },
  { id: 3, name: 'Emma Davis', avatar: null, status: 'online' },
  { id: 4, name: 'Alex Rodriguez', avatar: null, status: 'away' },
  { id: 5, name: 'Lisa Wang', avatar: null, status: 'online' },
  { id: 6, name: 'Tom Wilson', avatar: null, status: 'offline' },
  { id: 7, name: 'Rachel Green', avatar: null, status: 'online' }
];

// Mock messages data
let mockMessages = [
  {
    id: 1,
    senderId: 2,
    senderName: 'Mike Johnson',
    senderAvatar: null,
    text: 'The compliance audit for Q4 is ready for review. All documents have been submitted.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    isRead: false
  },
  {
    id: 2,
    senderId: 'current-user',
    senderName: 'You',
    senderAvatar: null,
    text: 'Great! I\'ll review it this afternoon.',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    isRead: true
  },
  {
    id: 3,
    senderId: 1,
    senderName: 'Sarah Chen',
    senderAvatar: null,
    text: 'The new verification service is now live. We\'ve already received 3 requests.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    isRead: false
  },
  {
    id: 4,
    senderId: 5,
    senderName: 'Lisa Wang',
    senderAvatar: null,
    text: 'Can we schedule a team meeting to discuss the upcoming regulatory changes?',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 minutes ago
    isRead: false
  }
];

// Auto-generate new messages periodically
const generateRandomMessage = () => {
  const activeUsers = mockUsers.filter(user => user.status === 'online' && user.id !== 'current-user');
  if (activeUsers.length === 0) return null;

  const sender = activeUsers[Math.floor(Math.random() * activeUsers.length)];
  const messages = [
    'New compliance request submitted for review.',
    'Verification process completed successfully.',
    'Please review the latest audit report.',
    'System maintenance scheduled for tonight.',
    'Q4 compliance metrics look good!',
    'New client onboarding documents received.',
    'Urgent: Please check the flagged transaction.',
    'Monthly compliance report is ready.',
    'Training session reminder: Tomorrow at 2 PM.',
    'All systems are operational and secure.'
  ];

  return {
    id: Date.now(),
    senderId: sender.id,
    senderName: sender.name,
    senderAvatar: sender.avatar,
    text: messages[Math.floor(Math.random() * messages.length)],
    timestamp: new Date().toISOString(),
    isRead: false
  };
};

export const messagingService = {
  async getRecentMessages(limit = 10) {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    
    // Occasionally add a new message to simulate real-time updates
    if (Math.random() < 0.3) { // 30% chance
      const newMessage = generateRandomMessage();
      if (newMessage) {
        mockMessages = [newMessage, ...mockMessages.slice(0, limit - 1)];
      }
    }
    
    return mockMessages.slice(0, limit).map(msg => ({ ...msg }));
  },

  async getOnlineUsers() {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    
    // Simulate users going online/offline
    const updatedUsers = mockUsers.map(user => {
      if (Math.random() < 0.1) { // 10% chance of status change
        const statuses = ['online', 'away', 'offline'];
        return {
          ...user,
          status: statuses[Math.floor(Math.random() * statuses.length)]
        };
      }
      return { ...user };
    });
    
    return updatedUsers.filter(user => user.status === 'online');
  },

  async sendMessage(messageData) {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    
    const newMessage = {
      id: Date.now(),
      senderId: messageData.senderId,
      senderName: messageData.senderName,
      senderAvatar: messageData.senderAvatar || null,
      text: messageData.text,
      timestamp: messageData.timestamp,
      isRead: true
    };
    
    mockMessages = [newMessage, ...mockMessages];
    return { ...newMessage };
  },

  async markAsRead(messageId) {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    
    const messageIndex = mockMessages.findIndex(msg => msg.id === parseInt(messageId));
    if (messageIndex !== -1) {
      mockMessages[messageIndex] = { ...mockMessages[messageIndex], isRead: true };
      return { ...mockMessages[messageIndex] };
    }
    
    return null;
  },

  async getUserStatus(userId) {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    
    const user = mockUsers.find(u => u.id === parseInt(userId));
    return user ? { ...user } : null;
  }
};