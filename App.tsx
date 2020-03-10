/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  PermissionsAndroid,
  BackHandler,
  Button
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import DeviceInfo from 'react-native-device-info';
import WifiManager from "react-native-wifi-reborn";

declare var global: {HermesInternal: null | {}};

const App = () => {

  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    console.log('init App');
    (async () => {
      const checkPhoneState: boolean = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);
      const fineLocation: boolean = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (!checkPhoneState || !fineLocation) {
        const request = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        ]);
        console.log(JSON.stringify(request))
        console.log('이건?', PermissionsAndroid.RESULTS.GRANTED)
        if (request["android.permission.READ_PHONE_STATE"] !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('in1');
          BackHandler.exitApp();
        }
        if (request["android.permission.ACCESS_FINE_LOCATION"] !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('in2');
          BackHandler.exitApp();
        }
      }
      const deviceId = await DeviceInfo.getAndroidId();
      console.log(`device id - ${deviceId}`);
      const phoneNum = await DeviceInfo.getPhoneNumber();
      console.log(`phone - ${phoneNum}`);
      WifiManager.loadWifiList(
        wifiList => {
            let wifiArray =  JSON.parse(wifiList);
            const a = wifiArray.map((value: any, index: any) =>
                {
                  console.log(`Wifi ${index  +  1} - ${value.SSID}`);
                  return `Wifi ${index  +  1} - ${value.SSID}`;
                  // console.log(JSON.stringify(value));
                }
            );
            setItems(a)
        },
        error =>  console.log(error)
      );
    })();
  }, []);

  const onClick = () => {
    console.log('click!!')
    // fetch('http://192.168.1.6:3000/user', { method: 'GET' })
    // .then(response => response.json())
    // .then((res) => {
    //   console.log('response', res);
    // }).catch((err) => {
    //   console.log('err', err);
    // });

    fetch('http://192.168.1.6:3000/wifi', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wifis: items }) 
    })
    .then(response => response.json())
    .then((res) => {
      console.log('response', res);
    }).catch((err) => {
      console.log('err', err);
    });
  }

  return (
    <>
      <Text>Wifi list</Text>
      <Button
        onPress={() => {onClick()}}
        title="호출 테스트"
      />
      <ScrollView>
        {items.map((item) => (
          <Text>{item}</Text>
        ))}
      </ScrollView>
      {/* <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.tsx</Text> to change
                this screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView> */}
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
