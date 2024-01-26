export type LeverageDOTParamsType = {
  user: string;
  token: string;
  borrow_dot_amount: string;
  repay_dot_amount: string;
};

export type LeverageDOTFromPositionParamsType = {
  user: string;
  token: string;
  borrow_dot_amount: string;
  supply_dot_amount: string;
};

export type CloseLeverageDOTParamsType = {
  user: string;
  dotAddress: string;
  ldotAddress: string;
};

export type LeveragerStatusAfterTx = {
  totalCollateralAfterTx: string;
  totalDebtAfterTx: string;
  totalCollateralInDotAfterTx: string;
  totalDebtInDotAfterTx: string;
  healthFactorAfterTx: string;
};
