import { kv } from '@vercel/kv';
import { ethProvider, ankrRpc } from 'src/config/index';
import Web3 from 'web3';
import { ethPrice } from 'src/lib/chats/eth/prices';
import { bscPrice } from 'src/lib/chats/bsc/pricesbsc';
import bscBlock from 'src/libs/bscBlock';
import ethBlock from 'src/libs/ethBlock';
import getHistoryBsc from 'src/libs/getHistoryBsc';
import getHistoryBscV3 from 'src/libs/getHistoryBscV3';
import getBalances from 'src/lib/moralis/getBalances';

const reserveTier = async (address, tier, timing, bscTokens, ethTokens) => {
  try {
    const parsed = await kv.get(address + tier);
    const cachedData = JSON.parse(JSON.stringify(parsed));

    if (cachedData && cachedData.timestamp && cachedData.timestamp + 3600000 > Date.now()) {
      return cachedData;
    } else {
      const bnb_Price0 = await bscPrice(timing[1]);
      const start = new Date().getTime();
      const providerBsc = new Web3.providers.HttpProvider(ankrRpc);
      const provider = new Web3.providers.HttpProvider(ethProvider);
      const web3Bsc = new Web3(providerBsc);
      const web3Eth = new Web3(provider);
      const eth_Price0 = await ethPrice(timing[1]);
      const blocksBsc = await bscBlock(timing, web3Bsc);
      const bnb_Price1 = await bscPrice(timing[2]);
      const blocksEth = await ethBlock(timing, web3Eth);
      const key = address + tier;
      const eth_Price1 = await ethPrice(timing[2]);

      const tokensArr = [bscTokens, ethTokens];

      const ultimate = await Promise.all(
        tokensArr.map(async (tokenAr, index) => {
          if (index === 0) {
            const bscArr = await Promise.all(
              tokenAr.map(async (token) => {
                if (token.pair.exchange == 'PancakeV2') {
                  const pair = await Promise.all(
                    blocksBsc.map(async (block) => {
                      try {
                        const pairData = await getHistoryBsc(
                          token.address,
                          web3Bsc,
                          address,
                          token.pair.pair,
                          block,
                          token.maxReserve,
                          token
                        );
                        return {
                          address: token.address,
                          decimals: token.decimal,
                          pair: token.pair,
                          reserves: pairData,
                        };
                      } catch (error) {
                        console.log(error);
                      }
                    })
                  );
                  return pair;
                } else if (token.pair.exchange == 'PancakeV3') {
                  const pair = await Promise.all(
                    blocksBsc.map(async (block) => {
                      try {
                        const pairData = await getHistoryBscV3(
                          token.address,
                          web3Bsc,
                          address,
                          token.pair.pair,
                          block,
                          token.maxReserve,
                          token
                        );
                        return {
                          address: token.address,
                          decimals: token.decimal,
                          pair: token.pair,
                          reserves: pairData,
                        };
                      } catch (error) {
                        console.log(error);
                      }
                    })
                  );
                  return pair;
                }
              })
            );
            return bscArr;
          } else {
            const ethArr = await Promise.all(
              tokenAr.map(async (token) => {
                if (token.pair.exchange === 'UniswapV2') {
                  const pair = await Promise.all(
                    blocksEth.map(async (block) => {
                      try {
                        const pairData = await getHistoryBsc(
                          token.address,
                          web3Eth,
                          address,
                          token.pair.pair,
                          block,
                          token.maxReserve,
                          token
                        );
                        return {
                          address: token.address,
                          decimals: token.decimal,
                          pair: token.pair,
                          reserves: pairData,
                        };
                      } catch (error) {
                        console.log(error);
                      }
                    })
                  );
                  return pair;
                } else if (token.pair.exchange === 'UniswapV3') {
                  const pair = await Promise.all(
                    blocksEth.map(async (block) => {
                      try {
                        const pairData = await getHistoryBscV3(
                          token.address,
                          web3Eth,
                          address,
                          token.pair.pair,
                          block,
                          token.maxReserve,
                          token
                        );
                        return {
                          address: token.address,
                          decimals: token.decimal,
                          pair: token.pair,
                          reserves: pairData,
                        };
                      } catch (error) {
                        console.log(error);
                      }
                    })
                  );
                  return pair;
                }
              })
            );
            return ethArr;
          }
        })
      );

      const bnb_Price2 = await bscPrice(timing[3]);

      const eth_Price2 = await ethPrice(timing[3]);
      const bscBalance = await getBalances(address, web3Bsc, blocksBsc);
      const bnb_Price3 = await bscPrice(timing[4]);
      const ethBalance = await getBalances(address, web3Eth, blocksEth);
      const eth_Price3 = await ethPrice(timing[4]);

      const bscData = {
        bscBalance,
        bnb_Prices: {
          bnb_Price0,
          bnb_Price1,
          bnb_Price2,
          bnb_Price3,
        },
        bscData: ultimate[1],
      };
      const ethData = {
        ethBalance,
        eth_Prices: {
          eth_Price0,
          eth_Price1,
          eth_Price2,
          eth_Price3,
        },
        ethData: ultimate[0],
      };
      const end = new Date().getTime();
      const time = end - start;
      const balanceData = {
        bscData,
        ethData,
        time: time / 1000,
        timestamp: new Date().getTime(),
      };
      await kv.set(key, JSON.stringify(balanceData));
      return balanceData;
    }
  } catch (error) {
    console.log(error);
  }
};

export default reserveTier;
