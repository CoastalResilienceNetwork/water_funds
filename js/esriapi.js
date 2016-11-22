define([
	"esri/layers/ArcGISDynamicMapServiceLayer", "esri/geometry/Extent", "esri/SpatialReference", "esri/tasks/query" ,"esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", 
	"esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui'
],
function ( 	ArcGISDynamicMapServiceLayer, Extent, SpatialReference, Query, QueryTask, declare, FeatureLayer, 
			SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol,Graphic, Color, lang, on, $, ui) {
        "use strict";

        return declare(null, {
			esriApiFunctions: function(t){	
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
				
				// create water fund point feature layer
				t.waterFundPoint = new FeatureLayer(t.url + "/0", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				t.waterFundPoint.setSelectionSymbol(sym);
				t.map.addLayer(t.waterFundPoint);
				
				t.waterFundPoint.on('selection-complete', lang.hitch(t,function(evt){
					if(evt.features[0] != undefined){
						t.esriapi.waterFundAttributeBuilder(evt,t)
						// slide down attribute wrapper
						$('#' + t.id + 'wf_attributeWrap').slideDown();
					}else{
						$('#' + t.id + 'wf_attributeWrap').slideUp();
					}
					
				}));
				t.map.on("click", lang.hitch(t, function(evt) {
					var centerPoint = new esri.geometry.Point(evt.mapPoint.x,evt.mapPoint.y,evt.mapPoint.spatialReference);
					var mapWidth = t.map.extent.getWidth();
					var mapWidthPixels = t.map.width;
					var pixelWidth = mapWidth/mapWidthPixels;
					var tolerance = 20 * pixelWidth;
					var pnt = evt.mapPoint;
					var ext = new esri.geometry.Extent(1,1, tolerance, tolerance, evt.mapPoint.spatialReference);
					var q = new Query();
					q.geometry = ext.centerAt(centerPoint);
					t.waterFundPoint.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
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
				var fundYear = 'need a year attribute';
				var content = "Year it became operational: <span>" + fundYear.toUpperCase() +"</span>"
				$('#' + t.id + 'wf_attYear').html(content)

				// water fund population
				var fundPop = evt.attributes.Downstream_Pop;
				var content = "Downstream population size: <span>" + fundPop +"</span>"
				$('#' + t.id + 'wf_attPop').html(content)

				// water fund sources
				var fundSource = evt.attributes.SourceWatershed;
				var content = "Funding Source(s): <span>" + fundSource +"</span>"
				$('#' + t.id + 'wf_attSource').html(content)

				// water fund partners
				var fundPart = evt.attributes.Partners;
				var content = "Number of Partners: <span>" + fundPart +"</span>"
				$('#' + t.id + 'wf_attPart').html(content)

				// water fund area
				var fundArea = evt.attributes.Impact_Actual;
				var content = "Area impacted (hectares):<span>" + fundArea +"</span>"
				$('#' + t.id + 'wf_attArea').html(content)
				
				// area below used for populating benefits and activities 
				// water fund area
				var fundActivity = 'activity place holder, lorem, ipsum, test1, test2, test3, test4, test5'
				var content = "Activities:<span>" + fundActivity +"</span>"
				$('#' + t.id + 'wf_attActivity').html(content)
				// water fund area
				var fundBenefit = 'benefits place holder, lorem, ipsum, test1, test2, test3, test4, test5'
				var content = "Benefits:<span>" + fundBenefit +"</span>"
				$('#' + t.id + 'wf_attBenefits').html(content)
				
				
			}
		});
    }
);