import { etherscanKey1, etherscanKey2, etherscanKey3 } from 'src/config/index';
import axios from 'axios';

const fetchPairs = async (contractAddress) => {
  const keys = [etherscanKey1, etherscanKey2, etherscanKey3];
  const key = keys[Math.floor(Math.random() * 3)];
  const apiEndpoint = `https://api.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${contractAddress}&apikey=${key}`;

  try {
    const { data } = await axios.get(apiEndpoint);
    return data;
  } catch (error) {
    console.error('Error retrieving internal transactions:', error);
    return [];
  }
};

export default fetchPairs;
