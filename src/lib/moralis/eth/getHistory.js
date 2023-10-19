import PairAbi from 'src/json/PairAbi.json';
import RouterV2Abi from 'src/config/UniswapV2Abi.json';
import erc20Abi from 'src/json/erc20Abi.json';
import fetchBalance from './fetchBalance';
import { userBalance } from '../bsc/userBalance';
import { UniswapV2, WETH, alchemyUrl, ethProvider } from 'src/config/index';
import Web3 from 'web3';
import { getV2PriceTime } from 'src/lib/getV2Price';

const getHistory = async (tokenAddress, provider, userAddress, blocks, decimals, ethData) => {
  try {
    const web3 = new Web3(provider);
    // const contract = new web3.eth.Contract(PairAbi, pair);
    const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);
    const balanceNow = await userBalance(tokenContract, userAddress);

    if (balanceNow !== null) {
      const RouterV2 = new web3.eth.Contract(RouterV2Abi, UniswapV2);
      const tokenDecimals = 10 ** decimals;
      const one = 1 * tokenDecimals;
      // const data = await RouterV2.methods
      //   .getAmountsOut(one.toString(), [tokenAddress.toString(), WETH.toString()])
      //   .call();

      // const token0 = await contract.methods.token0().call();
      // const token1 = await contract.methods.token1().call();
      // const tokenDetails = {
      //   token0,
      //   token1,
      // };

      //const resultNow = await contract.methods.getReserves().call();

      const balanceNow = await tokenContract.methods.balanceOf(userAddress).call();

      const serializedThen = {
        ethPrice: 0,
        block: { timestamp: 0, block: 0 },
        balance: '0',
      };

      const serializedNow = {
        ethPrice: parseInt(ethData),
        balance: balanceNow.toString(),
      };

      const balancesFetcher = blocks.map(async (block) => {
        try {
          const priceTime = await getV2PriceTime(
            tokenAddress,
            provider,
            parseInt(decimals),
            parseInt(block.block)
          );
          const balanceTime = await fetchBalance(
            tokenAddress,
            userAddress,
            parseInt(block.block),
            web3
          );

          const serializedTime = {
            ethPrice: parseInt(priceTime).toString(),
            block,
            balance: balanceTime,
          };

          return serializedTime;
        } catch (error) {
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
        //  tokenDetails,
      ];
    }
  } catch (error) {
    console.log('eth reserve error');
  }
};

export default getHistory;
