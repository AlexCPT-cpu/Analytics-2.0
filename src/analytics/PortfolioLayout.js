import Skeleton from "@mui/material/Skeleton";

const PortfolioLayout = () => {
  return (
    <div>
      <div className="mt-5 mb-6">
        <Skeleton
          className="mx-auto w-[350px] lg:w-[700px] h-80"
          variant="text"
          height={60}
          sx={{ fontSize: "1rem" }}
        />
      </div>
      <div className="mb-5">
        <Skeleton
          className="mx-auto w-[350px] lg:w-[1000px]"
          variant="rounded"
          height={400}
        />
      </div>
      <div className="mb-10">
        <Skeleton
          className="mx-auto w-[350px] lg:w-[1000px]"
          variant="rounded"
          height={30}
        />
      </div>

      <div className="mb-5">
        <Skeleton
          className="mx-auto w-[350px] lg:w-[1000px] border border-gray-400/60"
          variant="rounded"
          height={100}
        />
      </div>

      <div className="mb-5 border-t border-b border-gray-400/60 py-5 mx-5 lg:mx-16">
        <Skeleton
          className="mx-auto w-[350px] lg:w-[1000px]"
          variant="rounded"
          height={200}
        />
      </div>

      <div className="mb-5">
        <Skeleton
          className="mx-auto w-[350px] lg:w-[1000px]"
          variant="rounded"
          height={600}
        />
      </div>

      <div className="mt-5 mb-6">
        <Skeleton
          className="mx-auto w-[150px] lg:w-[200px] h-80"
          variant="text"
          height={60}
          sx={{ fontSize: "1rem" }}
        />
      </div>

      {/* <Skeleton variant="circular" width={40} height={40} /> */}
    </div>
  );
};

export default PortfolioLayout;
