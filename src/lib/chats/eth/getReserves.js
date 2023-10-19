import { factoryV2 } from 'src/config/index';
import UniswapV2Abi from 'src/json/factoryV2Abi.json';
import { FeeAmount } from '@uniswap/v3-sdk';
import getV3Pair from 'src/libs/getV3Pair';

const v2 = async (token0Address, token1Address, web3) => {
  try {
    const factory = new web3.eth.Contract(UniswapV2Abi, factoryV2);
    const pair = await factory.methods.getPair(token0Address, token1Address).call();
    return pair;
  } catch (error) {
    console.log(error.message, 'no pair');
  }
};
const v3 = async (token0Address, token1Address, decimal0, decimal1) => {
  const feeTiers = [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH];
  for (const feeTier of feeTiers) {
    try {
      const pair = await getV3Pair(token0Address, token1Address, decimal0, decimal1, feeTier);
      console.log(pair, feeTier);
      if (pair && pair !== '0x0000000000000000000000000000000000000000') {
        return { pair: pair, fee: parseInt(feeTier) };
      }
    } catch (error) {
      console.error(`Error fetching V3 Pool`, error.message);
    }
  }
  return null;
};
const getReserves = async (token0Address, token1Address, decimal0, decimal1, web3) => {
  const v3Pair = await v3(token0Address, token1Address, decimal0, decimal1);
  if (v3Pair && v3Pair !== null && v3Pair.pair != '0x0000000000000000000000000000000000000000') {
    console.log('return v3');
    console.log({ pair: v3Pair.pair, fee: v3Pair.fee, exchange: 'UniswapV3', isAvail: true });
    return { pair: v3Pair.pair, fee: v3Pair.fee, exchange: 'UniswapV3', isAvail: true };
  } else {
    console.log('checking v2');
    const v2Pair = await v2(token0Address, token1Address, web3);
    if (v2Pair && v2Pair != '0x0000000000000000000000000000000000000000') {
      return { pair: v2Pair, exchange: 'UniswapV2', isAvail: true };
    } else return null;
  }
};

export default getReserves;
