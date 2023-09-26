import Moralis from "moralis";

const getPrice = async (chain, address) => {
  const response = await Moralis.EvmApi.token.getTokenPrice({
    address,
    chain,
  });

  return response;
};

export default getPrice;
