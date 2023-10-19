import { ankrRpc } from 'src/config/index';
import CakeFactory from 'src/json/pancakeFactoryV3.json';
import { ethers } from 'ethers';

const getCakeV3Pair = async (token0, token1) => {
  const provider = new ethers.JsonRpcProvider(ankrRpc);
  const feeTiers = [100, 500, 1000, 3000, 10000, 30000];

  const factoryContract = new ethers.Contract(
    '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
    CakeFactory,
    provider
  );

  async function getPoolAddress() {
    for (const feeTier of feeTiers) {
      try {
        const poolAddress = await factoryContract.getPool(token0, token1, feeTier);
        if (poolAddress !== '0x0000000000000000000000000000000000000000') {
          return { token0, token1, feeTier, poolAddress }; // Return the result immediately
        }
      } catch (error) {
        console.error(
          `Error fetching pool for Token ${token0} and , ${token1} Fee Tier ${feeTier}:`,
          error
        );
      }
    }
    return null;
  }

  const poolAddress = await getPoolAddress();

  return poolAddress;
};
export default getCakeV3Pair;
