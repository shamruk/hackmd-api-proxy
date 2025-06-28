import axios from 'axios';

class HackMDConnection {
  #apiToken;
  #baseURL;
  #axios;

  constructor(apiToken) {
    if (!apiToken) {
      throw new Error('HackMD API token is required');
    }
    
    this.#apiToken = apiToken;
    this.#baseURL = 'https://api.hackmd.io/v1';
    
    this.#axios = axios.create({
      baseURL: this.#baseURL,
      headers: {
        'Authorization': `Bearer ${this.#apiToken}`,
        'X-HackMD-API-Version': '1.0.0',
        'Content-Type': 'application/json'
      }
    });
  }

  async #makeRequest(method, path, data = null) {
    try {
      const config = {
        method,
        url: path
      };
      
      if (data) {
        config.data = data;
      }
      
      const response = await this.#axios(config);
      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.statusText;
        throw new Error(`HackMD API error (${error.response.status}): ${errorMessage}`);
      } else if (error.request) {
        throw new Error('HackMD API request failed: No response received');
      } else {
        throw new Error(`HackMD API error: ${error.message}`);
      }
    }
  }

  async get(path) {
    return this.#makeRequest('GET', path);
  }

  async post(path, data) {
    return this.#makeRequest('POST', path, data);
  }

  async patch(path, data) {
    return this.#makeRequest('PATCH', path, data);
  }

  async delete(path) {
    return this.#makeRequest('DELETE', path);
  }
}

export default HackMDConnection;