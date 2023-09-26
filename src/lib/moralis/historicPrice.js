import Moralis from "moralis";

const historicPrice = async (address, chain, block) => {
  const historicalPrice = [];

  const response = await Moralis.EvmApi.token.getTokenPrice({
    address,
    chain,
    toBlock: block,
  });

  historicalPrice.push(response);

  return historicalPrice;
};

export default historicPrice;
