const IdeaSchema = require("../db-config/Signature.schema");
const UserSchema = require("../db-config/user.schema");
const UserAPI = require("../routes/UserAPI");
const express = require("express");
const router = express.Router();
const upload = require("../db-config/multer");
const path = require("path");
var fs = require("fs");
const { cloudinary } = require("../db-config/cloudinary");

addSignature = async (req, res) => {
  const creatorId = await UserSchema.findOne({ metamaskId: req.body.creator });
  const ownerId = await UserSchema.findOne({ metamaskId: req.body.owner });

  const newTile = {
    ...req.body,
    creator: creatorId,
    owner: ownerId,
  };
  console.log("newTile" + JSON.stringify(newTile));

  if (!newTile) {
    return res.status(400).json({
      success: false,
      error: "Hollow idea",
    });
  }
  const newIdea = new IdeaSchema(newTile);

  if (!newIdea) {
    return res.status(400).json({ success: false, error: err });
  }

  newIdea
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        tokenId: newIdea.tokenId,
        message: "New idea posted!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "New idea not posted!",
      });
    });
};

getSignatureByHash = async (req, res) => {
  console.log("Getting IdeaSchema :: ", req.params.PDFHash);
  await IdeaSchema.findOne({ PDFHash: req.params.PDFHash })
    .populate("creator")
    .populate("owner")
    .exec((err, signature) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!signature) {
        return res.status(404).json({ success: true, data: [] });
      }
      return res.status(200).json({ success: true, data: signature });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, data: err });
    });
};

getSignatures = async (req, res) => {
  let userName = req.body.userName;
  let limit = req.body.limit;
  let offset = req.body.offset;
  let tags = req.body.tags;
  let searchString = req.body.searchString;
  let searchOrArray = [];
  let payLoad = {
    status: "COMPLETED"
  };

  //search string block start

  if (tags) {
    for (let i = 0; i < tags.length; i++) {
      let tag = tags[0];
      searchOrArray.push({ category: { $regex: new RegExp(tag, "i") } });
    }
    console.log(searchOrArray);
  }
  if (searchString) {
    searchOrArray.push({ title: { $regex: new RegExp(searchString, "i") } });
    searchOrArray.push({ description: { $regex: new RegExp(searchString, "i") } });
  }
  if (searchOrArray.length > 0) {

    payLoad.$or = searchOrArray;
  }

  //search string block end

  if (userName) {
    payLoad.owner = {}
    const ownerUser = await UserSchema.findOne({ userName: userName });
    payLoad.owner = ownerUser._id;
  }
  if (!limit) {
      let tiles = await IdeaSchema.find(payLoad)
        .sort({ createdAt: "desc" })
        .populate("owner")
        .populate("creator")
        .exec();
      return res.status(200).json({ success: true, data: tiles });
  } else {
    console.log("Getting signatures for all");
    IdeaSchema.find(payLoad)
      .limit(limit)
      .then((signatures) => {
        return res.status(200).json({ success: true, data: signatures });
      })
      .catch((err) => {
        console.log(err);
        return res.status(404).json({ success: false, error: err });
      });
  }
};

buySignature = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      success: false,
      error: "Hollow idea",
    });
  }
  const ownerId = await UserSchema.findOne({ metamaskId: buyer })._id;
  let buyer = req.body.buyer;
  let seller = req.body.account;
  let PDFHash = req.body.PDFHash;

  const findCriteria = { PDFHash: PDFHash, owner: seller };
  const saleCriteria = {
    owner: ownerId,
    price: 0,
    purpose: {type:"KEEP"},
  };

  IdeaSchema.findOneAndUpdate(findCriteria, saleCriteria)
    .then((idea, err) => {
      console.log("Updating idea to mongoDB", idea);
      if (err) {
        console.log("Error updating idea");
        return res.status(400).json({ success: false, error: err });
      }
      if (!idea) {
        console.log(" failed Update");
        return res.status(404).json({ success: true, data: [] });
      }
      console.log(" Updated to store");
      return res.status(200).json({ success: true, data: idea });
    })
    .catch((err) => {
      console.log("Error updating store");
      return res.status(200).json({ success: false, data: err });
    });
};

updateIdeaID = async (req, res) => {
  await IdeaSchema.findOneAndUpdate(
    { transactionID: req.body.transactionID },
    { ideaID: req.body.ideaID, status: "COMPLETED" },
    (err, token) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }

      if (!token) {
        return res.status(404).json({ success: true, data: [] });
      }
      return res.status(200).json({ success: true, data: token });
    }
  ).catch((err) => {
    return res.status(200).json({ success: false, data: err });
  });
};

removeIdeaEntry = async (req, res) => {
  console.log("deleting ," + req.body.transactionID)
  await IdeaSchema.deleteOne(
    { transactionID: req.body.transactionID },
    (err, token) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }

      if (!token) {
        return res.status(404).json({ success: true, data: [] });
      }
      return res.status(200).json({ success: true, data: token });
    }
  ).catch((err) => {
    return res.status(200).json({ success: false, data: err });
  });
};

updatePurpose = async (req, res) => {
  console.log(
    "updateing token price",
    req.body.ideaID,
    " ",
    req.body.setter,
    " price ",
    req.body.price
  );

  await IdeaSchema.findOneAndUpdate(
    { ideaID: req.body.ideaID },
    { purpose: req.body.purpose },
    (err, token) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }

      if (!token) {
        return res.status(404).json({ success: true, data: [] });
      }
      return res.status(200).json({ success: true, data: token });
    }
  ).catch((err) => {
    return res.status(200).json({ success: false, data: err });
  });
};

getImagePathFromCloudinary = (req, res) => {
  try{
  console.log("file details: ", req.file);
  let folderPath = "ideaTribe" ;
  let fileName = req.hash
  if(req.thumbnail){
    fileName = req.hash +"_thumbnail"
    folderPath = folderPath + "/ideas/" +req.hash+"/"
  }
  else if(req.userID){
    fileName = userID +"_userID"
    
    folderPath = folderPath + "/users/" +userID+"/"
  }
  else if(req.cover){
    fileName = userID +"_cover"
    folderPath = folderPath + "/users/" +userID+"/"
  }
  else if(req.preview){
    req.hash = "_preview"
    folderPath = folderPath + "/ideas/" +req.hash+"/"
  }
  else if(req.original){
    fileName = req.hash +"_orig"
    folderPath = folderPath + "/ideas/" +req.hash+"/"
  }
  console.log("Image uploading to folderPath: ", folderPath);
  cloudinary.uploader
    .upload(req.file.path,(result) => {
      console.log("Image uplaoded to: ", result);
      if(result.error){
        return res.status(400).json({ success: false, error: result.error.message });
      }else{
        res.status(200).json({
          path: result.url,
          type: "thumbnail",
        });
      }
    },{ 
       public_id: fileName ,
       folder: folderPath
    })
  }
  catch(err){
    return res.status(400).json({ success: false, error: err });
  };
};

router.post("/addSignature", addSignature);
router.get("/signature/:PDFHash/", getSignatureByHash);
router.post("/getSignatures", getSignatures);
router.post("/buySignature", buySignature);
router.post("/updatePurpose", updatePurpose);
router.post("/updateIdeaID", updateIdeaID);
router.post("/removeIdeaEntry", removeIdeaEntry);


router.post(
  "/getCloundinaryImagePath",
  upload.single("thumbnail"),
  getImagePathFromCloudinary
);


module.exports = router;
