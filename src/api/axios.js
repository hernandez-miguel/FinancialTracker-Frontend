import axios from 'axios';

export default axios.create({
  baseURL: 'https://financialtracker-api.onrender.com'
});