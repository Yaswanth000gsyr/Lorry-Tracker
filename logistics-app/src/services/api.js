import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const loginUser = (credentials) => API.post("/login", credentials);
export const registerUser = (data) => API.post("/signup", data);

// Load management APIs
export const getAvailableLoads = () => API.get("/loads");
export const getLoadById = (id) => API.get(`/loads/${id}`);
export const createLoad = (loadData) => API.post("/loads", loadData);
export const updateLoad = (id, loadData) => API.put(`/loads/${id}`, loadData);
export const deleteLoad = (id) => API.delete(`/loads/${id}`);
export const getPostedLoadsByBroker = (brokerId) => API.get(`/loads/broker/${brokerId}`);
