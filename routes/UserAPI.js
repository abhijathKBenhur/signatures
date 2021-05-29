const User = require('../db-config/user.schema')
const express = require('express')
const router = express.Router()


signup = (req, res) => {
    console.log("signing up",req.body)
    const body = req.body
    body.balance = 1000;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a user',
        })
    }
    const newUser = new User(body)

    if (!newUser) {
        return res.status(400).json({ success: false, error: err })
    }

    newUser
        .save()
        .then((user,b) => {
            return res.status(201).json({
                success: true,
                data: user,
                message: 'New user created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'New user not created!',
            })
        })
}

buyUserToken =  (req, res) => {
    console.log("Buying user token", req.body.seller);
    let buyer = req.body.buyer
    let value = req.body.price
    let referrer = req.body.referrer

    let creditAmount = referrer ? value * 0.75 : value

    User.findOneAndUpdate({ userName: buyer},{$inc : {balance : - value}}).then((user, err) => {
        console.log("Debitting token", value);
        if (err) {
            console.log("Error Debitting token", err);
            return res.status(400).json({ success: false, error: err })
        }
        if (!user) {
            return res
                .status(404)
                .json({ success: true, data: [] })
        }
        console.log(" Debitted token", value);
        User.findOneAndUpdate({ userName: req.body.seller},{$inc : {balance : creditAmount}}).then((user, err) => {
            console.log("Crediting token for",req.body.seller, creditAmount);
            if (err) {
                console.log("Error Crediting token", value);
                return res.status(400).json({ success: false, error: err })
            }
            if (!user) {
                return res
                    .status(404)
                    .json({ success: true, data: [] })
            }
            console.log(" Credited token", value);
            if(referrer){
                User.findOneAndUpdate({ userName: referrer},{$inc : {balance : value * 0.25}}).then((user, err) => {
                    console.log("Crediting incentive",referrer, value * 0.25);
                    if (err) {
                        console.log("Error Crediting incentive", value);
                        return res.status(400).json({ success: false, error: err })
                    }
                    if (!user) {
                        return res
                            .status(404)
                            .json({ success: true, data: [] })
                    }
                    console.log(" Credited incentive", value);
                    return res.status(200).json({ success: true, data: user })
                }).catch(err => {
                    return res.status(200).json({ success: false, data: err })
                })
            }else{
                return res.status(200).json({ success: true, data: user }) 
            }
        }).catch(err => {
            return res.status(200).json({ success: false, data: err })
        })
    }).catch(err => {
        console.log("Error Debitting token", value);
        return res.status(200).json({ success: false, data: err })
    })


    
     
  

    
}

getUserInfo = async (req, res) => {
    await User.findOne({ userName: req.body.userName }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!user) {
            return res
                .status(404)
                .json({ success: true, data: [] })
        }
        console.log("Found user with " , req.body.userName, req.body.password)
        return res.status(200).json({ success: true, data: user })
    }).catch(err => {
        return res.status(200).json({ success: false, data: err })
    })
}


login = async (req, res) => {
    console.log("checking login",req.body)
    await User.findOne({ userName: req.body.userName, password: req.body.password }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!user) {
            return res
                .status(404)
                .json({ success: true, data: [] })
        }
        console.log("Found user with " , req.body.userName, req.body.password)
        return res.status(200).json({ success: true, data: user })
    }).catch(err => {
        return res.status(200).json({ success: false, data: err })
    })
}

router.post('/signup', signup)
router.post('/login', login)
router.post('/buyUserToken', buyUserToken)
router.post('/getUserInfo', getUserInfo)



module.exports = router
