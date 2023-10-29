import { nodeRealKeys } from 'src/config/index';
import { fetchV3PriceBsc } from 'src/lib/getV3PriceBsc';
import getHistoryBscV3 from 'src/lib/moralis/bsc/getHistoryBscV3';
import getHistoryBsc from 'src/lib/moralis/bsc/getHistoryBsc';
import { fetchV2PriceBsc } from 'src/lib/getV2PriceBsc';

const getV3Reserves = async (tokenAddress, web3, userAddress, provider, blocks, decimals, i) => {
  try {
    const priceData = await fetchV3PriceBsc(tokenAddress, provider, parseInt(decimals));
    if (priceData && priceData != null) {
      const reserves = await getHistoryBscV3(
        tokenAddress,
        web3,
        userAddress,
        blocks,
        i,
        decimals,
        priceData
      );
      return { ...reserves, exchange: 'PancakeV3' };
    } else return null;
  } catch (error) {
    console.log('error getting Cake V3 Data');
    return null;
  }
};

const getV2Reserves = async (tokenAddress, web3, userAddress, provider, blocks, decimals, i) => {
  try {
    const priceData = await fetchV2PriceBsc(tokenAddress, provider, parseInt(decimals));
    if (priceData && priceData != null) {
      const reserves = await getHistoryBsc(
        tokenAddress,
        web3,
        userAddress,
        blocks,
        i,
        decimals,
        priceData
      );
      return { ...reserves, exchange: 'PancakeV2' };
    } else return null;
  } catch (error) {
    console.log('error getting Cake V2 Data');
    return null;
  }
};

const getBscHistory = async (tokenAddress, web3, userAddress, blocks, decimals, i) => {
  try {
    const index = i % nodeRealKeys.length;
    const provider = nodeRealKeys[index];
    const v3Data = await getV3Reserves(
      tokenAddress,
      web3,
      userAddress,
      provider,
      blocks,
      decimals,
      i
    );
    if (v3Data && v3Data !== null) {
      return v3Data;
    } else {
      const v2Data = await getV2Reserves(
        tokenAddress,
        web3,
        userAddress,
        provider,
        blocks,
        decimals,
        i
      );
      if (v2Data && v2Data !== null) {
        return v2Data;
      } else return null;
    }
  } catch (error) {
    return null;
  }
};

export default getBscHistory;
