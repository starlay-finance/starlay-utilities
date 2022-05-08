export type BidParamsType = {
  user: string;
  reserve: string;
  amount: string;
  priceCap: string;
  cancelable: boolean;
};

export type UpdateParamsType = {
  user: string;
  reserve: string;
  amount: string;
  priceCap: string;
};

export type CancelParamsType = {
  user: string;
};
