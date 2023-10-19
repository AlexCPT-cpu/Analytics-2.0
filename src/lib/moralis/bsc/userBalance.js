export const userBalance = async (tokenContract, userAddress) => {
  try {
    const balanceNow = await tokenContract.methods.balanceOf(userAddress).call();
    return parseInt(balanceNow);
  } catch (error) {
    return null;
  }
};
