import getBlockByTimestamp from '../../chats/eth/getBlockByTimestamp';

const getGraph = async (web3, intervals) => {
  //console.log("  Getting Eth Intervals");
  const points = await Promise.all(
    intervals.map(async (interval) => {
      const timings = [];
      for (const time of interval) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        try {
          const blockObj = await getBlockByTimestamp(Math.floor(time / 1000));
          const block = await web3.eth.getBlock(parseInt(blockObj));
          timings.push({
            number: parseInt(block.number),
            timestamp: parseInt(block.timestamp),
          });
        } catch (error) {
          console.log(error);
        }
      }
      return timings;
    })
  );
  return points;
};

export default getGraph;
