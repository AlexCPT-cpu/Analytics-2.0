import getBalanceDetails from 'src/lib/getBalanceDetails';
import getBscDetails from 'src/lib/getBscDetails';

const formatApiData = (eth, bsc, ethData, bscData) => {
  const ethD = eth?.map((token) => getBalanceDetails(token, ethData, 'ethereum'));
  const bscD = bsc?.map((token) => getBscDetails(token, bscData, 'bsc'));
  return {
    ethData: ethD,
    bscData: bscD,
  };
};

export default formatApiData;
