import React, { useState, useEffect } from "react";
import { WebView } from "react-native-webview";
import { Magnetometer } from "expo-sensors";

const NE = "/home.html#page=seven";
const SE = "/home.html#page=one";
const SW = "/home.html#page=three";
const NW = "/home.html#page=five";
const N = "/home.html#page=six";
const E = "/home.html#page=eight";
const W = "/home.html#page=four";
const S = "/home.html#page=two";

const baseurl = "https://bcebel.github.io/3d";

export default function App() {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const subscription = Magnetometer.addListener((data) => {
      const direction = calculateDirection(data);
      const directionUrl = getUrlForDirection(direction);
      if (!url) {
        setUrl(`${baseurl}${directionUrl}`);
        subscription.remove();
      }
    });

    Magnetometer.setUpdateInterval(1000);

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [url]);

  const calculateDirection = ({ x, y }) => {
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    if (angle < 0) {
      angle += 360;
    }
    return angle;
  };

  const getUrlForDirection = (angle) => {
    if (angle >= 337.5 || angle < 22.5) {
      return N; // North
    } else if (angle >= 22.5 && angle < 67.5) {
      return NE; // North-East
    } else if (angle >= 67.5 && angle < 112.5) {
      return E; // East
    } else if (angle >= 112.5 && angle < 157.5) {
      return SE; // South-East
    } else if (angle >= 157.5 && angle < 202.5) {
      return S; // South
    } else if (angle >= 202.5 && angle < 247.5) {
      return SW; // South-West
    } else if (angle >= 247.5 && angle < 292.5) {
      return W; // West
    } else if (angle >= 292.5 && angle < 337.5) {
      return NW; // North-West
    }
    console.log(url);
  };

  return (
    url && (
      <WebView
        source={{ uri: url }}
        style={{ marginTop: 20, flex: 1 }}
        allowsBackForwardNavigationGestures={true}
      />
    )
  );
}
