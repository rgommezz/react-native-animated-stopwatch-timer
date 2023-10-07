import React, { ForwardedRef, forwardRef, useImperativeHandle } from 'react';
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
import useTimer from './useTimer';

const DEFAULT_ANIMATION_DELAY = 0;
const DEFAULT_ANIMATION_DISTANCE = 80;
const DEFAULT_ANIMATION_DURATION = 200;

export interface StopwatchTimerProps {
  /**
   * The enter/exit animation duration in milliseconds of a digit.
   */
  animationDuration?: number;
  /**
   * The enter/exit animation delay in milliseconds of a digit.
   */
  animationDelay?: number;
  /**
   * The enter/exit animation distance in dp of a digit.
   */
  animationDistance?: number;
  /**
   * The style of the component View container.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Extra style applied only to each digit, excluding separators.
   */
  digitStyle?: StyleProp<TextStyle>;
  /**
   * Whether the component should work as a stopwatch or as a timer.
   */
  mode?: 'stopwatch' | 'timer';
  /**
   * Initial time in milliseconds
   */
  initialTimeInMs?: number;
  /**
   * The number of zeros for the minutes.
   */
  leadingZeros?: 1 | 2;
  /**
   * Whether the new digit should enter from the top or the bottom.
   */
  enterAnimationType?: 'slide-in-up' | 'slide-in-down';
  /**
   * Callback executed when the timer reaches 0 (only when working in timer mode and initialTimeInMs is provided).
   */
  onFinish?: () => void;
  /**
   * Extra style applied only to separators. In this case, the colon (:) and the comma (,)
   */
  separatorStyle?: StyleProp<TextStyle>;
  /**
   * The style applied to each individual character of the stopwatch/timer.
   */
  textCharStyle?: StyleProp<TextStyle>;
  /**
   * If 0, the component will only display seconds and minutes.
   * If 1, the component will display seconds, minutes and hundredth of ms.
   */
  trailingZeros?: 0 | 1 | 2;
}

export interface StopwatchTimerMethods {
  /**
   * Starts the stopwatch/timer or resumes it if paused. Has no effect if the stopwatch/timer is already running.
   */
  play: () => void;
  /**
   * Pauses the stopwatch/timer and returns the current elapsed time in milliseconds.
   */
  pause: () => number;
  /**
   * Resets the stopwatch/timer.
   */
  reset: () => void;
  /**
   * Returns the current elapsed time in milliseconds.
   */
  getSnapshot: () => number;
}

function Stopwatch(
  {
    animationDelay = DEFAULT_ANIMATION_DELAY,
    animationDistance = DEFAULT_ANIMATION_DISTANCE,
    animationDuration = DEFAULT_ANIMATION_DURATION,
    containerStyle,
    enterAnimationType = 'slide-in-up',
    mode = 'stopwatch',
    digitStyle,
    initialTimeInMs,
    leadingZeros = 1,
    onFinish,
    separatorStyle,
    textCharStyle,
    trailingZeros = 1,
  }: StopwatchTimerProps,
  ref: ForwardedRef<StopwatchTimerMethods>
) {
  const {
    tensOfMs,
    lastDigit,
    tens,
    minutes,
    play,
    reset,
    pause,
    getSnapshot,
  } = useTimer({
    initialTimeInMs,
    onFinish,
    mode,
  });

  useImperativeHandle(ref, () => ({
    play,
    pause,
    reset,
    getSnapshot,
  }));

  const isSecondsDigitMounted = useSharedValue(false);
  const isTensOfSecondsDigitMounted = useSharedValue(false);
  const isMinutesDigitMounted = useSharedValue(false);

  const createEntering =
    (isFirstRender: SharedValue<boolean>) =>
    (values: EntryAnimationsValues) => {
      'worklet';
      if (!isFirstRender.value) {
        // Skip entering animation on first render
        isFirstRender.value = true;
        return { initialValues: {}, animations: {} };
      }
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { width, ...textCharStyleWithoutWidth } = StyleSheet.flatten(
    textCharStyle || {}
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {leadingZeros === 2 && (
        <Text
          style={[
            styles.defaultCharStyle,
            textCharStyleWithoutWidth,
            digitStyle,
          ]}
        >
          0
        </Text>
      )}
      <Animated.Text
        key={`${minutes}-minutes`}
        style={[styles.defaultCharStyle, textCharStyleWithoutWidth, digitStyle]}
        entering={createEntering(isMinutesDigitMounted)}
        exiting={exiting}
      >
        {minutes}
      </Animated.Text>
      <Text
        style={[
          styles.defaultCharStyle,
          textCharStyleWithoutWidth,
          separatorStyle,
        ]}
      >
        :
      </Text>
      <Animated.Text
        key={`${tens}-tens`}
        style={[styles.defaultCharStyle, textCharStyleWithoutWidth, digitStyle]}
        entering={createEntering(isTensOfSecondsDigitMounted)}
        exiting={exiting}
      >
        {tens}
      </Animated.Text>
      <Animated.Text
        key={`${lastDigit}-count`}
        style={[styles.defaultCharStyle, textCharStyleWithoutWidth, digitStyle]}
        entering={createEntering(isSecondsDigitMounted)}
        exiting={exiting}
      >
        {lastDigit}
      </Animated.Text>
      {trailingZeros > 0 && (
        <>
          <Text
            style={[
              styles.defaultCharStyle,
              textCharStyleWithoutWidth,
              separatorStyle,
            ]}
          >
            ,
          </Text>
          <Text
            style={[
              styles.defaultCharStyle,
              textCharStyleWithoutWidth,
              digitStyle,
            ]}
          >
            {tensOfMs >= 10 ? String(tensOfMs).charAt(0) : 0}
          </Text>
          {trailingZeros === 2 && (
            <Text
              style={[
                styles.defaultCharStyle,
                textCharStyleWithoutWidth,
                digitStyle,
              ]}
            >
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
  defaultCharStyle: {
    textAlign: 'center',
  },
});

const StopwatchTimer = forwardRef<StopwatchTimerMethods, StopwatchTimerProps>(
  Stopwatch
);

export default StopwatchTimer;
