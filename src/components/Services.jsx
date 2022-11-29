/*Services module performs two tasks: 
1. imports bear cave treasury wallet values from the BSC Blockchain
2. Outputs the bearcave treasury onto a webpage
*/
//import dependencies
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { axios } from "axios";
import { GETBLOCK_ID } from '../utils/constants';
import { CHAIN_STACK } from '../utils/constants';
import { ethers } from "ethers";
import currencyConverter from './CurrencyConverter';
import { FcInfo } from "react-icons/fc";
import { toast } from "react-toastify";

//import crypto logos
import bnbLogo from '../../images/BinanceLogo.png'
import maticLogo from '../../images/PolygonLogo.png';
import avaxLogo from '../../images/Avalanchelogo.png';
import ftmLogo from '../../images/Fantomlogo.png';
import busdLogo from '../../images/BUSDlogo.png';
import linkLogo from '../../images/linkLogo.png'
import adaLogo from '../../images/Adalogo.png';
import atomLogo from '../../images/Cosmoslogo.png';
import solLogo from '../../images/Solanalogo.png';
import sandLogo from '../../images/SandboxLogo.png';
import logo from '../../images/95WEOeJ(1).png';

//create and assign treasury wallet and contract addresses
const treasuryAddress = '0x1f1b2c8FF594E7f325594232d510234573675BbC'
const maticAddress = '0xCC42724C6683B7E57334c4E856f4c9965ED682bD'
const avaxAddress = '0x1CE0c2827e2eF14D5C4f29a091d735A204794041'
const ftmAddress = '0xAD29AbB318791D579433D831ed122aFeAf29dcfe'
const busdAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
const linkAddress = '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD'
const adaAddress = '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47' 
const atomAddress = '0x0Eb3a705fc54725037CC9e008bDede697f62F335'
const solAddress = '0x570A5D26f7765Ecb712C0924E4De545B89fD43dF'
const sandAddress = '0x67b725d7e342d7B611fa85e859Df9697D9378B2e'
const mboxAddress = '0x3203c9E46cA618C8C1cE5dC67e7e9D75f5da2377'
const kxaAddress = '0x2223bF1D7c19EF7C06DAB88938EC7B85952cCd89'
const ibatAddress = '0x19cd9B8e42d4EF62c3EA124110D5Cfd283CEaC43'

const wbnbAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
const bearLPAddress = '0x60783c1b91795adfd3add1a9492e37aec8a6e810'
const bearAddress = '0xd1421f138Fd1bCa936C1c4b2cCc80Fc133372e77'
const bearUnicryptAddress = '0xeaed594b5926a7d5fbbc61985390baaf936a6b8d'
const bearStakingAddress = '0xfbec91253b539de082e2da751c784228c2384842'
const deadBearAddress = '0x000000000000000000000000000000000000dead'
const deployerBearAddress = '0xd1421f138fd1bca936c1c4b2ccc80fc133372e77'
const marketingBearAddress ='0xd7b3398F528975CB1b966254ad16DA5E52217e7d'
const devBearAddress = '0xc414f2d604eb7B6c5C1dA41f80Ca0d7C6fA03B6a'

//instantiation of the smartchain provider used to call values from bscscan
const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/bsc')
const provider2 = new ethers.providers.JsonRpcProvider(GETBLOCK_ID)

const TREASURY_ABI = [
    "function name() external view returns(string memory)",
    "function symbol() external view returns (string memory)",
    "function balanceOf(address account) external view returns (uint256)",
]
const BEAR_ABI = [
    "function name() external view returns(string memory)",
    "function symbol() external view returns (string memory)",
    "function balanceOf(address account) external view returns (uint256)",
    "function totalSupply() external view returns (uint256)",
]

