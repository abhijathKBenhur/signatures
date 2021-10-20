const chainID = "";
const COOKIE_TOKEN_PHRASE = "ideaTribeAuthToken";
const SIGNATURE_MESSAGE = "Hello from ideaTribe. Click sign to prove that you have access to this wallet and we'll log you in. To stop hackers from using your wallet, here is a unique code that they cannot guess. ";

const CURRENCY = {
  name: "Matic",
  symbol: "MATIC"
}

const FILTERS_TYPES ={
  SEARCH: "SEARCH",
  CATEGORY_FILTER:"CATEGORY_FILTER"
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
  LICENSE:  "LICENSE",
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
  BUY_IDEA: "UPDATE_PRICE",
  CREATE_CLAN: "CREATE_CLAN",
  INCENTIVICED: "INCENTIVICED",
  DEPOSIT: "DEPOSIT",
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
  { value: "PRODUCTIONIZE", label: "PRODUCTIONIZE - Find people to take your idea to a complete shape." },
  { value: "FINANCE", label: "FINANCE - Find people to provide financial assistance to realize your idea." },
  { value: "PROMOTE", label: "PROMOTE - Find people to spread the word about your idea to the world." },
 
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
  FILTERS_TYPES,
  COOKIE_TOKEN_PHRASE,
  SIGNATURE_MESSAGE
};

export default CONSTANTS;
