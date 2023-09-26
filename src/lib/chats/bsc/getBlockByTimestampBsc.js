import axios from 'axios';
import { bscscanKey1, bscscanKey2, bscscanKey3 } from 'src/config/index';

const getBlockByTimestampBsc = async (timestamp) => {
  try {
    const keys = [bscscanKey1, bscscanKey2, bscscanKey3];
    const key = keys[Math.floor(Math.random() * 3)];

    const endpoint = `https://api.bscscan.com/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${key}`;
    const { data } = await axios.get(endpoint);
    return parseInt(data.result);
  } catch (error) {
    console.log('Timestamp Error:', error);
  }
};

export default getBlockByTimestampBsc;
