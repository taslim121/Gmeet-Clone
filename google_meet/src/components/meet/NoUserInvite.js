import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useLiveMeetStore } from '../../service/meetStore'
import { inviteStyles } from '../../styles/inviteStyles';
import { addHyphens } from '../../utils/Helpers';
import MaterialIcons from '@react-native-vector-icons/material-design-icons';
const NoUserInvite = () => {
    const {sessionId} = useLiveMeetStore();

  return (
    <View style={inviteStyles.container}>
      <Text style={inviteStyles.headerText}>You're the only one here</Text>
      <Text style={inviteStyles.subText}>Invite others to join the meeting</Text>
      <View style={inviteStyles.linkContainer}>
        <Text style={inviteStyles.linkText}>meet.google.com/{addHyphens(sessionId)}</Text>
      </View>
      <TouchableOpacity style={inviteStyles.shareButton}>
        <MaterialIcons name="export-variant" size={20} color="#000" />
        <Text style={inviteStyles.shareText}>Share Invite</Text>
      </TouchableOpacity>
    </View>
    
  )
}

export default NoUserInvite