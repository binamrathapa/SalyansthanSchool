
export interface FeeCategory {
  id: number;
  name: string;
  createdAt: string;
}
export interface FeeCategoryPayload {
  name: string;
}

export interface UpdateFeeCategoryPayload extends FeeCategoryPayload {
  id: number;
}


export interface FeeHead {
  id: number;
  feeCategoryId: number;
  feeCategoryName: string;
  name: string;
  createdAt: string;
}

export interface FeeHeadPayload {
  name: string;
  feeCategoryId: number;
}

export interface UpdateFeeHeadPayload extends FeeHeadPayload {
  id: number;
}