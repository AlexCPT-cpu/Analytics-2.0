import getBlockByTimestamp from 'src/lib/chats/eth/getBlockByTimestamp';

const ethBlock = async (timing, web3Eth) => {
  const times = await Promise.all(
    timing.map(async (time) => {
      const blockObj = await getBlockByTimestamp(Math.floor(time / 1000));
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
