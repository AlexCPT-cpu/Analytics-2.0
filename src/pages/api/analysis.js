import { WETH, bearerToken, ethProvider, moralisKey, ankrRpc } from 'src/config/index';
import timings from 'src/lib/timings';
import axios from 'axios';
import Web3 from 'web3';
import { kv } from '@vercel/kv';
import { bscPrice, bscPriceNow } from 'src/lib/chats/bsc/pricesbsc';
import { ethPrice, ethPriceNow } from 'src/lib/chats/eth/prices';
import getReservesBsc from 'src/lib/chats/bsc/getReservesBsc';
import getHistoryBsc from 'src/lib/moralis/bsc/getHistoryBsc';
import getHistoryBscV3 from 'src/lib/moralis/bsc/getHistoryBscV3';
import getReserves from 'src/lib/chats/eth/getReserves';
import getHistory from 'src/lib/moralis/eth/getHistory';
import getHistoryV3 from 'src/lib/moralis/eth/getHistoryV3';
import getBalances from 'src/lib/moralis/getBalances';
import { CircularReplacer, Stringify } from 'src/helpers/CircularReplacer';
import getBlockByTimestampBsc from 'src/libs/timestamps/getBlockByTimestampBsc';
import getBlockByTimestamp from 'src/libs/timestamps/getBlockByTimestamp';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const address = req.body.address;
    try {
      const parsed = await kv.get(address);
      const cachedData = JSON.parse(JSON.stringify(parsed));

      if (cachedData && cachedData.timestamp && cachedData.timestamp + 3600000 > Date.now()) {
        res.status(200).json(cachedData);
      } else {
        const timing = timings();
        const providerBsc = new Web3.providers.HttpProvider(ankrRpc);
        const provider = new Web3.providers.HttpProvider(ethProvider);
        const web3Bsc = new Web3(providerBsc);
        const web3 = new Web3(provider);

        const bnb_PriceNow = await bscPriceNow();

        const blocksBsc = await Promise.all(
          timing.map(async (time, i) => {
            const index = i % 3;
            const blockObj = await getBlockByTimestampBsc(Math.floor(time / 1000), index);
            const block = await web3Bsc.eth.getBlock(parseInt(blockObj));
            return {
              block: parseInt(block.number),
              timestamp: parseInt(block.timestamp),
            };
          })
        );
        const eth_PriceNow = await ethPriceNow();
        const blocks = await Promise.all(
          timing.map(async (time, i) => {
            const index = i % 3;
            const blockObj = await getBlockByTimestamp(Math.floor(time / 1000), index);
            const block = await web3.eth.getBlock(parseInt(blockObj));
            return {
              block: parseInt(block.number),
              timestamp: parseInt(block.timestamp),
            };
          })
        );

        const url = `https://deep-index.moralis.io/api/v2/${address}/erc20?chain=bsc`;
        const headers = {
          accept: 'application/json',
          'X-API-Key': moralisKey,
        };
        const xBsc = await axios
          .get(url, {
            headers,
          })
          .catch((error) => {
            console.error('Fetch error:', error.message);
          });

        const bscData = JSON.parse(Stringify(xBsc?.data, CircularReplacer));
        const eth_Price1H = await ethPrice(timing[0]);
        const urlEth = `https://deep-index.moralis.io/api/v2/${address}/erc20?chain=eth`;

        const xEth = await axios
          .get(urlEth, {
            headers,
          })
          .catch((error) => {
            console.error('Fetch error:', error.message);
          });
        const noSpamBsc = [];
        const noSpamEth = [];
        const ethData = JSON.parse(Stringify(xEth?.data, CircularReplacer));
        const bnb_Price1H = await bscPrice(timing[0]);
        const bscTokens = Object.values(bscData);
        const ethTokens = Object.values(ethData);
        await Promise.all(
          bscTokens.filter(async (token) => {
            if (token.possible_spam === false) {
              noSpamBsc.push(token);
            }
          })
        );
        await Promise.all(
          ethTokens.filter(async (token) => {
            if (token.possible_spam === false) {
              noSpamEth.push(token);
            }
          })
        );

        const bTokens = await Promise.all(
          noSpamBsc.map(async (token) => {
            const pair = await getReservesBsc(web3Bsc, token.token_address);
            return { ...token, pair };
          })
        );
        const xTokens = await Promise.all(
          noSpamEth.map(async (token) => {
            const pair = await getReserves(WETH, token?.token_address, web3);
            return { ...token, pair };
          })
        );

        const tokensArr = [bTokens, xTokens];

        const ultimate = await Promise.all(
          tokensArr.map(async (tokenAr, index) => {
            if (index == 0) {
              const tokenf = await Promise.all(
                tokenAr.map(async (token) => {
                  if (token.pair.isAvail === true) {
                    if (token.pair.exchange == 'PancakeV2') {
                      const reserves = await getHistoryBsc(
                        token.token_address,
                        web3Bsc,
                        address,
                        token.pair.pair,
                        blocksBsc
                      );

                      return { ...token, reserves };
                    } else if (token.pair.exchange == 'PancakeV3') {
                      const reserves = await getHistoryBscV3(
                        token.token_address,
                        web3Bsc,
                        address,
                        token.pair.pair,
                        blocksBsc
                      );
                      return { ...token, reserves };
                    }
                  }
                })
              );
              return tokenf;
            } else {
              const tokenf = await Promise.all(
                tokenAr.map(async (token) => {
                  if (token.pair.isAvail === true) {
                    if (token.pair.exchange === 'UniswapV2') {
                      const reserves = await getHistory(
                        token.token_address,
                        web3,
                        address,
                        token.pair.pair,
                        blocks
                      );
                      return { ...token, reserves };
                    } else if (token.pair.exchange === 'UniswapV3') {
                      const reserves = await getHistoryV3(
                        token.token_address,
                        web3,
                        address,
                        token.pair.pair,
                        blocks
                      );
                      return { ...token, reserves };
                    }
                  }
                })
              );
              return tokenf;
            }
          })
        );

        const chainArr = [blocksBsc, blocks];
        const balanceAr = await Promise.all(
          chainArr.map(async (blockAr, index) => {
            if (index === 0) {
              const bscBalances = await getBalances(address, web3Bsc, blockAr);
              return bscBalances;
            } else {
              const ethBalances = await getBalances(address, web3, blockAr);
              return ethBalances;
            }
          })
        );

        const bscDataObj = {
          bscBalances: balanceAr[0],
          bnbData: {
            bnb_PriceNow,
            bnb_Price1H,
          },
          bscData: ultimate[0],
        };

        const ethDataObj = {
          ethData: ultimate[1],
          ethBalances: balanceAr[1],
          ethPrices: {
            eth_PriceNow,
            eth_Price1H,
          },
        };

        const dataResponse = await axios.get(
          `https://api.app-mobula.com/api/1/wallet/transactions?wallet=${address}`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        const dateing = new Date().getTime();
        const balanceData = {
          ethData: ethDataObj,
          bscData: bscDataObj,
          transactions: dataResponse.data,
          timestamp: dateing,
        };

        const key = address;

        await kv.set(key, JSON.stringify(balanceData));
        res.status(200).json(balanceData);
      }
    } catch (error) {
      res
        .status(500)
        .send(
          `an error occured while trying to get the wallet portfolio/details: ${error?.message}`
        );
    }
  } else {
    res.status(400).send('invalid method');
  }
}
