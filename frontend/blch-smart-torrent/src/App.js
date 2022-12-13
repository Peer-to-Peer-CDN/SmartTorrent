import "./App.css";
import { useState } from "react";
import Dropzone from "./components/dropzone";
import vote from "./components/vote"
import { useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider"
import { getVotes, isBlacklisted } from "./components/getVotes";
import { toast } from "react-hot-toast";


const App = () => {
  const [hash, setHash] = useState("hash");
  const [walletId, setWalletId] = useState("wallet-id");
  const [malwareVotes, setMalwareVotes] = useState("malware-votes");
  const [copyrightVotes, setCopyrightVotes] = useState("copyright-votes");
  const [blacklistedReason, setBlacklistedReason] = useState("blacklisted-reason");
  const votingbox = document.querySelector("#voting-box");
  const blacklistedbox = document.querySelector("#blacklisted-box");
  const torrentbox = document.querySelector("#torrent-box");

  useEffect(() => {
    setHash("");
    setWalletId("");
    setMalwareVotes("");
    setCopyrightVotes("");
    setBlacklistedReason("");
  }, []);

  const resetVotes = () => {
      setMalwareVotes("");
      setCopyrightVotes("");
      setBlacklistedReason("");

      votingbox.classList.remove("hidden");
      blacklistedbox.classList.add("hidden");
    };

  const blacklistedReasonMap = {
    1: "Malware",
    2: "Copyright",
    3: "Malware and Copyright",
  };

  const connectMetamask = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      try {
        let result = await window.ethereum.request({ method: "eth_requestAccounts" });
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        setWalletId(result[0]);
        toast.success("Metamask connected");
        torrentbox.classList.remove("hidden");
      } catch (error) {
        console.log(error);
        toast.error("User denied account access");
        votingbox.classList.add("hidden");
        torrentbox.classList.add("hidden");
      }
    } else {
      toast.error("Metamask not installed");
    }
  };


  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      toast.error("Please connect to MetaMask.");
    } else if (accounts[0] !== walletId) {
      setWalletId(accounts[0]);
    }
  }

  const getBothVotes = async () => {

    isBlacklisted(hash).then((result) => {
      let intResult = parseInt(result, 16);
      if (intResult > 0) {
        setBlacklistedReason(blacklistedReasonMap[intResult]);
        votingbox.classList.add("hidden");
        blacklistedbox.classList.remove("hidden");
      } else {
        getVotes(hash, 0).then((result) => {
          setMalwareVotes("" + (parseInt(result, 16)));
        });
        getVotes(hash, 1).then((result) => {
          setCopyrightVotes("" + parseInt(result, 16));
        });
      }
    });
  }

  return (
    <div>
      <div className="logo-container">
        <img className="logo" src="./SmartTorrent.png" alt="logo" />
      </div>
      <div className="container">
        <button className="connect-btn" onClick={connectMetamask}>
          Connect Metamask
        </button>
        {walletId.length > 0 ? (<p>Wallet ID: {walletId}</p>) : ""}
      </div>
      <section id="torrent-box" className="hidden">
        <Dropzone updateHash={setHash} resetVotes={resetVotes} votingbox={votingbox}/>
      </section>
      <section id="blacklisted-box" className="hidden box blacklist">
        <h2 className="blacklist">Torrent is Blacklisted for {blacklistedReason}!</h2>
      </section>
      <section id="voting-box" className="hidden info box">
        <div className="votes">
          <button className="vote" onClick={() => getBothVotes()}>Get votes</button>
        </div>
        <div className="votes">
          <button className="vote" onClick={() => vote(hash, 1)}>Vote Copyrighted!</button>
          {copyrightVotes.length > 0 ? <p>Votes for Copyrighted: {copyrightVotes}</p> : <></>}
        </div>
        <div className="votes">
          <button className="vote" onClick={() => vote(hash, 0)}>
            Vote Malware!
          </button>
          {malwareVotes.length > 0 ? <p>Votes for Malware: {malwareVotes}</p> : <></>}
        </div>
      </section>
    </div>
  );
};

export default App;
