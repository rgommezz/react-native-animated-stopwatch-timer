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
import { StyleSheet, Text, View } from 'react-native';
import useStopwatch from './useStopwatch';

const DEFAULT_ANIMATION_DELAY = 0;
const DEFAULT_ANIMATION_DISTANCE = 40;
const DEFAULT_ANIMATION_DURATION = 200;

type Props = {
  /**
   * The enter/exit animation duration in milliseconds of a stopwatch digit.
   */
  animationDuration?: number;
  /**
   * The enter/exit animation delay in milliseconds of a stopwatch digit.
   */
  animationDelay?: number;
  /**
   * The enter/exit animation distance in dp of a stopwatch digit.
   */
  animationDistance?: number;
  /**
   * The style of the stopwatch View container.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * The number of zeros for the minutes.
   */
  leadingZeros?: 1 | 2;
  /**
   * Whether the new digit should enter from the top or the bottom.
   */
  enterAnimationType?: 'slide-in-up' | 'slide-in-down';
  /**
   * The style of the stopwatch Text.
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * If 0, the stopwatch will only display seconds and minutes.
   * If 1, the stopwatch will display seconds, minutes and hundredth of ms.
   */
  trailingZeros?: 0 | 1 | 2;
};

export interface StopWatchMethods {
  /**
   * Pauses the stopwatch.
   */
  pause: () => void;
  /**
   * Starts the stopwatch. Has no effect if the stopwatch is already running.
   */
  start: () => void;
  /**
   * Resets the stopwatch.
   */
  reset: () => void;
}

function Stopwatch(
  {
    animationDelay = DEFAULT_ANIMATION_DELAY,
    animationDistance = DEFAULT_ANIMATION_DISTANCE,
    animationDuration = DEFAULT_ANIMATION_DURATION,
    containerStyle,
    enterAnimationType = 'slide-in-up',
    leadingZeros = 1,
    textStyle,
    trailingZeros = 1,
  }: Props,
  ref: ForwardedRef<StopWatchMethods>
) {
  const { tensOfMs, lastDigit, tens, minutes, start, reset, pause } =
    useStopwatch();

  useImperativeHandle(ref, () => ({
    pause,
    start,
    reset,
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
      const enterDirection = enterAnimationType === 'slide-in-up' ? -1 : 1;
      const initialValues = {
        originY: values.targetOriginY + animationDistance * enterDirection,
      };
      return {
        initialValues,
        animations,
      };
    };

  const exiting = (values: ExitAnimationsValues) => {
    'worklet';
    const exitDirection = enterAnimationType === 'slide-in-up' ? 1 : -1;
    const animations = {
      originY: withDelay(
        animationDelay,
        withTiming(values.currentOriginY + animationDistance * exitDirection, {
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
      {leadingZeros === 2 && <Text style={textStyle}>0</Text>}
      <Animated.Text
        key={`${minutes}-minutes`}
        style={textStyle}
        entering={createEntering(oldMinutes, minutes)}
        exiting={exiting}
      >
        {minutes}
      </Animated.Text>
      <Text style={textStyle}>:</Text>
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
      {trailingZeros > 0 && (
        <>
          <Text style={textStyle}>,</Text>
          <Text style={textStyle}>
            {tensOfMs >= 10 ? String(tensOfMs).charAt(0) : 0}
          </Text>
          {trailingZeros === 2 && (
            <Text style={textStyle}>
              {tensOfMs >= 10
                ? String(tensOfMs).charAt(1)
                : String(tensOfMs).charAt(0)}
            </Text>
          )}
        </>
      )}
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

const AnimatedStopwatch = forwardRef<StopWatchMethods, Props>(Stopwatch);

export default AnimatedStopwatch;
