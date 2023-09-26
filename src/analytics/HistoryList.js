import { formatDistanceToNowStrict } from 'date-fns';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import Type from './TransactionType';

export const HistoryList = ({ slicedHistory }) => {
  return (
    <div className="w-[430px] md:w-[450px] lg:w-[700px]">
      <Container>
        <Card>
          <CardHeader
            action={
              <IconButton>
                <SvgIcon>
                  <DotsHorizontalIcon />
                </SvgIcon>
              </IconButton>
            }
            title={<h1 className="text-2xl">History</h1>}
          />
          <Divider />

          <Divider />
          <List disablePadding>
            {slicedHistory.map((history, index) => {
              const showDivider = index < slicedHistory.length - 1;
              const ago = formatDistanceToNowStrict(history.timestamp);

              return (
                <ListItem
                  divider={showDivider}
                  key={index}
                >
                  <ListItemAvatar
                    sx={{
                      position: 'relative',
                    }}
                  >
                    <Type type={history.type} />
                    <img
                      src={history?.blockchain === 'Ethereum' ? '/weth.png' : '/pancake.png'}
                      className="w-4 absolute bottom-0 left-6"
                      alt="icon-logo"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    disableTypography
                    primary={
                      <Link
                        color="text.primary"
                        sx={{ cursor: 'pointer', textTransform: 'capitalize', fontWeight: '600' }}
                        underline="none"
                        variant="subtitle2"
                      >
                        {history.type}
                      </Link>
                    }
                    secondary={
                      <Typography
                        color="text.secondary"
                        variant="body2"
                        sx={{
                          fontWeight: '400',
                        }}
                      >
                        {`${ago} ago`}
                      </Typography>
                    }
                  />
                  <Typography
                    color="text.secondary"
                    noWrap
                    variant="caption"
                    sx={{
                      fontWeight: '500',
                    }}
                  >
                    {history.amount.toLocaleString()} {history.asset.symbol}
                  </Typography>
                </ListItem>
              );
            })}
          </List>
          <Divider />
        </Card>
      </Container>
    </div>
  );
};
