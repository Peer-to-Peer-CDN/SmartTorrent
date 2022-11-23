import "./App.css";
import React from "react";
import { useState } from "react";
import Dropzone from "./components/dropzone";
import vote from "./components/vote"
import parseTorrent from "parse-torrent";
import { useEffect } from "react";
import detectEthereumProvider from '@metamask/detect-provider'
import getVotes from "./components/getVotes";
import { toast } from "react-hot-toast";
import ProgressBarCustom from "./components/ProgressBar";



const App = () => {
  const [hash, setHash] = useState("hash");
  const [walletId, setWalletId] = useState("wallet-id");
  const [malwareVotes, setMalwareVotes] = useState("malware-votes");
  const [copyrightVotes, setCopyrightVotes] = useState("copyright-votes");
  useEffect(() => {
    setHash("");
    setWalletId("");
    setMalwareVotes("");
    setCopyrightVotes("");
  }, []);

  const dragDrop = require("drag-drop");
  dragDrop("div", (files) => {
    const filesFiltered = files.filter((file) => {
      return file.name.match(/.*\.torrent/g) ? file : null;
    });

    if (filesFiltered.length > 0) {
      const reader = new FileReader();
      reader.onabort = () => toast.error("file reading was aborted");
      reader.onerror = () => toast.error("file reading has failed");
      reader.onloadend = () => {
        let buffer = Buffer.from(reader.result);
        let parsedTorrent = parseTorrent(buffer);
        setHash(parsedTorrent.infoHash);
        toast.success("Torrent file loaded successfully");
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
        toast.success("Metamask connected");
        document.querySelector("#voting-box").style.visibility = "visible";
        document.querySelector("#torrent-box").style.visibility = "visible";
      } catch (error) {
        toast.error("User denied account access");
        document.querySelector("#voting-box").style.visibility = "hidden";
        document.querySelector("#torrent-box").style.visibility = "hidden";

      }
    } else {
      toast.error("Metamask not installed");
    }
  };


  // For now, 'eth_accounts' will continue to always return an array
  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      toast.error('Please connect to MetaMask.');
    } else if (accounts[0] !== walletId) {
      setWalletId(accounts[0]);
      // Do any other work!
    }
  }

  const getBothVotes = async () => {
    console.log("Getting votes");
    getVotes(hash, 1).then((result) => {
      console.log("Malware", result);
      // setMalwareVotes(result);
    });
    setTimeout(() => {

      getVotes(hash, 2).then((result) => {
        console.log("Copyright", result);
        // setCopyrightVotes(result);
      });
    }, 1000);

  }

  return (
    <div>
      <div class="logo-container">
        <img class="logo" src="./SmartTorrent.png" />
      </div>
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
      <section id="voting-status">
        <ProgressBarCustom />
      </section>
      <section id="blacklisted-box" className="hidden">
        <h2>Torrent is Blacklisted!</h2>
      </section>
      <section id="voting-box" className="info box">
        <div className="votes">
          <button className="vote" onClick={() => getBothVotes()}>Get votes</button>
        </div>
        <div className="votes">
          {copyrightVotes.length > 0 ? <p>Votes for Copyrighted: {copyrightVotes}</p> : <></>}
          <button className="vote" onClick={() => vote(hash, 1)}>Vote Copyrighted!</button>
        </div>
        <div className="votes">
          {malwareVotes.length > 0 ? <p>Votes for Malware: {malwareVotes}</p> : <></>}
          <button className="vote" onClick={() => vote(hash, 0)}>
            Vote Malware!
          </button>
        </div>
      </section>
    </div>
  );
};

export default App;
