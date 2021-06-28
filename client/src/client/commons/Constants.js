const CATEGORIES = [
    { value: 'Business', label: 'Business' },
    { value: 'Career', label: 'Career' },
    { value: 'Education', label: 'Education' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Food', label: 'Food' },
    { value: 'Gaming', label: 'Gaming' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Parenting', label: 'Parenting' }
  ]

const PURPOSES = {
    AUCTION: "AUCTION",
    SELL: "SELL",
    COLLAB: "COLLABORATE",
    KEEP: "Decide later",
}

const STORAGE_TYPE = [
    { value: 'PUBLIC', label: 'PUBLIC - The files are stored in IPFS' },
    { value: 'PRIVATE', label: 'PRIVATE - We securely store the file in private stores' },
    { value: 'SELF', label: 'SELF - We wont be storing the file. Please save the has for reference.' },
  ];

const CONSTANTS = {
    CATEGORIES,
    PURPOSES,
    STORAGE_TYPE
}


export default CONSTANTS