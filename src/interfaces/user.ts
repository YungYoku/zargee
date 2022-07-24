export interface User {
  adWatchTime: number;
  codes: string[];
  gold: number;
  hearts: number;
  lvl: number;
  name: string;
  ref: number;
  refUsers: number;
  resetDay: number;
  rewardDay: number;
  rewardParts: {
    first: boolean;
    second: boolean;
  };
}