//assigning contract values to each token
const matic = new ethers.Contract(maticAddress, TREASURY_ABI, provider)
const avax = new ethers.Contract(avaxAddress, TREASURY_ABI, provider)
const ftm = new ethers.Contract(ftmAddress, TREASURY_ABI, provider)
const busd = new ethers.Contract(busdAddress, TREASURY_ABI, provider)
const link = new ethers.Contract(linkAddress, TREASURY_ABI, provider)
const ada = new ethers.Contract(adaAddress, TREASURY_ABI, provider)
const atom = new ethers.Contract(atomAddress, TREASURY_ABI, provider)
const sol = new ethers.Contract(solAddress, TREASURY_ABI, provider)
const bear = new ethers.Contract(bearAddress, BEAR_ABI, provider)
const wbnb = new ethers.Contract(wbnbAddress, TREASURY_ABI, provider)
const sand = new ethers.Contract(sandAddress, TREASURY_ABI, provider)
const mbox = new ethers.Contract(mboxAddress, TREASURY_ABI, provider)
const kxa = new ethers.Contract(kxaAddress, TREASURY_ABI, provider)
const ibat = new ethers.Contract(ibatAddress, TREASURY_ABI, provider)

const bearLP = async()=>{
    const bearLPWBNB = ethers.utils.formatEther(await wbnb.balanceOf(bearLPAddress))
    //console.log(bearLPWBNB);
    return parseFloat(bearLPWBNB).toFixed(2);
}
const bearLPTokenAmount = async()=>{
    const bearLPToken = await bear.balanceOf(bearLPAddress) / 1000000000
    return parseFloat(bearLPToken).toFixed(2)
}

const bearHeldByInvestors = async()=>{
    const bearTotalSupply = await bear.totalSupply() /1000000000
    const bearLPToken = await bear.balanceOf(bearLPAddress) / 1000000000
    const unicryptBear = await bear.balanceOf(bearUnicryptAddress) / 1000000000
    const stakingBear = await bear.balanceOf(bearStakingAddress) / 1000000000
    const deadBear = await bear.balanceOf(deadBearAddress) / 1000000000
    const deployerBear = await bear.balanceOf(deployerBearAddress) / 1000000000
//console.log(deployerBear)
    const devBear = await bear.balanceOf(devBearAddress) / 1000000000
    const marketingBear = await bear.balanceOf(marketingBearAddress) / 1000000000
    return (bearTotalSupply-bearLPToken-unicryptBear-stakingBear-deadBear-deployerBear-devBear-marketingBear);
}

const treasuryBNB = async()=>{
    const balance = ethers.utils.formatEther(await provider.getBalance(treasuryAddress));
    return parseFloat(balance).toFixed(2);
} 

const treasuryMatic = async()=>{
    const maticBalance = ethers.utils.formatEther(await matic.balanceOf(treasuryAddress));
    return parseFloat(maticBalance).toFixed(2);
}

const treasuryAvax = async()=>{
    const avaxBalance = ethers.utils.formatEther(await avax.balanceOf(treasuryAddress));
    return parseFloat(avaxBalance).toFixed(2);
}

const treasuryFtm = async()=>{
    const ftmBalance = ethers.utils.formatEther(await ftm.balanceOf(treasuryAddress));
    return parseFloat(ftmBalance).toFixed(2);
}

const treasuryBusd = async()=>{
    const busdBalance = ethers.utils.formatEther(await busd.balanceOf(treasuryAddress));
    return busdBalance;
}

const treasuryLink = async()=>{
    const linkBalance = ethers.utils.formatEther(await link.balanceOf(treasuryAddress));
    return parseFloat(linkBalance).toFixed(2);
}

const treasuryAda = async()=>{
    const adaBalance = ethers.utils.formatEther(await ada.balanceOf(treasuryAddress));
    return parseFloat(adaBalance).toFixed(2);
}

const treasuryAtom = async()=>{
    const atomBalance = ethers.utils.formatEther(await atom.balanceOf(treasuryAddress));
    return parseFloat(atomBalance).toFixed(2);
}

const treasurySol = async()=>{
    const solBalance = ethers.utils.formatEther(await sol.balanceOf(treasuryAddress));
    return parseFloat(solBalance).toFixed(2);
}

const treasurySand = async()=>{
    const sandBalance = ethers.utils.formatEther(await sand.balanceOf(treasuryAddress));
    return parseFloat(sandBalance).toFixed(2);
}

