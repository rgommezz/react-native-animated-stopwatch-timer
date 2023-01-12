import * as React from 'react';
import { IconButton, Provider as PaperProvider } from 'react-native-paper';

import { StyleSheet, View } from 'react-native';
import AnimatedStopWatch, {
  StopWatchMethods,
} from 'react-native-animated-stopwatch';

export default function App() {
  const animatedCounterRef = React.useRef<StopWatchMethods>(null);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <AnimatedStopWatch
          ref={animatedCounterRef}
          containerStyle={styles.stopWatchContainer}
          textStyle={styles.stopWatch}
          trailingZeros={2}
          onPaused={(elapsedInMs) => console.log('onPaused', elapsedInMs)}
        />
        <View style={styles.buttonsContainer}>
          {/** @ts-ignore */}
          <IconButton
            icon="play"
            mode="contained"
            size={32}
            onPress={() => animatedCounterRef.current?.start()}
          />
          {/** @ts-ignore */}
          <IconButton
            icon="pause"
            mode="contained"
            size={32}
            onPress={() => animatedCounterRef.current?.pause()}
          />
          {/** @ts-ignore */}
          <IconButton
            icon="refresh"
            mode="contained"
            size={32}
            onPress={() => animatedCounterRef.current?.reset()}
          />
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopWatchContainer: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'black',
    borderColor: 'gray',
    borderRadius: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 240,
    paddingTop: 48,
  },
  stopWatch: {
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#9CCC65',
  },
});
