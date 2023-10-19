import {
  ethProvider,
  moralisKey,
  ankrRpc,
  alchemyUrl,
  bearerToken,
  nodeRealKeys,
} from 'src/config/index';
import timings from 'src/lib/timings';
import axios from 'axios';
import Web3 from 'web3';
import { kv } from '@vercel/kv';
import { bscPrice, bscPriceNow } from 'src/lib/chats/bsc/pricesbsc';
import { ethPrice, ethPriceNow } from 'src/lib/chats/eth/prices';
import getBalances from 'src/lib/moralis/getBalances';
import { CircularReplacer, Stringify } from 'src/helpers/CircularReplacer';
import getBlockByTimestampBsc from 'src/libs/timestamps/getBlockByTimestampBsc';
import getBlockByTimestamp from 'src/libs/timestamps/getBlockByTimestamp';
import getBscHistory from 'src/helpers/getBscHistory';
import getEthHistory from 'src/helpers/getEthHistory';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const address = req.body.address.trim().toLowerCase();
    try {
      const parsed = await kv.get(address);
      const cachedData = JSON.parse(JSON.stringify(parsed));

      if (cachedData && cachedData.timestamp && cachedData.timestamp + 3600000 > Date.now()) {
        res.status(200).json(cachedData);
      } else {
        try {
          const timing = timings();
          const web3Bsc = new Web3(ankrRpc);
          const web3 = new Web3(alchemyUrl);

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
          const bscArry = [...nodeRealKeys];
          const ethArry = [ethProvider, alchemyUrl];
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
            bscTokens?.filter(async (token) => {
              if (token?.possible_spam === false) {
                noSpamBsc?.push(token);
              }
            })
          );
          await Promise.all(
            ethTokens?.filter(async (token) => {
              if (token?.possible_spam === false) {
                noSpamEth?.push(token);
              }
            })
          );
          const reservesArr = [noSpamBsc, noSpamEth];
          // const twoReserves = await Promise.all(
          //   reservesArr?.map(async (reserveArray, index) => {
          //     if (index == 0) {
          //       const bTokens = await Promise.all(
          //         reserveArray?.map(async (token) => {
          //           const pair = await getReservesBsc(web3Bsc, token.token_address);
          //           if (pair) {
          //             return { ...token, pair };
          //           }
          //         })
          //       );
          //       return bTokens;
          //     } else {
          //       const xTokens = await Promise.all(
          //         reserveArray?.map(async (token) => {
          //           const pair = await getReserves(
          //             WETH,
          //             token?.token_address,
          //             18,
          //             parseInt(token.decimals),
          //             web3
          //           );
          //           if (pair) {
          //             return { ...token, pair };
          //           }
          //         })
          //       );
          //       return xTokens;
          //     }
          //   })
          // );
          // const parsedPairBsc = twoReserves[0]?.filter((item) => {
          //   if (item) {
          //     return item;
          //   }
          // });
          // const parsedPairEth = twoReserves[1]?.filter((item) => {
          //   if (item) {
          //     return item;
          //   }
          // });
          // const bothReserves = [parsedPairBsc, parsedPairEth];
          const ultimate = await Promise.all(
            reservesArr?.map(async (tokenAr, index) => {
              try {
                if (index == 0) {
                  const tokenf = await Promise.all(
                    tokenAr?.map(async (token, index) => {
                      const reserves = await getBscHistory(
                        token?.token_address,
                        web3Bsc,
                        address,
                        blocksBsc,
                        parseInt(token.decimals),
                        index
                      );
                      if (reserves && reserves !== null) {
                        return { ...token, reserves };
                      } else return null;
                    })
                  );
                  return tokenf;
                } else {
                  const tokenf = await Promise.all(
                    tokenAr?.map(async (token, index) => {
                      const reserves = await getEthHistory(
                        token?.token_address,
                        address,
                        blocks,
                        parseInt(token.decimals),
                        index
                      );
                      if (reserves && reserves !== null) {
                        return { ...token, reserves };
                      } else return null;
                    })
                  );
                  return tokenf;
                }
              } catch (error) {
                console.log(error.message, 'ultimate error');
              }
            })
          );

          const chainArr = [blocksBsc, blocks];
          const balanceAr = await Promise.all(
            chainArr?.map(async (blockAr, index) => {
              if (index === 0) {
                const bscBalances = await getBalances(address, bscArry, blockAr);
                return bscBalances;
              } else {
                const ethBalances = await getBalances(address, ethArry, blockAr);
                return ethBalances;
              }
            })
          );
          const parsedBsc = ultimate[0]?.filter((item) => {
            if (item) {
              return item;
            }
          });
          const parsedEth = ultimate[1]?.filter((item) => {
            if (item) {
              return item;
            }
          });
          const bscDataObj = {
            bscBalances: balanceAr[0],
            bnbData: {
              bnb_PriceNow,
              bnb_Price1H,
            },
            bscData: parsedBsc,
          };

          const ethDataObj = {
            ethData: parsedEth,
            ethBalances: balanceAr[1],
            ethPrices: {
              eth_PriceNow,
              eth_Price1H,
            },
          };

          const dataResponse = await axios
            .get(`https://api.app-mobula.com/api/1/wallet/transactions?wallet=${address}`, {
              headers: {
                Authorization: `Bearer ${bearerToken}`,
              },
            })
            .catch((error) => console.log(error));
          const dateing = new Date().getTime();
          const balanceData = {
            ethData: ethDataObj,
            bscData: bscDataObj,
            transactions: dataResponse?.data,
            timestamp: dateing,
          };

          const key = address;

          await kv.set(key, JSON.stringify(balanceData));
          res.status(200).json(balanceData);
        } catch (error) {
          console.log(error);
        }
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
