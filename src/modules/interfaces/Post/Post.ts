import { PostInteractions } from "./PostInteraction";
import { PostMetrics } from "./PostMetrics";
import { PostMedia } from "./PostMedia";

export interface Post {
  postId: string;
  url: string;
  publishedDate: string;
  text: string;
  interactions: PostInteractions;
  metrics: PostMetrics;
  media: PostMedia;
}
