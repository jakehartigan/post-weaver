import { QuoteTweetType } from "./QuoteTweetType";

export interface PostInteractions {
  inReplyToStatusId: string | null;
  inReplyToUserId: string | null;
  inReplyToUrl: string | null;
  inReplyToUserHandle: string | null;
  mentionedHandles: string[];
  quoteTweetType: QuoteTweetType;
  quoteTweetUrl: string;
}
