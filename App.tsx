import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import { styles } from './styles/App';
import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";

const App: () => Node = () => {

  const [accelerateValues, setAccelerateValues] = useState({ x: 0, y: 0, z: 0, final: 0 });
  const [backgroundColor, setBackgroundColor] = useState<string>('gray');
  const [subscription, setSubscription] = useState(null);
  const [intervalEvent, setIntervalEvent] = useState(null);
  const [prevPrecentage, setPrevPrecentage] = useState<number>(0);
  const [accelarationList, setAccelarationList] = useState<Array<number>>([]);
  const gravity = [0, 0, 0];
  const maxQSize = 25;
  const sensitivityValue = 0.5;

  useEffect(() => {
    return () => {
      subscription?.unsubscribe();
      intervalEvent && clearInterval(intervalEvent);
    }
  }, []);

  const startListenert = () => {
    setBackgroundColor('red');
    setUpdateIntervalForType(SensorTypes.accelerometer, 50);
    const interval = setInterval(detectMovement, 200);
    const accelSubscription = accelerometer.subscribe(({ x, y, z, timestamp }) => {
      const alpha = 0.8;
      gravity[0] = alpha * gravity[0] + (1 - alpha) * x;
      gravity[1] = alpha * gravity[1] + (1 - alpha) * y;
      gravity[2] = alpha * gravity[2] + (1 - alpha) * z;
      const accelerateX = x - gravity[0];
      const accelerateY = y - gravity[1];
      const accelerateZ = z - gravity[2];
      const finalAccelarate = Math.sqrt(Math.pow(accelerateX, 2) + Math.pow(accelerateY, 2) + Math.pow(accelerateZ, 2));
      if (accelarationList.length === maxQSize) {
        accelarationList.shift();
      }
      accelarationList.push(finalAccelarate);
      setAccelarationList(accelarationList);
      setAccelerateValues({ x: accelerateX, y: accelerateY, z: accelerateZ, final: finalAccelarate });
    });
    setIntervalEvent(interval);
    setSubscription(accelSubscription);
  }


  const endListener = () => {
    subscription?.unsubscribe();
    intervalEvent && clearInterval(intervalEvent);
    setAccelerateValues({ x: 0, y: 0, z: 0, final: 0 });
    setBackgroundColor('gray');
  }

  const detectMovement = () => {
    let numOfValuesAboveSensitivity = 0;
    accelarationList.forEach((val) => {
      if (val > sensitivityValue) {
        numOfValuesAboveSensitivity++;
      }
    });
    const precentage = (numOfValuesAboveSensitivity / maxQSize) * 100;
    if (precentage >= 80) {
      setBackgroundColor('green');
    }
    else if (precentage <= 70) {
      setBackgroundColor('red');
    }
    else {
      if (prevPrecentage <= 70) {
        setBackgroundColor('red');
      }
      else {
        setBackgroundColor('green');
      }
    }
    setPrevPrecentage(precentage);
  }

  return (
    <View style={styles.container}>
      <View style={styles.squareContainer}>
        <View style={{
          height: 200,
          width: 200,
          backgroundColor
        }} />
      </View>
      <View style={styles.btnsContainer}>
        <TouchableOpacity style={styles.btn} onPress={startListenert}>
          <Text style={styles.txtBtn}>
            START
        </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={endListener}>
          <Text style={styles.txtBtn}>
            STOP
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>X : {accelerateValues.x}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>Y : {accelerateValues.y}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>Z : {accelerateValues.z}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>Final : {accelerateValues.final}</Text>
      </View>
    </View>
  );
};

export default App;
