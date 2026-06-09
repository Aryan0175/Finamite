const API_URL = import.meta.env.VITE_API_URL + '/tasks';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getTaskStatsAPI = async () => {
    const response = await fetch(`${API_URL}/stats`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch stats');
    return data;
};

export const getTasksAPI = async (status = 'All', search = '') => {
    const query = new URLSearchParams();
    if (status !== 'All') query.append('status', status);
    if (search) query.append('search', search);

    const response = await fetch(`${API_URL}?${query.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch tasks');
    return data;
};

export const createTaskAPI = async (taskData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create task');
    return data;
};

export const updateTaskAPI = async (taskId, updateData) => {
    const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update task');
    return data;
};

export const deleteTaskAPI = async (taskId) => {
    const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete task');
    return data;
};