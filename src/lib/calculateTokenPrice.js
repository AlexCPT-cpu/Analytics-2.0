const calculateTokenPrice = (
  tokenReserve,
  wethReserve,
  tokenDecimals,
  wethDecimals
) => {
  // const tokenReserveBN = new BigNumber(tokenReserve);
  // const wethReserveBN = new BigNumber(wethReserve);

  // const tokenPrice = wethReserveBN.dividedBy(tokenReserveBN);

  // const pricePerToken = tokenPrice.multipliedBy(
  //   new BigNumber(10).exponentiatedBy(tokenDecimals - wethDecimals)
  // );
  const EthPerToken =
    wethReserve / 10 ** wethDecimals / (tokenReserve / 10 ** tokenDecimals);

  if (!EthPerToken) {
    return 0;
  } else {
    return EthPerToken;
  }
};

export default calculateTokenPrice;
