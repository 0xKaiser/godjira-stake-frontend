import { Contract, Provider } from 'ethers-multicall';
import { ethers } from 'ethers';

import gen2Abi from "./abis/gen2Abi.json"
const gen2address = '0xEDc3AD89f7b0963fe23D714B34185713706B815b';

let address
export async function gen2call() {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const ethcallProvider = new Provider(provider);
  const account = await provider.listAccounts();
  address = account[0];
  await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor

  const gen2contract = new Contract(gen2address, gen2Abi);

  let call_array = []
  for(let i = 0; i <3333; i++) {
    const call = gen2contract.ownerOf(i);
    call_array.push(call)
  }

  const rec_call = await ethcallProvider.all(call_array);
  console.log(rec_call)
  let nft_array =[]
  for(let i = 0; i <3333; i++) {
    if(rec_call[i]===address){
        nft_array.push(i)
    }
    
  }
  if(nft_array.length===0){
      return []
  }
  else{
    return nft_array

  }
}