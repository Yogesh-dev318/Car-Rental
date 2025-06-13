// src/lib/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // The proxy will handle this
  withCredentials: true, // Important for sending cookies with requests
});

export default axiosInstance;