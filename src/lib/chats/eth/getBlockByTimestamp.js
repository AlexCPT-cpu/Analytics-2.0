import { etherscanKey1, etherscanKey2, etherscanKey3 } from 'src/config/index';
import axios from 'axios';

const getBlockByTimestamp = async (timestamp) => {
  try {
    const keys = [etherscanKey1, etherscanKey2, etherscanKey3];
    const key = keys[Math.floor(Math.random() * 3)];

    const endpoint = `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${key}`;
    const { data } = await axios.get(endpoint);
    return parseInt(data.result);
  } catch (error) {
    console.log('Timestanp Error:', error);
  }
};

export default getBlockByTimestamp;
