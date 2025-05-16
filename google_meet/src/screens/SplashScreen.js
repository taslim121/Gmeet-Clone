import { View, Text ,StyleSheet, Image} from 'react-native'
import React, { useEffect } from 'react'
import { screenHeight, screenWidth } from '../utils/Constants'
import { resetAndNavigate } from '../utils/NavigationUtils'

const SplashScreen = () => {
    useEffect(()=>{
        const timerId = setTimeout(() => {
            resetAndNavigate('HomeScreen')
        }, 1200);
        return () => clearTimeout(timerId)
    },[])
  return (
    <View style={styles.container}>
      <Image style ={styles.image} source={require("../assets/images/g.png")}/>
    </View>
  )
}
const styles = StyleSheet.create({
  container : {
    flex:1,
    backgroundColor : "white",
    justifyContent : 'center',
    alignItems : 'center'
  },
  image : {
    width : screenWidth * 0.7,
    height : screenHeight * 0.7,
    resizeMode : 'contain'
  }
})

export default SplashScreen