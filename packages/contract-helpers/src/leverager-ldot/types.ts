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

export type LeveragerStatusAfterTx = {
  totalCollateralAfterTx: string;
  totalDebtAfterTx: string;
  healthFactorAfterTx: string;
};
