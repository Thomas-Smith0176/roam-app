import * as Location from "expo-location";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config";
import { getAuth } from "firebase/auth";


  // const q = query(
  //   collection(db, "maps"),
  //   where("uid", "==", getAuth().currentUser.uid)
  // );
  // getDocs(q).then((snapshot) => {
  //   const coordsData = snapshot._snapshot.docChanges
  //   startLat = (coordsData[0].doc.data.value.mapValue.fields.startLatitude.doubleValue)
  //   startLong = (coordsData[0].doc.data.value.mapValue.fields.startLongitude.doubleValue)
  // })

const startLong = -1.59612;
const startLat = 53.8;

const createGrid = () => {
  let longitude = startLong;
  let longGrid = [];
  let grid = [];
  let tiles = [];
  const longitudeInterval = 0.001;
  const latitudeInterval = 0.00066;
// more negative (smaller number) moves grid left
  while (longitude < startLong + 0.05 && longitude >= startLong) {
    longGrid.push(longitude);
    longitude += longitudeInterval;
  }

  longGrid.forEach((long) => {
    //up or down, larger number moves grid up
    let latitude = startLat;
    while (latitude >= startLat && latitude < startLat + 0.03) {
      let square = { longitude: long, latitude: null };
      square.latitude = latitude;
      latitude += latitudeInterval;
      grid.push(square);
    }
  });
  grid.forEach((latLong) => {
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
  return tiles;
};

function gridSquareId() {
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
