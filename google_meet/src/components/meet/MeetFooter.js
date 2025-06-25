import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useLiveMeetStore } from '../../service/meetStore'
import LinearGradient from 'react-native-linear-gradient';
import { footerStyles } from '../../styles/footerStyles';
import { goBack } from '../../utils/NavigationUtils';
import MaterialIcons from '@react-native-vector-icons/material-design-icons';
const MeetFooter = ({toggleMic, toggleVideo}) => {

  const {micOn,videoOn}  = useLiveMeetStore();
  const getIconStyle = isActive =>({
    backgroundColor : isActive ? 'rgba(255, 255, 255, 0.1)' : '#fff',
    borderRadius: 50,
    padding : 12
  }) 

  const getIconColor = isActive => (isActive ? '#fff' : '#000');

  return (
    <LinearGradient
        colors={['#000000', 'rgba(0,0,0,0.7)','transparent'].reverse()}
        style={footerStyles.footerContainer}
    >
        <View style={footerStyles.iconContainer}>
            <TouchableOpacity 
            style={footerStyles.callEndButton}
             onPress={()=>goBack()}>
                <MaterialIcons name="phone-hangup" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
            style={getIconStyle(micOn)}
            onPress={()=>toggleMic()}
            >
                {micOn ? <MaterialIcons name="microphone" size={14} color={getIconColor(micOn)} /> : <MaterialIcons name="microphone-off" size={14} color={getIconColor(micOn)} />}
            </TouchableOpacity>

            <TouchableOpacity
            style={getIconStyle(videoOn)}
            onPress={()=>toggleVideo()}
            >
                {videoOn ? <MaterialIcons name="video" size={14} color={getIconColor(videoOn)} /> : <MaterialIcons name="video-off" size={14} color={getIconColor(videoOn)} />}
            </TouchableOpacity>

        </View>

    </LinearGradient>
  )
}

export default MeetFooter