import erc20Abi from 'src/json/erc20Abi.json';
import { userBalance } from '../bsc/userBalance';
import Web3 from 'web3';
import { getV3PriceTime } from 'src/lib/getV3Price';
import fetchBalance from './fetchBalance';

const getHistoryV3 = async (tokenAddress, userAddress, blocks, provider, decimals, ethData) => {
  try {
    const web3 = new Web3(provider);
    const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);

    const balanceNow = await userBalance(tokenContract, userAddress);
    if (balanceNow !== null) {
      if (ethData !== null) {
        const resultThen = {
          ethPrice: 0,
          balance: 0,
          block: { timestamp: 0, number: 0 },
          fee: 0,
        };
        const resultNow = {
          ethPrice: ethData.ethPrice,
          balance: parseInt(balanceNow),
          fee: ethData.fee,
        };
        const balancesFetcher = blocks.map(async (block) => {
          try {
            const balanceTime = await fetchBalance(
              tokenAddress,
              userAddress,
              parseInt(block.block),
              web3
            );
            const priceTime = await getV3PriceTime(
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
      } else return null;
    }
  } catch (error) {
    console.log('eth v3 reserve error');
  }
};

export default getHistoryV3;
