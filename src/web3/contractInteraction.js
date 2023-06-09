import { ethers } from "ethers";
import stakingAbi from "./abis/stakingAbi.json";
import genAbi from "./abis/genAbi.json";
import gen2Abi from "./abis/gen2Abi.json";
import tokenAbi from "./abis/tokenAbi.json";
import { toast } from "react-toastify";
import { getSignerGen, getSignerGen2 } from "./../utils/backendApi";
import axios from "axios";
let stakingContract, genContract, gen2Contract, tokenContract, address;
//mainnet
// const stakingContractAddress = "0xe71a8ddCad4a950a1bbea58a301F62B5337eCB5c"; //staking contract
// const genContractAddress = "0x9ada21A8bc6c33B49a089CFC1c24545d2a27cD81"; //gen contract
// const gen2ContractAddress = "0xEDc3AD89f7b0963fe23D714B34185713706B815b"; //gen2 contract
// const tokenContractAddress = "0x517AB044bda9629E785657DbbCae95C40C8f452C"; //token contract

const stakingContractAddress = "0x7617a1144bA5C6dd27DDB56f70C1ec7a83bc877D"; //staking contract
const genContractAddress = "0x44eaf544212EbCa6D795667375BC3434a8284FeC"; //gen contract
const gen2ContractAddress = "0x8A7339c8E02CA654b5493b09EA01cEF093Dd7E69"; //gen2 contract
const tokenContractAddress = "0xd9552b20b8AA59B89E3034166563D983e73c5473"; //token contract

export const providerHandler = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const account = await provider.listAccounts();
  address = account[0];
  const signer = provider.getSigner();

  stakingContract = new ethers.Contract(
    stakingContractAddress,
    stakingAbi,
    signer
  );
  genContract = new ethers.Contract(genContractAddress, genAbi, signer);
  gen2Contract = new ethers.Contract(gen2ContractAddress, gen2Abi, signer);
  tokenContract = new ethers.Contract(tokenContractAddress, tokenAbi, signer);
  return address;
};

//Approve Functions
export const setApprovalForAllGen = async () => {
  try {
    toast.loading("Approving....");
    const n = await genContract?.setApprovalForAll(
      stakingContractAddress,
      true
    );
    await n.wait();
    toast.dismiss();
    toast.success("Approved");
    return n;
  } catch (e) {
    toast.dismiss();
    toast.error(e.message);
    console.warn(e.message);
    return false;
  }
};
export const setApprovalForAllGen2 = async () => {
  try {
    toast.loading("Approving....");
    const n = await gen2Contract?.setApprovalForAll(
      stakingContractAddress,
      true
    );
    await n.wait();
    toast.dismiss();
    toast.success("Approved");
    return n;
  } catch (e) {
    toast.dismiss();
    toast.error(e.message);
    console.warn(e.message);
    return false;
  }
};

//Check Approved
export const isApprovalForAllGen = async () => {
  try {
    const n = await genContract?.isApprovedForAll(
      address,
      stakingContractAddress
    );
    return n;
  } catch (e) {
    console.warn(e.message);
  }
};

export const isApprovalForAllGen2 = async () => {
  try {
    const n = await gen2Contract?.isApprovedForAll(
      address,
      stakingContractAddress
    );
    return n;
  } catch (e) {
    console.warn(e.message);
  }
};

//Balance of Jira Token
export const jiraBalance = async () => {
  try {
    const n = await tokenContract?.balanceOf(address);
    const r = n.toString();
    return ethers.utils.formatEther(r);
  } catch (e) {
    console.warn(e.message);
  }
};

//Unstaked Tokens
//Gen
export const totalUnstakedTokensGen = async () => {
  const nftCount = await genContract.balanceOf(address);
  if (nftCount.toNumber() === 0) {
    return [];
  } else {
    let nft_list = [];
    for (let i = 0; i < nftCount.toNumber(); i++) {
      const n = await genContract.tokenOfOwnerByIndex(address, i);
      nft_list.push(n.toNumber());
    }
    return nft_list;
  }
};

//Gen2
export const totalUnstakedTokensGen2 = async () => {
  const nftCount = await gen2Contract.balanceOf(address);
  if (nftCount.toNumber() === 0) {
    return [];
  } else {
    let nft_list = [];
    for (let i = 0; i < nftCount.toNumber(); i++) {
      const n = await gen2Contract.tokenOfOwnerByIndex(address, i);
      nft_list.push(n.toNumber());
    }
    return nft_list;
  }
};

//claim tokens
export const claim = async () => {
  try {
    toast.loading("Claiming.....");
    const n = await stakingContract?.claim();
    await n.wait();
    toast.dismiss();
    toast.success("Claimed");
    window.location.reload(false);
    return n;
  } catch (e) {
    toast.dismiss();
    toast.error(e.message);
  }
};

//Calculate unclaimed balance
export const unclaimedBalance = async () => {
  try {
    const total=[]
    const bags = await totalBags() 
    for(let i = 0; i < bags.length; i++){
      const n = await stakingContract.getUnclaimedBalanceSinceLastChange(bags[i])
      const m = await bagsDetails(bags[i])
    const r = n.toString();
    const s= m.unclaimedBalance.toString()
    console.log(r,s,'balance') 
    total.push(Number(ethers.utils.formatEther(r)))
    total.push(Number(ethers.utils.formatEther(s)))
    }
    return total.reduce((a, b) => a + b, 0);
  } catch (e) {
    console.warn(e.message);
  }
};

