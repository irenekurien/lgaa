import axios from 'axios';
import { URL } from 'const/constants';

export const axiosInstance = axios.create({
  baseURL: `${URL}`,
  headers: {
    'Content-Type': 'application/json', 
  },
});

export const updateAuthorizationHeader = (accessToken: string | null) => {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};