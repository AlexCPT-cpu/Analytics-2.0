import erc20Abi from 'src/json/erc20Abi.json';
import { userBalance } from './userBalance';
import { nodeRealKeys } from 'src/config/index';
import Web3 from 'web3';
import { getV3PriceTimeBsc } from 'src/lib/getV3PriceBsc';
import fetchBalance from './fetchBalance';

const getHistoryBscV3 = async (tokenAddress, web3, userAddress, blocks, i, decimals, ethData) => {
  try {
    const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);

    const balanceNow = await userBalance(tokenContract, userAddress);
    if (balanceNow !== null) {
      const index = i % 4;
      const provider = nodeRealKeys[index];
      const web3Time = new Web3(provider);

      if (ethData !== null) {
        const resultThen = {
          ethPrice: 0,
          balance: 0,
          block: { timestamp: 0, number: 0 },
          fee: 0,
        };
        const resultNow = {
          ethPrice: parseInt(ethData.ethPrice),
          balance: parseInt(balanceNow),
          fee: parseInt(ethData.fee),
        };

        const balancesFetcher = blocks.map(async (block) => {
          try {
            const balanceTime = await fetchBalance(
              tokenAddress,
              userAddress,
              parseInt(block.block),
              web3Time
            );
            const priceTime = await getV3PriceTimeBsc(
              tokenAddress,
              provider,
              decimals,
              ethData.fee,
              parseInt(block.block)
            );

            return {
              ethPrice: priceTime,
              fee: ethData.fee,
              block,
              balance: balanceTime,
            };
          } catch (error) {
            return resultThen;
          }
        });
        const dates = await Promise.all(balancesFetcher);

        return [
          {
            maxReserve: resultThen,
            nowReserve: resultNow,
            dates,
          },
        ];
      }
    } else return null;
  } catch (error) {
    console.log('bsc v3 reserve error');
  }
};

export default getHistoryBscV3;
