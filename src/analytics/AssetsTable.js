import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Scrollbar } from 'src/components/scrollbar';
import AssetItem from './AssetItem';
import { AnalyticsConsumer } from 'src/contexts/AnalyticsContext';
import BscItem from './BscItem ';
import ChainItem from './ChainItem';

export const AssetsTable = () => {
  const { apiData, bscFiltered, allData } = AnalyticsConsumer();

  const eth = {
    name: 'Ethereum',
    chain: 'ethereum',
    price: allData?.ethData.ethPrices.eth_PriceNow,
    amount: allData?.ethData.ethBalances.balanceNow,
    value: allData?.ethData.ethBalances.balanceNow * allData?.ethData.ethPrices.eth_PriceNow,
    symbol: 'ETH',
    logo: '/weth.png',
  };

  const bnb = {
    name: 'Binance Smart Chain',
    chain: 'smart chain',
    price: allData?.bscData.bnbData.bnb_PriceNow,
    amount: allData?.bscData.bscBalances.balanceNow,
    value: allData?.bscData.bscBalances.balanceNow * allData?.bscData.bnbData.bnb_PriceNow,
    symbol: 'BNB',
    logo: '/pancake.png',
  };

  return (
    <div className="w-[98vw] md:w-[43%] lg:w-[80%]">
      <Box
        sx={{
          p: 2,
        }}
      >
        <Card>
          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            gap={2}
            sx={{ p: 2 }}
          ></Stack>
          <Scrollbar>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Assets</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <ChainItem
                  data={eth}
                  chain="ETH"
                />
                <ChainItem
                  data={bnb}
                  chain="BSC"
                />
                {apiData.map((customer, index) => (
                  <AssetItem
                    key={index}
                    customer={customer}
                  />
                ))}
                {bscFiltered.map((customer, index) => (
                  <BscItem
                    key={index}
                    customer={customer}
                  />
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
          {/* <TablePagination
            component="div"
            count={apiData.length}
            onPageChange={() => {}}
            onRowsPerPageChange={() => {}}
            page={0}
            rowsPerPage={5}
            rowsPerPageOptions={[5, 10, 25]}
          /> */}
        </Card>
      </Box>
    </div>
  );
};
