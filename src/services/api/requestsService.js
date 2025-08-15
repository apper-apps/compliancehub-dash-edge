import requestsData from "@/services/mockData/requests.json";

const DELAY_MS = 350;

export const requestsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    return [...requestsData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    const request = requestsData.find(item => item.Id === parseInt(id));
    return request ? { ...request } : null;
  },

  async create(requestData) {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    const maxId = Math.max(...requestsData.map(item => item.Id));
    const newRequest = {
      Id: maxId + 1,
      ...requestData,
      createdAt: new Date().toISOString()
    };
    requestsData.push(newRequest);
    return { ...newRequest };
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    const index = requestsData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) return null;
    
    requestsData[index] = { ...requestsData[index], ...updateData };
    return { ...requestsData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    const index = requestsData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) return false;
    
    requestsData.splice(index, 1);
    return true;
  }
};