import React, {useState} from 'react';
import {Animated, Dimensions, View} from 'react-native';
import {PinchGestureHandler, State} from 'react-native-gesture-handler';
import {hp, wp} from '../constants';

const PinchableBox = ({imageUri}) => {
  const [scale] = useState(new Animated.Value(1));

  const onPinchEvent = Animated.event(
    [
      {
        nativeEvent: {scale: scale},
      },
    ],
    {
      useNativeDriver: true,
    },
  );

  const onPinchStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View>
      <PinchGestureHandler
        onGestureEvent={onPinchEvent}
        onHandlerStateChange={onPinchStateChange}>
        <Animated.Image
          source={{uri: imageUri}}
          style={{
            width: wp(99),
            height: hp(43.5),
            alignSelf: 'center',
            transform: [{scale: scale}],
          }}
        />
      </PinchGestureHandler>
    </View>
  );
};

export default PinchableBox;
