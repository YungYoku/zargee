export interface User {
  adWatchTime: number;
  codes: string[];
  complexity: number;
  gold: number;
  hearts: number;
  lvl: number;
  name: string;
  ref: string;
  refUsers: number;
  resetDay: number;
  rewardDay: number;
  rewardParts: {
    first: boolean;
    second: boolean;
  };
}
