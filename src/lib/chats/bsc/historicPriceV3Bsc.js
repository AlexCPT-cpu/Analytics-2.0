import getSerialisedV3dataBsc from 'src/lib/moralis/bsc/getSerialisedV3dataBsc';

const historicPriceV3Bsc = async (
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
  const serialisedData = await getSerialisedV3dataBsc(
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

export default historicPriceV3Bsc;
