console.log("just keep going.");
console.log("testing js connection to index.");


require(["esri/config",
        "esri/Map",     
        "esri/views/MapView", 
        "esri/layers/FeatureLayer", 
        "esri/views/ui/UI",
        "esri/widgets/BasemapToggle",
        "esri/layers/ImageryLayer"
    ], (esriConfig, Map, MapView, FeatureLayer, UI, BasemapToggle, ImageryLayer) => {
    
    
    const map = new Map({
          basemap: "streets-vector",
        });

        
    const view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: 4,
        center: [-100, 36]
    });
    
    //a SQL 'where' expression that currently has two uses - 1. It is the used to generate an option in a select widget in the top-right of the map-view. 2. It is the SQL query expression that will filter the data in the featureLayer('majorCities'). 
    const sqlExp = ["POPULATION > 1000000", "POPULATION < 10000"];

    //creating a html element in dom. This creates the select-filter expression widget
    const selectFilter = document.createElement("select");
        selectFilter.setAttribute("class", "esri-widget esri-select");
        selectFilter.setAttribute("style", "width: 275px; font-family Avenir Next W00; font-size: 1em;")

    //seeting up the select-filter-widget with options(choices) based on the existing entries in the 'sqlExp' array. 
    sqlExp.forEach(sql => {
        let option = document.createElement("option");
        option.value = sql;
        option.innerHTML = sql;
        selectFilter.appendChild(option);
    })


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
    //update: added a popupTemplate. I would like to modify it a bit later.
    //the 'definitionExpression' key is what acts as the SQL query. The featureLayer's data is filtered by that expression as it's rendered top the map. 
    const majorCities = new FeatureLayer({
        url: "https://services.arcgis.com/BG6nSlhZSAWtExvp/arcgis/rest/services/Enriched_USA_Major_Cities/FeatureServer/0",
        outfields: ["*"],
        popupTemplate: {
            title: "{NAME}",
            content: "Population: {POPULATION}"
        },
        definitionExpression: "POPULATION > 1000000",
        renderer: citiesRenderer,
        opacity: 0.5,
        visible: true
    });
    view.map.add(majorCities, 0);
    
    //a simple basemap-toggle-widget. Not surving much of a function, except for an asthetic change.
    let toggle = new BasemapToggle({
        view: view,
        nextBasemap: "dark-gray"
    });
    
    //this function will change the 'definitionExpression' key in the 'majorCities' object
    function setFeatureLayerFilter(expression){
        majorCities.definitionExpression = expression;
    }

    //this eventListener is tied to the select-widget in the mapView. The selected choice from that widget will change the 'definitionExpression in the 'majorCities' object to the selected choice.
    selectFilter.addEventListener("change", (e) => {
        setFeatureLayerFilter(e.target.value);
    });
    
    //adding the basemap-toggle-widget to the mapView.
    view.ui.add(toggle, "bottom-right");

    //adding the select-filter-widget to the mapView
    view.ui.add(selectFilter, "top-right")


});
        


