const Token = require('../db-config/token.schema')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path');


addToken = (req, res) => {
    console.log("adding token",req.body)
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a token',
        })
    }
    const newToken = new Token(body)

    if (!newToken) {
        return res.status(400).json({ success: false, error: err })
    }

    newToken
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                tokenId: newToken.tokenId,
                message: 'new token created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'new token not created!',
            })
        })
}

function clearEmptyTokens(sellerCriteria){
    Token.findOneAndUpdate(sellerCriteria,{$inc : {amount : - 1}},{new:true}).then((user, err) => {
        console.log("reduc to store");
        if (err) {
            console.log("Error reduc to store");
            return res.status(400).json({ success: false, error: err })
        }
        if (!user) {
            return res
                .status(404)
                .json({ success: true, data: [] })
        }
        Token.deleteMany({ amount: { $eq: 0 } }).then(function(token){
            console.log("Data deleted");
            // return res.status(200).json({ success: true, data: token }) // Success
        }).catch(function(error){
            console.log(error); // Failure
        });
    }).catch(err => {
        console.log("Error reduced store");
        // return res.status(200).json({ success: false, data: err })
    })
}


buyToken = async (req, res) => {
    console.log("Buying token", req.body);
    let buyer = req.body.buyer
    let seller = req.body.account
    let buyTokenId = req.body.tokenId

    const findCriteria = { owner: buyer,tokenId: buyTokenId};
    const sellerCriteria = { owner: seller,tokenId: buyTokenId};
    Token.find(findCriteria, function (err, docs) {
        if (docs.length){
            console.log("doc found");

            Token.findOneAndUpdate(findCriteria,{$inc : {amount : + 1}},{new:true}).then((token, err) => {
                console.log("Adding to store",token);
                clearEmptyTokens(sellerCriteria)
                if (err) {
                    console.log("Error Adding to store");
                    return res.status(400).json({ success: false, error: err })
                }
                if (!token) {
                    console.log(" failed update");

                    return res
                        .status(404)
                        .json({ success: true, data: [] })
                }
                console.log(" Addinged to store");
                return res
                        .status(200)
                        .json({ success: true, data: token })
            }).catch(err => {
                console.log("Error Addinged store");
                return res.status(200).json({ success: false, data: err })
            })
        }else{
            console.log("new doc add");
            req.body.owner = buyer;
            req.body.amount = 1;
            delete req.body._id
            const newToken = new Token(req.body)
            newToken.save().then(() => {
                clearEmptyTokens(sellerCriteria)
                return res.status(200).json({
                    success: true,
                    tokenId: newToken.tokenId,
                    message: 'new token created!',
                })

            })
            .catch(error => {
                console.log(error)
                return res.status(400).json({
                    error,
                    message: 'new token not created!',
                })
            })
        }
       
    });
}




updatePrice = async (req, res) => {
    console.log("updateing token price" , req.body.tokenId ," " , req.body.setter , " price " , req.body.price )

    await Token.updateOne({ tokenId: req.body.tokenId, owner : req.body.setter} ,{ price : req.body.price }, {new:true}, (err, token) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!token) {
            return res
                .status(404)
                .json({ success: true, data: [] })
        }
        return res.status(200).json({ success: true, data: token })
    }).catch(err => {
        return res.status(200).json({ success: false, data: err })
    })
}

getTokenById = async (req, res) => {
    console.log("Getting token" , req.params.tokenId, req.params.owner)
    console.log(Token)

    await Token.findOne({ tokenId: req.params.tokenId, owner:req.params.owner }, (err, token) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!token) {
            return res
                .status(404)
                .json({ success: true, data: [] })
        }
        return res.status(200).json({ success: true, data: token })
    }).catch(err => {
        return res.status(200).json({ success: false, data: err })
    })
}

getTokens = async (req, res) => {
    console.log("Getting tokens for ", req.body.userName)
    payLoad = {};
    if(req.body.userName){
        payLoad.owner = req.body.userName
        await Token.find(payLoad, (err, token) => {
        if (err) {
            return res.status(400).json({ success: false, error: "here" })
        }
        if (!token.length) {
            return res
                .status(404)
                .json({ success: false, error: `token not found` })
        }
        return res.status(200).json({ success: true, data: token })
        }).catch(err => {
            return res.status(200).json({ success: false, error: "err" })
        })
    }else{
        Token.aggregate([
            {
                $group:{
                    "_id": { 
                        "tokenId": "$tokenId", 
                    },
                    "price": {"$min":"$price"},
                    "account": {"$first":"$account"},
                    "owner": {"$first":"$owner"},
                    "name": {"$first":"$name"},
                    "category": {"$first":"$category"},
                    "description": {"$first":"$description"},
                    "amount": {"$first":"$amount"},
                    "type": {"$first":"$type"},
                    "uri": {"$first":"$uri"},
                    "tokenId": {"$first":"$tokenId"},
                   
                },
            }
        ]).then(token => {
            return res.status(200).json({ success: true, data: token })
        }).catch(err => {
            console.log(err)
            return res.status(200).json({ success: false, error: "err" })
        })
    }
    

    
}

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Init Upload
  const upload = multer({
    storage: storage,
    limits:{fileSize: 5000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('fileData');
  
  // Check File Type
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }

getFilePath = async (req, res) => {
    console.log("getting file path")
    upload(req, res, (err) => {
        console.log(err)
      if(err){
        return res.status(200).json({ success: false, error: "err" })
      } else {
        if(req.file == undefined){
            return res.status(200).json({ success: false, error: "no file selected" })
        } else {
            return res.status(200).json({ success: true, data: "/uploads/"+req.file.filename })
        }
      }
    });
}
  


router.post('/getFilePath', getFilePath)
router.post('/token', addToken)
router.get('/token/:tokenId/:owner', getTokenById)
router.post('/tokens', getTokens)
router.post('/buyToken', buyToken)
router.post('/updatePrice', updatePrice)

module.exports = router
