export interface Tweet {
  tweet: {
    edit_info?: {
      initial?: {
        editTweetIds: string[];
        editableUntil: string;
        editsRemaining: string;
        isEditEligible: boolean;
      };
    };
    retweeted: boolean;
    source: string;
    entities: {
      hashtags: any[];
      symbols: any[];
      user_mentions: {
        name: string;
        screen_name: string;
        indices: string[];
        id_str: string;
        id: string;
      }[];
      urls: any[];
    };
    extended_entities?: {
      media?: {
        type: string;
        media_url_https: string;
        video_info?: {
          variants: {
            bitrate?: string;
            content_type: string;
            url: string;
          }[];
        };
      }[];
    };
    display_text_range: string[];
    favorite_count: string;
    id_str: string;
    truncated: boolean;
    retweet_count: string;
    id: string;
    created_at: string;
    favorited: boolean;
    full_text: string;
    lang: string;
    in_reply_to_status_id_str?: string;
    in_reply_to_user_id?: string;
    in_reply_to_status_id?: string;
    in_reply_to_screen_name?: string;
    in_reply_to_user_id_str?: string;
  };
}
