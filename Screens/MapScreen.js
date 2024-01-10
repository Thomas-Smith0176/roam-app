import React, { useEffect, useState } from "react";
import MapView, { Polyline, Polygon, Marker } from "../setup/map";
import * as Location from "expo-location";
import createGrid from "../utils/createGrid";
import mapStyle from "../assets/mapStyle.json";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  GeoPoint,
} from "firebase/firestore";
import { db } from "../config";
import Modal from "react-native-modal";
import { Pressable, Text, View, StyleSheet, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/core";
import Geohash from "latlon-geohash";
const customPin = "../assets/re-sized-landmark-pin.png";

export default function MapScreen() {
  const [location, setLocation] = useState({});
  const [locationHistory, setLocationHistory] = useState([]);
  const [region, setRegion] = useState(createGrid());
  const [finalLandmarkArray, setFinalLandmarkArray] = useState([]);
  const navigation = useNavigation();
  const [addButtonClicked, setAddButtonClicked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newLandmarkTitle, setNewLandmarkTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [locationHistoryGeohash, setLocationHistoryGeoHash] = useState([])

  function loadMaps() {
    return getDoc(doc(db, "Maps", "HJLCbJGvssb2onQTbiy4")).then((snapshot) => {
      return snapshot.data().mapLoad;
    });
  }

  useEffect(() => {
    const startLocationUpdates = () => {
      Location.requestForegroundPermissionsAsync().then(({ status }) => {
        if (status !== "granted") {
          console.log("error");
          return "error";
        }
        return Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Highest, timeInterval: 2000 },
          (location) => {
            const newCoordinates = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            setLocation(newCoordinates);
            setLocationHistory((currHistory) => {
              return [...currHistory, newCoordinates];
            });
            setLocationHistoryGeoHash((currGeo) => {
              const geohash = Geohash.encode(
                newCoordinates.latitude,
                newCoordinates.longitude,
                10
              );
              if (currGeo && currGeo.includes(geohash)) {
                return currGeo;
              } else {
                return [...currGeo, geohash];
              }
            });
          }
        );
      });
    };
    startLocationUpdates();
  }, []);
  useEffect(() => {
    setRegion((currRegion) => {
      const updatedRegion = currRegion.map((area) => {
        if (
          location.latitude <= area.sortLat[1] &&
          location.latitude >= area.sortLat[0] &&
          location.longitude >= area.sortLong[0] &&
          location.longitude <= area.sortLong[1]
        ) {
          const updatedArea = { ...area };
          updatedArea.fill = false;
          return updatedArea;
        } else {
          return area;
        }
      });
      return updatedRegion;
    });
  }, [location]);

  console.log(locationHistoryGeohash)
  useEffect(() => {
    const landmarkArray = [];
    getDocs(collection(db, "Landmarks"))
      .then((querySnapshot) => {
        querySnapshot.forEach((landmarkData) => {
          const landmarkDataObject = landmarkData.data();
          landmarkDataObject.id = landmarkData.id;
          landmarkArray.push(landmarkDataObject);
        });
        return landmarkArray;
      })
      .then((array) => {
        setFinalLandmarkArray(array);
        setIsLoading(false);
      });
  }, [newLandmarkTitle]);

  function addPinFunction() {
    setAddButtonClicked(true);
    setIsModalVisible(true);
  }

  function submitLandmark() {
    const landmarksCollection = collection(db, "Landmarks");
    const landmarkData = {
      Title: newLandmarkTitle,
      Coordinate: new GeoPoint(location.latitude, location.longitude),
    };
    addDoc(landmarksCollection, landmarkData)
      .then((data) => {
        setNewLandmarkTitle("");
        navigation.navigate("Landmarks", { id: data.id });
        setIsModalVisible(false);
      })
      .catch((error) => {
        console.log("error:", error);
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapView}>
        <MapView
          minZoomLevel={15}
          style={{ flex: 1, height: "100%" }}
          initialRegion={{
            latitude: 53.8,
            longitude: -1.54,
            latitudeDelta: 0.09,
            longitudeDelta: 0.04,
          }}
          provider="google"
          googleMapsApiKey={loadMaps}
          customMapStyle={mapStyle}
        >
          {region.map((tile, index) => {
            return (
              <Polygon
                key={`tile${index}`}
                coordinates={tile.location}
                fillColor={
                  tile.fill ? "rgba(105,105,105,1)" : "rgba(105,105,105,0)"
                }
                strokeColor="rgba(0,0,0,0)"
              />
            );
          })}
          {location && (
            <Polyline coordinates={locationHistory} strokeWidth={5} />
          )}

          {finalLandmarkArray.map((data, index) => (
            <Marker
              onPress={() => {
                {
                  navigation.navigate("Landmarks", { id: data.id });
                }
              }}
              key={index}
              coordinate={{
                latitude: data.Coordinate._lat,
                longitude: data.Coordinate._long,
              }}
              title={`${data.Title}`}
              description={`${data.Description}`}
              image={require(customPin)}
            />
          ))}
        </MapView>
      </View>
      {addButtonClicked && (
        <View style={styles.separator}>
          <Modal isVisible={isModalVisible}>
            <View style={styles.modal}>
              <TextInput
                placeholder="What Landmark is this?"
                style={styles.textInput}
                onChangeText={(title) => setNewLandmarkTitle(title)}
              />
              <Pressable style={styles.addPinButton} onPress={submitLandmark}>
                <Text>Submit</Text>
              </Pressable>
            </View>
          </Modal>
        </View>
      )}

      <Pressable style={styles.addPinButton} onPress={addPinFunction}>
        <Text>Add a new landmark</Text>
      </Pressable>
    </View>
  );
}

// <Image
// source="require(../../../assets/cyclist-icon.png)"
// style={styles.markerImage}
// />

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    marginVertical: 30,
    height: 0.5,
    width: "80%",
  },
  mapView: {
    height: "90%",
    width: "100%",
  },
  addPinButton: {
    padding: 20,
    margin: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#f0f0f0",
    backgroundColor: "#2596be",
    width: "50%",
    alignItems: "center",
    marginLeft: "25%",
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    height: "20%",
  },
  textInput: {
    backgroundColor: "white",
    height: 40,
    fontSize: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ffffff",
    justifyContent: "center",
  },
});
