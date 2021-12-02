console.log("just keep going.");
console.log("testing js connection to index.");


require(["esri/config","esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/views/ui/UI", "esri/widgets/BasemapToggle"], (esriConfig, Map, MapView, FeatureLayer, UI, BasemapToggle) => {
    
    
    const map = new Map({
          basemap: "streets-vector"
        });

        
    const view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: 4,
        center: [253, 42]
    });
    
    // renderer that will style the information from the "majorCities" featureLayer. Remember to call out the renderer in the FeatureLayer object.
    const citiesRenderer = {
        "type": "simple",
        symbol: {
            type: "simple-marker",
            color: "salmon",
            outline: {
                width: 0.5,
                color: "black"
            }
        }
    }
    
    // Feature layer focusing on major cities in the US.
    const majorCities = new FeatureLayer({
        url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Enriched%20USA%20Major%20Cities/FeatureServer",
        renderer: citiesRenderer,
        opacity: 0.5
    });
    
    let toggle = new BasemapToggle({
        view: view,
        nextBasemap: "dark-gray"
    });
    
    map.add(majorCities, 0);
    view.ui.add(toggle, "top-right");
        
    });
    
    console.log("did we make it through?");


