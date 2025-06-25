import { View, Text, StyleSheet, Animated, PanResponder, Image } from 'react-native'
import React, { useRef } from 'react'
import { useUserStore } from '../../service/userStore';
import { useLiveMeetStore } from '../../service/meetStore';
import { RTCView } from 'react-native-webrtc';
import MaterialIcons from '@react-native-vector-icons/material-design-icons';

const UserView = ({containerDimensions, localStream}) => {

    const { width : containerWidth, height : containerHeight } = containerDimensions;

    const { videoOn } = useLiveMeetStore();
    const { user } = useUserStore();
    const pan = useRef(new Animated.ValueXY({
        x:containerWidth-containerWidth*0.24-10,
        y:containerHeight-containerHeight*0.24-10
    })).current;

    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant:()=>{
            pan.setOffset({
                x: pan.x._value,
                y: pan.y._value
            });
            pan.setValue({x: 0, y: 0});
        },
        onPanResponderMove: Animated.event([
            null,
            { dx: pan.x, dy: pan.y }
        ], { useNativeDriver: false }),

        onPanResponderRelease: (e, gestureState) => {
          pan.flattenOffset();

          // Calculate the new position
          let newX = pan.x._value;
          let newY = pan.y._value;

          // Define the four corners
          const corners = {
            topLeft: { x: 10, y: 10 },
            topRight: { x: containerWidth - containerWidth * 0.24 - 10, y: 10 },
            bottomLeft: { x: 10, y: containerHeight - containerHeight * 0.22 - 10 },
            bottomRight: { x: containerWidth - containerWidth * 0.24 - 10, y: containerHeight - containerHeight * 0.22 - 10 }
          };

          // Find the closest corner
          const distances = Object.entries(corners).map(([key, pos]) => ({
            key,
            dist: Math.hypot(newX - pos.x, newY - pos.y),
            ...pos
          }));
          const closest = distances.reduce((a, b) => (a.dist < b.dist ? a : b));

          // Snap to the closest corner
          Animated.spring(pan, {
            toValue: { x: closest.x, y: closest.y },
            useNativeDriver: false
          }).start();
        }
      })
    ).current;

  return (
    <Animated.View
     {...panResponder.panHandlers} 
     style={
        [styles.container,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y }
          ]
        }
        ]}>
        {user && (
            <>
                {localStream && videoOn ? (
                    <RTCView
                     streamURL={localStream?.toURL()}
                     style={styles.localVideo}
                     mirror
                     zOrder={2}
                     objectFit='cover'
                    />
                ):(
                    <>
                        {user?.photo ?(
                            <Image
                                source={{ uri: user?.photo }}
                                style={styles.image}
                            />
                        ):(
                            <View style={styles.noVideo}>
                                <Text style={styles.initial}>{user?.name?.charAt(0)}</Text>
                            </View>
                        )}
                    </>
                )}
            </>
        )}

        <Text style={styles.name}>You</Text>
        <View style={styles.ellipse}>
            <MaterialIcons name="dots-vertical" size={14} color="#fff" />
        </View>
    </Animated.View>
  )
}
const styles = StyleSheet.create({
  container: {
    height: '22%',
    width: '24%',
    zIndex: 99,
    elevation: 10,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'absolute',
    backgroundColor: '#202020',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    shadowColor: '#000'
  },
  ellipse:{
    position:"absolute",
    bottom: 5,
    right: 2,
  },
  image:{
    width:40,
    height:40,
    borderRadius: 40,
  },
  noVideo:{
    backgroundColor: '#FF5100',
    justifyContent: 'center',
    alignItems: 'center',
    width:40,
    height:40,
    borderRadius: 40,
  },
  localVideo:{
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.5)'
    },
    initial:{
        fontSize: 14,
        color: '#fff'
    },
    name:{
        position: 'absolute',
        bottom: 5,
        left: 5,
        fontSize: 10,
        color: '#fff',
        fontWeight: '600',
        zIndex: 99
    }


})

export default UserView