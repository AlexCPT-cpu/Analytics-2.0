const noNulls = async (array) => {
  const notNull = array.filter((balance) => {
    if (balance) {
      return balance;
    }
  });

  return notNull;
};

export default noNulls;
