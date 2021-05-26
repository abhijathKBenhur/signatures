const Signature = require("../db-config/Signature.schema");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
var fs = require("fs");

addSignature = (req, res) => {
  console.log("Adding an idea", req.body);
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

buyToken = async (req, res) => {
  console.log("Buying token", req.body);
  let buyer = req.body.buyer;
  let seller = req.body.account;
  let buyTokenId = req.body.tokenId;

  const findCriteria = { owner: buyer, tokenId: buyTokenId };
  const sellerCriteria = { owner: seller, tokenId: buyTokenId };
  Token.find(findCriteria, function(err, docs) {
    if (docs.length) {
      console.log("doc found");

      Token.findOneAndUpdate(
        findCriteria,
        { $inc: { amount: +1 } },
        { new: true }
      )
        .then((token, err) => {
          console.log("Adding to store", token);
          clearEmptyTokens(sellerCriteria);
          if (err) {
            console.log("Error Adding to store");
            return res.status(400).json({ success: false, error: err });
          }
          if (!token) {
            console.log(" failed update");

            return res.status(404).json({ success: true, data: [] });
          }
          console.log(" Addinged to store");
          return res.status(200).json({ success: true, data: token });
        })
        .catch((err) => {
          console.log("Error Addinged store");
          return res.status(200).json({ success: false, data: err });
        });
    } else {
      console.log("new doc add");
      req.body.owner = buyer;
      req.body.amount = 1;
      delete req.body._id;
      const newToken = new Token(req.body);
      newToken
        .save()
        .then(() => {
          clearEmptyTokens(sellerCriteria);
          return res.status(200).json({
            success: true,
            tokenId: newToken.tokenId,
            message: "new token created!",
          });
        })
        .catch((error) => {
          console.log(error);
          return res.status(400).json({
            error,
            message: "new token not created!",
          });
        });
    }
  });
};

updatePrice = async (req, res) => {
  console.log(
    "updateing token price",
    req.body.tokenId,
    " ",
    req.body.setter,
    " price ",
    req.body.price
  );

  await Token.updateOne(
    { tokenId: req.body.tokenId, owner: req.body.setter },
    { price: req.body.price },
    { new: true },
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

getSignatureByHash = async (req, res) => {
  console.log("Getting token", req.params.tokenId, req.params.owner);
  console.log(Token);

  await Token.findOne(
    { tokenId: req.params.tokenId, owner: req.params.owner },
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
    return res.status(404).json({ success: false, data: err });
  });
};

getSignatures = async (req, res) => {
  let userName = req.body.userName
  
  payLoad = {};
  
  if (userName) {
    payLoad.owner = userName;
    console.log("Getting signatures for ", userName);
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
    let limit = req.body.limit 
    Signature.find(payLoad).limit(limit)
      .then((signatures) => {
        return res.status(200).json({ success: true, data: signatures });
      })
      .catch((err) => {
        console.log(err);
        return res.status(404).json({ success: false, error: err });
      });
  }
};

getFilePath = async (req, res) => {
  const upload = multer({
    req,
    res,
    storage: multer.diskStorage({
      destination: "./public/uploads/",
      filename: function(req, file, cb) {
        cb(null, "temp" + path.extname(file.originalname));
      },
    }),
    limits: { fileSize: 5000000 },
    fileFilter: function(req, file, cb) {
      checkFileType(file, cb);
    },
  }).single("fileData");

  // Check File Type
  function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|pdf/;
    // Check ext
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  }

  upload(req, res, (err) => {
    console.log(err);
    if (err) {
      return res.status(400).json({ success: false, error: err });
    } else {
      if (req.file == undefined) {
        return res.status(400).json({ success: false, error: "File missing" });
      } else {
        let __dirname = "./public/uploads";
        let hashCode = req.body.hash;
        
        var targetDir = __dirname + '/' + hashCode;
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, 0744);
        }

        const files = fs.readdirSync(__dirname);
        for (const file of files) {
          if(file.endsWith(".jpeg") || file.endsWith(".jpg") || file.endsWith(".png") || file.endsWith(".pdf")){
              fs.rename(
                __dirname + '/' + file,
                targetDir + '/' + hashCode + "." + file.split(".")[1] ,
                err => {
                  console.log(err)
                }
              )
          }
        }
        return res
          .status(200)
          .json({
            success: true,
            path:
              "/uploads/" +
              hashCode +
              "/" +
              hashCode +
              "." +
              req.file.filename.split(".")[1],
          });
      }
    }
  });
};
router.post("/getFilePath", getFilePath);
router.post("/addSignature", addSignature);
router.get("/token/:hashId/", getSignatureByHash);
router.post("/getSignatures", getSignatures);
router.post("/buyToken", buyToken);
router.post("/updatePrice", updatePrice);

module.exports = router;
