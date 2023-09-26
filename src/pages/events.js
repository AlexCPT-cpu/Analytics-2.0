import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';

import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { paths } from 'src/paths';

const Page = () => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [message, setMessage] = useState();
  const [progress, setProgress] = useState();

  usePageView();

  // client-side code
  const address = '0xd05DB5264ECAB3C490f7Cc106104Ffe1075d3EeC';

  const eventSource = new EventSource(`/api/transactions`, {
    method: 'POST',
    body: JSON.stringify({ address }),
  });

  eventSource.onopen = (event) => {
    //    / console.log('Connection opened:', event);
  };

  eventSource.onmessage = (event) => {
    const eventData = JSON.parse(event.data);

    if (eventData.step) {
      setProgress(eventData);
    }

    if (eventData?.walletData?.tokens) {
      console.log(eventData.walletData.tokens);
      setMessage(eventData);
      eventSource.close();
    }
  };
  eventSource.onerror = () => {
    console.log('Server Closed Connection');
    eventSource.close();
  };

  // console.log(message, progress);
  return (
    <>
      <Seo title="Error: Server Error" />
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          py: '80px',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 6,
            }}
          >
            <div>
              {progress?.step} {progress?.progress}
            </div>
            <br />
            <div>
              <h2>Tokens:</h2>
              <br />
              <ul id="tokens-list"></ul>
            </div>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Page;
