import { bscscanKey1, bscscanKey2, bscscanKey3 } from 'src/config/index';
import axios from 'axios';

const fetchPairs = async (tokenAddress) => {
  const keys = [bscscanKey1, bscscanKey2, bscscanKey3];
  const key = keys[Math.floor(Math.random() * 3)];
  const apiEndpoint = `https://api.bscscan.com/api?module=contract&action=getcontractcreation&contractaddresses=${tokenAddress}&apikey=${key}`;

  try {
    const { data } = await axios.get(apiEndpoint);
    return data;
  } catch (error) {
    console.error('Error retrieving internal transactions:', error);
    return [];
  }
};

export default fetchPairs;
