import { UniswapV2, WETH } from 'src/config//index';
import RouterV2Abi from 'src/config/UniswapV2Abi.json';
import Web3 from 'web3';

export const getV2PriceNow = async (tokenAddress, prov, decimals) => {
  try {
    const tokenDecimals = 10 ** decimals;
    const web3 = new Web3(prov);
    const RouterV2 = new web3.eth.Contract(RouterV2Abi, UniswapV2);
    const one = 1 * tokenDecimals;
    const data = await RouterV2.methods
      .getAmountsOut(one.toString(), [tokenAddress.toString(), WETH.toString()])
      .call();
    if (parseInt(data[0]) / 1e18 === parseInt(1)) {
      return parseInt(data[1]);
    } else {
      return parseInt(data[0]);
    }
  } catch (error) {
    return null;
  }
};

export const fetchV2Price = async (tokenAddress, prov, decimals) => {
  try {
    const ethPrice = getV2PriceNow(tokenAddress, prov, decimals);
    if (ethPrice && ethPrice !== null) {
      return ethPrice;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getV2PriceTime = async (tokenAddress, prov, decimals, block) => {
  try {
    const tokenDecimals = 10 ** decimals;
    const web3 = new Web3(prov);
    const RouterV2 = new web3.eth.Contract(RouterV2Abi, UniswapV2);
    RouterV2.defaultBlock = parseInt(block);
    const one = 1 * tokenDecimals;
    const data = await RouterV2.methods
      .getAmountsOut(one.toString(), [tokenAddress.toString(), WETH.toString()])
      .call();
    if (parseInt(data[0]) / 1e18 === parseInt(1)) {
      return parseInt(data[1]);
    } else {
      return parseInt(data[0]);
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
