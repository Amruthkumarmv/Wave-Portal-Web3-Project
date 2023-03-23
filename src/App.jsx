import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import "./box.css";
import WavePortalo from "./utils/WavePortal.json";

////Find Metamask///////////////////////////////

const findMetamaskAccount = async () => {
  try {
    // const ethereum = getEthereumObject();
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Not Found Ethereum Object ");
      return null;
    }
    console.log("Ethereum Object Found", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

//////////////////////////////////////////////////////////////////

const App = () => {
  const [currentAccount, setcurrentAccount] = useState("");
  const contractAddress = "Your Deployed Contract Address here";
  const contractABI = WavePortalo.abi;
  const [allWaves, setAllWaves] = useState([]);
  const [tmessage, setTmessage] = useState("");

  /////////////////////////////////////FindMetamask////////////////////////////////////

  const getEthereumObject = () => window.ethereum;

  //////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// GetAllWaves //////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        //main config
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        //logic here
        const waves = await wavePortalContract.getAllWaves();
        console.log(waves);
        alert(waves);

        let wavesCleaned = [];
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });

        setAllWaves(wavesCleaned);

        wavePortalContract.on("NewWave", (from, timestamp, message) => {
          console.log("NewWave", from, timestamp, message);
          setAllWaves((prevState) => [
            ...prevState,
            {
              address: from,
              timestamp: new Date(timestamp * 1000),
              message: message,
            },
          ]);
        });
      } else {
        console.log("Ethereum object doesn't found");
        alert("Ethereum object doesn't found");
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  //////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// GetWavesCount //////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  const GetWavesCount = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        alert("Retrieved total wave count..." + " " + count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
        alert("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        //Alchemy provider
        // const alchemyProvider = new ethers.providers.AlchemyProvider(network = "goerli", API_KEY);

        //Alchemy signer - you
        // const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

        //Alchemy contract instance
        // const wavePortalContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        console.log(wavePortalContract.getTotalWaves());

        let count = await wavePortalContract.getTotalWaves();

        console.log("Retrieved total wave count...", count.toNumber());
        alert("Retrieved total wave count... " + count.toNumber());
        /*
         * Execute the actual wave from your smart contract
         */
        const waveTxn = await wavePortalContract.wave(tmessage, {
          gasLimit: 300000,
        });
        console.log("Mining...", waveTxn.hash);
        alert("Mining -- " + " " + waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        alert("Mined -- " + waveTxn.hash);
        setTmessage("");
        document.getElementById("tmsg").value = "";

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        alert("Retrieved total wave count..." + count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  ////////////////////////////////////////////////////////////////////
  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        console.log("Get Metamask");
        alert("Get Metamask");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      alert("Account connected:" + accounts[0]);
      setcurrentAccount(accounts[0]);
      await getAllWaves();
    } catch (error) {
      console.error(error);
    }
  };

  ///////////////////////////////////////////////////////////////////////////
  // const connectContract = async () => {

  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
  //   let contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
  //   console.log(contract.address);
  // }

  useEffect(() => {
    const funct = async () => {
      const account = await findMetamaskAccount();
      if (account != null) setcurrentAccount(account);
    };
  }, []);

  return (
    <>
      {/* <Header /> */}
      <div className="mainContainer">
        <h1 className="texto">WavePortal</h1>

        <div className="dataContainer">
          <div
            className="header"
            style={{
              fontFamily: "cursive",
              fontSize: "2vh",
              marginBottom: "2px",
            }}
          >
            <p style={{ fontSize: "16px" }}>👋Hey there welcome!</p>
          </div>

          {/* //////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////// */}

          {currentAccount && (
            <>
              <input
                className="inputo"
                id="tmsg"
                type="text"
                onChange={(e) => setTmessage(e.target.value)}
              />
              <button className="boxy" onClick={wave}>
                Wave hai at Me
              </button>
              <br />
            </>
          )}
          {/* ////////////////////////////////////////////////////////// */}
          {/* /////////////////////////////////////////////////////////////////// */}
          <br />
          <button className="waveButton" onClick={GetWavesCount}>
            Get Count
          </button>

          {!currentAccount && (
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}

          {allWaves.map((wave, index) => {
            return (
              <div
                key={index}
                style={{
                  backgroundColor: "#232b2b",
                  marginTop: "16px",
                  padding: "8px",
                  color: "white",
                  fontFamily: "monospace",
                  borderRadius: "10px",
                }}
              >
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default App;
