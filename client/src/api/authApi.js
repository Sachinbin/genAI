import apiInstance from "../utils/axiosInstance";

export const login = async (formData) => {
  try {
    const response = await apiInstance.post('/auth/login', formData);   

    return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const register = async (formData) => {
  try {
    const response = await apiInstance.post('/auth/register', formData);

    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getMe = async () => {
  try {
    const response = await apiInstance.get('/auth/get-me');    
    return response.data;
    } catch (error) {
        console.error('GetMe error:', error);
        throw error;
    }
};

export const logout = async () => {
  try {
    const response = await apiInstance.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};