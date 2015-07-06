var x = document.getElementById("demo");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude; 
    // console.log('SENDING :');
    // var requestP = $.ajax({
    //   url: "/locations",
    //   type: "POST",
    //   data: {
    //     lat : position.coords.latitude,
    //     long: position.coords.longitude
    //   },
    //   dataType: "json"
    // });

    // requestP.done(function(res, type) {
    //   console.log("DONE :", res);
    //   console.log('type :', type);
    // });


    var requestG = $.ajax({
      url: "/locations",
      type: "GET"
    });

    requestG.done(function(res, type) {
      console.log("DONE :", res);
      console.log('type :', type);
    });

}

getLocation();