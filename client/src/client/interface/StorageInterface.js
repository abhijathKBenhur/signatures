import axios from "axios";
import _ from "lodash";
import IPFS from "../config/ipfs";

const fileAPI = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const getFilePathsFromIPFS = (form) => {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(form.PDFFile);
    reader.onloadend = () => {
      IPFS.files.add(Buffer(reader.result), (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        }
        console.log("PDF uploaded to IPFS")
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
  return fileAPI.post(`/getCloundinaryPath`, IMGformData);
}

export const getPDFFilepath =(form) =>  {
  let PDFformData = new FormData();
  PDFformData.append("PDFFile", form.PDFFile);
  PDFformData.append("hash", form.PDFHash);
  PDFformData.append("type", "PDFFile");
  return getFilePathsFromIPFS(form);
}

const StorageInterface = {
  getFilePaths,
  getImagePath,
  getPDFFilepath
};

export default StorageInterface;
