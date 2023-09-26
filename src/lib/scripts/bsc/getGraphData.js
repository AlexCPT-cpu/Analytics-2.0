import fetchBalance from "../../bsc/fetchBalance";
import getBlockByTimestamp from "../../bsc/getBlockByTimestamp";

export const getGraphData = async (
  timestamp,
  tokenAddress,
  userAddress,
  web3
) => {
  try {
    const block = await getBlockByTimestamp(timestamp);
    const blockData = await web3.eth.getBlock(block);

    const details = {
      number: parseInt(blockData.number),
      timestamp: parseInt(blockData.timestamp),
    };

    const balance = await fetchBalance(
      tokenAddress,
      userAddress,
      details.number,
      web3
    );
    await delay(200);
    const resultTime = await contract.methods
      .getReserves()
      .call({}, details.number);

    const serializedTime = {
      ...resultTime,
      0: resultTime["0"].toString(),
      1: resultTime["1"].toString(),
      2: resultTime["2"].toString(),
      __length__: resultTime.__length__.toString(),
      _reserve0: resultTime._reserve0.toString(),
      _reserve1: resultTime._reserve1.toString(),
      _blockTimestampLast: resultTime._blockTimestampLast.toString(),
      blockNo: details,
      balance: balance,
    };
    return serializedTime;
  } catch (error) {
    console.log(error);
  }
};
