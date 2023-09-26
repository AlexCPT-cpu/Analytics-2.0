import getSerialisedV3data from "../../moralis/eth/getSerialisedV3data";

const historicPriceV3 = async (
  address,
  tokenAddress,
  pair,
  token0,
  token1,
  web3,
  block,
  token,
  timestamp
) => {
  const serialisedData = await getSerialisedV3data(
    tokenAddress,
    address,
    pair,
    token0,
    token1,
    web3,
    block,
    token,
    timestamp
  );
  return serialisedData;
};

export default historicPriceV3;
