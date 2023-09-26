import { Alchemy, Network } from 'alchemy-sdk';
import { alchemyKey } from 'src/config';

const ethHistory = async (address) => {
  const config = {
    apiKey: alchemyKey,
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);

  const data = await alchemy.core.getAssetTransfers({
    fromBlock: '0x0',
    fromAddress: address,
    category: ['external', 'erc20'],
  });

  return data;
};

export default ethHistory;
