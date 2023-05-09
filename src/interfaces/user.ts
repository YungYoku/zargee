export interface User {
  age: number;
  adWatchTime: number;
  codes: string[];
  gold: number;
  gender: string;
  hearts: number;
  lvl: number;
  name: string;
  changeNameDate: number;
  ref: number;
  refUsers: number;
  resetDay: number;
  rewardDay: number;
  rewardParts: {
    first: boolean;
    second: boolean;
  };
}
