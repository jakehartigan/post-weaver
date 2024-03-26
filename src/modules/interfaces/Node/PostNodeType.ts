export type PostNodeType =
  | ""
  | "commentThread"
  | "comment"
  | "long"
  | "quoteTweetOther"
  | "quoteTweetSelf"
  | "retweet"
  | "short"
  | "tweetThread";

export const POST_NODE_TYPE_OPTIONS: PostNodeType[] = [
  "",
  "commentThread",
  "comment",
  "long",
  "quoteTweetOther",
  "quoteTweetSelf",
  "retweet",
  "short",
  "tweetThread",
];
