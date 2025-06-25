import { View, Text,TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native'
import React,{useState,useEffect} from 'react'
import { RTCView,mediaDevices } from 'react-native-webrtc';
import { prepareStyles } from '../styles/prepareStyles';
import { useUserStore } from '../service/userStore';
import { useWS } from '../service/api/WSProvider'
import { useLiveMeetStore } from '../service/meetStore';
import { addHyphens,requestPermissions } from '../utils/Helpers';
import { replace,goBack } from '../utils/NavigationUtils';
import { Colors } from '../utils/Constants';
import MaterialIcons from '@react-native-vector-icons/material-design-icons';

const PrepareMeetScreen = () => {
  const {emit,on,off} =useWS();
  const{addSessionId,addParticipant,sessionId,toggle,micOn,videoOn}=useLiveMeetStore();
  const{user} =useUserStore();

  const [localStream, setLocalStream] = useState(null);
  const [participants, setParticipants] = useState([]);
  useEffect(() => {

    const handleParticipantsUpdate = (updatedParticipants) => {
      setParticipants(updatedParticipants?.participants);
      updatedParticipants?.participants?.forEach(i => addParticipant(i));
    };
    on('session-info', handleParticipantsUpdate);
    

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream?.release();
      }
      setLocalStream(null);
      off('session-info', handleParticipantsUpdate);
    };
  }, [sessionId, off, on, emit]);


  const showMediaDevices= (audio,video) =>{
    mediaDevices
    ?.getUserMedia({
      audio: audio,
      video: video
    }).then(stream => {
      setLocalStream(stream);
      const audioTracks = stream.getAudioTracks()[0];
      const videoTracks = stream.getVideoTracks()[0];
      if (audioTracks) {
        audioTracks.enabled = audio;
      }
      if (videoTracks) {
        videoTracks.enabled = video;
      }
    }).catch(error => {
      console.error('Error accessing media devices.', error);
    });
  }


  const toggleMicState = (newState) => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks()[0];
      if (audioTracks){
        audioTracks.enabled = newState;
      };
    }
  };

  const toggleVideoState = (newState) => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks()[0];
      if (videoTracks) {
        videoTracks.enabled = newState;
      }
    }
  };

  const toggleLocal = (type) => {
    if (type === 'mic') {
      toggleMicState(!micOn);
      toggle('mic')
    } else if (type === 'video') {
      toggleVideoState(!videoOn);
      toggle('video');
    }
  };

  const fetchMediaPermissions = async () => {
    const result = await requestPermissions();
    if(result.isCameraGranted){
      toggleLocal('video');
    }
    if(result.isMicrophoneGranted){
      toggleLocal('mic');
    }

    showMediaDevices(result.isMicrophoneGranted, result.isCameraGranted);
  };

  useEffect(() => {
    fetchMediaPermissions();
  }, []);


  const handleStartCall = async()=>{
    try {
      emit("join-session",{
        name: user?.name,
        photo : user?.photo,
        userId : user?.id,
        sessionId,
        micOn,
        videoOn
      })

      participants.forEach(i=>addParticipant(i))
      addSessionId(sessionId);
      replace('LiveMeetScreen');
    } catch (error) {
      console.error('Error starting call:', error);
    }
  }

  const renderParticipantText = () =>{
    if(participants.length === 0){
      return 'No participants yet';
    }
    const names = participants
    ?.slice(0,2)
    ?.map(p => p.name)
    ?.join(', ');
    const count = participants.length ;
    return `${names}${count > 2 ? ` and ${count - 2} more` : ''} in the call`;
  };
  return (
    <View style={prepareStyles.container}>
      <SafeAreaView/>
      <View style={prepareStyles.headerContainer}>
        <TouchableOpacity onPress={()=>{
          goBack();
          addSessionId(null);
        }}>
          <Text style={{color : Colors.text,fontSize : 18}}>←</Text>
        </TouchableOpacity>
        <Text style={{color : Colors.text,fontSize : 18}}>
            Ξ
        </Text>
      </View>
      <ScrollView contentContainerStyle={{flex:1}}>
        <View style={prepareStyles.videoContainer}>
          <Text style={prepareStyles.meetingCode}>
            {addHyphens(sessionId)}
          </Text>
          <View style={prepareStyles.camera}>
               {localStream && videoOn ? (
                <RTCView
                  streamURL={localStream?.toURL()}
                  style={prepareStyles?.localVideo}
                  mirror={true}
                  objectFit="cover"
                />
               ):(
                <Image source={{uri:user?.photo}} style={prepareStyles?.image}/>
               )}

               <View style={prepareStyles.toggleContainer}>
                  <TouchableOpacity onPress={() => toggleLocal('mic')}
                    style={prepareStyles.iconButton}>
                    <Text>
                      {micOn ? <MaterialIcons name="microphone" size={24} color="#fff" /> : <MaterialIcons name='microphone-off' size={24} color={"#fff"}/>}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => toggleLocal('video')} style={prepareStyles.iconButton}>
                    <Text>
                      {videoOn ? <MaterialIcons name="video" size={24} color="#fff" /> : <MaterialIcons name="video-off" size={24} color="#fff" />}
                    </Text>
                  </TouchableOpacity>
                
               </View>
          </View>
          <Text style={prepareStyles.peopleText}>
                {renderParticipantText()}
          </Text>
        </View>
      </ScrollView>
      <View style={prepareStyles.joinContainer}>
              <TouchableOpacity
                onPress={handleStartCall}
                style={prepareStyles.joinButton}
              >
                <Text style={prepareStyles.joinButtonText}>Join</Text>
              </TouchableOpacity>
              <Text style={prepareStyles.noteText}>Joining</Text>
              <Text style={prepareStyles.peopleText}>{user?.name}</Text>
      </View>
    </View>
  )
} 

export default PrepareMeetScreen