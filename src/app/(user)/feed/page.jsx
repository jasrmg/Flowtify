import { FeedContent } from "./FeedContent";

// This is a server component, so we can use metadata
export const metadata = {
  title: "Flowtify | Feed",
  description: "Feed page for flowtify users",
};

export const Feed = () => {
  return <FeedContent />;
};

export default Feed;
