const getBalanceDetails = (balance, ethData, chain) => {
  if (balance.reserves['0']) {
    const wethDecimals = 1e18;
    const tokenDecimals = balance.decimals;
    const decimals = 10 ** tokenDecimals;
    const reserves = balance?.reserves['0'];
    const hour = reserves?.dates[0];

    const nowPriceEth = Number(reserves.nowReserve.ethPrice) / wethDecimals;

    const hourPriceEth = Number(reserves.dates[0].ethPrice) / wethDecimals;

    const nowPrice = ethData?.eth_PriceNow;
    const hourPrice = ethData?.eth_Price1H;

    const nowBal = parseInt(balance?.balance) / decimals;
    const hourBal = hour?.balance / decimals;

    return {
      nowPriceBal: nowPriceEth * nowBal,
      hourPriceBal: hourPriceEth * hourBal,
      token: balance,
      nowPrice,
      tokenPriceEth: nowPriceEth,
      hourPrice,
      hourPriceEth,
      hourBalance: hour?.balance,
      balance: parseInt(balance?.balance) / decimals,
      chain: chain,
      exchange: balance.reserves.exchange,
    };
  }
};
export default getBalanceDetails;
