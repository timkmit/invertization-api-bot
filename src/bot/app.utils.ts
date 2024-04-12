export const showList = (goods) => {
  const categoryGood = goods.map((good) => good.category);
  return categoryGood;
};
