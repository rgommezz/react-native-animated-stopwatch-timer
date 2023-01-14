# react-native-animated-stopwatch-timer

[![npm](https://img.shields.io/npm/v/react-native-animated-stopwatch-timer?color=brightgreen)](https://www.npmjs.com/package/react-native-animated-stopwatch-timer)
[![npm bundle size](https://img.shields.io/bundlephobia/min/react-native-animated-stopwatch-timer)](https://bundlephobia.com/result?p=react-native-animated-stopwatch-timer)
![platforms: ios, android, web](https://img.shields.io/badge/platform-ios%2C%20android-blue)
[![license MIT](https://img.shields.io/badge/license-MIT-brightgreen)](https://github.com/rgommezz/react-native-animated-stopwatch-timer/blob/master/LICENSE)

 <p><i>A React Native Stopwatch/Timer component that empowers <b>reanimated worklets</b> to smoothly animate the digits change. Cross-platform, performant, with all <b>layout animations executed on the UI thread at 60FPS</b>. Compatible with Expo.</i></p>

 ## Preview

https://user-images.githubusercontent.com/4982414/212443504-7c46a701-7e13-4504-8b39-88499fb17752.mp4


## Try it out

🧑‍💻 Run the [example app](https://snack.expo.dev/@rgommezz/react-native-animated-stopwatch-timer) with [Expo](https://expo.dev/) to see it in action. The source code for the example is under the [/example](/example) folder.

## Installation

```sh
npm install react-native-animated-stopwatch-timer
```

You also need to install `react-native-reanimated` `2.5.x` or higher.

```sh
npm install react-native-reanimated
```

If you are installing reanimated on a bare React Native app, you should also follow this [additional installation instructions.](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/)

## Modes

You can use this component in two different modes:

- **Stopwatch**: The timer starts counting up from 0 (default).
- **Timer**: The timer starts counting down from a given time. Use the `initialTimeInMs` prop to activate this mode.

## Usage

```tsx
import { useRef } from 'react';
import StopwatchTimer, {
  StopwatchTimerMethods,
} from 'react-native-animated-stopwatch-timer';

const stopwatchTimerRef = useRef<StopwatchTimerMethods>(null);

// Methods to control the stopwatch

function play() {
  stopwatchTimerRef.current?.play();
}

function pause() {
  const elapsedTimeInMs = stopwatchTimerRef.current?.pause();
  // Do something with the elapsed time
  console.log(elapsedTimeInMs);
}

function reset() {
  stopwatchTimerRef.current?.reset();
}

return <StopwatchTimer ref={stopwatchTimerRef} />;
```

## Props

| Name                 | Required | Type                              | Description                                                                                                                                                                                                                                                                                                                   |
|----------------------| -------- |-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `animationDuration`  | no       | `number`                          | The enter/exit animation duration in milliseconds of a digit. Defaults to `80`                                                                                                                                                                                                                                                |
| `animationDelay`     | no       | `number`                          | The enter/exit animation delay in milliseconds of a digit. Defaults to `0`                                                                                                                                                                                                                                                    |
| `animationDistance`  | no       | `number`                          | The enter/exit animation vertical distance in dp of a digit. Defaults to `120`                                                                                                                                                                                                                                                |
| `containerStyle`     | no       | `StyleProp<ViewStyle>`            | The style of the stopwatch/timer `View` container                                                                                                                                                                                                                                                                             |
| `digitStyle`         | no       | `StyleProp<TextStyle>`            | Extra style applied to each digit, excluding separators (`:` and `,`). This is useful if the `fontFamily` has different widths per digit, to avoid an unpleasant fluctuation of the total component width as it runs. Check the example app where this is used on iOS's default San Francisco font, that presents this issue. |
| `initialTimeInMs`    | no       | `number`                          | If you want to **use it as a timer**, set this value                                                                                                                                                                                                                                                                          |
| `leadingZeros`       | no       | `1` or `2`                        | The number of zeros for the minutes. Defaults to 1                                                                                                                                                                                                                                                                            |
| `enterAnimationType` | no       | `'slide-in-up' or 'slide-in-down'` | Whether the new digit should enter from the top or the bottom                                                                                                                                                                                                                                                                 |
| `separatorStyle`     | no       | `StyleProp<TextStyle>`            | Extra style applied only to separators. In this case, the colon (`:`) and the comma (`,`)                                                                                                                                                                                                                                     |
| `onFinish`           | no       | `() => void`                      | Callback executed when the timer reaches 0 (only when working in **timer mode** and `initialTimeInMs` prop is provided)                                                                                                                                                                                                           |
| `textCharStyle`      | no       | `StyleProp<TextStyle>`            | The style applied to each individual character of the stopwatch/timer                                                                                                                                                                                                                                                         |
| `trailingZeros`      | no       | `0`, `1` or `2`                   | If `0`, the component will only display seconds and minutes. If `1`, the component will display seconds, minutes and hundredth of ms. If `2`, the component will display seconds, minutes and tens of ms. Defaults to `1`                                                                                                     |

## Methods

#### `play: () => void`

Starts the stopwatch/timer or resumes it if paused. It has no effect if it's already running.

```js
stopwatchTimerRef.current?.play();
```

#### `pause: () => number`

Pauses the stopwatch/timer. It has no effect if it is either paused or reset. The method returns a snapshot of the time elapsed in ms.

```js
stopwatchTimerRef.current?.pause();
```

#### `reset: () => void`

Resets the stopwatch/timer.

```js
stopwatchTimerRef.current?.reset();
```

#### `getSnapshot: () => number`

Returns the current time elapsed in ms.

```js
stopwatchTimerRef.current?.getSnapshot();
```

`stopwatchTimerRef` refers to the [`ref`](https://reactjs.org/docs/hooks-reference.html#useref) passed to the `StopwatchTimer` component.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
