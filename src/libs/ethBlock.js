import getBlockByTimestamp from './timestamps/getBlockByTimestamp';

const ethBlock = async (timing, web3Eth) => {
  const times = await Promise.all(
    timing.map(async (time, i) => {
      const index = i % 3;
      const blockObj = await getBlockByTimestamp(Math.floor(time / 1000), index);
      const block = await web3Eth.eth.getBlock(parseInt(blockObj));
      return {
        block: parseInt(block.number),
        timestamp: parseInt(block.timestamp),
      };
    })
  );
  return times;
};

export default ethBlock;
