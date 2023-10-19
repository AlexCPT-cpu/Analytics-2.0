import { UniswapV2, WETH, ankrRpc, bscProvider, ethProvider, nodeRealBsc } from 'src/config/index';
import QuoterAbi from 'src/config/Quoter.json';
import PairAbi from 'src/json/pancakePairV2.json';
import RouterV2Abi from 'src/config/UniswapV2Abi.json';
import getGraphIntervals from 'src/lib/getGraphIntervals';
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import Web3 from 'web3';
import { ethers } from 'ethers';
import QuoterV2 from 'src/config/QuoterV2';
import getReserves from 'src/lib/chats/eth/getReserves';
import { fetchV3Price, getV3PriceNow } from 'src/lib/getV3Price';

export default async function handler(req, res) {
  const web3 = new Web3(ethProvider);
  if (req.method === 'GET') {
    const pair = await fetchV3Price('0x20561172f791f915323241e885b4f7d5187c36e1', ethProvider, 18);
    // const ethPrice = await getV3PriceNow(
    //   '0x4743a7a193cdf202035e9bc6830a07f1607630c4',
    //   ethProvider,
    //   18,
    //   100
    // );
    // console.log(ethPrice);
    res.status(200).json(pair);
  }
}
