import { Button, Modal, TextInput, View, Text, StyleSheet, Pressable } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useEffect } from "react";
import * as Location from "expo-location";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config";

export default function CreateMap({navigation}) {

    // function handleLogOut() {
    //     signOut(getAuth())
    //     console.log(getAuth())
    //     navigation.navigate('LoginPage')
    // }

function handleCreateMap() {
        const currentLocation = Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest})
        const mapGrids = collection(db, 'mapGrids')
        const userId = getAuth().currentUser.uid
        return Promise.all([currentLocation, mapGrids, userId])
        .then(([currentLocation, mapGrids, userId]) => {
            const mapGridData = {
                currentLocation: currentLocation,
                userId: userId
            }
            return addDoc(mapGrids, mapGridData)
        })
        .then(() => {
            return navigation.navigate('MapScreen')
        })
    }

    useEffect(() => {
        Location.requestForegroundPermissionsAsync().then(({ status }) => {
            if (status !== "granted") {
              console.log("error");
              return "error";
            }
    })
    }, []);

    return (
        <View>
        <Text>Create map page</Text>
        {/* <Button onPress={handleLogOut()} title={'Log out'}>
            <Text>Log out</Text>
        </Button> */}
        <Button onPress={() => {handleCreateMap()}} title={'Create map'}>
            <Text>Create map</Text>
        </Button>
        </View>
    ) 
}