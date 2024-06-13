// Interfaces
import { Post, QuoteTweetType } from "../interfaces/Post";
import { Tweet } from "../interfaces/Importing";
import { PostNode, PostNodeStatus, PostNodeType } from "../interfaces/Node";

// Firebase
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../firebaseConfig";

/**
 The following function performs several steps to transform raw post data into a structured format
 * and then uploads the threads and long posts to Firestore db
 */

const importAndProcessPosts = async (userId: string, newPosts: Tweet[]) => {
  const db = getFirestore(app);

  //   // Normalize postObjects to ensure it's always an array
  const postObjects: Tweet[] = Array.isArray(newPosts) ? newPosts : [newPosts];
  //   // Convert raw post data to a more structured format
  let formattedPosts = formatPostsForProcessing(postObjects);
  //   // Sort the posts by their published date
  formattedPosts = sortPostsByDate(formattedPosts);
  //   // Organize posts into threads based on their reply structure
  const allPostNodes = organizePostsIntoTwitterThreads(formattedPosts);

  //   // Add delta content (like images, videos, etc.) to each post node
  const postNodesWithHtmlContent = addHtmlToPostNodes(allPostNodes);
  //   // Categorize each post node by its type (e.g., retweet, comment, etc.)
  const categorizedPostNodes = assignTypesToPostNodes(postNodesWithHtmlContent);

  // Filter post nodes to only include tweetThreads and long posts
  const filteredRepostableNodes = categorizedPostNodes.filter((postNode) =>
    ["long", "tweetThread"].includes(postNode.type)
  );

  // Add the filtered posts to Firestore under the user's importedPosts directory
  for (const postNode of filteredRepostableNodes) {
    try {
      await addDoc(collection(db, `users/${userId}/importedPosts`), postNode);
      console.log("Document written with ID: ", postNode.postNodeId);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
};

const addHtmlToPostNodes = (postNodes: PostNode[]): PostNode[] => {
  const constructHtml = (posts?: Post[]): any => {
    let content = "";

    posts?.forEach((post) => {
      const lines = post.text.split(/\n/);
      lines.forEach((line) => {
        content += `<p>${line}</p>`;
      });

      // Add links
      post.media.urls?.forEach((url) => {
        content += `<p><a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></p>`;
      });

      // Add images with Froala-specific classes and styles
      post.media.photos.forEach((photo) => {
        content += `<p><img src="${photo}" style="max-width: 80%; width: auto; height: auto; max-height:350px;" 
                    class="fr-fic fr-dib fr-draggable"></p>`;
      });

      // Add videos with Froala-specific classes and styles
      post.media.videos.forEach((video) => {
        content += `
          <p><span class="fr-video fr-dvb fr-draggable">
            <video src="${video}" style="max-width: 80%; width: auto; height: auto; max-height:350px;" 
            controls class="fr-draggable">
            </video>
          </span></p>`;
      });

      // Add GIFs with Froala-specific classes and styles
      post.media.gifs.forEach((gif) => {
        content += `<p><img src="${gif}" style="max-width: 80%; width: auto; height: auto; max-height:350px;" 
                    class="fr-fic fr-dib fr-draggable"></p>`;
      });

      content += "<br />";
    });

    return content;
  };

  return postNodes.map((postNode) => {
    return {
      ...postNode,
      content: constructHtml(postNode.posts),
    };
  });
};

const assignTypesToPostNodes = (postNodes: PostNode[]): PostNode[] => {
  return postNodes.map((postNode) => {
    let type = "" as PostNodeType;

    // if (!postNode.posts) {
    //   console.log("No posts found for postNode: ", postNode);
    // }

    if (postNode.posts) {
      const firstPost = postNode.posts[0];

      // console.log(
      //   "PostLength: ",
      //   postNode.posts.length,
      //   "   TextLength: ",
      //   firstPost.text.length,
      //   "   Url: ",
      //   firstPost.url
      // );

      // Retweet
      if (firstPost.text.startsWith("RT")) {
        type = "retweet" as PostNodeType;
      }

      // Comment (Reply not to oneself)
      else if (
        postNode.posts.length === 1 &&
        firstPost.interactions.inReplyToUserId !== null
      ) {
        type = "comment" as PostNodeType;
      }
      // Quote Tweet Other
      else if (
        firstPost.interactions.quoteTweetType === ("other" as QuoteTweetType)
      ) {
        type = "quoteTweetOther" as PostNodeType;
      }
      // Quote Tweet Self
      else if (
        firstPost.interactions.quoteTweetType === ("self" as QuoteTweetType)
      ) {
        type = "quoteTweetSelf" as PostNodeType;
      }
      // Short Tweet
      else if (postNode.posts.length === 1 && firstPost.text.length <= 280) {
        type = "short" as PostNodeType;
      }
      // Long Tweet
      else if (postNode.posts.length === 1 && firstPost.text.length > 280) {
        type = "long" as PostNodeType;
      }
      // Tweet Thread
      else if (
        postNode.posts.length > 1 &&
        firstPost.interactions.inReplyToStatusId === null
      ) {
        type = "tweetThread" as PostNodeType;
      }
      // Comment Thread
      else if (
        postNode.posts.length > 1 &&
        firstPost.interactions.inReplyToStatusId !== null
      ) {
        type = "commentThread" as PostNodeType;
      }
    }

    // Return the PostNode with the updated type
    return {
      ...postNode,
      type: type,
    };
  });
};

const formatPostsForProcessing = (postObjects: Tweet[]): Post[] => {
  return postObjects.map((postObject) => getPostDetails(postObject));
};

// Function to organize posts into threads
const organizePostsIntoTwitterThreads = (posts: Post[]): PostNode[] => {
  // Function to build a thread from a given root post
  const buildThreadFromRoot = (rootPost: Post): Post[] => {
    let thread = [rootPost];
    let currentPost = rootPost;

    // Find and add replies to the thread
    while (true) {
      let reply = posts.find(
        (post) => post.interactions.inReplyToStatusId === currentPost.postId
      );

      if (!reply) break;

      thread.push(reply);
      currentPost = reply;
    }

    return thread;
  };

  // const rootPosts = posts.filter(
  //   (post) => !post.interactions.inReplyToStatusId
  // );

  // Get the IDs of all posts
  const postIds = new Set(posts.map((post) => post.postId));

  // Determine root posts
  const rootPosts = posts.filter(
    (post) =>
      // A post is a root if it does not reply to any other post in the dataset
      !post.interactions.inReplyToStatusId ||
      !postIds.has(post.interactions.inReplyToStatusId)
  );

  // Build threads starting from each root post
  const postNodes = rootPosts.map((rootPost) => {
    const threadPosts = buildThreadFromRoot(rootPost);
    return {
      postNodeId: rootPost.postId,
      status: "published" as PostNodeStatus,
      type: "" as PostNodeType,
      createdAt: rootPost.publishedDate,
      content: rootPost.text,
      posts: threadPosts,
    };
  });

  // Return the array of PostNode objects
  return postNodes;
};

const getPostDetails = (postObject: Tweet): Post => {
  const url = `https://twitter.com/MPeytonCox/status/${postObject.tweet.id_str}`;
  const mentionedHandles = getMentionedHandles(postObject);
  const { quoteTweetType, quoteTweetUrl } = getQuoteTweets(postObject);
  const urls = getUrls(postObject);
  const photos = getPhotos(postObject);
  const videos = getVideos(postObject);
  const gifs = getGifs(postObject);

  // Remove media URLs from the full text
  const regex = new RegExp("https://t\\.co/[\\w\\d]+", "gi");
  let text = postObject.tweet.full_text;
  text = text.replace(regex, "");

  const post: Post = {
    postId: postObject.tweet.id_str,
    url: url,
    publishedDate: postObject.tweet.created_at,
    text: text,
    interactions: {
      inReplyToStatusId: postObject.tweet.in_reply_to_status_id || null,
      inReplyToUserId: postObject.tweet.in_reply_to_user_id || null,
      inReplyToUrl: postObject.tweet.in_reply_to_screen_name
        ? `https://twitter.com/${postObject.tweet.in_reply_to_screen_name}/status/${postObject.tweet.in_reply_to_status_id}`
        : null,
      inReplyToUserHandle: postObject.tweet.in_reply_to_screen_name || null,
      mentionedHandles: mentionedHandles,
      quoteTweetType: quoteTweetType,
      quoteTweetUrl: quoteTweetUrl,
    },
    metrics: {
      impressions: null,
      favorites: postObject.tweet.favorite_count,
      retweets: postObject.tweet.retweet_count,
      engagements: null,
      engagementRate: null,
      replies: null,
      profileClicks: null,
      urlClicks: null,
      detailExpands: null,
    },
    media: {
      urls: urls,
      photos: photos,
      videos: videos,
      gifs: gifs,
    },
  };

  return post;
};

const getMentionedHandles = (postObject: Tweet): string[] => {
  const mentionedHandles: string[] = [];
  const entities = postObject.tweet.entities;
  if (entities && entities.user_mentions) {
    for (const user of entities.user_mentions) {
      if (user.screen_name) {
        mentionedHandles.push(user.screen_name);
      }
    }
  }
  return mentionedHandles;
};

const getQuoteTweets = (
  postObject: Tweet
): {
  quoteTweetType: QuoteTweetType;
  quoteTweetUrl: string;
} => {
  let quoteTweetType = "none" as QuoteTweetType;
  let quoteTweetUrl = "";

  const entities = postObject.tweet.entities;
  if (entities && entities.urls) {
    for (const url of entities.urls) {
      const expandedUrl = url.expanded_url;
      if (expandedUrl.includes("MPeytonCox/status")) {
        quoteTweetType = "self" as QuoteTweetType;
        quoteTweetUrl = expandedUrl;
      } else if (expandedUrl.includes("/status")) {
        quoteTweetType = "other" as QuoteTweetType;
        quoteTweetUrl = expandedUrl;
      }
    }
  }

  return { quoteTweetType, quoteTweetUrl };
};

const getUrls = (postObject: Tweet): string[] => {
  const urls: string[] = [];

  const entities = postObject.tweet.entities;
  if (entities && entities.urls) {
    for (const url of entities.urls) {
      if (url.expanded_url) {
        urls.push(url.expanded_url);
      }
    }
  }

  return urls;
};

const getPhotos = (postObject: Tweet): string[] => {
  const photos: string[] = [];

  const extendedEntities = postObject.tweet.extended_entities;
  if (extendedEntities && extendedEntities.media) {
    for (const media of extendedEntities.media) {
      if (media.type === "photo" && media.media_url_https) {
        photos.push(media.media_url_https);
      }
    }
  }

  return photos;
};

const getVideos = (postObject: Tweet): string[] => {
  const videos: string[] = [];
  const extendedEntities = postObject.tweet.extended_entities;

  if (extendedEntities && extendedEntities.media) {
    for (const media of extendedEntities.media) {
      if (
        media.type === "video" &&
        media.video_info &&
        media.video_info.variants
      ) {
        const variants = media.video_info.variants;

        // Filter out variants without a valid bitrate and convert bitrate to number
        const filteredVariants = variants
          .filter(
            (variant) =>
              typeof variant.bitrate === "string" &&
              !isNaN(parseInt(variant.bitrate))
          )
          .map((variant) => ({
            ...variant,
            bitrate: parseInt(variant.bitrate as string), // 'as string' type assertion ensures bitrate is a string
          }));

        // Sort variants by bitrate, highest to lowest
        const sortedVariants = filteredVariants.sort(
          (a, b) => b.bitrate - a.bitrate
        );

        if (sortedVariants.length > 0) {
          videos.push(sortedVariants[0].url);
        }
      }
    }
  }

  return videos;
};

const getGifs = (postObject: Tweet): string[] => {
  const gifs: string[] = [];
  const extendedEntities = postObject.tweet.extended_entities;

  if (extendedEntities && extendedEntities.media) {
    for (const media of extendedEntities.media) {
      if (
        media.type === "animated_gif" &&
        media.video_info &&
        media.video_info.variants
      ) {
        const variants = media.video_info.variants;

        // Loop through variants and extract GIF URLs
        for (const variant of variants) {
          if (variant.url) {
            gifs.push(variant.url);
          }
        }
      }
    }
  }

  return gifs;
};

const sortPostsByDate = (posts: Post[]): Post[] => {
  return posts.sort(
    (a, b) =>
      new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime()
  );
};

export default importAndProcessPosts;
