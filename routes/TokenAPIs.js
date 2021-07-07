const SignatureSchema = require("../db-config/Signature.schema");
const UserSchema = require("../db-config/user.schema");
const UserAPI = require("../routes/UserAPI")
const express = require("express");
const router = express.Router();
const upload = require("../db-config/multer");
const path = require("path");
var fs = require("fs");
const { cloudinary } = require("../db-config/cloudinary");

 addSignature = async(req, res) => {

  const creatorId = await UserSchema.findOne({metamaskId:req.body.creator})
  const ownerId = await UserSchema.findOne({metamaskId:req.body.owner})

  const newTile = {
    ...req.body,
    creator: creatorId,
    owner: ownerId
  }
  console.log("newTile" + JSON.stringify(newTile))


  if (!newTile) {
    return res.status(400).json({
      success: false,
      error: "Hollow idea",
    });
  }
  const newIdea = new SignatureSchema(newTile);

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
  console.log("Getting SignatureSchema :: ", req.params.PDFHash);
  await SignatureSchema.findOne({ PDFHash: req.params.PDFHash }).populate("creator").populate("owner").exec((err, signature) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!signature) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: signature });
  }).catch((err) => {
    return res.status(400).json({ success: false, data: err });
  });
};

getSignatures = async (req, res) => {
  let ownerAddress = req.body.ownerAddress;
  let limit = req.body.limit;
  let getOnlyNulls = req.body.getOnlyNulls;
  let tags = req.body.tags;
  let searchString = req.body.searchString;
  let searchOrArray = []
  let payLoad = {};

  if (getOnlyNulls) {
    payLoad.ideaID = null;
  }
  console.log(tags)

  //search string block start
  
  if(tags){
    for(let i=0; i < tags.length; i++) {
      let tag = tags[0];
      searchOrArray.push({'category':{ $regex: tag }})
    }
    console.log(searchOrArray)
  }
  if(searchString){
    searchOrArray.push({'title':{ $regex: new RegExp(searchString, "i") }})
    searchOrArray.push({'description':{ $regex: searchString }})
  }
  if(searchOrArray.length > 0){
    payLoad.$or = searchOrArray;
  }

  //search string block end
  
  if (ownerAddress) {
    payLoad.owner = ownerAddress;
  }
  if (!limit) {
    await SignatureSchema.find(payLoad).sort({'createdAt': 'desc'}).populate("owner").populate("creator").exec((err, signatures) => {
      if (err) {
        return res.status(404).json({ success: false, error: "here" });
      }
      return res.status(200).json({ success: true, data: signatures });
    })
    .catch((err) => {
      return res.status(404).json({ success: false, error: err });
    });
  } else {
    console.log("Getting signatures for all");
    SignatureSchema.find(payLoad)
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
  const ownerId = await UserSchema.findOne({metamaskId:buyer})._id
  let buyer = req.body.buyer;
  let seller = req.body.account;
  let PDFHash = req.body.PDFHash;
  let price = req.body.price;
  let transactionID = req.body.transactionID;

  const findCriteria = { PDFHash: PDFHash,owner: seller };
  const saleCriteria = {
    owner: ownerId,
    price: 0,
    transactionID: transactionID,
    purpose: "Decide later",
  };

  SignatureSchema.findOneAndUpdate(findCriteria, saleCriteria)
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

updatePrice = async (req, res) => {
  console.log(
    "updateing token price",
    req.body.ideaID,
    " ",
    req.body.setter,
    " price ",
    req.body.price
  );

  await SignatureSchema.findOneAndUpdate(
    { ideaID: req.body.ideaID, owner: req.body.setter },
    { price: req.body.price },
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
  console.log("file details: ", req.file);
  // cloudinary.v2.uploader.upload(file, options, callback);
  cloudinary.uploader
    .upload(req.file.path, {
      public_id: "ThoughBlocks/" + req.hash + "/" + req.hash,
    })
    .then((result) => {
      console.log("Image uplaoded to : ", result);
      res.status(200).json({
        path: result.url,
        type: "thumbnail",
      });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
};

getPDFPathFromCloudinary = (req, res) => {
  console.log("file details: ", req.file);
  cloudinary.uploader
    .upload(req.file.path, {
      public_id: "ThoughBlocks/" + req.hash + "/" + req.hash,
    })
    .then((result) => {
      console.log("PDF uplaoded to : ", result);
      res.status(200).json({
        path: result.url,
        type: "PDFFile",
      });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
};

router.post("/addSignature", addSignature);
router.get("/signature/:PDFHash/", getSignatureByHash);
router.post("/getSignatures", getSignatures);
router.post("/buySignature", buySignature);
router.post("/updatePrice", updatePrice);
router.post(
  "/getCloundinaryImagePath",
  upload.single("thumbnail"),
  getImagePathFromCloudinary
);
router.post(
  "/getCloundinaryPDFPath",
  upload.single("PDFFile"),
  getPDFPathFromCloudinary
);

module.exports = router;






