import { nodeRealKeys2 } from 'src/config/index';
import { getV2PriceTimeBsc } from 'src/lib/getV2PriceBsc';
import fetchBalance from 'src/lib/moralis/bsc/fetchBalance';
import Web3 from 'web3';

const getHistoryBsc = async (tokenAddress, userAddress, block, maxReserve, decimals, i) => {
  const index = i % nodeRealKeys2.length;
  const provider = nodeRealKeys2[index];
  const web3 = new Web3(provider);
  try {
    const balanceTime = await fetchBalance(tokenAddress, userAddress, parseInt(block.block), web3);
    const ethPrice = await getV2PriceTimeBsc(
      tokenAddress,
      provider,
      parseInt(decimals),
      parseInt(block.block)
    );

    const serializedTime = {
      ethPrice,
      block,
      balance: balanceTime,
    };

    return serializedTime;
  } catch (error) {
    console.log(error);
    return maxReserve;
  }
};

export default getHistoryBsc;
