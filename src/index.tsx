import React, { useRef } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import type {
  PanResponderInstance,
  PanResponderGestureState,
  ImageSourcePropType,
} from 'react-native';

interface AnimatedButtonProps {
  primaryTitleRequired?: boolean;
  secondaryTitleRequired?: boolean;
  primaryTitle?: string;
  secondaryTitle?: string;
  titleSize?: number;
  titleColor?: string;
  titleFontFamily?: string;
  buttonWidth?: number;
  buttonHeight?: number;
  mainIcon?: ImageSourcePropType;
  mainIconWidth?: number;
  mainIconHeight?: number;
  backgroundImageRequired?: boolean;
  backgroundImage?: ImageSourcePropType;
  buttonBorderColor?: string;
  buttonBackgroundColor?: string;
  buttonBorderRadius?: number;
  onSwipeEnd?: () => void;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  primaryTitleRequired = true,
  secondaryTitleRequired = true,
  primaryTitle = "Let's Start",
  secondaryTitle = 'Good Luck',
  titleFontFamily,
  titleSize = 18,
  titleColor = '#597445',
  buttonWidth = 400,
  buttonHeight = 70,
  buttonBorderColor = '#2F4F4F',
  buttonBackgroundColor = '#E3F4F4',
  buttonBorderRadius = 20,
  backgroundImageRequired = true,
  backgroundImage = require('./media/grass.png'),
  mainIcon = require('./media/movingDino.png'),
  mainIconWidth = 30,
  mainIconHeight = 35,
  onSwipeEnd = () => {},
}) => {
  const pan = useRef(new Animated.Value(0)).current;
  const primaryTextOpacity = useRef(new Animated.Value(1)).current;
  const secondaryTextOpacity = useRef(new Animated.Value(0)).current;

  const panResponder: PanResponderInstance = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState: PanResponderGestureState) => {
        if (gestureState.dx < buttonWidth) {
          pan.setValue(gestureState.dx);

          if (gestureState.dx > buttonWidth / 3) {
            Animated.timing(primaryTextOpacity, {
              toValue: 0,
              duration: 50,
              useNativeDriver: true,
            }).start();

            Animated.timing(secondaryTextOpacity, {
              toValue: 1,
              duration: 50,
              useNativeDriver: true,
            }).start();
          } else {
            Animated.timing(primaryTextOpacity, {
              toValue: 1,
              duration: 50,
              useNativeDriver: true,
            }).start();

            Animated.timing(secondaryTextOpacity, {
              toValue: 0,
              duration: 50,
              useNativeDriver: true,
            }).start();
          }
        }
      },
      onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
        Animated.timing(primaryTextOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();

        Animated.timing(secondaryTextOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
        if (gestureState.dx > buttonWidth / 2) {
          onSwipeEnd();
        }
      },
    })
  ).current;

  return (
    <ImageBackground
      source={backgroundImageRequired ? backgroundImage : undefined}
      resizeMode="cover"
      style={[
        styles.container,
        {
          width: buttonWidth - 40,
          height: buttonHeight,
          borderColor: buttonBorderColor,
          borderRadius: buttonBorderRadius,
          backgroundColor: buttonBackgroundColor,
        },
      ]}
    >
      <Animated.View
        style={[styles.animatedView, { transform: [{ translateX: pan }] }]}
        {...panResponder.panHandlers}
      >
        <Image
          source={mainIcon}
          style={{ width: mainIconWidth, height: mainIconHeight }}
        />
      </Animated.View>
      <View style={styles.textContainer}>
        {primaryTitleRequired && (
          <Animated.Text
            style={[
              styles.text,
              {
                fontFamily: titleFontFamily ? titleFontFamily : undefined,
                fontSize: titleSize,
                color: titleColor,
                opacity: primaryTextOpacity,
              },
            ]}
          >
            {primaryTitle}
          </Animated.Text>
        )}

        {secondaryTitleRequired && (
          <Animated.Text
            style={[
              styles.text,
              {
                fontFamily: titleFontFamily ? titleFontFamily : undefined,
                fontSize: titleSize,
                color: titleColor,
                opacity: secondaryTextOpacity,
              },
            ]}
          >
            {secondaryTitle}
          </Animated.Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 5,
    zIndex: 1000,
  },
  animatedView: {
    flexDirection: 'row',
    position: 'relative',
    zIndex: 100,
  },
  text: {
    position: 'absolute',
    alignSelf: 'center',
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnimatedButton;
