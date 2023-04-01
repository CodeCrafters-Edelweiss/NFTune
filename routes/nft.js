import express from "express";
var router = express.Router();
// import { mintNFT } from "../scripts/mint-nft.js";

import dotenv from "dotenv"
dotenv.config();
const API_URL = process.env.API_URL;
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
const alchemyWeb3 = createAlchemyWeb3(API_URL);

import * as fs from 'fs';
import { readFile } from 'fs/promises';
const {abi} = JSON.parse(await readFile(new URL('../artifacts/contracts/OsunRiverNFT.sol/TorNFT.json', import.meta.url)));
let METAMASK_PUBLIC_KEY = process.env.METAMASK_PUBLIC_KEY;
let METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;

const contractAddress = "0x9436f34035a4885650C8311cA24e3E2DeD2FF0a2"; // the hash of the smart contract to be used in minting this NFT
const nftContract = new alchemyWeb3.eth.Contract(abi, contractAddress);

import { Web3Storage, getFilesFromPath } from "web3.storage";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { unlink } from "fs";
import jsonfile from 'jsonfile'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.post("/create-json", async (req, res) => {
  // Code for user authentication will go here for future purposes

  // For now token is assigned manually     
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkxQzVDMzc1NDE4Qjg4Mjc3RkY2N2ZiQzQxRkM1YzNEOTBmMDNBNDgiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzcwOTM5ODM1ODAsIm5hbWUiOiJ0ZXN0In0.tl7NTO5aXSk3NrO210u8aQNtgfkaZlXhuE1l2vHx3qM";

    
    
  const user = req.body.user;
  const description = req.body.description;
  const image = req.body.image;
  const storage = new Web3Storage({ token });
  const files = [];
  //

  var obj = 
    {
        "description" : description,
        "image" : image
    }
    let uploadPath = __dirname + "/tmp/" + user+"-nft.json";
    // var json = JSON.stringify(obj);
   
 
    const file = uploadPath
    jsonfile.writeFile(file, obj, { spaces: 2 }, async function (err) {
        console.log('Write complete')
        const pathFiles = await getFilesFromPath(uploadPath);
        files.push(...pathFiles);
    
        console.log(`Uploading ${files.length} files`);
        const cid = await storage.put(files);
        console.log("CID : " + cid);
    
        unlink(uploadPath, (err) => {
            if (err)
                throw err;
            console.log(uploadPath + " was deleted");
        });
    
        res.json({ file: "https://" + cid + ".ipfs.w3s.link/" + user+"-nft.json" });
    
    })

    //
    // const pathFiles = await getFilesFromPath(uploadPath);
    // files.push(...pathFiles);

    // console.log(`Uploading ${files.length} files`);
    // const cid = await storage.put(files);
    // console.log("CID : " + cid);

    // unlink(uploadPath, (err) => {
    //     if (err)
    //         throw err;
    //     console.log(uploadPath + " was deleted");
    // });

    // res.json({ file: "https://" + cid + ".ipfs.w3s.link/" + document.name });

});


router.post('/mint-nft', async (req, res)=>{
    const user_id = req.body.user_id;
    METAMASK_PUBLIC_KEY = req.body.metamask_public_key;
    METAMASK_PRIVATE_KEY = req.body.metamask_private_key;
    const tokenURI = req.body.tokenURI;

    const nonce = await alchemyWeb3.eth.getTransactionCount(
      METAMASK_PUBLIC_KEY,
      "latest"
    );
  
    const tx = {
      from: METAMASK_PUBLIC_KEY, // your metamask public key
      to: contractAddress, // the smart contract address we want to interact with
      nonce: nonce, // nonce with the no of transactions from our account
      gas: 1000000, // fee estimate to complete the transaction
  
      data: nftContract.methods
        .createNFT("0x0d28235B6191a66A3410cc1e3CeBfE53602D7865", tokenURI)
        .encodeABI(), // call the createNFT function from our OsunRiverNFT.sol file
    };
  
    const signPromise = alchemyWeb3.eth.accounts.signTransaction(
      tx,
      METAMASK_PRIVATE_KEY
    );
    signPromise
      .then((signedTx) => {
        alchemyWeb3.eth.sendSignedTransaction(
          signedTx.rawTransaction,
          function (err, hash) {
            if (!err) {
              res.json( {"status": "success","hash": hash})
            } else {
              res.json ({
                "status": "failure","message": "Something went wrong when submitting your transaction:",
                "error":err
              });
            }
          }
        );
      })
      .catch((err) => {
        console.log(" Promise failed:", err);
      });
})

export default router;