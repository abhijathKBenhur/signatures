const Signature = require("../db-config/Signature.schema");
const express = require("express");
const router = express.Router();
const upload = require("../db-config/multer");
const path = require("path");
var fs = require("fs");
const { cloudinary } = require("../db-config/cloudinary");

addSignature = (req, res) => {
  console.log("Adding an idea  to mongoDB", req.body);
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Hollow idea",
    });
  }
  const newIdea = new Signature(body);

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

updateIdeaID = (req, res) => {
  console.log("updating ID to an idea", req.body);
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Hollow idea",
    });
  }

  if (!body.PDFHash) {
    return res.status(400).json({ success: false, error: err });
  }
  let findCriteria = {
    PDFHash: body.PDFHash,
    transactionID: body.transactionID,
  };

  Signature.findOneAndUpdate(findCriteria, { ideaID: body.ideaID })
    .then((idea, err) => {
      console.log("Updating idea", idea);
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

getSignatureByHash = async (req, res) => {
  console.log("Getting Signature :: ", req.params.PDFHash);

  await Signature.findOne({ PDFHash: req.params.PDFHash }, (err, signature) => {
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
  let userName = req.body.userName;
  let limit = req.body.limit;
  payLoad = {};

  if (userName) {
    payLoad.owner = userName;
  }
  if (!limit) {
    await Signature.find(payLoad, (err, signatures) => {
      if (err) {
        return res.status(404).json({ success: false, error: "here" });
      }
      if (!signatures.length) {
        return res
          .status(404)
          .json({ success: false, error: `signature not found` });
      }
      return res.status(200).json({ success: true, data: signatures });
    }).catch((err) => {
      return res.status(404).json({ success: false, error: err });
    });
  } else {
    console.log("Getting signatures for all");
    Signature.find(payLoad)
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
  let buyer = req.body.buyer;
  let seller = req.body.account;
  let PDFHash = req.body.PDFHash;

  const findCriteria = { PDFHash: PDFHash };
  const saleCriteria = { owner: buyer };
  const ideaToUpdate = new Signature(req.body);

  Signature.findOneAndUpdate(findCriteria, saleCriteria)
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

  await Signature.findOneAndUpdate(
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



getImagePathFromCloudinary = (req,res) => {
    console.log("file details: ", req.file);
    // cloudinary.v2.uploader.upload(file, options, callback);
    cloudinary.uploader.upload(req.file.path,{
      folder:"ThoughBlocks",
      public_id:""
    }).then(result =>{
      console.log("Image uplaoded to : ", result);
      const post_details = {
        path: result.url,
        type:"thumbnail"
      };
  
      res.status(200).json({ post_details });
    }).catch(err => {
      return res.status(400).json({ success: false, error: err });
    })
};



router.post("/addSignature", addSignature);
router.get("/signature/:PDFHash/", getSignatureByHash);
router.post("/getSignatures", getSignatures);
router.post("/buySignature", buySignature);
router.post("/updatePrice", updatePrice);
router.post("/updateIdeaID", updateIdeaID);
router.post("/getCloundinaryPath",upload.single("thumbnail"), getImagePathFromCloudinary);

module.exports = router;
