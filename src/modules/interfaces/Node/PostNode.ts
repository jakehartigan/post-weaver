import { Post } from "../Post/Post";
import { PostNodeType } from "./PostNodeType";
import { PostNodeStatus } from "./PostNodeStatus";

export interface PostNode {
  postNodeId: string;
  status: PostNodeStatus;
  type: PostNodeType;
  createdAt: string;
  content: any;
  posts?: Post[];
}
