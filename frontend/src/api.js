const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
  } catch (_error) {
    throw new Error('Could not reach backend API. Make sure backend is running on port 8080.');
  }

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const body = await response.json();
      message = body.message || message;
    } catch (_error) {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const taskApi = {
  getTasks() {
    return request('/tasks');
  },

  createTask(payload) {
    return request('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  updateTaskStatus(id, status) {
    return request(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  deleteTask(id) {
    return request(`/tasks/${id}`, { method: 'DELETE' });
  }
};

