import fetch from "./fetch.js";
import { delay } from "./delay.js";

const ethPrice = async (date) => {
  const time = new Date(date);
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();
  const format = `${day}-${month}-${year}`;
  try {
    const { data } = await fetch(
      "GET",
      `https://api.coingecko.com/api/v3/coins/ethereum/history?date=${format}&localization=false`
    );
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const ethPriceNow = async () => {
  const { data } = await fetch(
    "GET",
    `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
  );
  return data;
};

//date=30-12-2022
const coinInfo = async (contract) => {
  const { data } = await fetch(
    "GET",
    `https://api.coingecko.com/api/v3/coins/ethereum/contract/${contract}`
  );
  return data;
};

const marketChart = async (contract, days) => {
  const { data } = await fetch(
    "GET",
    `https://api.coingecko.com/api/v3/coins/ethereum/contract/${contract}/market_chart/?vs_currency=usd&days=${days}`
  );
  return data;
};
const marketChartRange = async (contract, start, end) => {
  const { data } = await fetch(
    "GET",
    `https://api.coingecko.com/api/v3/coins/ethereum/contract/${contract}/market_chart/range?vs_currency=usd&from=${start}&to=${end}`
  );
  return data;
};

export { ethPrice, coinInfo, marketChart, marketChartRange, ethPriceNow };

// const eth_PriceNow = await ethPrice(
//   Math.floor(new Date().getTime() / 1000)
// );
// const eth_Price1 = await ethPrice(timing[0]);
// const eth_Price7 = await ethPrice(timing[1]);
// const eth_Price30 = await ethPrice(timing[2]);

// const coin = await coinInfo(tokenAddress);

// const market1 = await marketChart(tokenAddress, 1);
// const market7 = await marketChart(tokenAddress, 7);
// const market30 = await marketChart(tokenAddress, 30);
