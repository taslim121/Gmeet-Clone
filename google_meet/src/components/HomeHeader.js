import { View, Text,SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { headerStyles } from '../styles/headerStyles'
import { useUserStore } from '../service/userStore'
import InquiryModal from './InquiryModal'
import { navigate } from '../utils/NavigationUtils'
import MaterialIcons from '@react-native-vector-icons/material-design-icons';

const HomeHeader = () => {
    const [visible,setVisible] = useState(true);
    const {user} = useUserStore();
    useEffect(()=>{
        const checkUserName = () =>{
            const storedName = user?.name;
            if(!storedName){
                setVisible(true);
            }
        checkUserName();
    }
    },[]);


    const handleNaviagte=()=>{
        const storedName = user?.name;
            if(!storedName){
                setVisible(true);
                return;
            }
        navigate('JoinMeetScreen');    
    }
  return (
    <View>
      <SafeAreaView/>
      <View style={headerStyles.container}>
       <MaterialIcons name="home" size={20} color="#000" />
        <TouchableOpacity onPress={handleNaviagte} style={headerStyles.textContainer}>
            <Text style={headerStyles.placeholderText}>Enter meeting Code</Text>
          </TouchableOpacity> 
        <TouchableOpacity onPress={()=>setVisible(true)}>
            <MaterialIcons name="account" size={20} color="#000" />
        </TouchableOpacity> 
      </View>
      <InquiryModal onClose={()=>setVisible(false)} visible={visible}/>
    </View>
  )
}

export default HomeHeader