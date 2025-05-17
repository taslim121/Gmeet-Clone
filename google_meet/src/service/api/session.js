import axios from 'axios'
import { BASE_URL } from "../config"
import { Alert } from "react-native";
export const createSession = async()=>{
    try {
        const apiRes = await axios.post(`${BASE_URL}/create-session`);
        return apiRes?.data?.sessionId
    } catch (error) {
        console.log("SESSION CREATE ERROR",error)
        Alert.alert("There was an Error")
        return null
    }
}

export const checkSession = async(id)=>{
    try {
        const apiRes = await axios.get(`${BASE_URL}/is-alive?sessionId=${id}`);
        return apiRes?.data?.isAlive
    } catch (error) {
        console.log("SESSION CHECK ERROR",error)
        Alert.alert("There was an Error")
        return false
    }
}

