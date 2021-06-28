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

  const  PRIORITIES = {
    HIGH: "1",
    LOW: "0",
}

const REGISTRATION_LEVEL = {
    BASE_1: "BASE_1",
    BASE_2: "BASE_1",
    BASE_3: "BASE_3",
    BASE_4: "BASE_4"
}

const STORAGE_TYPE = {
    PUBLIC: "PUBLIC",
    PRIVATE: "PRIVATE",
    SELF: "SELF",
}

const PURPOSES = {
    AUCTION: "AUCTION",
    SELL: "SELL",
    COLLAB: "COLLABORATE",
    KEEP: "Decide later",
}
const FileStorageDropdownOptions = [
    { value: 'PUBLIC', label: 'PUBLIC - The files are stored in IPFS' },
    { value: 'PRIVATE', label: 'PRIVATE - We securely store the file in private stores' },
    { value: 'SELF', label: 'SELF - We wont be storing the file. Please save the has for reference.' },
  ];

const CONSTANTS = {
    CATEGORIES,
    PRIORITIES,
    REGISTRATION_LEVEL,
    STORAGE_TYPE,
    PURPOSES,
    FileStorageDropdownOptions
}


export default CONSTANTS