// Frontend API client - communicates with backend only
// Database operations are handled by the backend server

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

console.log('API URL:', apiUrl);

// API client for authentication and data operations
class AuthAPI {
  async request(endpoint, options = {}) {
    console.log('Request method called with:', {
      endpoint,
      options,
      options_keys: Object.keys(options),
      body_in_options: options.body,
      body_type: typeof options.body,
      body_exists: !!options.body,
      body_keys: options.body && typeof options.body === 'object' ? Object.keys(options.body) : 'N/A'
    });

    const url = `${apiUrl}${endpoint}`;
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body,
    };

    console.log('Config after construction:', {
      config_keys: Object.keys(config),
      body_in_config: config.body,
      body_type: typeof config.body,
      body_exists: !!config.body,
      method: config.method,
      headers: config.headers,
      body_same_as_options: config.body === options.body
    });

    if (config.body && typeof config.body !== 'string') {
      const originalBody = config.body;
      const bodyString = JSON.stringify(config.body);
      console.log('API Request Debug:', {
        endpoint,
        url,
        method: config.method,
        body_original: originalBody,
        body_original_type: typeof originalBody,
        body_original_keys: originalBody ? Object.keys(originalBody) : 'N/A',
        body_stringified: bodyString,
        body_stringified_length: bodyString.length,
        headers: config.headers
      });
      config.body = bodyString;
    } else if (config.body) {
      console.log('API Request Debug (string body):', {
        endpoint,
        url,
        method: config.method,
        body_type: typeof config.body,
        body_length: config.body.length,
        body_preview: config.body.substring(0, 100),
        headers: config.headers
      });
    } else {
      console.log('API Request Debug (no body):', {
        endpoint,
        url,
        method: config.method,
        headers: config.headers
      });
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data,
          url: url
        });
        
        // Handle authentication errors
        if (response.status === 401 || response.status === 403) {
          console.warn('Authentication failed, clearing stored token');
          localStorage.removeItem('authToken');
          throw new Error('Authentication failed. Please log in again.');
        }
        
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async signUp(email, password, metadata = {}) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: { email, password, ...metadata },
    });
  }

  async signIn(email, password) {
    return this.request('/auth/signin', {
      method: 'POST',
      body: { email, password },
    });
  }

  async signOut() {
    const token = localStorage.getItem('authToken');
    return this.request('/auth/signout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getProfile() {
    const token = localStorage.getItem('authToken');
    return this.request('/auth/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateProfile(updates) {
    const token = localStorage.getItem('authToken');
    return this.request('/auth/profile', {
      method: 'PUT',
      body: updates,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async resetPassword(email) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: { email },
    });
  }

  // Analysis History API methods
  async saveAnalysis(analysisData) {
    const token = localStorage.getItem('authToken');
    
    console.log('saveAnalysis called with:', {
      analysisData,
      analysisData_keys: analysisData ? Object.keys(analysisData) : 'NULL',
      analysisData_type: typeof analysisData,
      token: token ? `${token.substring(0, 20)}...` : 'NO TOKEN',
      tokenLength: token ? token.length : 0
    });

    // Test serialization
    try {
      const testSerialization = JSON.stringify(analysisData);
      console.log('Serialization test passed:', {
        length: testSerialization.length,
        preview: testSerialization.substring(0, 200) + '...'
      });
    } catch (error) {
      console.error('Serialization test failed:', error);
      throw new Error('Cannot serialize analysis data: ' + error.message);
    }

    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    return this.request('/api/analysis/save', {
      method: 'POST',
      body: analysisData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getAnalysisHistory(page = 1, limit = 10) {
    const token = localStorage.getItem('authToken');
    return this.request(`/api/analysis/history?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getAnalysisDetails(id) {
    const token = localStorage.getItem('authToken');
    return this.request(`/api/analysis/history/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deleteAnalysis(id) {
    const token = localStorage.getItem('authToken');
    return this.request(`/api/analysis/history/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const authAPI = new AuthAPI();
