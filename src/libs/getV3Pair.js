import { computePoolAddress } from '@uniswap/v3-sdk';
import { Token } from '@uniswap/sdk-core';

async function getV3Pair(token0Address, token1Address, decimal0, decimal1, poolfee) {
  try {
    const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
    const first = new Token(1, token0Address, decimal0);

    const second = new Token(1, token1Address, decimal1);

    const pair = computePoolAddress({
      factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
      tokenA: first,
      tokenB: second,
      fee: poolfee,
    });

    return pair;
  } catch (error) {
    console.log(error.message);
  }
}

export default getV3Pair;
