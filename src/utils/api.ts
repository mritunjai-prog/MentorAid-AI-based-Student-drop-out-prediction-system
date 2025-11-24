import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          }
        );

        const { access_token } = response.data;
        localStorage.setItem("access_token", access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  googleLogin: async (token: string) => {
    const response = await axios.post(`${API_URL}/auth/google`, { token });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await axios.post(
      `${API_URL}/auth/refresh`,
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
      }
    );
    return response.data;
  },
};

// Prediction API
export const predictionAPI = {
  predictSingle: async (data: any) => {
    const response = await api.post("/predict", data);
    return response.data;
  },

  predictBatch: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/predict/batch", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getModelInfo: async () => {
    const response = await axios.get(`${API_URL}/model/info`);
    return response.data;
  },

  analyzeFeatures: async () => {
    const response = await api.post("/analyze", {});
    return response.data;
  },
};

// Student API
export const studentAPI = {
  getAll: async () => {
    const response = await api.get("/students");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
};

// Intervention API
export const interventionAPI = {
  getByStudent: async (studentId: string) => {
    const response = await api.get(`/interventions/${studentId}`);
    return response.data;
  },

  create: async (data: {
    student_id: string;
    type: string;
    description: string;
    outcome?: string;
  }) => {
    const response = await api.post("/interventions", data);
    return response.data;
  },
};

// Stats API
export const statsAPI = {
  getPredictionStats: async () => {
    const response = await api.get("/stats/predictions");
    return response.data;
  },
};
