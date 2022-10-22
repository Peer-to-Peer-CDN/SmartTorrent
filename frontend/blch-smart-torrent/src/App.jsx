import "./App.css";
import React from "react";
import { useState } from "react";
import Dropzone from "./components/dropzone";
import voteMalware from "./components/voteMalware";
import voteCopyrighted from "./components/voteCopyrighted";
import { useEffect } from "react";

const App = () => {
  const [hash, setHash] = useState("hash");

  useEffect(() => {
    setHash("");
  }, []);

  const dragDrop = require("drag-drop");
  dragDrop("div", (files) => {
    const filesFiltered = files.filter((file) => {
      return file.name.match(/.*\.torrent/g) ? file : null;
    });

    if (filesFiltered.length > 0) {
      console.log("Here is the dropped file", filesFiltered[0]);

      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = reader.result;
        // let parsedTorrent = parseTorrent(binaryStr)
        // setHash(parsedTorrent.infoHash);
      };

      reader.readAsArrayBuffer(filesFiltered[0]);
    } else {
      console.log("No valid file dropped");
    }
  });

  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        console.log("Metamask connected");
      } catch (error) {
        console.log("User denied account access");
      }
    } else {
      console.log("Metamask not installed");
    }
  };

  return (
    <body>
      <h1>Smart Torrent Hub</h1>
      <Dropzone />
      <p>{hash.length > 0 ? "File hash: " + hash : ""}</p>
      <div class="container">
        <button class="connect-btn" onClick={connectMetamask}>
          Connect Metamask
        </button>
      </div>
      <div class="info box">
        <div class="votes">
          <p>Votes for Copyrighted: X</p>
          <button class="vote" onClick={voteCopyrighted}>
            Vote!
          </button>
        </div>
        <div class="votes">
          <p>Votes for Maleware: X</p>
          <button class="vote" onClick={voteMalware}>
            Vote!
          </button>
        </div>
      </div>
    </body>
  );
};

export default App;
