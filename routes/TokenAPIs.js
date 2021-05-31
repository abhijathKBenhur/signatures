const Signature = require("../db-config/Signature.schema");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
var fs = require("fs");

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
  let findCriteria = {PDFHash: body.PDFHash, transactionID : body.transactionID}

  Signature.findOneAndUpdate(
    findCriteria,
    {ideaID:body.ideaID}
  )
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

  await Signature.findOne(
    { PDFHash: req.params.PDFHash },
    (err, signature) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!signature) {
        return res.status(404).json({ success: true, data: [] });
      }
      return res.status(200).json({ success: true, data: signature });
    }
  ).catch((err) => {
    return res.status(400).json({ success: false, data: err });
  });
};

getSignatures = async (req, res) => {
  let userName = req.body.userName
  let limit = req.body.limit 
  payLoad = {};
  
  if(userName){
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
  console.log(__dirname)
  let dest = "./client/public/uploads";
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, 0744);
}
  const upload = multer({
    req,
    res,
    storage: multer.diskStorage({
      destination: "./client/public/uploads/",
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
        let __dirname = "./client/public/uploads";
        console.log(req.body.type)
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
            type:req.body.type,
            path:
              "uploads/" +
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

  const findCriteria = {  PDFHash: PDFHash };
  const saleCriteria = { owner: buyer};
  const ideaToUpdate = new Signature(req.body);

  Signature.findOneAndUpdate(
    findCriteria,
    saleCriteria
  )
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
    (  err,token) => {
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


router.post("/getFilePath", getFilePath);
router.post("/addSignature", addSignature);
router.get("/signature/:PDFHash/", getSignatureByHash);
router.post("/getSignatures", getSignatures);
router.post("/buySignature", buySignature);
router.post("/updatePrice", updatePrice);
router.post("/updateIdeaID", updateIdeaID);


module.exports = router;
