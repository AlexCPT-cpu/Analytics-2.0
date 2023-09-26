import axios from "axios";
import historicPriceV3 from "../../chats/eth/historicPriceV3";
import { bearerToken } from "@/config";
import getValueByTimestamp from "@/helpers/getValueByTimestamp";
import { delay } from "@/helpers/delay";
import getBalancez from "../getBalancez";
import getGraph from "../../scripts/eth/getGraph";

const ethChart = async (tokens, web3, address, intervals) => {
  // console.log(" eth interval");
  const ethPoints = await getGraph(web3, intervals);

  //console.log(" token data");

  const tokenReserves = await Promise.all(
    tokens.map(async (token) => {
      const tokenPts = await Promise.all(
        ethPoints.map(async (pointArr) => {
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

  //  console.log("eth data");

  const pts = await Promise.all(
    ethPoints.map(async (pointArr) => {
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
  //console.log("eth prices");
  const ethPrices = [];
  const dataResponse = await axios.get(
    "https://api.app-mobula.com/api/1/market/history?asset=ethereum",
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

  for (const blocks of ethPoints) {
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
    ethPrices.push(timedArr);
  }
  return {
    tokenReserves,
    ethPrices,
    ethBalances: pts,
  };
};

export default ethChart;
