import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { AnalyticsConsumer } from 'src/contexts/AnalyticsContext';

const AssetItem = ({ customer }) => {
  const logo = useMemo(() => {
    return customer?.chain === 'ethereum'
      ? ['/weth.png', 'Ethereum']
      : ['/pancake.png', 'Smart Chain'];
  }, [customer]);

  const { fullData } = AnalyticsConsumer();

  function calculateEthProfit(recentValue, oneDayAgoValue) {
    if (fullData.ethPrices) {
      let priceDifference = 0;
      let percentageChange = 0;
      let zero = 0.01;
      if (oneDayAgoValue === 0) {
        priceDifference = recentValue - zero;
      } else {
        priceDifference = recentValue - oneDayAgoValue;
      }
      const profitLoss = priceDifference > 0 ? 'Profit' : 'Loss';
      if (oneDayAgoValue === 0) {
        percentageChange = (priceDifference / zero) * 100;
      } else {
        percentageChange = (priceDifference / oneDayAgoValue) * 100;
      }

      return {
        profitLoss,
        priceDifference: priceDifference * fullData?.ethPrices?.eth_PriceNow,
        percentageChange,
      };
    }
  }

  function generateInitials(word) {
    if (word) {
      const characters = word.split('');
      const initials = characters
        .filter((char) => /[a-zA-Z]/.test(char))
        .slice(0, 2)
        .map((char) => char.toUpperCase())
        .join('');
      return initials;
    }
  }

  const nowBal = customer?.balance;
  const hourBal = customer?.hourBalance / 10 ** customer?.token.decimals;

  const nowPrice = customer?.tokenPriceEth;
  const hourPrice = customer?.hourPriceEth;
  const ethNow = nowPrice * nowBal;
  const ethHour = hourPrice * hourBal;
  const calc = calculateEthProfit(ethNow, ethHour);

  return (
    <TableRow hover>
      <TableCell>
        {customer?.logo ? (
          <img
            src={customer?.token.logo}
            className="w-7 lg:w-8 object-cover m-5"
            alt="table-logo"
          />
        ) : (
          <div className="rounded-full bg-gray-200/60 uppercase font-semibold text-xs text-[10px] w-8 h-8 lg:w-9 lg:h-9 justify-center flex text-center object-cover m-5 items-center">
            {generateInitials(customer?.token.name)}
          </div>
        )}
      </TableCell>
      <TableCell>
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <div>
            <Link
              color="inherit"
              variant="subtitle2"
            >
              {customer.token.name}
            </Link>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              <span className="flex flex-row items-center">
                <span className="flex flex-row items-center">
                  <img
                    src={logo[0]}
                    className="w-3 mr-2"
                    alt="table-logo"
                  />
                  <span className="capitalize font-light text-xs">{logo[1]}</span>
                </span>
                <span className="capitalize font-bold text-xs">{customer?.token.chain}</span>
              </span>
            </Typography>
          </div>
        </Stack>
      </TableCell>
      <TableCell> ${Number(customer?.nowPrice * customer.tokenPriceEth).toFixed(8)}</TableCell>
      <TableCell>
        {Number(customer?.balance).toLocaleString()} {customer?.token?.symbol}
      </TableCell>
      <TableCell>
        <span className="">
          ${Number(customer.nowPriceBal * customer.nowPrice).toLocaleString()}
        </span>
        <br />
        <span
          className={`${
            calc.profitLoss === 'Loss' && calc.priceDifference === 0
              ? 'text-green-600'
              : calc.profitLoss === 'Profit'
              ? 'text-green-600'
              : 'text-red-600'
          } flex flex-row whitespace-nowrap`}
        >
          {calc.profitLoss === 'Profit' && '+'}
          {calc.percentageChange.toLocaleString()}% ($
          {calc.priceDifference.toLocaleString()})
        </span>
      </TableCell>
    </TableRow>
  );
};

export default AssetItem;
