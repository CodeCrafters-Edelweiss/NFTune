import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from "axios";
import { useStyles } from "./styles.js";

import DropZone from "../../components/DropZone";
import "./form.css";
import { api } from "../../services/api";
import Header from "../../components/Header/index.js";
import bgImage from "../../assets/gradient.png";
import Switch from '@mui/material/Switch';


const CreateNFT = () => {
  const classes = useStyles();
  const history = useHistory();

  const account = useSelector((state) => state.allNft.account);
  const artTokenContract = useSelector(
    (state) => state.allNft.artTokenContract
  );

  const [selectedFile, setSelectedFile] = useState();
  console.log(selectedFile);
  console.log(`soemthing`)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });





  function handleInputChange(event) {
    let { name, value } = event.target;
    // if(name === 'image'){
    //   value = event.target.files[0];
    // }
    setFormData({ ...formData, [name]: value });
  }

  async function createNFT(event) {
    event.preventDefault();
    // const { title, description } = formData;

    // console.log("title: " + title);

    const data = new FormData();
    data.append("name", name);
    data.append("description", artist);

    if (selectedFile) {
      data.append("img", selectedFile);
      console.log("slectedFile: ", selectedFile);
    }

    try {
      const totalSupply = await artTokenContract.methods.totalSupply().call();
      data.append("tokenId", Number(totalSupply) + 1);

      const response = await api.post("/tokens", data, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
      });
      console.log(response);

      mint(response.data.message);
    } catch (error) {
      console.log(error);
      // error.response.data
    }
  }

  async function mint(tokenMetadataURL) {
    try {
      const receipt = await artTokenContract.methods
        .mint(tokenMetadataURL)
        .send({ from: account });
      console.log(receipt);
      console.log(receipt.events.Transfer.returnValues.tokenId);
      // setItems(items => [...items, {
      //   tokenId: receipt.events.Transfer.returnValues.tokenId,
      //   creator: accounts[0],
      //   owner: accounts[0],
      //   uri: tokenMetadataURL,
      //   isForSale: false,
      //   saleId: null,
      //   price: 0,
      //   isSold: null
      // }]);
      history.push("/");
    } catch (error) {
      console.error("Error, minting: ", error);
      alert("Error while minting!");
    }
  }

  const [checked, setChecked] = React.useState(true);
  const [audio, setAudio] = React.useState(true);
  const handleChange = (event) => {
    setChecked(event.target.checked);
    setAudio(!checked);
  };

  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [lyricImage, setLyricImage] = useState(undefined);

  const getImageLyric = async () => {

    await axios.post("http://localhost:8080/image", {
      name: name,
      artist: artist,
    })
      .then(async (res) => {
        console.log(res.data);
        setLyricImage(res.data);
        setSelectedFile(res.data);
        const data = new FormData();
        data.append("name", name);
        data.append("description", artist);

        let url = res.data;
        const toDataURL = url => fetch(url)
          .then(response => response.blob())
          .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
          }))



        function dataURLtoFile(dataurl, filename) {
          var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new File([u8arr], filename, { type: mime });
        }


        await toDataURL(url)
          .then(async(dataUrl) => {
            console.log('Here is Base64 Url', dataUrl)
            var fileData = dataURLtoFile(dataUrl, "imageName.jpg");
            // console.log("Here is JavaScript File Object", fileData)
            //  fileArr.push(fileData)
            console.log(fileData);
            console.log(`===================================`)
            setSelectedFile(fileData);
            console.log("selectedFile: ", selectedFile);
            data.append("img", fileData);
            
        try {
          const totalSupply = await artTokenContract.methods.totalSupply().call();
          data.append("tokenId", Number(totalSupply) + 1);

          const response = await api.post("/tokens", data, {
            headers: {
              "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            },
          });
          console.log(response);

          mint(response.data.message);
        } catch (error) {
          console.log(error);
        }
          })


      })
      .catch((err) => {
        console.log(err);
      })
  }

  const onNameChange = (event) => {
    setName(event.target.value);
    event.preventDefault();
  }
  const onArtistChange = (event) => {
    setArtist(event.target.value);
    event.preventDefault();
  }

  return (
    <div>
      <Header />
      <img src={bgImage} alt="" className="bgImage" />
      <div className="" style={{ justifyContent: "center", display: "flex" }}>
        <FormControlLabel control={<Switch
          checked={checked}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'controlled' }}
        />} label="Use Audio" color="secondary" />


      </div>
      <form onSubmit={createNFT}>
        <div>
          {/* <h1>Create collectible</h1> */}
          <Link to="/">
            <CancelOutlinedIcon fontSize="large" />
          </Link>
        </div>
        <div>
          <div>{/* <DropZone onFileUploaded={setSelectedFile} /> */}</div>

          <div
            className="container songInput"
            style={{ zIndex: 1000, width: "20vw", padding: "5vh" }}
          >
            {/* <input type="text" className="form-control" placeholder="Enter Song Name: " name="song"/>
              <input type="text" className="form-control" placeholder="Enter Artist Name: " name="artist" /> */}
            {
              audio &&
              <div className="inputGroup">
                <input
                  className="loginInput form-control"
                  type="text"
                  name="Song"
                  id=""
                  placeholder="NFT Title"
                />
                <input
                  className="passwordInput form-control"
                  type="text"
                  name="Artist"
                  id=""
                  placeholder="Artist"
                />
                <h5>OR</h5>
                <DropZone onFileUploaded={setSelectedFile} />
                {/* <button className="loginButton btn btn-success" onClick={createNFT}>Generate</button> */}
                <button
                  className="loginButton btn btn-success"
                  type="submit" >
                  Submit
                </button>
              </div>
            }
            {
              !audio &&
              <div className="inputGroup">
                <input
                  className="loginInput form-control"
                  type="text"
                  name="Song"
                  id=""
                  placeholder="Song Name"
                  value={name}
                  onChange={onNameChange}
                />
                <input
                  className="passwordInput form-control"
                  type="text"
                  name="Artist"
                  id=""
                  placeholder="Artist"
                  value={artist}
                  onChange={onArtistChange}
                />
                <button
                  className="loginButton btn btn-success"
                  type="submit" onClick={getImageLyric} >
                  Submit
                </button>
              </div>
            }
          </div>
          {/* <TextField
              label="Title"
              name="title"
              variant="filled"
              required
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              id="outlined-multiline-static"
              multiline
              rows={4}
              label="Description"
              name="description"
              variant="filled"
              required
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="price"
              name="price"
              variant="filled"
              value={formData.price}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
              }}
              fullWidth
            /> */}

          {/* <Button variant="contained" color="primary" type="submit">
            Submit
          </Button> */}
        </div>
      </form>
    </div>
  );
};

export default CreateNFT;
