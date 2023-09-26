import { WBNB } from '../config/index';
import calculateTokenPrice from './calculateTokenPrice';

const getBscDetails = (balance, ethData, chain) => {
  const isWeth = String(balance?.reserves[1]?.token0).toLowerCase() === String(WBNB).toLowerCase();

  const wethDecimals = 18;
  const tokenDecimals = balance.decimals;
  const reserves = balance?.reserves[0];
  const now = reserves?.nowReserve;
  const hour = reserves?.dates[0];
  // const day = reserves?.dates[1];
  // const week = reserves?.dates[2];
  // const month = reserves?.dates[3];
  //const year = reserves?.dates[4];
  // const max = reserves?.maxReserve;

  const nowPriceEth = isWeth
    ? calculateTokenPrice(now?.reserve1, now?.reserve0, tokenDecimals, wethDecimals)
    : calculateTokenPrice(now?.reserve0, now?.reserve1, tokenDecimals, wethDecimals);

  const hourPriceEth = isWeth
    ? calculateTokenPrice(hour?.reserve1, hour?.reserve0, tokenDecimals, wethDecimals)
    : calculateTokenPrice(hour?.reserve0, hour?.reserve1, tokenDecimals, wethDecimals);
  // const dayPriceEth = isWeth
  //   ? calculateTokenPrice(day?.reserve1, day?.reserve0, tokenDecimals, wethDecimals)
  //   : calculateTokenPrice(day?.reserve0, day?.reserve1, tokenDecimals, wethDecimals);

  // const weekPriceEth = isWeth
  //   ? calculateTokenPrice(week?.reserve1, week?.reserve0, tokenDecimals, wethDecimals)
  //   : calculateTokenPrice(week?.reserve0, week?.reserve1, tokenDecimals, wethDecimals);

  // const monthPriceEth = isWeth
  //   ? calculateTokenPrice(month?.reserve1, month?.reserve0, tokenDecimals, wethDecimals)
  //   : calculateTokenPrice(month?.reserve0, month?.reserve1, tokenDecimals, wethDecimals);

  // const maxPriceEth = isWeth
  //   ? calculateTokenPrice(
  //       max?.reserve1,
  //       max?.reserve0,
  //       tokenDecimals,
  //       wethDecimals
  //     )
  //   : calculateTokenPrice(
  //       max?.reserve0,
  //       max?.reserve1,
  //       tokenDecimals,
  //       wethDecimals
  //     );

  const nowPrice = ethData?.bnb_PriceNow;
  const hourPrice = ethData?.bnb_Price1H;
  // const day1Price = ethData?.bnb_Price1D?.market_data?.current_price?.usd;
  // const day7Price = ethData?.bnb_Price7?.market_data?.current_price?.usd;
  // const day30Price = ethData?.bnb_Price30?.market_data?.current_price?.usd;

  return {
    nowPriceBal: nowPriceEth * (parseInt(balance?.balance) / 10 ** tokenDecimals),
    hourPriceBal: hourPriceEth * (hour?.balance / 10 ** tokenDecimals),
    // dayPriceBal: dayPriceEth * (day?.balance / 10 ** tokenDecimals),
    // weekPriceBal: weekPriceEth * (week?.balance / 10 ** tokenDecimals),
    // monthPriceBal: monthPriceEth * (month?.balance / 10 ** tokenDecimals),
    // maxPriceBal: maxPriceEth * (max?.balance * 10 ** tokenDecimals),
    token: balance,
    nowPrice,
    tokenPriceEth: nowPriceEth,
    hourPrice,
    // day1Price,
    // day7Price,
    // day30Price,
    hourPriceEth,
    // dayPriceEth,
    hourBalance: hour?.balance,
    // dayBalance: day?.balance,
    balance: parseInt(balance?.balance) / 10 ** tokenDecimals,
    chain: chain,
  };
};

export default getBscDetails;
