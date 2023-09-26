const noNulls = async (array) => {
  const notNull = await Promise.all(
    array.filter((balance) => {
      if (balance) {
        return balance;
      }
    })
  );

  return notNull;
};

export default noNulls;
