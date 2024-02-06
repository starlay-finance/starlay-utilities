export type LeverageDotParamsType = {
  user: string;
  dotAddress: string;
  leverage: string;
  repayAmountInDot: string;
};

export type LeverageDotFromPositionParamsType = {
  user: string;
  dotAddress: string;
  leverage: string;
  supplyAmountInDot: string;
};

export type LeverageLdotParamsType = {
  user: string;
  dotAddress: string;
  ldotAddress: string;
  leverage: string;
  repayAmountInLdot: string;
};

export type LeverageLdotFromPositionParamsType = {
  user: string;
  dotAddress: string;
  ldotAddress: string;
  leverage: string;
  supplyAmountInLdot: string;
};

export type CloseLeverageDotParamsType = {
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
