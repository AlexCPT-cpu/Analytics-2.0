import erc20Abi from 'src/json/erc20Abi.json';
import fetchBalance from './fetchBalance';
import { userBalance } from './userBalance';
import { nodeRealKeys } from 'src/config/index';
import Web3 from 'web3';
import { getV2PriceTimeBsc } from 'src/lib/getV2PriceBsc';

const getHistoryBsc = async (tokenAddress, web3, userAddress, blocks, i, decimals, ethData) => {
  try {
    const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);
    const balanceNow = await userBalance(tokenContract, userAddress);

    if (balanceNow !== null) {
      const index = i % nodeRealKeys.length;

      const serializedThen = {
        ethPrice: 0,
        block: { timestamp: 0, block: 0 },
        balance: '0',
      };

      const serializedNow = {
        ethPrice: parseInt(ethData),
        balance: balanceNow.toString(),
      };

      const balancesFetcher = blocks?.map(async (block) => {
        try {
          const provider = nodeRealKeys[index];
          const web3Time = new Web3(provider);
          const balanceTime = await fetchBalance(
            tokenAddress,
            userAddress,
            parseInt(block.block),
            web3Time
          );
          const priceTime = await getV2PriceTimeBsc(
            tokenAddress,
            provider,
            parseInt(decimals),
            parseInt(block.block)
          );

          const serializedTime = {
            ethPrice: parseInt(priceTime).toString(),
            block,
            balance: balanceTime,
          };

          return serializedTime;
        } catch (error) {
          console.log('duration error', error);
          return serializedThen;
        }
      });
      const dates = await Promise.all(balancesFetcher);

      return [
        {
          maxReserve: serializedThen,
          nowReserve: serializedNow,
          dates,
        },
      ];
    } else {
      return null;
    }
  } catch (error) {
    console.log('bsc reserve error');
  }
};

export default getHistoryBsc;
