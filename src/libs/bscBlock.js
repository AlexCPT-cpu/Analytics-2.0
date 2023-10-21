import getBlockByTimestampBsc from './timestamps/getBlockByTimestampBsc';

const bscBlock = async (timing, web3Bsc) => {
  const times = await Promise.all(
    timing.map(async (time, i) => {
      const index = i % 3;
      const blockObj = await getBlockByTimestampBsc(Math.floor(time / 1000), index);
      const block = await web3Bsc.eth.getBlock(parseInt(blockObj));
      return {
        block: parseInt(block?.number),
        timestamp: parseInt(block?.timestamp),
      };
    })
  );
  return times;
};

export default bscBlock;
