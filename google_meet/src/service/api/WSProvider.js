import { createContext, useContext, useEffect,useRef } from "react"
import { io } from "socket.io-client";
import { SOCKET_URL } from "../config";


const WSContext = createContext(undefined)


export const WSProvider = ({children}) => {
    const socket = useRef();

    useEffect(()=>{
        socket.current = io(SOCKET_URL,{
            transports : ['websocket']
        });

        return ()=>{
            socket.current?.disconnect();
        }
    },[])
    
    const emit = (event,data)=>{
        socket.current?.emit(event,data);
    };
    const on = (event, callback) => {
        socket.current?.on(event, callback);
    };

    const off = (event) => {
        socket.current?.off(event);
    };

    const removeListener = (listnerName) => {
        socket.current?.removeListener(listnerName);
    };

    const disconnect = () =>{
        if(socket.current){
            socket.current.disconnect();
            socket.current = undefined;
        };
    }

    const socketService = {
        initializeScoket: ()=>{},
        emit,
        on,
        off,
        disconnect,
        removeListener
    };
    return (
        <WSContext.Provider value={socketService}>
            {children}
        </WSContext.Provider>
    );
};

export const useWS =()=>{
    const socketService = useContext(WSContext);
    if(!socketService){
        throw new Error('useWSmust be used within a WSProvider')
    }
    return socketService;
} 