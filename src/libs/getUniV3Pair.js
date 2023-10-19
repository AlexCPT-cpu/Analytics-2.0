import { ethProvider } from 'src/config/index';
import UniV3Factory from 'src/json/factoryV3Abi.json';
import { ethers } from 'ethers';

const getUniV3Pair = async (token0, token1) => {
  const provider = new ethers.JsonRpcProvider(ethProvider);
  const feeTiers = [100, 500, 1000, 3000, 10000, 30000];

  const factoryContract = new ethers.Contract(
    '0x1f98431c8ad98523631ae4a59f267346ea31f984',
    UniV3Factory,
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
export default getUniV3Pair;
