# react-native-animated-stopwatch

React Native Stopwatch component that smoothly animates the digits change

## Installation

```sh
npm install react-native-animated-stopwatch
```

## Usage

```tsx
import AnimatedStopWatch, {
  StopWatchMethods,
} from 'react-native-animated-stopwatch';

const animatedCounterRef = React.useRef<StopWatchMethods>(null);

function startClock() {
  animatedCounterRef.current?.start();
}

function stopClock() {
  animatedCounterRef.current?.stop();
}

return <AnimatedStopWatch ref={animatedCounterRef} />;
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
