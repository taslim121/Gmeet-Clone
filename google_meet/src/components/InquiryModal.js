import 'react-native-get-random-values';
import { View, Text,Alert, Modal, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, TextInput,ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState  } from 'react'
import { useUserStore } from '../service/userStore'
import { inquiryStyles } from '../styles/inquiryStyles'
import {v4 as uuidv4} from 'uuid';



const InquiryModal = ({visible,onClose}) => {
    const {setUser,user} = useUserStore();
    const [name,setName] = useState("");
    const [profilePhotoUrl,setProfilePhotoUrl] = useState("");


    useEffect(()=>{
        if(visible){
            setName(user?.name || "");
            setProfilePhotoUrl(user?.photo || "");
        }
    },[visible]);

    const handleSave = () => {
        if(name && profilePhotoUrl){
            setUser({
                id:uuidv4(),
                name,
                photo:profilePhotoUrl
            });
            onClose();
        }else{
            Alert.alert("Please enter all fields");
        }
    }
  return (
    <Modal 
     visible={visible} 
     animationType="slide"
     transparent={true}
     onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={inquiryStyles.modalContainer}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={inquiryStyles.keyboardAvoidingView}>
                <ScrollView contentContainerStyle={inquiryStyles.scrollViewContent} >
                    <View style={inquiryStyles.modalContent}>
                        <Text style={inquiryStyles.title}>
                         Enter your Details
                        </Text>
                        <TextInput
                            style={inquiryStyles.input}
                            placeholder='Enter your name'
                            value={name}
                            placeholderTextColor={"#ccc"}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={inquiryStyles.input}
                            placeholder='Enter your Profile Url'
                            value={profilePhotoUrl}
                            placeholderTextColor={"#ccc"}
                            onChangeText={setProfilePhotoUrl}
                        />

                        <View style={inquiryStyles.buttonContainer}>
                            <TouchableOpacity style={inquiryStyles.button} onPress={handleSave}>
                                <Text style={inquiryStyles.buttonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[inquiryStyles.button,inquiryStyles.cancelButton]} onPress={onClose}>
                                <Text style={inquiryStyles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>

            </KeyboardAvoidingView>
        </View>
        </TouchableWithoutFeedback>
    </Modal>
  )
}

export default InquiryModal