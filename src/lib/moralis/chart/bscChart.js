import axios from 'axios';
import { bearerToken } from 'src/config/index';
import historicPriceV3 from '../../chats/eth/historicPriceV3';
import getValueByTimestamp from '@/helpers/getValueByTimestamp';
import getBalancez from '../getBalancez';
import { delay } from '@/helpers/delay';
import getGraphBsc from '../../scripts/bsc/getGraphBsc';

const bscChart = async (tokens, web3, address, intervals) => {
  console.log('Bsc Interval');
  const bscPoints = await getGraphBsc(web3, intervals);

  //console.log("token data");

  const tokenReserves = await Promise.all(
    tokens.map(async (token) => {
      const tokenPts = await Promise.all(
        bscPoints.map(async (pointArr) => {
          const pts = await Promise.all(
            pointArr.map(async (point) => {
              const data = await historicPriceV3(
                address,
                token.address,
                token.pair.pair,
                token.pair.token0,
                token.pair.token1,
                web3,
                point.number,
                token,
                point.timestamp
              );
              return data;
            })
          );
          return pts;
        })
      );
      return tokenPts;
    })
  );

  //  console.log("bsc data");

  const pts = await Promise.all(
    bscPoints.map(async (pointArr) => {
      await delay(100);
      return await Promise.all(
        pointArr.map(async (point) => {
          const bal = await getBalancez(address, point.number, web3);
          await delay(100);
          return bal;
        })
      );
    })
  );
  // console.log("bnb prices");
  const bnbPrices = [];
  const dataResponse = await axios.get(
    'https://api.app-mobula.com/api/1/market/history?asset=bnb',
    {
      headers: {
        Authorization: bearerToken,
      },
    }
  );

  const format = dataResponse.data.data.price_history.map((item) => ({
    timestamp: item[0],
    price: item[1],
  }));

  for (const blocks of bscPoints) {
    const timedArr = await Promise.all(
      blocks.map(async (block) => {
        const timeStamp = Math.floor(block.timestamp * 1000);
        const value = await getValueByTimestamp(timeStamp, format);
        if (value) {
          return value;
        } else {
          return format[format.length - 1].price;
        }
      })
    );
    bnbPrices.push(timedArr);
  }
  return { tokenReserves, bnbPrices, bnbBalances: pts };
};

export default bscChart;
