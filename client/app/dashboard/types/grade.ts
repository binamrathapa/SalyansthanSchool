export interface Grade {
  id: number;
  name: string;

  sections: {
    id: number;
    name: string;
  }[];

  isActive: boolean;
  createdAt: string;
}

export type CreateGradePayload = {
  name: string;
  isActive: boolean;
};

export type UpdateGradePayload = {
  id: number;
  name: string;
  isActive: boolean;
};
