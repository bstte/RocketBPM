// src/api.js
import axios from 'axios';
const baseUrl='https://teamwebdevelopers.com/proto-type/api'
// const baseUrl ='http://localhost:8000/api/'
export const defaultApi = axios.create({
  baseURL: baseUrl, 
  headers: {
    'Content-Type': 'application/json',
  },
});

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const saveNodes = async (data) => {
  try {
    const response = await api.post('/nodes', data);
    return response.data;
  } catch (error) {
    console.error('Error saving nodes:', error);
    throw error;
  }
};


export const getNodes = async (level = null, user_id = null,Process_id=null) => {
  try {
    const response = await api.get('/nodes', { params: {
      level, 
      user_id,
      Process_id
    } }); 
    return response.data; 
  } catch (error) {
    console.error('Error fetching nodes:', error);
    throw error;
  }
};


export const getPublishedNodes = async (level = null, user_id = null,Process_id=null) => {
  try {
    const response = await api.get('/Publishnodes', { params: {
      level, 
      user_id,
      Process_id
    } }); 
    return response.data; 
  } catch (error) {
    console.error('Error fetching nodes:', error);
    throw error;
  }
};


export const filter_draft = async (ParentPageGroupId = null) => {
  try {
    const response = await api.get('/nodes/filter-draft', {
      params: { ParentPageGroupId }, 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nodes:', error);
    throw error;
  }
};



export const getdataByNodeId = async (node_id = null,status=null) => {
  try {
    const response = await api.get('/nodes/getdataByNodeId', {
      params: { node_id,status }, 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nodes:', error);
    throw error;
  }
};


export const Login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password }); 
    return response.data; 
  } catch (error) {
    console.error('Error fetching nodes:', error);
    throw error;
  }
};

export const CurrentUser = async (token) => {
  try {
    const response = await api.get('/user',{
      headers: {
        Authorization: `Bearer ${token}`, 
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nodes:', error);
    throw error; 
  }
};


export const saveProcessTitle = async (title,user_id) => {
  try {
    const response = await api.post('/process-titles', {process_title: title ,user_id:user_id});
    return response.data;
  } catch (error) {
    console.error('Error saving process title:', error);
    throw error;
  }
};



export const ProcessAssign = async (user_id,process_id,assigned_users) => {
  try {
    const response = await api.post('/process-Assign', {user_id,process_id,assigned_users});
    return response.data;
  } catch (error) {
    console.error('Error saving process title:', error);
    throw error;
  }
};


export const getProcessTitles = async (user_id = null) => {
  try {
    const response = await api.get('/process-titles', { params: {
      user_id,
    } }); 
    return response.data;
  } catch (error) {
    console.error('Error fetching process titles:', error);
    throw error;
  }
};



const apiExports = { saveNodes, getNodes, Login,saveProcessTitle, defaultApi,filter_draft,getPublishedNodes ,getdataByNodeId};

export default apiExports;
