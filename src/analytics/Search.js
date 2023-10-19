import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { Tip } from 'src/components/tip';
import { usePageView } from 'src/hooks/use-page-view';
import { useRouter } from 'next/router';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import validateAddress from 'src/libs/validateAddress';

const Search = () => {
  const router = useRouter();
  usePageView();
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateAddress(value);
    if (validation) {
      router.push(`/address/${value}`);
      setValue('');
      console.log('passed');
    } else {
      setError(true);
      setValue('');
    }
  };

  return (
    <div>
      <Tip message="Enter a valid evm wallet address and press Enter" />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 3 }}
      >
        <TextField
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon>
                  <SearchMdIcon />
                </SvgIcon>
              </InputAdornment>
            ),
          }}
          label="Search"
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search..."
          value={value}
        />
        {error ? (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            The address entered is not evm compatible — <strong>Please try again!</strong>
          </Alert>
        ) : null}
      </Box>
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 3,
          }}
        >
          {/* <CircularProgress /> */}
        </Box>
      )}
    </div>
  );
};

export default Search;
