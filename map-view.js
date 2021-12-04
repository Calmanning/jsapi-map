console.log("That's it. just keep going.");


require(["esri/config",
        "esri/Map",     
        "esri/views/MapView", 
        "esri/layers/FeatureLayer", 
        "esri/views/ui/UI",
        "esri/widgets/BasemapToggle",
        "esri/layers/ImageryLayer"
    ], (esriConfig, Map, MapView, FeatureLayer, UI, BasemapToggle, ImageryLayer) => {
    
    
    const map = new Map({
          basemap: "gray-vector",
        });

        
    const view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: 4,
        center: [-100, 36]
    });
    
    //a SQL 'where' expression that currently has two uses - 1. It is the used to generate an option in a select widget in the top-right of the map-view. 2. It is the SQL query expression that will filter the data in the featureLayer('majorCities'). 

    
    const sqlExp = ["POPULATION > 1000000", "POPULATION < 10000", "POPULATION > 0"];

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
            color: "white",
            outline: {
                width: 1,
                color: "white"
            }
        },
        //'visualVariables allow you to change the symbol's style of the data-points presented. This one changes the size of the points based on population size. The larger the population, the larger the marker.
        visualVariables:[
            {
            type: 'size',
            field: "POPULATION",
            minDataValue: 9000,
            maxDataValue: 8000000,
            minSize: 8,
            maxSize: 25

            }, 
            //added a second visual variable. A color gradient that changes depending on the median age variable. not the best choice for a map that is already so colorful...maybe if we could toggle the layers?
            {
            type: "color",
            field: "MED_AGE",
            stops: [
                { value: 20, color: "black" },
                { value: 50, color: "orange" }
                ]
            }
        ]
    }

    //A feature layer highlighting the areas of risk in the United States.
    const riskIndex = new FeatureLayer({
        url: "https://services.arcgis.com/XG15cJAlne2vxtgt/arcgis/rest/services/National_Risk_Index_Counties/FeatureServer",
        opacity: 0.8
    })
    view.map.add(riskIndex,0)

    // Another Feature layer focusing on major cities in the US. Will be added on top of the risk index layer.
    //update: added a popupTemplate. I would like to modify it a bit later.
    //the 'definitionExpression' key is what acts as the SQL query. The featureLayer's data is filtered by that expression as it's rendered top the map. 
    const majorCities = new FeatureLayer({
        url: "https://services.arcgis.com/BG6nSlhZSAWtExvp/arcgis/rest/services/Enriched_USA_Major_Cities/FeatureServer/0",
        outfields: ["*"],
        popupTemplate: {
            title: "{NAME}",
            content: `Population: {POPULATION}
            Median Age: {MED_AGE}`
        },
        definitionExpression: "POPULATION > 1000000",
        renderer: citiesRenderer,
        opacity: 0.7,
        visible: true
    });
    view.map.add(majorCities, 1);

    
    //a simple basemap-toggle-widget. Not surving much of a function, except for an asthetic change.
    let toggle = new BasemapToggle({
        view: view,
        nextBasemap: "dark-gray"
    });
    
    //this function will change the 'definitionExpression' key in the 'majorCities' object
    //note: I had this as an arrow function originally, but it was giving me problems. Go back and see if there's something I'm missing.
    function setFeatureLayerFilter(expression){
        majorCities.definitionExpression = expression;
    }

    //this eventListener is tied to the select-widget in the mapView. The selected choice from that widget will change the 'definitionExpression in the 'majorCities' object to the selected choice.
    //could I use the 'watch' method here? what would that look like?
    selectFilter.addEventListener("change", (e) => {
        setFeatureLayerFilter(e.target.value);
    });
    
    //adding the basemap-toggle-widget to the mapView.
    view.ui.add(toggle, "bottom-right");

    //adding the select-filter-widget to the mapView
    view.ui.add(selectFilter, "top-right")


});
        


