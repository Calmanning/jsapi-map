console.log("just keep going.");
console.log("testing js connection to index.");


require(["esri/config","esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer"], (esriConfig, Map, MapView, FeatureLayer) => {
    
    esriConfig.apiKey = "AAPK115d19ab66264ef1b7cdbdd54b6804f4whm-2t82h02UCQQ1zigAlbT-GPsbqzkH4Cd1xDjXtPoshgyibnsGBM4zg-eklxut";
    
    const map = new Map({
          basemap: "streets-vector"
        });

        const fl = new FeatureLayer({
            url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Enriched%20USA%20Major%20Cities/FeatureServer"
        });



        map.add(fl, 0);
        // not sure if I need to add the below for anything...I got lost in a see of documentation.
        // fl.load().then();

        const view = new MapView({
            container: "viewDiv",
            map: map,
            zoom: 4,
            center: [253, 42]
        });
});

console.log("did we make it through?");


