import React,{useEffect,useRef,useState} from "react";
import { RTCPeerConnection,RTCSessionDescription,RTCIceCandidate,mediaDevices,MediaStream } from "react-native-webrtc";
import { useWS } from "../service/api/WSProvider";
import { useLiveMeetStore } from "../service/meetStore";
import { useUserStore } from "../service/userStore";
import { peerConstraints } from "../utils/Helpers";

export const useWebRTC = () => {
    const { user } = useUserStore();
    const {
         participants,
         setStreamURL,sessionId,
         addSessionId,
         addParticipant,
         micOn,
         clear,
         videoOn,
         toggle,
         removeParticipant,
         updateParticipant,
        } = useLiveMeetStore();

    const [localStream, setLocalStream] = useState(null);
    const {emit,on,off} = useWS();
    const peerConnections = useRef(new Map());
    const pendingCandidates = useRef(new Map());

    const startLocalStream = async () => {
        try {
            const mediaStream = await mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setLocalStream(mediaStream);
        } catch (error) {
            console.error("Error starting local stream:", error);
        }
    };
    const establishPeerConnections = async () => {
        participants?.forEach(async streamUser  => {
            if (!peerConnections.current.has(streamUser?.userId)) {
                const pc = new RTCPeerConnection(peerConstraints);
                peerConnections.current.set(streamUser?.userId, pc);

                pc.ontrack = event => {
                    const remoteStream = new MediaStream();
                    event.streams[0].getTracks().forEach(track => {remoteStream.addTrack(track)});

                    console.log("Received remote stream:", remoteStream.toURL());
                    setStreamURL(streamUser?.userId,remoteStream);
                };
                pc.onicecandidate = ({candidate}) => {
                    if (candidate) {
                        emit("send-ice-candidate", {
                            sessionId,
                            sender: user?.id,
                            receiver: streamUser?.userId,
                            candidate,   
                        });
                    }
                };

                localStream?.getTracks().forEach(track =>{
                    pc.addTrack(track,localStream);
                });

                try {
                    const OfferDespcription = await pc.createOffer();
                    await pc.setLocalDescription(OfferDespcription);
                    emit('send-offer',{
                        sessionId,
                        sender : user?.id,
                        receiver : streamUser?.userId,
                        offer: OfferDespcription
                    })
                } catch (error) {
                    console.error('Error creating or sending offer',error)
                }
            }
        });
    };
    const joiningStream = async () => {
        await establishPeerConnections();
    };

    useEffect(() => {
        if(localStream){
        joiningStream();
        }
    }, [localStream]);

    useEffect(() => {
        startLocalStream();
        if(localStream){
            return () => {
            localStream?.getTracks()?.forEach(track => track.stop());
        };
        }
    }, []);

    useEffect(()=>{
        if(localStream){
            on('receive-ice-candidate',handleReceiveIceCandidate)
            on('receive-offer',handleReceiveOffer)
            on('receive-answer',handleReceiveAnswer)
            on('new-participant',handleNewParticipant)
            on('participant-left',handleParticipantLeft)
            on('participant-update',handleParticipantUpdate)

            return () => {
                localStream?.getTracks()?.forEach(track => track.stop());
                peerConnections.current.forEach(pc => pc.close());
                pendingCandidates.current.clear();
                addSessionId(null);
                clear();
                emit('hang-up');
                off('receive-ice-candidate')
                off('receive-offer')
                off('receive-answer')
                off('new-participant')
                off('participant-left')
                off('participant-update')
            };
        }
    }, [localStream]);

    const handleNewParticipant = (participant) => {
        if(participant?.userId === user?.id) return;
        addParticipant(participant);
    };

    const handleReceiveOffer = async ({sender,receiver,offer})=>{
        if(receiver !== user?.id) return;

        try {
            let pc = peerConnections.current.get(sender)
            if(!pc){
                pc = new RTCPeerConnection(peerConstraints);
                peerConnections.current.set(sender, pc);

                pc.ontrack = event =>{
                    const remoteStream = new MediaStream();
                    event.streams[0].getTracks().forEach(track => {
                        remoteStream.addTrack(track);
                        console.log("Received remote track:", remoteStream.toURL());
                    });
                    setStreamURL(sender, remoteStream);
                };

                pc.onicecandidate = ({candidate}) => {
                    if (candidate) {
                        emit("send-ice-candidate", {
                            sessionId,
                            sender: receiver,
                            receiver: sender,
                            candidate,
                        });
                    } 
                };

                if(pendingCandidates.current.has(sender)) {
                    const candidates = pendingCandidates.current.get(sender);
                    candidates.forEach(candidate => {
                        pc.addIceCandidate(new RTCIceCandidate(candidate));
                    });
                    pendingCandidates.current.delete(sender);
                }

                if(localStream){
                    localStream.getTracks().forEach(track => {
                        pc.addTrack(track, localStream);
                    });
                }
            }
            //----------
           
                    await pc.setRemoteDescription(
                        new RTCSessionDescription(offer)
                    );
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    emit("send-answer", {
                        sessionId,
                        sender: receiver,
                        receiver: sender,
                        answer
                    });
        


        } catch (error) {
            console.error('Error handling offer:', error);
        }
    }

    const handleReceiveAnswer = async ({sender,receiver,answer})=>{
        if(receiver !== user?.id) return;

        try {
            const pc = peerConnections.current.get(sender)
            if(pc){
                await pc.setRemoteDescription(
                    new RTCSessionDescription(answer));
            }
        } catch (error) {
            console.error('Error handling answer:', error);
        }
    }
    const handleReceiveIceCandidate = async ({sender,receiver,candidate})=>{
        if(receiver !== user?.id) return;

            const pc = peerConnections.current.get(sender)
            if(pc){
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }else{
                if(!pendingCandidates.current.has(sender)){
                    pendingCandidates.current?.set(sender, []);
                }
                pendingCandidates.current.get(sender).push(candidate);
            }
    };
    const handleParticipantLeft = (userId) => {
        if(userId === user?.id) return;
        removeParticipant(userId);
        const pc = peerConnections.current.get(userId);
        if (pc) {
            pc.close();
            peerConnections.current.delete(userId);
        }
    };

    const handleParticipantUpdate = (updatedParticipants) => {
        updateParticipant(updatedParticipants);
    };

    const toggleMic = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                micOn ? track.enabled = false : track.enabled = true;
            });
        }
        toggle('mic');
        emit('toggle-mute', { sessionId, userId:user?.id});
    };
    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                videoOn ? track.enabled = false : track.enabled = true;
            });
        }
        toggle('video');
        emit('toggle-video', { sessionId, userId:user?.id});
    };

    const switchCamera = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track._switchCamera();
            });
        }
        emit('switch-camera', { sessionId, userId:user?.id});
    };

    return {
        localStream,
        participants,
        toggleMic,
        toggleVideo,
        switchCamera
    };
}; 