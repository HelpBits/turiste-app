import axios from 'axios';
import { API_URL } from '@env';

const login = () => {
  return axios.post(`${API_URL}/gists/25aa26aacfd5db16c50a0560f82fba6b`);
};

export default login;
