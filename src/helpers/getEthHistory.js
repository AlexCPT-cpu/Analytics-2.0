import { infuraKeys } from 'src/config/index';
import { fetchV3Price } from 'src/lib/getV3Price';
import getHistory from 'src/lib/moralis/eth/getHistory';
import getHistoryV3 from 'src/lib/moralis/eth/getHistoryV3';
import { fetchV2Price } from 'src/lib/getV2Price';

const getV3Reserves = async (tokenAddress, userAddress, provider, blocks, decimals) => {
  try {
    const priceData = await fetchV3Price(tokenAddress, provider, parseInt(decimals));
    if (priceData && priceData != null) {
      const reserves = await getHistoryV3(
        tokenAddress,
        userAddress,
        blocks,
        provider,
        decimals,
        priceData
      );
      return { ...reserves, exchange: 'UniswapV3' };
    } else return null;
  } catch (error) {
    console.log('error getting Eth V3 Data');
    return null;
  }
};

const getV2Reserves = async (tokenAddress, userAddress, provider, blocks, decimals) => {
  try {
    const priceData = await fetchV2Price(tokenAddress, provider, parseInt(decimals));
    if (priceData && priceData != null) {
      const reserves = await getHistory(
        tokenAddress,
        provider,
        userAddress,
        blocks,
        decimals,
        priceData
      );
      return { ...reserves, exchange: 'UniswapV2' };
    } else return null;
  } catch (error) {
    console.log('error getting Eth V2 Data');
    return null;
  }
};

const getEthHistory = async (tokenAddress, userAddress, blocks, decimals, i) => {
  try {
    const index = i % infuraKeys.length;
    const provider = infuraKeys[index];
    const v3Data = await getV3Reserves(tokenAddress, userAddress, provider, blocks, decimals);

    if (v3Data && v3Data !== null) {
      return v3Data;
    } else {
      const v2Data = await getV2Reserves(tokenAddress, userAddress, provider, blocks, decimals);
      if (v2Data && v2Data !== null) {
        return v2Data;
      } else return null;
    }
  } catch (error) {
    return null;
  }
};

export default getEthHistory;
