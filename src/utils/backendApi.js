const axios = require('axios');

const BACKEND_URL = "https://godjira-staking-backend.herokuapp.com/"

export const getSignerGen = async (tokenId)=>{
    try{
        const {data} = await axios.post(BACKEND_URL+'signer/gen/',{tokenId:tokenId});
        return data
    }catch(err){
        console.error(err.message)
        return false
    } 
}

export const getSignerGen2 = async (tokenId)=>{
    try{
        console.log(tokenId,'gen2IntiatetokenId')
        const {data} = await axios.post(BACKEND_URL+'signer/gen2/',{tokenId:tokenId});
        return data
    }catch(err){
        console.error(err.message)
        return false
    } 
}

export const getRarityGen = async(tokenId) => {
    try{
        const {data} = await axios.post(BACKEND_URL+'rarity/gen/',{tokenId:tokenId});
        return data
    }catch(err){
        console.error(err.message)
        return false
    } 
}

export const getRarityGen2 = async(tokenId) => {
    try{
        const {data} = await axios.post(BACKEND_URL+'rarity/gen2/',{tokenId:tokenId});
        return data
    }catch(err){
        console.error(err.message)
        return false
    } 
}

