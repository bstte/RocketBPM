// src/api.js
import axios from 'axios';
const baseUrl='https://teamwebdevelopers.com/proto-type/api'
// const baseUrl ='http://localhost:8000/api/'
export const defaultApi = axios.create({
  baseURL: baseUrl, // Use 127.0.0.1 instead of localhost
  headers: {
    'Content-Type': 'application/json',
  },
});

const api = axios.create({
  baseURL: baseUrl, // Use 127.0.0.1 instead of localhost
  headers: {
    'Content-Type': 'application/json',
  },
});

// Save nodes and edges to the backend
export const saveNodes = async (data) => {
  try {
    const response = await api.post('/nodes', data);
    return response.data; // Return the response message or data
  } catch (error) {
    console.error('Error saving nodes:', error);
    throw error; // Re-throw the error to be handled in the calling function
  }
};

export const getNodes = async (level = null, user_id = null,Process_id=null) => {
  try {
    const response = await api.get('/nodes', { params: {
      level, 
      user_id,
      Process_id
    } }); // Pass level as a query parameter
    return response.data; // Return the retrieved nodes and edges
  } catch (error) {
    console.error('Error fetching nodes:', error);
    throw error; // Re-throw the error to be handled in the calling function
  }
};

export const Login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password }); // Change to post
    return response.data; // Return the retrieved user data
  } catch (error) {
    console.error('Error fetching nodes:', error);
    throw error; // Re-throw the error to be handled in the calling function
  }
};

export const CurrentUser = async (token) => {
  try {
    const response = await api.get('/user',{
      headers: {
        Authorization: `Bearer ${token}`, // Attach token in header
      }
    }); // Change to post
    return response.data; // Return the retrieved user data
  } catch (error) {
    console.error('Error fetching nodes:', error);
    throw error; // Re-throw the error to be handled in the calling function
  }
};

// Save process title to the backend
export const saveProcessTitle = async (title,user_id) => {
  try {
    const response = await api.post('/process-titles', {process_title: title ,user_id:user_id});
    return response.data;
  } catch (error) {
    console.error('Error saving process title:', error);
    throw error;
  }
};


// Save process title to the backend
export const ProcessAssign = async (user_id,process_id,assigned_users) => {
  try {
    const response = await api.post('/process-Assign', {user_id,process_id,assigned_users});
    return response.data;
  } catch (error) {
    console.error('Error saving process title:', error);
    throw error;
  }
};

// Fetch all process titles from the backend
export const getProcessTitles = async (user_id = null) => {
  try {
    const response = await api.get('/process-titles', { params: {
      user_id,
    } }); // Adjust the endpoint if necessary
    return response.data;
  } catch (error) {
    console.error('Error fetching process titles:', error);
    throw error;
  }
};


// Assign the object to a variable before exporting as default
const apiExports = { saveNodes, getNodes, Login,saveProcessTitle, defaultApi };

export default apiExports;
