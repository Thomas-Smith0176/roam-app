import * as Location from "expo-location";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config";
import { useState } from "react";

const createGrid = () => {

  const [userLatitude, setUserLatitude] = useState()
  const [userLongitude, seUserLongitude] = useState()

  const userId = getAuth().currentUser.uid
  const q = query(collection(db, 'mapGrids'), where('userId', '==', userId))
  getDocs(q)
  .then((snapshot)=> {
    snapshot.forEach((doc) => {
      setUserLatitude(doc._document.data.value.mapValue.fields.currentLocation.mapValue.fields.coords.mapValue.fields.latitude.doubleValue)
      seUserLongitude(doc._document.data.value.mapValue.fields.currentLocation.mapValue.fields.coords.mapValue.fields.longitude.doubleValue)
    })
  })
  .then(()=> {
  let longitude = userLongitude - 0.05;
  let longGrid = [];
  let grid = [];
  let tiles = [];
  const longitudeInterval = 0.0025;
  const latitudeInterval = 0.0015;

  while (longitude < userLongitude + 0.05 && longitude >= userLongitude - 0.05) {
    longGrid.push(longitude);
    longitude += longitudeInterval;
  }
  longGrid.forEach((long) => {
    let latitude = userLatitude - 0.025;
    while (latitude >= userLatitude - 0.025 && latitude < userLatitude + 0.025) {
      let square = { longitude: long, latitude: null };
      square.latitude = latitude;
      latitude += latitudeInterval;
      grid.push(square);
    }
  });
  grid.forEach((latLong, index) => {
    tiles.push({
      location: [
        {
          latitude: latLong.latitude,
          longitude: latLong.longitude,
        },
        {
          latitude: latLong.latitude,
          longitude: latLong.longitude + longitudeInterval,
        },
        {
          latitude: latLong.latitude + latitudeInterval,
          longitude: latLong.longitude + longitudeInterval,
        },
        {
          latitude: latLong.latitude + latitudeInterval,
          longitude: latLong.longitude,
         },
       ],
      fill: true,
       sortLat: [latLong.latitude, latLong.latitude + latitudeInterval],
       sortLong: [latLong.longitude, latLong.longitude + longitudeInterval],
    });
  });
  console.log(tiles.length)

  console.log(tiles.slice)
  return tiles
})
};

function gridSquareId(){
  //we want two map collections on firebase
  //one stores map grids
  //other stores locations of users
  //i.e id of grid squares
  //when someone views map, make request to firebase to mapgrid with their user_id.
  //also request their history of squares than filter mapgrid to remove any squares of id's in grid array
  //store user history in state for conditional rendering.
  //when user closes app, local state updated to firebase to reflect changes on front end to backend.
  
}

export default createGrid;
