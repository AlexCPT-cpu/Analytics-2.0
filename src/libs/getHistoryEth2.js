import { ethProvider, alchemyUrl } from 'src/config/index';
import { getV2PriceTime } from 'src/lib/getV2Price';
import fetchBalance from 'src/lib/moralis/eth/fetchBalance';
import Web3 from 'web3';

const getHistoryEth2 = async (tokenAddress, userAddress, block, maxReserve, decimals, i) => {
  const index = i % 2;
  const arr = [alchemyUrl, ethProvider];
  const provider = arr[index];
  const web3 = new Web3(provider);

  try {
    const balanceTime = await fetchBalance(tokenAddress, userAddress, parseInt(block.block), web3);
    const ethPrice = await getV2PriceTime(
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
    return maxReserve;
  }
};

export default getHistoryEth2;
