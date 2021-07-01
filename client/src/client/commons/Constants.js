const CATEGORIES = [
    { value: "Apparel", label: "Apparel" },
    { value: "App", label: "App" },
    { value: "Art", label: "Art" },
    { value: "Book", label: "Book" },
    { value: "Business", label: "Business " },
    { value: "Chemical", label: "Chemical" },
    { value: "Craft", label: "Craft" },
    { value: "Design", label: "Design" },
    { value: "Discovery", label: "Discovery" },
    { value: "DIY", label: "DIY" },
    { value: "Engineering", label: "Engineering" },
    { value: "Equipment", label: "Equipment" },
    { value: "Fashion", label: "Fashion" },
    { value: "Fitness", label: "Fitness" },
    { value: "Home", label: "Home" },
    { value: "Invention", label: "Invention" },
    { value: "Jewelry", label: "Jewelry" },
    { value: "Logo", label: "Logo" },
    { value: "Lyrics", label: "Lyrics" },
    { value: "Material", label: "Material" },
    { value: "Meme", label: "Meme" },
    { value: "Method", label: "Method" },
    { value: "Music", label: "Music" },
    { value: "Painting", label: "Painting" },
    { value: "Photo", label: "Photo" },
    { value: "Phrase", label: "Phrase" },
    { value: "Poem", label: "Poem" },
    { value: "Process", label: "Process" },
    { value: "Product", label: "Product " },
    { value: "Recipe", label: "Recipe" },
    { value: "Science", label: "Science" },
    { value: "Screenplay", label: "Screenplay" },
    { value: "Script", label: "Script" },
    { value: "Society", label: "Society" },
    { value: "Song", label: "Song" },
    { value: "Sound", label: "Sound" },
    { value: "Story", label: "Story" },
    { value: "System", label: "System" },
    { value: "Technology", label: "Technology" },
    { value: "Theme", label: "Theme" },
    { value: "Thesis", label: "Thesis" },
    { value: "Thought", label: "Thought" },
    { value: "Tune", label: "Tune" },
    { value: "Video", label: "Video" },
    { value: "Word", label: "Word" }
];

const PURPOSES = {
  AUCTION: "AUCTION",
  SELL: "SELL",
  COLLAB: "COLLABORATE",
  KEEP: "Decide later",
};
const ACTIONS = {
  AUCTION_REQUEST: "Auction Request",
  BUY_INIT: "Initiate Buy",
  COLLAB_INTEREST: "Interest to collaborate",
};
const ACTION_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  DECLINED: "DECLINED",
};

const STORAGE_TYPE = [
  { value: "PUBLIC", label: "PUBLIC - The files are stored in IPFS" },
  {
    value: "PRIVATE",
    label: "PRIVATE - We securely store the file in private stores",
  },
  {
    value: "SELF",
    label:
      "SELF - We wont be storing the file. Please save the has for reference.",
  },
];

const CONSTANTS = {
  CATEGORIES,
  PURPOSES,
  STORAGE_TYPE,
  ACTIONS,
  ACTION_STATUS,
};

export default CONSTANTS;
