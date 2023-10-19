import getGraphIntervals from 'src/lib/getGraphIntervals';
import reserveTier from 'src/libs/reserveTier';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { address, tier, tokens } = req.body;
    const intervals = getGraphIntervals();

    if (tier === '1H') {
      try {
        const bscTokens = tokens.bscTokens;
        const ethTokens = tokens.ethTokens;
        const timing = intervals[0];
        const data = await reserveTier(address, '/history/1H', timing, bscTokens, ethTokens);
        res.status(200).json(data);
      } catch (error) {
        res
          .status(500)
          .send(
            `an error occured while trying to get the wallet portfolio/details: ${error?.message}`
          );
      }
    } else if (tier === '1D') {
      try {
        const bscTokens = tokens.bscTokens;
        const ethTokens = tokens.ethTokens;
        const timing = intervals[1];
        const data = await reserveTier(address, '/history/1D', timing, bscTokens, ethTokens);
        res.status(200).json(data);
      } catch (error) {
        res
          .status(500)
          .send(
            `an error occured while trying to get the wallet portfolio/details: ${error?.message}`
          );
      }
    } else if (tier === '1W') {
      try {
        const bscTokens = tokens.bscTokens;
        const ethTokens = tokens.ethTokens;
        const timing = intervals[2];
        const data = await reserveTier(address, '/history/1W', timing, bscTokens, ethTokens);
        res.status(200).json(data);
      } catch (error) {
        res
          .status(500)
          .send(
            `an error occured while trying to get the wallet portfolio/details: ${error?.message}`
          );
      }
    } else if (tier === '1M') {
      try {
        const bscTokens = tokens.bscTokens;
        const ethTokens = tokens.ethTokens;
        const timing = intervals[3];
        const data = await reserveTier(address, '/history/1M', timing, bscTokens, ethTokens);
        res.status(200).json(data);
      } catch (error) {
        res
          .status(500)
          .send(
            `an error occured while trying to get the wallet portfolio/details: ${error?.message}`
          );
      }
    } else if (tier === '1Y') {
      try {
        const bscTokens = tokens.bscTokens;
        const ethTokens = tokens.ethTokens;
        const timing = intervals[4];
        const data = await reserveTier(address, '/history/1Y', timing, bscTokens, ethTokens);
        res.status(200).json(data);
      } catch (error) {
        res
          .status(500)
          .send(
            `an error occured while trying to get the wallet portfolio/details: ${error?.message}`
          );
      }
    } else {
      res.status(400).send('invalid tier');
    }
  } else {
    res.status(400).send('invalid method');
  }
}
