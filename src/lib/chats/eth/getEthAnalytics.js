import Moralis from 'moralis';
import getBalances from 'src/lib/moralis/getBalances';
import { ethPriceNow, ethPrice } from './prices';
import getBlockByTimestamp from './getBlockByTimestamp';
import getReserves from './getReserves';
import { WETH } from 'src/config/index';
import getHistory from 'src/lib/moralis/eth/getHistory';
import getHistoryV3 from 'src/lib/moralis/eth/getHistoryV3';
import noNulls from 'src/lib/noNulls';

const getEthAnalytics = async (address, chain, timing, web3) => {
  const eth_PriceNow = await ethPriceNow();
  //console.log("  Getting Eth Blocks");
  const blocks = await Promise.all(
    timing.map(async (time) => {
      const blockObj = await getBlockByTimestamp(Math.floor(time / 1000));
      const block = await web3.eth.getBlock(parseInt(blockObj));
      return {
        block: parseInt(block.number),
        timestamp: parseInt(block.timestamp),
      };
    })
  );

  const ethArr = [];

  const eth_Price1H = await ethPrice(timing[0]);
  //console.log("  Getting Eth Tokens");
  const ethData = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    chain,
  });

  const ethTokens = Object.values(ethData);

  const filteredObjects = ethTokens[0].filter((obj) => obj.possible_spam === false);
  const eth_Price1D = await ethPrice(timing[1]);
  //console.log("  Getting Eth Tokens History");
  for (const token of filteredObjects) {
    const pair = await getReserves(WETH, token?.token_address, chain);
    if (pair.exchange === 'UniswapV2') {
      const reserves = await getHistory(token.token_address, web3, address, pair.pair, blocks);
      ethArr.push({ ...token, pair, reserves });
    } else if (pair.exchange === 'UniswapV3') {
      const reserves = await getHistoryV3(token.token_address, web3, address, pair.pair, blocks);
      ethArr.push({ ...token, pair, reserves });
    }
  }

  const eth_Price7 = await ethPrice(timing[2]);
  const ethBalances = await getBalances(address, web3, blocks);

  const eth_Price30 = await ethPrice(timing[3]);

  const notNull = await noNulls(ethArr);

  return {
    ethData: notNull,
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
