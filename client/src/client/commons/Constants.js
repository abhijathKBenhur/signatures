const CATEGORIES = [
    { value: "Creative_art", label: "Creative art" },
    { value: "Business_idea", label: "Business idea" },
    { value: "Technical_inventions", label: "Technical inventions" },
    { value: "Scientific_research", label: "Scientific research" },
];

const PURPOSES = {
  AUCTION: "AUCTION",
  SELL: "SELL",
  COLLAB: "COLLABORATE",
  KEEP: "KEEP",
  LICENCE:  "LICENCE",
};
const NOTIFICATION_ACTIONS = {
  AUCTION_REQUEST: "Auction Request",
  BUY_INIT: "Initiate Buy",
  COLLAB_INTEREST: "Interest to collaborate",
  PERSONAL_MESSAGE: "PERSONAL_MESSAGE",
};
const ACTION_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  DECLINED: "DECLINED",
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
  NOTIFICATION_ACTIONS,
  ACTION_STATUS,
  COLLAB_TYPE
};

export default CONSTANTS;
