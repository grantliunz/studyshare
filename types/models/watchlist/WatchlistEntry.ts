import { WatchListType } from "../user/user";

export type WatchlistEntry = {
  watchedId: string;
  lastViewed: Date;
  watchType: WatchListType;
};
