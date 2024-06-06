export const isArraysEqual = <T>(firstArray: T[], secondArray: T[]) => {
  if (
    firstArray?.length === secondArray?.length &&
    firstArray?.every((element, index) => element === secondArray?.[index])
  ) {
    return true;
  }
  return false;
};
