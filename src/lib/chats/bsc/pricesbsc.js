import axios from 'axios';

const bscPrice = async (timestamp) => {
  try {
    const response = await axios.get(`https://min-api.cryptocompare.com/data/pricehistorical`, {
      params: {
        fsym: 'BNB',
        tsyms: 'USD',
        ts: timestamp,
      },
    });
    const bnbPriceAtTimestamp = response.data.BNB.USD;

    return bnbPriceAtTimestamp;
  } catch (error) {
    console.log('gecko price', error);
  }
};

const bscPriceNow = async () => {
  const response = await axios.get(`https://min-api.cryptocompare.com/data/pricehistorical`, {
    params: {
      fsym: 'BNB',
      tsyms: 'USD',
      ts: new Date().getTime(),
    },
  });
  const bnbPriceAtTimestamp = response.data.BNB.USD;

  return bnbPriceAtTimestamp;
};

const coinInfo = async (contract) => {
  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/coins/binancecoin/contract/${contract}`
  );
  return data;
};

const marketChart = async (contract, days) => {
  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/coins/binancecoin/contract/${contract}/market_chart/?vs_currency=usd&days=${days}`
  );
  return data;
};
const marketChartRange = async (contract, start, end) => {
  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/coins/binancecoin/contract/${contract}/market_chart/range?vs_currency=usd&from=${start}&to=${end}`
  );
  return data;
};

export { bscPrice, coinInfo, marketChart, marketChartRange, bscPriceNow };
