import axios from "axios";
import _ from "lodash";

import IPFS from "../config/ipfs";
import ENDPOINTS from '../commons/Endpoints';
const fileAPI = axios.create({
  baseURL: process.env.NODE_ENV == "production" ? ENDPOINTS.REMOTE_ENDPOINTS: ENDPOINTS.LOCAL_ENDPOINTS,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});



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
    reader.readAsArrayBuffer(form.PDFFile);
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
  });
};

export const getFilePaths = (form, addThumbnail) => {
  let promiseList = [];
  if(form.PDFFile){
    promiseList.push(getPDFFilepath(form));
  }
  if(addThumbnail){
    promiseList.push(getImagePath(form));
  }
  return Promise.all(promiseList);
};

export const getImagePath = (form) => {
  const IMGformData = new FormData();
  IMGformData.append("thumbnail", form.thumbnail);
  IMGformData.append("hash", form.PDFHash);
  IMGformData.append("type", "thumbnail");
  return fileAPI.post(`/getCloundinaryImagePath`, IMGformData);
}

export const getPDFFilepath =(form) =>  {
  let PDFformData = new FormData();
  let finalFile = getIfMaskedFile(form)
  PDFformData.append("PDFFile", finalFile);
  PDFformData.append("hash", form.PDFHash);
  PDFformData.append("type", "PDFFile");
  return form.masked ? fileAPI.post(`/getCloundinaryImagePath`, PDFformData) : getPathsFromIPFS(form);
}

const getIfMaskedFile = (form) => {
  let maskedFile = form.PDFFile
  if(form.masked){
    switch(form.fileType){
      case "pdf":
        let outputImages = pdf2img.convert(form.PDFFile);
        outputImages.then(function(outputImages) {
          let firstPage = outputImages[0]
        })
      break;
      case "mp3":
        break;
      case "jpg":
        break;
    }
  }

}

const StorageInterface = {
  getFilePaths,
  getImagePath,
  getPDFFilepath,
  getFileFromIPFS
};

export default StorageInterface;
