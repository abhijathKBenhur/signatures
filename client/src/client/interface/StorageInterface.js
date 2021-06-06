import axios from "axios";
import _ from "lodash";
import { isDebuggerStatement } from "typescript";
import IPFS from "../config/ipfs";

const fileAPI = axios.create({
  baseURL: "http://localhost:4000/api",
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
        if (error) {
          console.error(error);
          reject(error);
        }
        console.log("PDF uploaded to IPFS ::" + result[0].path)
        resolve({ path: result[0].path, type: "PDFFile" });
      });
    };
  });
};

export const getFilePaths = (form) => {
  let promiseList = [];
  promiseList.push(getPDFFilepath(form));
  promiseList.push(getImagePath(form));

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
  PDFformData.append("PDFFile", form.PDFFile);
  PDFformData.append("hash", form.PDFHash);
  PDFformData.append("type", "PDFFile");
  // getPathsFromIPFS(PDFformData)
  return fileAPI.post(`/getCloundinaryPDFPath`, PDFformData);
}

const StorageInterface = {
  getFilePaths,
  getImagePath,
  getPDFFilepath,
  getFileFromIPFS
};

export default StorageInterface;
