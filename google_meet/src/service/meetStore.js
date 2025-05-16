import { create } from "zustand";
import { persist,createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "./storage";

export const useLiveMeetStore = create()(
        (set,get) =>({
            sessionId:null,
            participants:[],
            chatMessages:[],
            micOn : false,
            videoOn : false,
            addSessionId : id=>{
                set({sessionId : id})
            },

            removeSessionId : () =>{
                set({sessionId : null})
            },

            addParticipant : participant =>{
                const {participants} = get()
                if (!participants.find(p => p.userId === participant?.userId)){
                    set({participants : [...participants,participant]})
                }
            },

            removeParticipant : participantId =>{
                const {participants} = get()
                set({
                    participants : participants.filter(p => p.userId = participantId),
                })
            },

            upadateParticipant: upadatedParticipant =>{
                 const {participants} = get()
                 set({
                    participants : participants.map(p =>
                        p.userId === upadatedParticipant.userId
                        ? {
                            ...p,
                            micOn : upadatedParticipant.micOn,
                            videoOn : upadatedParticipant.videoOn,
                        }
                        : p,
                    ),
                 });
            },

            setStreamURL : (participantId,streamURL) =>{
                 const {participants} = get()
                 const upadatedParticipants = participants.map(p=>{
                    if(p.userId === participantId){
                        return {...p,streamURL};
                    }
                    return p;
                 });

                //  if(!participants.some(p=>p.userId === participantId)){
                //     upadatedParticipants.push({id: participantId,streamURL});
                //  }

                 set({participants : upadatedParticipants});
            },

            toggle : type =>{
                if (type === 'mic'){
                    set(state =>({micOn : !state.micOn}))
                } else if (type === 'video'){
                    set(state => ({videoOn : !state.videoOn}))
                }
            }
            
        }),
        {
            name : "Live-meet-storage",
            storage : createJSONStorage(()=>mmkvStorage())
        }
)