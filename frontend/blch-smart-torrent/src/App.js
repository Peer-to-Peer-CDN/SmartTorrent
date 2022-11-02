import "./App.css";
import React from "react";
import { useState } from "react";
import Dropzone from "./components/dropzone";
import voteMalware from "./components/voteMalware";
import voteCopyrighted from "./components/voteCopyrighted";
import parseTorrent from "parse-torrent";
import { useEffect } from "react";
import detectEthereumProvider from '@metamask/detect-provider'



const App = () => {
  const [hash, setHash] = useState("hash");
  const [walletId, setWalletId] = useState("wallet-id");

  useEffect(() => {
    setHash("");
    setWalletId("");
  }, []);

  const dragDrop = require("drag-drop");
  dragDrop("div", (files) => {
    const filesFiltered = files.filter((file) => {
      return file.name.match(/.*\.torrent/g) ? file : null;
    });

    if (filesFiltered.length > 0) {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onloadend = () => {
        let buffer = Buffer.from(reader.result);
        let parsedTorrent = parseTorrent(buffer);
        setHash(parsedTorrent.infoHash);
      };

      reader.readAsArrayBuffer(filesFiltered[0]);
    } else {
      console.log("No valid file dropped");
    }
  });

  
  const connectMetamask = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      try {
        let result = await window.ethereum.enable();
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        setWalletId(result[0]);
        console.log("Metamask connected");
        document.querySelector("#voting-box").style.visibility = "visible";
        document.querySelector("#torrent-box").style.visibility = "visible";


      } catch (error) {
        console.log("User denied account access");
        document.querySelector("#voting-box").style.visibility = "hidden";
        document.querySelector("#torrent-box").style.visibility = "hidden";

      }
    } else {
      console.log("Metamask not installed");
    }
  };


  // For now, 'eth_accounts' will continue to always return an array
  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== walletId) {
      setWalletId(accounts[0]);
      // Do any other work!
    }
  }



  return (
    <div>
      <h1>Smart Torrent Hub</h1>

      <div className="container">
        <button className="connect-btn" onClick={connectMetamask}>
          Connect Metamask
        </button>
        {walletId.length > 0 ? (<p>Wallet ID: {walletId}</p>) : ""}
      </div>
      <section id="torrent-box">
        <Dropzone />
        <p>{hash.length > 0 ? "File hash: " + hash : ""}</p>
      </section>
      <section id="voting-box" className="info box">

        <div className="votes">
          <p>Votes for Copyrighted: X</p>
          <button className="vote" onClick={() => voteCopyrighted(hash, 1)}>
            Vote!
          </button>
        </div>
        <div className="votes">
          <p>Votes for Maleware: X</p>
          <button className="vote" onClick={voteMalware}>
            Vote!
          </button>
        </div>
      </section>
    </div>
  );
};

export default App;
