import axios from "axios";
import _ from "lodash";
import watermark from 'watermarkjs'
import Hash from "ipfs-only-hash";
import IPFS from "../config/ipfs";
import ENDPOINTS from '../commons/Endpoints';
import mp3Slice from "mp3-slice";
import {readFileSync} from 'fs';
import {convert} from 'imagemagick-convert';



const fileAPI = axios.create({
  baseURL: process.env.NODE_ENV == "production" ? ENDPOINTS.REMOTE_ENDPOINTS: ENDPOINTS.LOCAL_ENDPOINTS,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
const apikey = process.env.NODE_ENV == "production" ? "ASCHmMKFXTsmn9KFuk92Yz": "AY6hWHDg1Spia4wpNJdnRz"; // Change to your API KEY here
const fileStackClient = require('filestack-js').init(apikey);

export const getFileFromIPFS = (hash) => {
  return new Promise((resolve, reject) => {
      IPFS.files.get(hash, (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        }
        console.log("PDF fetched from IPFS",result)
        resolve({ content: result[0].content, type: "PDFFile" });
      });
  });
};


const getPathsFromIPFS = (form) => {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    try{
    reader.readAsArrayBuffer(form.fileUploaded);
    reader.onloadend = () => {
      IPFS.files.add(Buffer(reader.result), (error, result) => {
        if (error || _.isUndefined(result) ||  _.isUndefined(result[0])) {
          console.error(error);
          reject(error);
        }else{
          console.log("PDF uploaded to IPFS ::" + result[0].path)
          resolve({ path: result[0].path, type: "PDFFile" });
        }
      });
    };
  }catch(err){
    console.log(err)
    reject(err)
  }
  });
};

export const getFilePaths = (form, addThumbnail) => {
  let promiseList = [];
  if(addThumbnail){
    promiseList.push(getImagePath(form));
  }
  if(form.fileUploaded){
    promiseList.push(getPDFFilepath(form));
  }
  return Promise.all(promiseList);
};

export const getImagePath = (form) => {
  const IMGformData = new FormData();
  IMGformData.append("fileUploaded", form.thumbnail);
  IMGformData.append("hash", form.PDFHash);
  IMGformData.append("type", "thumbnail");
  return fileAPI.post(`/getCloundinaryImagePath`, IMGformData);
}

export const getPDFFilepath =(form) =>  {
  let PDFformData = new FormData();
  return new Promise((resolve, reject) => {
    getIfMaskedFile(form).then(finalFile =>{
      getPathsFromIPFS({...form, fileUploaded:finalFile}).then(success =>{
        resolve(success)
      }).catch(Err =>{
        reject(Err)
      })
    })
  });
 
 
}

const getIfMaskedFile = (form) => {
  var rotate = function(target) {
    var context = target.getContext('2d');
    var text = 'IdeaTribe';
    var metrics = context.measureText(text);
    var x = (target.width / 2) - (metrics.width + 24);
    var y = (target.height / 2) + 48 * 2;
  
    context.translate(x, y);
    context.globalAlpha = 0.5;
    context.fillStyle = '#79579F';
    context.font = '48px Josefin Slab';
    context.rotate(-45 * Math.PI / 180);
    context.fillText(text, 0, 0);
    return target;
  };
  const promise = new Promise((resolve, reject) => {
    if(form.masked){
      sideLoadToFileStack(form)
      switch(form.fileType){
        case "pdf":
          const reader = new window.FileReader();
          reader.readAsArrayBuffer(form.fileUploaded);
          reader.onloadend = () => {
            convert({
              srcData: Buffer(reader.result),
              srcFormat: 'pdf',
              format: 'PNG'
            }).then(file =>{
              resolve(file)
            })
          };
        break;
        case "mp3":
          const mp3File = form.fileUploaded;
          const trimFrom = 0; // seconds
          const trimTo = 10; // seconds
          mp3Slice.trim(mp3File, trimFrom, trimTo).then(blob =>{
            const file = new File([blob], 'trimmed.wav', blob)
            resolve(file)

          })
          break;
        default:
          watermark([_.get(form,'fileUploaded')])
          .image(rotate)
          .render()
          .image(rotate)
          .then(function (img) {
            fetch(img.src)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], 'masked.png', blob)
              console.log(file)
              resolve(file)
            })
          });
          break;
      }
     
    }else{
      resolve(form.fileUploaded)
    }
  });
  return promise
}

const sideLoadToFileStack = (form) =>{
    console.log("Posting to filestack with filename : " + form.PDFHash )
    fileStackClient.upload(form.fileUploaded,undefined,{
      filename: form.PDFHash
    }).then(success =>{
      console.log("success",success)
    })
}

const StorageInterface = {
  getFilePaths,
  getImagePath,
  getPDFFilepath,
  getFileFromIPFS
};

export default StorageInterface;
