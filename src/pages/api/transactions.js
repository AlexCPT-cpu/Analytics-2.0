import { bearerToken } from 'src/config/index';
import axios from 'axios';
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const address = req.body.address;
    try {
      const parsed = await kv.get(address + 'transactions');
      const cachedData = JSON.parse(JSON.stringify(parsed));

      if (cachedData && cachedData.timestamp && cachedData.timestamp + 3600000 > Date.now()) {
        res.status(200).json(cachedData);
      } else {
        const dataResponse = await axios.get(
          `https://api.app-mobula.com/api/1/wallet/transactions?wallet=${address}`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        const dateing = new Date().getTime();
        const balanceData = {
          transactions: dataResponse.data,
          timestamp: dateing,
        };

        const key = address;

        await kv.set(key + 'transactions', JSON.stringify(balanceData));
        res.status(200).json(balanceData);
      }
    } catch (error) {
      res
        .status(500)
        .send(
          `an error occured while trying to get the wallet portfolio/details: ${error?.message}`
        );
    }
  } else {
    res.status(400).send('invalid method');
  }
}