//gen is initialized
export const genIsInitialised = async (tokenIds) => {
  try {
    let gen = [];
    for (let i = 0; i < tokenIds.length; i++) {
      const n = await stakingContract?.genIsInitialised(tokenIds[i]);
      if (!n) {
        gen.push(tokenIds[i]);
      }
    }
    return gen;
  } catch (e) {
    console.warn(e.message);
  }
};
//gen2 is initialized
export const gen2IsInitialised = async (tokenIds) => {
  try {
    let gen2 = [];
    for (let i = 0; i < tokenIds.length; i++) {
      const n = await stakingContract?.gen2IsInitialised(tokenIds[i]);
      if (!n) {
        gen2.push(tokenIds[i]);
      }
    }
    return gen2;
  } catch (e) {
    console.warn(e.message);
  }
};

//set genesis rarity
export const setGenesisRarity = async (tokenIds) => {
  try {
    toast.loading("Initializing Genesis.....");
    const sign_array = [];
    for (let i = 0; i < tokenIds.length; i++) {
      const n = await getSignerGen(tokenIds[i]);
      sign_array.push(n.signature);
    }
    const n = await stakingContract?.setGenesisRarity(sign_array);
    await n.wait();
    toast.dismiss();
    toast.success("Initialized");
    return n;
  } catch (e) {
    toast.dismiss();
    toast.error(e.message);
    console.warn(e.message);
    return false;
  }
};

//set gen2 rarity
export const setGen2Rarity = async (tokenIds) => {
  try {
    toast.loading("Initializing Gen 2.....");
    const sign_array = [];
    for (let i = 0; i < tokenIds.length; i++) {
      const n = await getSignerGen2(tokenIds[i]);
      sign_array.push(n.signature);
    }
    const n = await stakingContract?.setGen2Rarity(sign_array);
    await n.wait();
    toast.dismiss();
    toast.success("Initialized");
    return n;
  } catch (e) {
    toast.dismiss();
    toast.error(e.message);
    console.warn(e.message);
    return false;
  }
};

//Stake
export const stake = async (finalStake, bagStake) => {
  try {
    toast.loading("Staking...");
    const n = await stakingContract?.stake(finalStake, bagStake);
    await n.wait();
    toast.dismiss();
    toast.success("Staked");
    return n;
  } catch (e) {
    toast.dismiss();
    toast.error(e.message);
    console.warn(e.message);
  }
};
// edit and stake a bag
export const editBag = async (genToken, gen2Tokens, bagId) => {
  try {
    toast.loading("Staking...");
    const n = await stakingContract?.stake(
      [[genToken, gen2Tokens, 0, 0]],
      [bagId]
    );
    await n.wait();
    toast.dismiss();
    toast.success("Staked");
    return n;
  } catch (e) {
    toast.dismiss();
    toast.error(e.message);
    console.warn(e.message);
  }
};

//get total bags list
export const totalBags = async () => {
  const bagCount = await stakingContract?.balanceOf(address);
  if (bagCount.toNumber() === 0) {
    return [];
  } else {
    let bag_list = [];
    for (let i = 0; i < bagCount.toNumber(); i++) {
      const n = await stakingContract.tokenOfOwnerByIndex(address, i);
      bag_list.push(n.toNumber());
    }
    return bag_list;
  }
};

//get bag details
export const bagsDetails = async (bagId) => {
  try {
    const n = await stakingContract.bags(bagId);
    return n;
  } catch (e) {
    console.warn(e.message);
  }
};

//get unclaimed Balance in bags
export const getUnclaimedBalance = async (bagIds) => {
  try {
    let balance = [];
    for (let i = 0; i < bagIds.length; i++) {
      const n = await stakingContract?.getUnclaimedBalance(bagIds[i]);
      balance.push(n);
    }
    return balance;
  } catch (e) {
    console.warn(e.message);
  }
};

//unstake
export const unstake = async (
  unstakeBagList,
  unstakeGenList,
  unstakeGen2List
) => {
  try {
    toast.loading("Unstaking...");
    const n = await stakingContract.unstake(
      unstakeBagList,
      unstakeGenList,
      unstakeGen2List
    );
    await n.wait();
    toast.dismiss();
    toast.success("Unstaked");
    return n;
  } catch (e) {
    toast.dismiss();
    toast.error(e.message);
    console.warn(e.message);
  }
};

//gen2 tokens in a bag
export const gen2Tokens = async (bagId) => {
  const gen2Count = await stakingContract.getTotalGen2InBag(bagId);
  if (gen2Count.toNumber() === 0) {
    return [];
  } else {
    let gen2_list = [];
    for (let i = 0; i < gen2Count.toNumber(); i++) {
      const n = await stakingContract.getGen2InBagByIndex(bagId, i);
      gen2_list.push(n.toNumber());
    }
    return gen2_list;
  }
};

export const getGenisisRarity = async (arr, rarityFunc) => {
  const config = {
    method: "post",
    url: "https://godjirastaking.0xytocin.ml/rarity/genarray",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      tokenId: arr,
    }),
  };

  await axios(config)
    .then(({ data }) => {
      rarityFunc(data.rarity);
      return data.rarity;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getGen2Rarity = async (arr, rarityFunc) => {
  const config = {
    method: "post",
    url: "https://godjirastaking.0xytocin.ml/rarity/gen2array",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      tokenId: arr,
    }),
  };

  await axios(config)
    .then(({ data }) => {
      rarityFunc(data.rarity);
    })
    .catch((error) => {
      console.log(error);
    });
};
