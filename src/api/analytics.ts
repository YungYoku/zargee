export interface Analytics {
  type: string;
  ip: string;
  date: Date;
}

export const requestTypes = [
  "addEmptyUserToDb",
  "claimDaily",
  "claimRewards",
  "login",
  "sendBonusToGivingRefUser",
  "updateAdWatchTime",
  "updateGold",
  "updateHearts",
  "updateName",
  "updateUserLevelRecord",
];
