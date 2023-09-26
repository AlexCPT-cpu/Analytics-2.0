import getBlockByTimestampBsc from 'src/lib/chats/bsc/getBlockByTimestampBsc';

const bscBlock = async (timing, web3Bsc) => {
  const times = await Promise.all(
    timing.map(async (time) => {
      const blockObj = await getBlockByTimestampBsc(Math.floor(time / 1000));
      const block = await web3Bsc.eth.getBlock(parseInt(blockObj));
      return {
        block: parseInt(block.number),
        timestamp: parseInt(block.timestamp),
      };
    })
  );
  return times;
};

export default bscBlock;
