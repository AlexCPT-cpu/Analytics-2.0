import { PancakeswapV2, bscWBNB } from 'src/config/index';
import PancakeAbi from 'src/config/PancakeswapV2Abi.json';
import Web3 from 'web3';

export const getV2PriceNowBsc = async (tokenAddress, prov, decimals) => {
  try {
    const tokenDecimals = 10 ** decimals;
    const web3 = new Web3(prov);
    const RouterV2 = new web3.eth.Contract(PancakeAbi, PancakeswapV2);
    const one = 1 * tokenDecimals;
    const data = await RouterV2.methods
      .getAmountsOut(one.toString(), [tokenAddress.toString(), bscWBNB.toString()])
      .call();
    return parseInt(data[0]);
  } catch (error) {
    return null;
  }
};

export const fetchV2PriceBsc = async (tokenAddress, prov, decimals) => {
  try {
    const ethPrice = getV2PriceNowBsc(tokenAddress, prov, decimals);
    if (ethPrice && ethPrice !== null) {
      return ethPrice;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getV2PriceTimeBsc = async (tokenAddress, prov, decimals, block) => {
  try {
    const tokenDecimals = 10 ** decimals;
    const web3 = new Web3(prov);
    const RouterV2 = new web3.eth.Contract(PancakeAbi, PancakeswapV2);
    RouterV2.defaultBlock = parseInt(block);
    const one = 1 * tokenDecimals;
    const data = await RouterV2.methods
      .getAmountsOut(one.toString(), [tokenAddress.toString(), bscWBNB.toString()])
      .call();
    return parseInt(data[0]);
  } catch (error) {
    return null;
  }
};
