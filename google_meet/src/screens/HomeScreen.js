import { View, Text,StyleSheet, TouchableOpacity, Alert, FlatList, Image } from 'react-native'
import React from 'react'
import { homeStyles } from '../styles/homeStyles'
import HomeHeader from '../components/HomeHeader'
import { navigate } from '../utils/NavigationUtils'
import { useUserStore } from '../service/userStore'
import { useWS } from '../service/api/WSProvider'
import { useLiveMeetStore } from '../service/meetStore'
import { addHyphens, removeHyphens } from '../utils/Helpers'
import { checkSession } from '../service/api/session'

const HomeScreen = () => {
  const {user,sessions,addSession,removeSession} = useUserStore();
  //const {addSessionId,removeSessionId} = useLiveMeetStore();
  const {emit} = useWS();
  const handleNaviagte=()=>{
          const storedName = user?.name;
              if(!storedName){
                  Alert.alert("Please enter your name");
                  return;
              }
          navigate('JoinMeetScreen');    
      }
  
  const joinViaSessionId = async(sessionId) => {
     const storedName = user?.name;
              if(!storedName){
                  Alert.alert("Please enter your name");
                  return;
              }
      const isAvailable = await checkSession(id);
      if(isAvailable){
        emit("prepare-session",{
          userId : user?.id,
          sessionId:removeHyphens(id)
        });
        addSession(id);
        navigate("PrepareMeetScreen",{id});
      }else{
        removeSession(id);
        //removeSessionId(id);
        Alert.alert("There is no meet found");

      }
    
    }
  const renderSessions = ({item})=>{
  return(
    <View style={homeStyles.sessionContainer}>
      <Text>📅</Text>
      <View style={homeStyles.sessionTextContainer}>
        <Text style={homeStyles.sessionTitle}>
          {addHyphens(item)}
        </Text>
        <Text style={homeStyles.sessionTime}>Join and Enjoy the party!</Text>
      </View>
      <TouchableOpacity style={homeStyles.joinButton}
      onPress={()=>joinViaSessionId(item)} 
      >
      <Text style={homeStyles.joinButtonText}>Join</Text>

      </TouchableOpacity>
    </View>
  )
  
  }
  return (
    <View style={homeStyles.container}>
      <HomeHeader/>
      <FlatList
      data={sessions}
      renderItem={renderSessions}
      key={(item)=>item}
      contentContainerStyle={{padding:20}}
      ListEmptyComponent={
        <View>
          <Image 
            source={require('../assets/images/bg.png')} style={homeStyles.img}/>
          <Text style={homeStyles.title}>
            Video Calls and Meetings For Everyone 
          </Text>
          <Text style={homeStyles.subTitle}>
            Connect Collaborate and celebrate from anywhere with Google Meet
          </Text>
        </View>
      }
      />

      <TouchableOpacity
      style={homeStyles.absoluteButton}
      onPress={handleNaviagte}
      >
        <Text style={{fontSize:20}}>📷</Text>
        <Text style={homeStyles.buttonText}>Join Meet</Text>

      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen