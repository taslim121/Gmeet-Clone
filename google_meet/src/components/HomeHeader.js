import { View, Text,SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { headerStyles } from '../styles/headerStyles'
import { useUserStore } from '../service/userStore'
import InquiryModal from './InquiryModal'
import { navigate } from '../utils/NavigationUtils'
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
       <Text style={{fontSize:20}}>🍔</Text>
        <TouchableOpacity onPress={handleNaviagte} style={headerStyles.textContainer}>
            <Text style={headerStyles.placeholderText}>Enter meeting Code</Text>
          </TouchableOpacity> 
        <TouchableOpacity onPress={()=>setVisible(true)}>
            <Text style={{fontSize:20}}>👤</Text>
        </TouchableOpacity> 
      </View>
      <InquiryModal onClose={()=>setVisible(false)} visible={visible}/>
    </View>
  )
}

export default HomeHeader