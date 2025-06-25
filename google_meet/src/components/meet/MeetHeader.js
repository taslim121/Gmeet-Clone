import { View, Text, StyleSheet, Platform, SafeAreaView } from 'react-native'
import React from 'react'
import { useLiveMeetStore } from '../../service/meetStore'
import LinearGradient from 'react-native-linear-gradient';
import { addHyphens } from '../../utils/Helpers';
import MaterialIcons from '@react-native-vector-icons/material-design-icons';
const MeetHeader = ({switchCamera}) => {
    const {sessionId} = useLiveMeetStore();
  
    return (
    <LinearGradient
        colors={['#000', 'rgba(0,0,0,0.7)','transparent']}
        style={styles.container}
    >
        <SafeAreaView/>
        <View style={styles.header}>
            <Text style={styles.meetCode}>{addHyphens(sessionId)}</Text>
            <View style={styles.icons}>
                <MaterialIcons name="camera-flip-outline" size={24} color="#fff" onPress={switchCamera} />
                <MaterialIcons name="volume-high" size={24} color="#fff" style={styles.iconSpacing}/>    
            </View>
        </View>
    </LinearGradient>
  )
}
const styles = StyleSheet.create({
    container:{
        width:'100%',
    },
    header:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal: 16,
        paddingBottom:30,
        paddingTop: Platform.OS === 'android' ? 10 : 0,
    },
    meetCode:{
        color : '#fff',
        fontSize:18,
        fontWeight:"500"
    },
    icons:{
        flexDirection:'row',
        alignItems:'center',
    },
    iconSpacing:{
        marginLeft:20
    }

})

export default MeetHeader