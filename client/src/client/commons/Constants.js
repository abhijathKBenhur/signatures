const chainID = "";
const CURRENCY = {
  name: "Matic",
  symbol: "MATIC"
}


const CATEGORIES = [
    { value: "Creative_art", label: "Creative art" },
    { value: "Business_idea", label: "Business idea" },
    { value: "Technical_inventions", label: "Technical inventions" },
];

const PURPOSES = {
  AUCTION: "AUCTION",
  SELL: "SELL",
  COLLAB: "COLLABORATE",
  KEEP: "KEEP",
  LICENCE:  "LICENCE",
};

const ENTITIES = {
  IDEA: "IDEA",
  PROFILE: "PROFILE",
  CLAN: "CLAN",
  PUBLIC: "PUBLIC",
};

const ACTIONS = {
  UPVOTE: "UPVOTE",
  FOLLOW: "FOLLOW",
  PERSONAL_MESSAGE: "PERSONAL_MESSAGE",
  UNFOLLOWED: "UNFOLLOWED",
  COMMENT: "COMMENT",
  POST_IDEA: "POST_IDEA",
  BUY_IDEA: "BUY_IDEA",
  CREATE_CLAN: "CREATE_CLAN",
  INCENTIVICED: "INCENTIVICED",
};

const ACTION_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  DECLINED: "DECLINED",
  FAILED: "FAILED",
  INIT: "INIT",
};

const STORAGE_TYPE = [
  { value: "PUBLIC", label: "PUBLIC - The file will be stored in IPFS. Anyone can view it." },
  {
    value: "SECURE",
    label: "SECURE - We will store the file in our secure servers (upto 5MB).",
  },
  {
    value: "SELF",
    label:
      "SELF - The file wont be stored with us. Losing or modifying this file will make your idea unverifiable.",
  },
];

const COLLAB_TYPE = [
  { value: "ENHANCE", label: "ENHANCE - Find people to enhance and grow your idea." },
  { value: "PRODUCTIONISE", label: "PRODUCTIONISE - Find people to take your idea to a complete shape." },
  { value: "FINANCE", label: "FINANCE - Find people to provide financial assistance to realtize your idea." },
  { value: "PROMOTE", label: "PROMOTE - Find people to spread the work about your idea to the world." },
 
];

const CONSTANTS = {
  CATEGORIES,
  PURPOSES,
  STORAGE_TYPE,
  ACTIONS,
  ACTION_STATUS,
  COLLAB_TYPE,
  ACTIONS,
  ENTITIES,
  CURRENCY,
};

export default CONSTANTS;
