import "./App.css";
import React from "react";
import { useState } from "react";
import Dropzone from "./components/dropzone";
import vote from "./components/vote"
import { useEffect } from "react";
import detectEthereumProvider from '@metamask/detect-provider'
import {getVotes,isBlacklisted} from "./components/getVotes";
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
    // console.log("Getting votes");
    getVotes(hash, 0).then((result) => {
      // console.log("Malware", parseInt(result, 16));
      setMalwareVotes("" + (parseInt(result, 16)));
    });
    getVotes(hash, 1).then((result) => {
      // console.log("Copyright", parseInt(result, 16));
      setCopyrightVotes("" + parseInt(result, 16));
    });
    // isBlacklisted(hash).then((result) => {
    //   if (result) {
    //     toast.error("Torrent is blacklisted");
    //     document.querySelector("#voting-box").classList.toggle( "hidden");
    //     document.querySelector("#blacklisted-box").classList.toggle( "hidden");
    //   } else {
    //     toast.success("Torrent is not blacklisted");
    //   }
    // });
  }

  return (
    <div>
      <div class="logo-container">
        <img class="logo" src="./SmartTorrent.png" alt="logo" />
      </div>
      <div className="container">
        <button className="connect-btn" onClick={connectMetamask}>
          Connect Metamask
        </button>
        {walletId.length > 0 ? (<p>Wallet ID: {walletId}</p>) : ""}
      </div>
      <section id="torrent-box">
        <Dropzone/>
      </section>
      {/* <section id="voting-status">
        <ProgressBarCustom />
      </section> */}
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
