const getBalance = async (pairAddress, contract0, contract1, block) => {
  const decimal0 = await contract0.methods.decimals().call();
  const decimal1 = await contract1.methods.decimals().call();

  const balance0 = await contract0.methods
    .balanceOf(pairAddress)
    .call({}, block);
  const balance1 = await contract1.methods
    .balanceOf(pairAddress)
    .call({}, block);

  const balances = [parseInt(balance0), parseInt(balance1)];

  const decimals = [parseInt(decimal0), parseInt(decimal1)];

  const parsed = [
    balances[0] / 10 ** decimals[0],
    balances[1] / 10 ** decimals[1],
  ];
  return parsed;
};

const getNowBalance = async (pairAddress, contract0, contract1) => {
  const decimal0 = await contract0.methods.decimals().call();
  const decimal1 = await contract1.methods.decimals().call();

  const balance0 = await contract0.methods.balanceOf(pairAddress).call();
  const balance1 = await contract1.methods.balanceOf(pairAddress).call();

  const balances = [parseInt(balance0), parseInt(balance1)];

  const decimals = [parseInt(decimal0), parseInt(decimal1)];

  const parsed = [
    balances[0] / 10 ** decimals[0],
    balances[1] / 10 ** decimals[1],
  ];

  return parsed;
};
export { getBalance, getNowBalance };
