import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from 'react';
import Animated, {
  EntryAnimationsValues,
  ExitAnimationsValues,
  SharedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import useClock from './useClock';

const DEFAULT_ANIMATION_DELAY = 0;
const DEFAULT_ANIMATION_DISTANCE = 40;
const DEFAULT_ANIMATION_DURATION = 200;

type Props = {
  animationDuration?: number;
  animationDelay?: number;
  animationDistance?: number;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export interface StopWatchMethods {
  start: () => void;
  stop: () => void;
}

function StopWatch(
  {
    animationDelay = DEFAULT_ANIMATION_DELAY,
    animationDistance = DEFAULT_ANIMATION_DISTANCE,
    animationDuration = DEFAULT_ANIMATION_DURATION,
    containerStyle,
    textStyle,
  }: Props,
  ref: ForwardedRef<StopWatchMethods>
) {
  const { hundredthMs, lastDigit, tens, minutes, stop, start } = useClock();

  useImperativeHandle(ref, () => ({
    start,
    stop,
  }));

  const oldLastDigit = useSharedValue<number>(-1);
  const oldTens = useSharedValue<number>(-1);
  const oldMinutes = useSharedValue<number>(-1);

  const newLastDigit = useSharedValue<number>(lastDigit);
  const newTens = useSharedValue<number>(tens);
  const newMinutes = useSharedValue<number>(minutes);

  useEffect(() => {
    newLastDigit.value = lastDigit;
    newTens.value = tens;
    newMinutes.value = minutes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastDigit, tens, minutes]);

  const createEntering =
    (oldValue: SharedValue<number>, numericValue: number) =>
    (values: EntryAnimationsValues) => {
      'worklet';
      if (oldValue.value === -1) {
        // skip entering animation on first render
        oldValue.value = numericValue;
        return { initialValues: {}, animations: {} };
      }
      oldValue.value = numericValue;
      const animations = {
        originY: withDelay(
          animationDelay,
          withTiming(values.targetOriginY, {
            duration: animationDuration,
          })
        ),
      };
      const initialValues = {
        originY: values.targetOriginY - animationDistance,
      };
      return {
        initialValues,
        animations,
      };
    };

  const exiting = (values: ExitAnimationsValues) => {
    'worklet';
    const animations = {
      originY: withDelay(
        animationDelay,
        withTiming(values.currentOriginY + animationDistance, {
          duration: animationDuration,
        })
      ),
    };
    const initialValues = {
      originY: values.currentOriginY,
    };
    return {
      initialValues,
      animations,
    };
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.Text
        key={`${minutes}-minutes`}
        style={textStyle}
        entering={createEntering(oldMinutes, minutes)}
        exiting={exiting}
      >
        {minutes}
      </Animated.Text>
      <Animated.Text style={textStyle}>:</Animated.Text>
      <Animated.Text
        key={`${tens}-tens`}
        style={textStyle}
        entering={createEntering(oldTens, tens)}
        exiting={exiting}
      >
        {tens}
      </Animated.Text>
      <Animated.Text
        key={`${lastDigit}-count`}
        style={textStyle}
        entering={createEntering(oldLastDigit, lastDigit)}
        exiting={exiting}
      >
        {lastDigit}
      </Animated.Text>
      <Animated.Text style={textStyle}>,</Animated.Text>
      <Animated.Text style={textStyle}>{hundredthMs}</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

const AnimatedStopWatch = forwardRef<StopWatchMethods, Props>(StopWatch);

export default AnimatedStopWatch;
