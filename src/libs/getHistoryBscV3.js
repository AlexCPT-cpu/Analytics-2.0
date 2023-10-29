import { nodeRealKeys2 } from 'src/config/index';
import { getV3PriceTimeBsc } from 'src/lib/getV3PriceBsc';
import fetchBalance from 'src/lib/moralis/bsc/fetchBalance';
import Web3 from 'web3';

const getHistoryBscV3 = async (tokenAddress, userAddress, block, maxReserve, fee, decimals, i) => {
  const index = i % nodeRealKeys2.length;
  const provider = nodeRealKeys2[index];
  const web3 = new Web3(provider);

  try {
    const balanceTime = await fetchBalance(tokenAddress, userAddress, parseInt(block.block), web3);
    const ethPrice = await getV3PriceTimeBsc(
      tokenAddress,
      provider,
      parseInt(decimals),
      parseInt(fee),
      parseInt(block.block)
    );

    const serializedTime = {
      ethPrice,
      block,
      balance: balanceTime,
    };

    return serializedTime;
  } catch (error) {
    return maxReserve;
  }
};

export default getHistoryBscV3;
