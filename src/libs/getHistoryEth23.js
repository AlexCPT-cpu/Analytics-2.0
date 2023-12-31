import { infuraKeys } from 'src/config/index';
import { getV3PriceTime } from 'src/lib/getV3Price';
import fetchBalance from 'src/lib/moralis/eth/fetchBalance';
import Web3 from 'web3';

const getHistoryEth23 = async (tokenAddress, userAddress, block, maxReserve, fee, decimals, i) => {
  const index = i % infuraKeys.length;
  const provider = infuraKeys[index];

  const web3 = new Web3(provider);

  try {
    const balanceTime = await fetchBalance(tokenAddress, userAddress, parseInt(block.block), web3);
    const ethPrice = await getV3PriceTime(
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
    console.log(error);
    return maxReserve;
  }
};

export default getHistoryEth23;
