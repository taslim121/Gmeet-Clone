import { View, Text, SafeAreaView,TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { joinStyles } from '../styles/joinStyles'
import { navigate,goBack } from '../utils/NavigationUtils'
import { checkSession,createSession } from '../service/api/session'
import { useWS } from '../service/api/WSProvider'
import { removeHyphens } from '../utils/Helpers'
import { useUserStore } from '../service/userStore'
import { useLiveMeetStore } from '../service/meetStore'
import { Colors } from '../utils/Constants'
import LinearGradient from 'react-native-linear-gradient'


const JoinMeetScreen = () => {

  const [code, setCode] = useState('');
  const {emit} = useWS();
  const {addSessionId,removeSessionId} = useLiveMeetStore();
  const {user,addSession,removeSession} = useUserStore();

  const createNewMeet=async()=>{

    const sessionId = await createSession();
    if(sessionId){
      addSession(sessionId);
      addSessionId(sessionId);
      emit('prepare-session', { userId:user?.id,sessionId });
      navigate('PrepareMeetScreen')
    }
  }

  const joinViaSessionId = async () => {
    const isAvailable = await checkSession(removeHyphens(code));

    if (isAvailable) {
      emit('prepare-session', { userId: user?.id, sessionId: removeHyphens(code) });
      addSession(code);
      addSessionId(code);
      navigate('PrepareMeetScreen');
    } else {
      // Handle invalid session ID
      removeSession(code);
      removeSessionId(code);
      setCode('');
      Alert.alert('No Meeting Found');
    }
  };
  return (
    <View style={joinStyles.container}>
      <SafeAreaView/>
      <View style={joinStyles.headerContainer}>
        <TouchableOpacity onPress={()=>goBack()}>
          <Text style={{color : Colors.text,fontSize : 18}}>←</Text>
        </TouchableOpacity>
        <Text style={joinStyles.headerText}>
          Join Meet
        </Text>
        <Text style={{color : Colors.text,fontSize : 18}}>
          Ξ
        </Text>
      </View>

      <LinearGradient
        colors={['#007AFF','#A6C8FF']}
        style={joinStyles.gradientButton}
        start={{x:0,y:0}}
        end={{x:1,y:1}}
      >
        <TouchableOpacity
        style={joinStyles.button}
        activeOpacity={0.7}
        onPress={createNewMeet}
        >
           <Text style={{fontSize:20}}>📷</Text>
           <Text style={joinStyles.buttonText}>Create New Meet</Text>
        </TouchableOpacity>
      </LinearGradient>

      <Text style={joinStyles.orText}>
        OR
      </Text>
      <View style={joinStyles.inputContainer}>
        <Text style={joinStyles.labelText}>
          Enter the code provided by Meeting organiser
        </Text>
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Example: abcd-mnop-xyz"
          placeholderTextColor={'#888'}
          returnKeyLabel='Join'
          returnKeyType='join'
          onSubmitEditing={()=>joinViaSessionId()}
          style={joinStyles.inputBox}
        />
        <Text style={joinStyles.noteText}>
          Note: This Meeting is secure with cloud End to End encryption
        </Text>
      </View>
    </View>
  )
}

export default JoinMeetScreen