import Moralis from 'moralis';
import getBalances from 'src/lib/moralis/getBalances';
import { ethPrice, ethPriceNow } from './pricesbsc';
import getBlockByTimestamp from './getBlockByTimestampBsc';
import getReserves from './getReservesBsc';
import getHistory from 'src/lib/moralis/bsc/getHistory';
import getHistoryV3 from 'src/lib/moralis/bsc/getHistoryV3';
import noNulls from 'src/lib/noNulls';

const getBscAnalytics = async (address, chain, timing, web3) => {
  const bscArr = [];
  const bnb_PriceNow = await ethPriceNow();
  //console.log("  Getting Bsc Blocks");
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

  const bnb_Price1D = await ethPrice(timing[1]);
  // console.log("  Getting Bsc Tokens");
  const bscData = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    chain,
  });
  const bnb_Price1H = await ethPrice(timing[0]);
  const bscTokens = Object.values(bscData);
  const filteredObjects = bscTokens[0].filter((obj) => obj.possible_spam === false);
  // console.log("  Getting Bsc History");
  for (const token of filteredObjects) {
    const pair = await getReserves(web3, token.token_address);
    if (pair.exchange == 'PancakeV2') {
      const reserves = await getHistory(token.token_address, web3, address, pair.pair, blocks);
      bscArr.push({ ...token, pair, reserves });
    } else if (pair.exchange == 'PancakeV3') {
      const reserves = await getHistoryV3(token.token_address, web3, address, pair.pair, blocks);
      bscArr.push({ ...token, pair, reserves });
    }
  }

  const bnb_Price7 = await ethPrice(timing[2]);
  const bscBalances = await getBalances(address, web3, blocks);

  const bnb_Price30 = await ethPrice(timing[3]);
  const fullData = await noNulls(bscArr);

  return {
    bscBalances,
    bnbData: {
      bnb_PriceNow,
      bnb_Price1H,
      bnb_Price1D,
      bnb_Price7,
      bnb_Price30,
    },
    bscData: fullData,
  };
};

export default getBscAnalytics;
