import Moralis from "moralis";
import historicPrice from "../historicPrice.js";
import getBalances from "../getBalances.js";
import getPrice from "../getPrice.js";
import { ethPrice, ethPriceNow } from "../../bsc/prices.js";
import getBlockByTimestamp from "../../bsc/getBlockByTimestamp.js";
import getBalance from "../getBalance.js";

const getBscAnalytics = async (address, chain, timing, web3) => {
  const blocks = await Promise.all(
    timing.map(async (time) => {
      const blockObj = await getBlockByTimestamp(Math.floor(time / 1000));
      return { block: parseInt(blockObj) };
    })
  );

  const bnb_PriceNow = await ethPriceNow();
  const bscArr = [];
  const bscData = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    chain,
  });
  const bnb_Price1H = await ethPrice(timing[0]);
  const bscTokens = Object.values(bscData);
  const filteredObjects = bscTokens[0].filter(
    (obj) => obj.possible_spam === false
  );
  for (const token of filteredObjects) {
    try {
      const price = await getPrice(chain, token.token_address);

      bscArr.push({
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
  const bnb_Price1D = await ethPrice(timing[1]);
  const finalData = await Promise.all(
    bscArr.map(async (token) => {
      const reserves = [];
      for (const block of blocks) {
        try {
          const histrPrice = await historicPrice(address, chain, block.block);
          const balance = await getBalance(
            token.token_address,
            address,
            web3,
            block.block
          );
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
  const bnb_Price7 = await ethPrice(timing[2]);
  const bscBalances = await getBalances(address, web3, blocks);

  const bnb_Price30 = await ethPrice(timing[3]);

  return {
    bscArr: finalData,
    bscBalances,
    bnbData: {
      bnb_PriceNow,
      bnb_Price1H,
      bnb_Price1D,
      bnb_Price7,
      bnb_Price30,
    },
  };
};

export default getBscAnalytics;
