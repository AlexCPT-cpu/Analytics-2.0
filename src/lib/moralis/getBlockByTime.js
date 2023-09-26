import Moralis from "moralis";

const getBlockByTime = async (date, chain) => {
  // const date = "1667823435";

  const response = await Moralis.EvmApi.block.getDateToBlock({
    date,
    chain,
  });
  return response.toJSON();
};

export default getBlockByTime;
