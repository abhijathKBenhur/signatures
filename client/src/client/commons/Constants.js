const chainID = "";
const COOKIE_TOKEN_PHRASE = "ideaTribeAuthToken";
const SIGNATURE_MESSAGE = "Welcome to IdeaTribe! Click 'Sign' to sign in. No password needed! This request will not trigger a blockchain transaction or cost any gas fees. Your authentication status will be reset after 24 hours. I accept the IdeaTribe Terms of Service: https://ideatribe.io. Nonce: ";

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
  { value: "ENHANCE", label: "ENHANCE: Find people to improve your Idea" },
  { value: "PRODUCTIONIZE", label: "PRODUCTIONIZE: Find people to implement your Idea" },
  { value: "FINANCE", label: "FINANCE: Find people to fund your Idea" },
  { value: "PROMOTE", label: "PROMOTE: Find people to market your Idea" },
 
];

const SCANNER_TESTNET_URL = "https://mumbai.polygonscan.com"
const SCANNER_MAINNET_URL = "https://polygonscan.com"

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
  SIGNATURE_MESSAGE,
  SCANNER_MAINNET_URL,
  SCANNER_TESTNET_URL
};

export default CONSTANTS;
