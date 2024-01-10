import * as Location from "expo-location";
import Geohash from "latlon-geohash";
const createGrid = () => {

  let longitude = -1.58;
  let longGrid = [];
  let grid = [];
  let tiles = [];
  const longitudeInterval = 0.0025;
  const latitudeInterval = 0.0015;

  while (longitude < -1.48 && longitude >= -1.58) {
    longGrid.push(longitude);
    longitude += longitudeInterval;
  }
  longGrid.forEach((long) => {
    let latitude = 53.78;
    while (latitude >= 53.78 && latitude < 53.83) {
      let square = { longitude: long, latitude: null };
      square.latitude = latitude;
      latitude += latitudeInterval;
      grid.push(square);
    }
  });
  grid.forEach((latLong) => {
    tiles.push({
      location: [
      //bottom left
        {
          latitude: latLong.latitude,
          longitude: latLong.longitude,
        },
        //bottom right
        {
          latitude: latLong.latitude,
          longitude: latLong.longitude + longitudeInterval,
        },
        //top right
        {
          latitude: latLong.latitude + latitudeInterval,
          longitude: latLong.longitude + longitudeInterval,
        },
        //top left
        {
          latitude: latLong.latitude + latitudeInterval,
          longitude: latLong.longitude,
         },
       ],
      fill: true,
      // geohash: Geohash.encode()
       sortLat: [latLong.latitude, latLong.latitude + latitudeInterval],
       sortLong: [latLong.longitude, latLong.longitude + longitudeInterval],
    });
  });
  console.log(tiles[0])
  return tiles
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
