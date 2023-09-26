import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { Seo } from 'src/components/seo';

const Page = () => {
  const router = useRouter();

  // useEffect(() => {
  //   const x = async () => {
  //     const data = await axios.get('/api/transactions');
  //     console.log(data);
  //   };
  //   x();
  // }, []);
  return (
    <>
      <Seo />
      <div className="flex justify-center items-center min-h-screen flex-col">
        <Button
          size="large"
          variant="outlined"
          color="primary"
          sx={{
            fontSize: '25px',
          }}
          onClick={() => {
            router.push('/address');
          }}
        >
          Go To Analytics
        </Button>
      </div>
    </>
  );
};

export default Page;
