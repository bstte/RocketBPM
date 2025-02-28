// src/api.js
import axios from 'axios';
const baseUrl = 'https://teamwebdevelopers.com/proto-type/api'
export const ImageBaseUrl = 'https://teamwebdevelopers.com/proto-type/public/'
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


export const getNodes = async (level = null, user_id = null, Process_id = null) => {
  try {
    const response = await api.get('/nodes', {
      params: {
        level,
        user_id,
        Process_id
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nodes:', error);
    throw error;
  }
};

export const checkRecord = async (level = null, user_id = null, Process_id = null) => {
  try {
    const response = await api.get('/check-record', {
      params: {
        level,
        user_id,
        Process_id
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nodes:', error);
    throw error;
  }
};

export const checkPublishRecord = async (level = null, user_id = null, Process_id = null) => {
  try {
    const response = await api.get('/checkPublishRecord', {
      params: {
        level,
        user_id,
        Process_id
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nodes:', error);
    throw error;
  }
};


export const GetPublishedDate = async (level = null, user_id = null, Process_id = null, status = null) => {
  try {
    const response = await api.get('/GetPublishedDate', {
      params: {
        level,
        user_id,
        Process_id,
        status
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nodes:', error);
    throw error;
  }
};

export const getUserNodes = async (user_id = null) => {
  try {
    const response = await api.get('/getUserNodes', {
      params: {
        user_id,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nodes:', error);
    throw error;
  }
};




export const getPublishedNodes = async (level = null, user_id = null, Process_id = null) => {
  try {
    const response = await api.get('/Publishnodes', {
      params: {
        level,
        user_id,
        Process_id
      }
    });
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



export const getdataByNodeId = async (node_id = null, status = null) => {
  try {
    const response = await api.get('/nodes/getdataByNodeId', {
      params: { node_id, status },
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
    const response = await api.get('/user', {
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

export const deactivateUser = async (token) => {
  try {
    const response = await api.post(
      '/deactivate-user',
      {}, // Empty body (if your API requires a payload, add it here)
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Ensure JSON format
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deactivating user:', error.response?.data || error.message);
    throw error;
  }
};

export const updateprofile = async (token, profileData) => {
  try {
    const response = await api.post(
      '/update-profile',
      profileData, // Pass the updated profile data here
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error.message);
    throw error;
  }
};


export const saveProcessTitle = async (title, user_id) => {
  try {
    const response = await api.post('/process-titles', { process_title: title, user_id: user_id });
    return response.data;
  } catch (error) {
    console.error('Error saving process title:', error);
    throw error;
  }
};



export const ProcessAssign = async (user_id, process_id, assigned_users) => {
  try {
    const response = await api.post('/process-Assign', { user_id, process_id, assigned_users });
    return response.data;
  } catch (error) {
    console.error('Error saving process title:', error);
    throw error;
  }
};


export const getProcessTitles = async (user_id = null) => {
  try {
    const response = await api.get('/process-titles', {
      params: {
        user_id,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching process titles:', error);
    throw error;
  }
};


export const getProcessAssignUsers = async (user_id = null, process_id = null) => {
  try {
    const response = await api.get('/get-process-assign-users', {
      params: {
        user_id,
        process_id
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching process titles:', error);
    throw error;
  }
};

export const checkEmail = async (email = null) => {
  try {
    const response = await api.get('/check-email', {
      params: {
        email,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching process titles:', error);
    throw error;
  }
};

export const saveAssingUserData = async (newUserObject = null) => {
  try {
    const response = await api.post('/save-Assign-User-Data', newUserObject);
    return response.data;
  } catch (error) {
    console.error('Error fetching process titles:', error);
    throw error;
  }
};

export const addFavProcess = async (user_id, process_id, type) => {
  try {
    const response = await api.post('/add-fav-process', { user_id, process_id, type });
    return response.data;
  } catch (error) {
    console.error('Error fetching process titles:', error);
    throw error;
  }
};

export const checkFavProcess = async (user_id, process_id) => {
  try {
    const response = await api.get('/check-fav-process', {
      params: {
        user_id, process_id
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching process titles:', error);
    throw error;
  }
};
export const getFavProcessesByUser = async (user_id) => {
  try {
    const response = await api.get('/get-fav-processes', {
      params: {
        user_id
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching process titles:', error);
    throw error;
  }
};

export const getProcessTitleById = async (id) => {
  try {
    const response = await api.get('/get-process-ById', {
      params: {
        id
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching process titles:', error);
    throw error;
  }
};

export const updateProcess = async (processId, processdata) => {
  try {
    const response = await api.post(
      `/update-process-ById?id=${processId}`, // Pass ID as a query parameter
      processdata,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating process:', error.response?.data || error.message);
    throw error;
  }
};


export const deleteProcess = async (processId) => {
  try {
    const response = await api.delete(`/delete-process-ById?id=${processId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting process:", error.response?.data || error.message);
    throw error;
  }
};

export const getvideo = async (id) => {
  try {
    const response = await api.get('/get-video');
    return response.data;
  } catch (error) {
    console.error('Error fetching process titles:', error);
    throw error;
  }
};

export const signup = async (newUserObject = null) => {
  try {
    const response = await api.post('/signup', newUserObject);
    return response.data;
  } catch (error) {
    console.error('Error fetching process titles:', error);
    throw error;
  }
};




const apiExports = { saveNodes, getNodes, checkPublishRecord, GetPublishedDate, checkRecord, Login, saveProcessTitle, defaultApi, filter_draft, getPublishedNodes, getdataByNodeId };

export default apiExports;
