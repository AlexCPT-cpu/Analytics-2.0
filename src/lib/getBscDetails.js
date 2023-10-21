const getBscDetails = (balance, ethData, chain) => {
  if (balance.reserves['0']) {
    const wethDecimals = 1e18;
    const tokenDecimals = balance.decimals;
    const decimals = 10 ** tokenDecimals;
    const reserves = balance?.reserves['0'];
    const hour = reserves?.dates[0];

    const nowPriceEth = reserves.nowReserve.ethPrice / wethDecimals;

    const hourPriceEth = reserves.dates[0].ethPrice / wethDecimals;
    const nowPrice = ethData?.bnb_PriceNow;
    const hourPrice = ethData?.bnb_Price1H;

    return {
      nowPriceBal: nowPriceEth * (parseInt(balance?.balance) / decimals),
      hourPriceBal: hourPriceEth * (hour?.balance / decimals),
      token: balance,
      nowPrice,
      tokenPriceEth: nowPriceEth,
      hourPrice,
      hourPriceEth,
      hourBalance: hour?.balance,
      balance: parseInt(balance?.balance) / 10 ** tokenDecimals,
      chain: chain,
      exchange: balance.reserves.exchange,
    };
  }
};

export default getBscDetails;
