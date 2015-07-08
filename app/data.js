/**
* Temporary global development variables instantiated here.
* Remove/refactor for Production.
* Used to work on Map or Search components independently. 
* Note: 
* -mapsApp currently renders the searchApp component.
* -therefore, setting _MAPOFF to true will also disable searchApp
* @type {Object}
*/

//Used to center map, and store locations for both map and search components.
var __LOCAL_MAP_DATA = {
  initialZoom: 11, //hardcoded: calculated to render map with 30-40mi radius
  mapCenterLat: null,
  mapCenterLng: null,
  __ALL_LOCATIONS : null,
  __NEARBY_LOCATIONS: null
};
/**
 * _MAPOFF and _SEARCHOFF pause rendering when true.
 * _MOCK is used to override user's navigator.geolocation results.
 * @type {Object}
 */
var __DEV = {
  _MAPOFF : false,
  _SEARCHOFF : false,
  _MOCK : {
    SanFrancisco : false,
    sfLatLong : [37.7759949,-122.4061965], //Atlassian Offices.
    Seattle : false,
    seaLatLong : [47.61658651, -122.3520824] //1st Ave.
  }
};
