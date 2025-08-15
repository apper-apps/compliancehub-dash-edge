import servicesData from "@/services/mockData/services.json";

const DELAY_MS = 300;

export const servicesService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    return [...servicesData];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    const service = servicesData.find(item => item.Id === parseInt(id));
    return service ? { ...service } : null;
  },

  async create(serviceData) {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    const maxId = Math.max(...servicesData.map(item => item.Id));
    const newService = {
      Id: maxId + 1,
      ...serviceData
    };
    servicesData.push(newService);
    return { ...newService };
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    const index = servicesData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) return null;
    
    servicesData[index] = { ...servicesData[index], ...updateData };
    return { ...servicesData[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    const index = servicesData.findIndex(item => item.Id === parseInt(id));
    if (index === -1) return false;
    
    servicesData.splice(index, 1);
    return true;
  }
};