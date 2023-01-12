# Animated Stopwatch

[![npm](https://img.shields.io/npm/v/react-native-animated-stopwatch?color=brightgreen)](https://www.npmjs.com/package/react-native-animated-stopwatch)
[![npm bundle size](https://img.shields.io/bundlephobia/min/react-native-animated-stopwatch)](https://bundlephobia.com/result?p=react-native-animated-stopwatch)
![platforms: ios, android, web](https://img.shields.io/badge/platform-ios%2C%20android-blue)
[![license MIT](https://img.shields.io/badge/license-MIT-brightgreen)](https://github.com/rgommezz/react-native-animated-stopwatch/blob/master/LICENSE)

React Native Stopwatch component that smoothly animates the digits change. Cross-platform, performant, with all animations executed on the UI thread at 60FPS. Compatible with Expo.

## Installation

```sh
npm install react-native-animated-stopwatch
```

## Usage

```tsx
import { useRef } from 'react';
import AnimatedStopwatch, {
  StopWatchMethods,
} from 'react-native-animated-stopwatch';

const stopwatchRef = useRef<StopWatchMethods>(null);

function play() {
  stopwatchRef.current?.play();
}

function pause() {
  stopwatchRef.current?.pause();
}

function reset() {
  stopwatchRef.current?.reset();
}

return <AnimatedStopwatch ref={stopwatchRef} />;
```

## Props

| Name                 | Required | Type                               | Description                                                                                                                                                                                              |
| -------------------- | -------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `animationDuration`  | no       | `number`                           | The enter/exit animation duration in milliseconds of a stopwatch digit. Defaults to `80`                                                                                                                 |
| `animationDelay`     | no       | `number`                           | The enter/exit animation delay in milliseconds of a stopwatch digit. Defaults to `0`                                                                                                                     |
| `animationDistance`  | no       | `number`                           | The enter/exit animation vertical distance in dp of a stopwatch digit. Defaults to `120`                                                                                                                 |
| `containerStyle`     | no       | `StyleProp<ViewStyle>`             | The style of the stopwatch `View` container                                                                                                                                                              |
| `leadingZeros`       | no       | `1` or `2`                         | The number of zeros for the minutes                                                                                                                                                                      |
| `enterAnimationType` | no       | `'slide-in-up' or 'slide-in-down'` | Whether the new digit should enter from the top or the bottom                                                                                                                                            |
| `onPaused`           | no       | `(elapsedInMs: number) => void`    | Callback that gets invoked every time the stopwatch pauses, providing as argument the current time elapsed in ms                                                                                         |
| `textStyle`          | no       | `StyleProp<TextStyle>`             | The style of the stopwatch `Text` component                                                                                                                                                              |
| `trailingZeros`      | no       | `0`, `1` or `2`                    | If `0`, the stopwatch will only display seconds and minutes. If `1`, the stopwatch will display seconds, minutes and hundredth of ms. If `2`, the stopwatch will display seconds, minutes and tens of ms |

## Methods

#### `start()`

Starts the stopwatch or resumes it if paused. It has no effect if the stopwatch is already running.

```js
stopwatchRef.current?.play();
```

#### `pause()`

Pauses the stopwatch. It has no effect if the stopwatch is either paused or reset. You can use the `onPaused` prop to get a snapshot of the time elapsed when the stopwatch pauses

```js
stopwatchRef.current?.pause();
```

#### `reset()`

Resets the stopwatch to 0.

```js
stopwatchRef.current?.reset();
```

`stopwatchRef` refers to the [`ref`](https://reactjs.org/docs/react-api.html#reactcreateref) passed to the `AnimatedStopwatch` component.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
