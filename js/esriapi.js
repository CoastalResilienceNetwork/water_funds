define([
	"esri/layers/ArcGISDynamicMapServiceLayer", "esri/geometry/Extent", "esri/SpatialReference", "esri/tasks/query" ,"esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", 
	"esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui'
],
function ( 	ArcGISDynamicMapServiceLayer, Extent, SpatialReference, Query, QueryTask, declare, FeatureLayer, 
			SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol,Graphic, Color, lang, on, $, ui) {
        "use strict";

        return declare(null, {
			esriApiFunctions: function(t){	
				// Start with empty expressions
				t.popExp = '';
				t.partVal = '';
				t.actExp = '';
				t.benExp = '';
				
				
				// Add dynamic map service
				t.dynamicLayer = new ArcGISDynamicMapServiceLayer(t.url);
				t.map.addLayer(t.dynamicLayer);
				t.dynamicLayer.on("load", lang.hitch(t, function () { 			
					if (t.obj.visibleLayers.length > 0){	
						t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					}
					t.layersArray = t.dynamicLayer.layerInfos;
					t.clicks.layerDefUpdate(t);
					t.map.setMapCursor("pointer");
				}));
				
				// water fund point symbology
				var sym = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 20,
						new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
						new Color([0,0,255]), 2),
						new Color([206,200,58,0]));
						
				var polySym = new SimpleFillSymbol( SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(
					SimpleLineSymbol.STYLE_SOLID, new Color([0,0,255]), 2 ), new Color([0,0,0,0.1]));
					
				// create water fund point feature layer
				t.waterFundPoint = new FeatureLayer(t.url + "/1", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				t.waterFundPoint.setSelectionSymbol(sym);
				t.map.addLayer(t.waterFundPoint);
				// create water fund polygon layer
				t.waterFundPoly = new FeatureLayer(t.url + "/3", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				t.waterFundPoly.setSelectionSymbol(polySym);
				//t.map.addLayer(t.waterFundPoly);
				
				// toggle filter and attribute section 
				$('#' + t.id + 'wf_filterHeader').on('click', lang.hitch(t,function(evt){
					$('#' + t.id + 'wf_attributeWrap').slideUp();
				}));
				$('#' + t.id + 'wf_largeHeader').on('click', lang.hitch(t,function(evt){
					$('#' + t.id + 'wf_cbListener').slideUp();
				}));
				
				// on water fund selection complete
				t.waterFundPoint.on('selection-complete', lang.hitch(t,function(evt){
					if(evt.features[0] != undefined){
						t.esriapi.waterFundAttributeBuilder(evt,t);
						// slide down attribute wrapper
						$('#' + t.id + 'wf_attributeWrap').slideDown();
					}else{
						$('#' + t.id + 'wf_attributeWrap').slideUp();
					}
					// slide up water fund filter area if it is showing when water fund is clicked on the map.
					if ($('#' + t.id + 'wf_cbListener').is(":visible")){
						$('#' + t.id + 'wf_cbListener').slideUp();
					};
					
				}));
				// on water fund selection complete
				t.waterFundPoly.on('selection-complete', lang.hitch(t,function(evt){
					if(evt.features[0] != undefined){
						t.esriapi.waterFundAttributeBuilder(evt,t);
						// slide down attribute wrapper
						$('#' + t.id + 'wf_attributeWrap').slideDown();
					}else{
						$('#' + t.id + 'wf_attributeWrap').slideUp();
					}
					// slide up water fund filter area if it is showing when water fund is clicked on the map.
					if ($('#' + t.id + 'wf_cbListener').is(":visible")){
						$('#' + t.id + 'wf_cbListener').slideUp();
					};
					
				}));
				
				// call the filter function to update the vis layers when on zoom. 
				t.map.on("zoom-end", lang.hitch(t, function(evt){
					t.mapScale  = t.map.getScale();
					t.clicks.filterChange(t);
				}));
				
				// on map click do below
				t.map.on("click", lang.hitch(t, function(evt) {
					// clear graphics
					t.map.graphics.clear();
					// var centerPoint = new esri.geometry.Point(evt.mapPoint.x,evt.mapPoint.y,evt.mapPoint.spatialReference);
					// var mapWidth = t.map.extent.getWidth();
					// var mapWidthPixels = t.map.width;
					// var pixelWidth = mapWidth/mapWidthPixels;
					//change the tolerence below to adjust how many pixels will be grabbed when clicking on a point or line
					// var tolerance = 10 * pixelWidth;
					// var pnt = evt.mapPoint;
					// var ext = new esri.geometry.Extent(1,1, tolerance, tolerance, evt.mapPoint.spatialReference);
					var q = new Query();
					q.distance = 10;
					if(t.map.getScale() > 8000000){
						t.waterFundPoint.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
					}else{
						t.waterFundPoly.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
					}
				}));
				
				// control mouse pointer icon
				t.map.on("zoom-end", lang.hitch(t,function(e){
					t.map.setMapCursor("pointer");
				}));
				t.map.on("update-end", lang.hitch(t,function(e){
					t.map.setMapCursor("pointer");
				}));				
			},
			// build the attribute table for the water fund click
			waterFundAttributeBuilder: function(evt,t){
				evt = evt.features[0];
				// water fund name
				var fundName = evt.attributes.WF_Name;
				var content = "Water Fund Name: <span>" + fundName +"</span>"
				$('#' + t.id + 'wf_attName').html(content)

				// water fund year
				var fundYear = evt.attributes.OperationalYear;
				var content = "Year it became operational: <span>" + fundYear +"</span>"
				$('#' + t.id + 'wf_attYear').html(content)

				// water fund population
				var fundPop = evt.attributes.PopSize;
				var content = "Downstream population size: <span>" + fundPop +"</span>"
				$('#' + t.id + 'wf_attPop').html(content)

				// water fund sources
				var fundSource = evt.attributes.SourceWatersheds;
				var content = "Funding Source(s): <span>" + fundSource +"</span>"
				$('#' + t.id + 'wf_attSource').html(content)

				// water fund partners
				var fundPart = evt.attributes.Partners;
				var content = "Number of Partners: <span>" + fundPart +"</span>"
				$('#' + t.id + 'wf_attPart').html(content)

				// water fund area
				var fundArea = evt.attributes.Area_Actual;
				if(fundArea == '-99'){
					fundArea = "N/A";
				}
				var content = "Area impacted (hectares):<span>" + fundArea +"</span>"
				$('#' + t.id + 'wf_attArea').html(content)
				
				// area below used for populating benefits and activities 
				// water fund area
				t.esriapi.actBenPopulate(t, evt); // call the function to populate the activities and benefits list.
				
				var content = "Activities:<span>" + t.fundActivity +"</span>"
				$('#' + t.id + 'wf_attActivity').html(content)
				// water fund area
				var fundBenefit = 'Waiting for the new data, logic is ready'
				
				var content = "Benefits:<span>" + fundBenefit +"</span>"
				$('#' + t.id + 'wf_attBenefits').html(content)
				
				
			},
// Activities Benefits Populate function ////////////////////////////////////////////////////////////////////////////////////////////
			actBenPopulate: function(t, evt){
				// work with the activity array
				t.fundActivity = ''
				var actFieldArray = ['LandProtection', 'Revegetation','RiparianRestoration',
				'AgriculturalBMPs','RanchingBMPs','FireRiskManagement','WetlandRestoration_Creation',
				'Road_management', 'EnvEd', 'GenderEquity_Equality', 'RuralSanitation'];
				$.each(actFieldArray, lang.hitch(t,function(i,v){
					if(evt.attributes[v] == 1){
						if (v == 'LandProtection'){
							var v = 'Land Protection';
						}
						if (v == 'Revegetation'){
							var v = 'Revegetation';
						}
						if (v == 'RiparianRestoration'){
							var v = 'Riparian Restoration';
						}
						if (v == 'AgriculturalBMPs'){
							var v = 'Agricultural BMPs';
						}
						if (v == 'RanchingBMPs'){
							var v = 'Ranching BMPs';
						}
						if (v == 'FireRiskManagement'){
							var v = 'Fire Risk Management';
						}
						if (v == 'WetlandRestoration_Creation'){
							var v = 'Wetland Restoration/Creation';
						}
						if (v == 'Road_management'){
							var v = 'Road Management';
						}
						if (v == 'EnvEd'){
							var v = 'Environmental Education';
						}
						if (v == 'GenderEquity_Equality'){
							var v = 'Gender Equity/Equality';
						}
						if (v == 'RuralSanitation'){
							var v = 'Rural Sanitation';
						}
						// populate string 
						if(t.fundActivity.length == 0){
							t.fundActivity = v + ", "
						}else{
							t.fundActivity = t.fundActivity + v +", ";
						}
					}
				}));
				// slice off the last space and comma.
				t.fundActivity = t.fundActivity.slice(0, -2);
				// if the string is empty set the string to none.
				if(t.fundActivity.length == 0){
					t.fundActivity = "None";
				}
				
				// work with the benefit array
				t.fundBenefit = ''
				var benFieldArray = ['WaterQuality', 'WaterQuantity','Biodiversity','ClimateChange','Social'];
				$.each(benFieldArray, lang.hitch(t,function(i,v){
					if(evt.attributes[v] == 1){
						if (v == 'WaterQuality'){
							var v = 'Water Quality';
						}
						if (v == 'WaterQuantity'){
							var v = 'Water Quantity';
						}
						if (v == 'Biodiversity'){
							var v = 'Biodiversity';
						}
						if (v == 'ClimateChange'){
							var v = 'Climate Change';
						}
						if (v == 'Social'){
							var v = 'Social';
						}
						// Populate the string 
						if(t.fundBenefit.length == 0){
							t.fundBenefit = v + ", "
						}else{
							t.fundBenefit = t.fundBenefit + v +", ";
						}
					}
				}));
				// slice off the last space and comma.
				t.fundBenefit = t.fundBenefit.slice(0, -2);
				// if the string is empty set the string to none.
				if(t.fundBenefit.length == 0){
					t.fundBenefit = "None";
				}
			}
		});
    }
);