const treasuryMbox = async()=>{
    const mboxBalance = ethers.utils.formatEther(await mbox.balanceOf(treasuryAddress));
    return parseFloat(mboxBalance).toFixed(2);
}

const treasuryKxa = async()=>{
    const kxaBalance = ethers.utils.formatEther(await kxa.balanceOf(treasuryAddress));
    return parseFloat(kxaBalance).toFixed(2);
}

const treasuryIbat = async()=>{
    const ibatBalance = ethers.utils.formatEther(await ibat.balanceOf(treasuryAddress)) * 1000000000;
    console.log(ibatBalance);
    return parseFloat(ibatBalance).toFixed(2);
}



//commonStyles is used to format the white table outline for The Bear Cave Treasury
//const commonStyles = "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-medium text-white";

// Output of the bear cave treasury including token logo, name, balance, symbol, and dollar value
const Services = ({bnbExchangeRate, maticExchangeRate, avaxExchangeRate, ftmExchangeRate, linkExchangeRate, adaExchangeRate, atomExchangeRate, solExchangeRate, sandExchangeRate, mboxExchangeRate, kxaExchangeRate, ibatExchangeRate}) => {
    const [newBearLp, setNewBearLp] = useState(0);
    const [newBearLPTokenAmount, setNewBearLPTokenAmount] = useState(0);
    const [newBnbBalance, setNewBnbBalance] = useState(0);
    const [newMaticBalance, setNewMaticBalance] = useState(0);
    const [newAvaxBalance, setNewAvaxBalance] = useState(0);
    const [newFtmBalance, setNewFtmBalance] = useState(0);
    const[newBusdBalance, setNewBusdBalance] = useState(0);
    const[newLinkBalance, setNewLinkBalance] = useState(0);
    const[newAdaBalance,setNewAdaBalance] = useState(0);
    const[newAtomBalance, setNewAtomBalance] = useState(0);
    const[newSolBalance, setNewSolBalance] = useState(0);
    const[newSandBalance, setNewSandBalance] = useState(0);
    const[newMboxBalance, setNewMboxBalance] = useState(0);
    const[newKxaBalance, setNewKxaBalance] = useState(0);
    const[newIbatBalance, setNewIbatBalance] = useState(0);
    const[newBearHeldByInvestors, setNewBearHeldByInvestors] = useState(0)
    bearLP().then(value => setNewBearLp(value));
    bearLPTokenAmount().then(value => setNewBearLPTokenAmount(value));
    treasuryBNB().then(value => setNewBnbBalance(value));
    treasuryMatic().then(value => setNewMaticBalance(value));
    treasuryAvax().then(value=> setNewAvaxBalance(value));
    treasuryFtm().then(value=>setNewFtmBalance(value));
    treasuryBusd().then(value=>setNewBusdBalance(value));
    treasuryLink().then(value=>setNewLinkBalance(value));
    treasuryAda().then(value=>setNewAdaBalance(value));
    treasuryAtom().then(value=>setNewAtomBalance(value));
    treasurySol().then(value=>setNewSolBalance(value));
    treasurySand().then(value=>setNewSandBalance(value));
    treasuryMbox().then(value=>setNewMboxBalance(value));
    treasuryKxa().then(value=>setNewKxaBalance(value));
    treasuryIbat().then(value=>setNewIbatBalance(value));
    bearHeldByInvestors().then(value=>setNewBearHeldByInvestors(value));
    const setTotal = () => {
        const total = (bnbExchangeRate * newBnbBalance)+
                  (maticExchangeRate * newMaticBalance)+
                  (avaxExchangeRate * newAvaxBalance)+
                  (ftmExchangeRate * newFtmBalance)+
                  (linkExchangeRate * newLinkBalance)+
                  (adaExchangeRate * newAdaBalance)+
                  (atomExchangeRate * newAtomBalance)+
                  (solExchangeRate * newSolBalance)+
                  (parseFloat(newBusdBalance))+
                  (bnbExchangeRate * newBearLp)+
                  (sandExchangeRate * newSandBalance)+
                  (mboxExchangeRate * newMboxBalance)+
                  (kxaExchangeRate * newKxaBalance)+
                  (ibatExchangeRate * newIbatBalance);
        return total.toFixed(2);
    }
    const showInfo = () => {
        toast(
          "If the project hypothetically ended at this time, each investor holding 1 Million BEAR will receive this much BUSD in their wallet", {autoClose:4000}
        );
      }
      
      const showInfo1 = () => {
        toast(
          "Total BEAR out of 100 million minted that is held by investors at this time", {autoClose:4000}
        );
      }
      
      const showInfo2 = () => {
        toast(
          "This is the current value of 1 Million BEAR on PancakeSwap, after taxes", {autoClose:4000}
        );
      }

    return(
        <div className="flex w-full justify-center text-white pt-52 font-Roboto"> 
        <div className="flex mf:flex-row flex-col items-start justify-between pt-10 px-4">
            <div className="flex flex-1 justify-center items-start flex-col mf:mr-10">
                {/* <h1 className="text-4xl text-center text-white py-3  w-full ">
                    The Bear Cave  
                </h1> */}
                <h1 className="text-7xl font-medium w-full text-center">
                Total: ${setTotal()}
                </h1>
                <div className="grid grid-cols-4 items-center lg:grid-cols-5 w-full mt-10 border-2 p-5 rounded-xl gap-4 text-white backdrop-blur-lg text-center divide-x">
                    
                    <div><img src={maticLogo} alt="logo" className="w-12 lg:w-16 border-2" /></div>
                    <div>Polygon</div>
                    <div>{newMaticBalance}</div>
                    <div className="hidden lg:block">MATIC</div>
                    <div> ${(newMaticBalance*maticExchangeRate).toFixed(2)} </div>

                    <div><img src={avaxLogo} alt="logo" className="w-12 lg:w-16 border-2" /></div>
                    <div>Avalanche</div>
                    <div>{newAvaxBalance}</div>
                    <div className="hidden lg:block">AVAX</div>
                    <div>${(newAvaxBalance*avaxExchangeRate).toFixed(2)}</div>

                    <div><img src={ftmLogo} alt="logo" className="w-12 lg:w-16 border-2" /></div>
                    <div>Fantom</div>
                    <div>{newFtmBalance}</div>
                    <div className="hidden lg:block">FTM</div>
                    <div>${(newFtmBalance*ftmExchangeRate).toFixed(2)}</div>

                    <div><img src={busdLogo} alt="logo" className="w-12 lg:w-16 border-2" /></div>
                    <div>Binance-US Dollar</div>
                    <div >{newBusdBalance}</div>
                    <div className="hidden lg:block">BUSD</div>
                    <div>${newBusdBalance}</div>

                    <div><img src={linkLogo} alt="logo" className="w-12 lg:w-16 border-2" /></div>
                    <div>Chainlink</div>
                    <div>{newLinkBalance}</div>
                    <div className="hidden lg:block">LINK</div>
                    <div>${(newLinkBalance*linkExchangeRate).toFixed(2)}</div>

                    <div><img src={adaLogo} alt="logo" className="w-12 lg:w-16 border-2" /></div>
                    <div>Cardano</div>
                    <div>{newAdaBalance}</div>
                    <div className="hidden lg:block">ADA</div>
                    <div>${(newAdaBalance*adaExchangeRate).toFixed(2)}</div>

                    <div> <img src={atomLogo} alt="logo" className="w-12 lg:w-16 border-2" /> </div>
                    <div>Cosmos</div>
                    <div>{newAtomBalance}</div>
                    <div className="hidden lg:block">ATOM</div>
                    <div> ${(newAtomBalance*atomExchangeRate).toFixed(2)} </div>
                    
                    <div> <img src={solLogo} alt="logo" className="w-12 lg:w-16 border-2" /> </div>
                    <div>Solana</div>
                    <div>{newSolBalance}</div>
                    <div className="hidden lg:block">SOL</div>
                    <div> ${(newSolBalance*solExchangeRate).toFixed(2)} </div>

                </div>
                <h1 className="text-4xl text-center text-white mt-5 w-full">
                    Gaming/Utility
                </h1>
                <div className="grid gap-4 grid-cols-4 lg:grid-cols-5 items-center border-2 rounded-lg w-full mt-10 text-white backdrop-blur-lg p-5 text-center divide-x">
                    
                    <div> <img src={sandLogo} alt="logo" className="w-12 lg:w-16 border-2" /> </div>
                    <div>Sand Box</div>
                    <div>{newSandBalance}</div>
                    <div className="hidden lg:block">SAND</div>
                    <div> ${(newSandBalance*sandExchangeRate).toFixed(2)} </div>

                    <div> <img src={sandLogo} alt="logo" className="w-12 lg:w-16 border-2" /> </div>
                    <div>Mobox</div>
                    <div>{newMboxBalance}</div>
                    <div className="hidden lg:block">MBOX</div>
                    <div> ${(newMboxBalance*mboxExchangeRate).toFixed(2)} </div>

                    <div> <img src={sandLogo} alt="logo" className="w-12 lg:w-16 border-2" /> </div>
                    <div>Kryxivia</div>
                    <div>{newKxaBalance}</div>
                    <div className="hidden lg:block">KXA</div>
                    <div> ${(newKxaBalance*kxaExchangeRate).toFixed(2)} </div>

                    <div> <img src={sandLogo} alt="logo" className="w-12 lg:w-16 border-2" /> </div>
                    <div>BattleInfinity</div>
                    <div>{newIbatBalance}</div>
                    <div className="hidden lg:block">IBAT</div>
                    <div> ${(newIbatBalance*ibatExchangeRate).toFixed(2)} </div>

                </div>

                <h1 className="text-4xl text-center text-white mt-5 w-full">
                    Next Month's Investment
                </h1>
                <div className="grid grid-cols-4 lg:grid-cols-5 items-center border-2 rounded-lg w-full mt-10 text-white backdrop-blur-lg p-5 text-center divide-x">
                    
                    <div><img src={bnbLogo} alt="logo" className="w-12 lg:w-16 border-2" /></div>
                    <div>Binance Smartchain</div>
                    <div>{newBnbBalance}</div>
                    <div className="hidden lg:block">BNB</div>
                    <div> ${(bnbExchangeRate*newBnbBalance).toFixed(2)} </div>
                </div>
                <h1 className="text-4xl text-center text-white mt-5 w-full">
                    Arbitrage Calculation
                </h1>
                <div className="grid grid-cols-4 lg:grid-cols-5 items-center border-2 rounded-lg w-full mt-10 text-white backdrop-blur-lg p-5 text-center divide-x gap-4">
                
                <div><img src={bnbLogo} alt="logo" className="w-12 lg:w-16 border-2" /></div>
                    <div>Bear LP</div>
                    <div>{newBearLp}</div>
                    <div className="hidden lg:block">BNB</div>
                    <div> ${(bnbExchangeRate*newBearLp).toFixed(2)} </div>

                    <div><img src={logo} alt="logo" className="w-12 lg:w-16 border-2" /></div>
                    <div>The Bear Token</div>
                    <div>1 Million</div>
                    <div className="hidden lg:block">BEAR</div>
                    <div className="flex items-center justify-center gap-2"> ${((bnbExchangeRate*(newBearLp/newBearLPTokenAmount)*1000000)*0.9).toFixed(2)}{" "} <FcInfo onClick={showInfo2}/> </div>

                    <div><img src={logo} alt="logo" className="w-12 lg:w-16 border-2" /></div>
                    <div>Treasury Value</div>
                    <div className="flex items-center justify-center gap-2">{(newBearHeldByInvestors).toFixed(2).slice(0,2)} Million <FcInfo onClick={showInfo1}/> </div>
                    <div className="hidden lg:block">BEAR</div>
                    <div className="flex items-center justify-center gap-2"> ${((setTotal()/newBearHeldByInvestors)*1000000).toFixed(2)} <FcInfo onClick={showInfo} /> </div>
                </div>  
            </div>
        </div>
    </div>
    )
};

export default Services;