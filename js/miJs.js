var miMapa;
var urlGP = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/NetworkAnalysis/SanDiego/GPServer/FindRoutes";
require(["esri/map",
"esri/tasks/Geoprocessor",
"esri/symbols/PictureMarkerSymbol",
"esri/symbols/SimpleLineSymbol",
"esri/layers/GraphicsLayer",
"esri/graphic",
"esri/Color",
"esri/tasks/FeatureSet",
"dojo/domReady!"],
function(Map,
Geoprocessor,
PictureMarkerSymbol,
SimpleLineSymbol,
GraphicsLayer,
Graphic,
Color,
FeatureSet) {
  miMapa = new Map("mapaCont",{
    basemap: "streets-night-vector",
    zoom: 10,
    center: [-117.15, 32.71]
  });

  var gp = new Geoprocessor(urlGP);

  var marker = new PictureMarkerSymbol();
  marker.setOffset(0, 16);
  marker.setHeight(32);
  marker.setWidth(32);
  marker.setUrl("http://www.iconninja.com/files/978/634/410/map-point-marker-pin-location-pointer-place-icon.png");

  var line = new SimpleLineSymbol();
  line.setWidth(5);
  line.setColor(new Color([85, 255, 0, 1]));

  var glStops = new GraphicsLayer();
  miMapa.addLayer(glStops);

  var glRuta = new GraphicsLayer();
  miMapa.addLayer(glRuta);

  var arrayStops = [];
  var units = "Minutes";

  miMapa.on("click", añadirStop);

  function añadirStop(objEvento){
    var pnt = objEvento.mapPoint;
    var gr = new Graphic(pnt, marker);
    glStops.add(gr);
    arrayStops.push(gr);
  };


  var botonCalcularRuta = document.getElementById("btnCalcRuta");
  botonCalcularRuta.onclick = calculaRuta;

  function calculaRuta(){
    //obtener parámetros de entrada
    var fsetStops = new FeatureSet();
    fsetStops.features = arrayStops;

    //montar objeto parametros de entrada
    var objParams = {
      Stops: fsetStops,
      Measurement_Units: units
    };

    //lanzar el georpocesamiento

    gp.submitJob(objParams, submitJobSucceded);


    function submitJobSucceded(jobInfo){
      var jobId = jobInfo.jobId;
      gp.getResultData(jobId, "Output_Routes", getResult);

    }

    function getResult(resultado){
      console.log(resultado);
    }



  }







});
