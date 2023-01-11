import * as React from 'react';

import { Button, StyleSheet, View } from 'react-native';
import AnimatedStopWatch, {
  StopWatchMethods,
} from 'react-native-animated-stopwatch';

export default function App() {
  const animatedCounterRef = React.useRef<StopWatchMethods>(null);

  return (
    <View style={styles.container}>
      <AnimatedStopWatch
        ref={animatedCounterRef}
        textStyle={styles.stopWatch}
      />
      <View style={styles.buttonsContainer}>
        <Button
          title="Start"
          onPress={() => animatedCounterRef.current?.start()}
        />
        <Button
          title="Stop"
          onPress={() => animatedCounterRef.current?.stop()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    padding: 24,
  },
  stopWatch: {
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#00563F',
  },
});
