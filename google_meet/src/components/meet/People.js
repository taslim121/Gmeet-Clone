import { View, Text, Image } from 'react-native'
import React from 'react'
import { peopleStyles } from '../../styles/peopleStyles';
import { RTCView } from 'react-native-webrtc';
import MaterialIcons from '@react-native-vector-icons/material-design-icons';

const People = ({people,containerDimensions}) => {

  const maxVisibleUsers = 8;
  const visiblePeople = people?.slice(0, maxVisibleUsers); 
  const othersCount = people?.length > maxVisibleUsers ? people?.length - maxVisibleUsers : 0;

  const gridStyle = containerDimensions ?
      getGridStyle(
        visiblePeople?.length,
        containerDimensions.width,
        containerDimensions.height
      ):{}

  
  return (
    <View style={peopleStyles.container}>
      {visiblePeople.map((person, index) => {
        return (
          <View key={index} style={[
            peopleStyles.card,
            person?.speaking 
            ? {borderWidth : 3} : null,
            Array.isArray(gridStyle) ? gridStyle[index] : gridStyle
          ]}>
            {person?.videoOn && person?.streamURL?.toURL()?(
              <RTCView
              mirror
              objectFit='cover'
              streamURL={person?.streamURL?.toURL()}
              style={peopleStyles.rtcVideo}
              />
            ):(
              <View style={peopleStyles.noVideo}>
                {person?.photo?(
                  <Image
                    source={{ uri: person?.photo }}
                    style={peopleStyles.image}
                  />
                ):(
                  <Text style={peopleStyles.initial}>{person?.name.charAt(0)}</Text>
                )}
              </View>
            )}

            <Text style={peopleStyles.name}>{person?.name}</Text>
            {!person?.micOn && (
              <View style={peopleStyles.muted}>
                <MaterialIcons name="microphone-off" size={10} color="#fff" />
              </View>
            )}
          </View>
        );
      })}
    </View>
  )
}

export default People

const getGridStyle = (count, containerWidth, containerHeight) => {
  if (!containerWidth || !containerHeight) return {};

  switch(count){
    case 1:
      return {
        width: '82%',
        height: '98%',
      };
    case 2:
      return {
        width: '82%',
        height: '48%',
      };
    case 3:
      return [
        {width: '82%', height: containerHeight * 0.5},
        {width: '40%', height: containerHeight * 0.46},
        {width: '40%', height: containerHeight * 0.46},
      ]
    case 4:
      return {
        width: '82%',
        height: containerHeight * 0.46,
      };
    case 5:
    case 6:
      return{
        width : containerWidth / 2 - 40,
        height: containerHeight / 3 - 15,
      };
    default:{
      const maxCols =2 ;
      const maxRows = 4;

      const itemWidth = containerWidth / maxCols - 40;
      const itemHeight = containerHeight / maxRows - 10;

      return {
        width: itemWidth,
        height: itemHeight,
      };
    }
  }
};