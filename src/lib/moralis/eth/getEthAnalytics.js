import Moralis from 'moralis';
import getBalances from '../getBalances.js';
import historicPrice from '../historicPrice.js';
import getPrice from '../getPrice.js';
import { ethPriceNow, ethPrice } from '../../helpers/prices.js';
import getBlockByTimestamp from '../../lib/getBlockByTimestamp.js';
import getBalance from '../getBalance.js';

const getEthAnalytics = async (address, chain, timing, web3) => {
  const blocks = await Promise.all(
    timing.map(async (time) => {
      const blockObj = await getBlockByTimestamp(Math.floor(time / 1000));
      return { block: parseInt(blockObj) };
    })
  );
  const eth_PriceNow = await ethPriceNow();
  const ethArr = [];
  const ethData = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    chain,
  });

  const eth_Price1H = await ethPrice(timing[0]);
  const ethTokens = Object.values(ethData);

  const filteredObjects = ethTokens[0].filter((obj) => obj.possible_spam === false);
  for (const token of filteredObjects) {
    try {
      const price = await getPrice(chain, token.token_address);

      ethArr.push({
        ...token,
        price: price.usdPrice,
        formattedPrice: price.usdPriceFormatted,
        exchangeAddress: price.exchangeAddress,
        exchangeName: price.exchangeName,
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  const eth_Price1D = await ethPrice(timing[1]);
  const finalData = await Promise.all(
    ethArr.map(async (token) => {
      const reserves = [];
      for (const block of blocks) {
        try {
          const histrPrice = await historicPrice(address, chain, block.block);
          const balance = await getBalance(token.token_address, address, web3, block.block);
          reserves.push({ ...histrPrice, balance });
        } catch (error) {
          console.log(error.message);
          reserves.push({
            nativePrice: {
              value: 0,
              decimals: token.decimals,
              name: token.name,
              symbol: token.symbol,
            },
            usdPrice: 0,
            balance: 0,
          });
        }
      }
      return { ...token, reserves };
    })
  );

  const eth_Price7 = await ethPrice(timing[2]);
  const ethBalances = await getBalances(address, web3, blocks);

  const eth_Price30 = await ethPrice(timing[3]);

  return {
    ethArr: finalData,
    ethBalances,
    ethPrices: {
      eth_PriceNow,
      eth_Price1H,
      eth_Price1D,
      eth_Price7,
      eth_Price30,
    },
  };
};

export default getEthAnalytics;
