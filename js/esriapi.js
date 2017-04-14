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
				t.PartnersNum = '';
				t.actExp = '';
				t.benExp = '';
				
				t.selectedBasinPoint = '0'
				t.selectedBasinPoly = '3'
				// zoom to tracker
				t.zoomTo = 'no'
				// Add dynamic map service
				t.dynamicLayer = new ArcGISDynamicMapServiceLayer(t.url, {opacity:0.8});
				t.map.addLayer(t.dynamicLayer);
				if (t.obj.visibleLayers.length > 0){	
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				}
				t.dynamicLayer.on("load", lang.hitch(t, function () { 			
					t.layersArray = t.dynamicLayer.layerInfos;
					// Save and Share Handler					
					if (t.obj.stateSet == "yes"){
						//extent
						var extent = new Extent(t.obj.extent.xmin, t.obj.extent.ymin, t.obj.extent.xmax, t.obj.extent.ymax, new SpatialReference({ wkid:4326 }))
						t.map.setExtent(extent, true);
						// accordion visibility
						$('#' + t.id + t.obj.accordVisible).show();
						$('#' + t.id + t.obj.accordHidden).hide();
						$('#' + t.id + 'getHelpBtn').html(t.obj.buttonText);
						t.clicks.updateAccord(t);
						$('#' + t.id + t.obj.accordVisible).accordion( "option", "active", t.obj.accordActive );
						// population checkboxes
						$.each(t.obj.checkedPopulation,lang.hitch(t,function(i,v){
							$('#' + this.id + 'cbWrap input').each(lang.hitch(this,function(j,w){
								if (v == $(w).val()){
									$(w).trigger('click');
								}			
							}));	
						}));	
						t.obj.stateSet = "no";
					}	
					else{
						t.clicks.filterChange(t);
					}
					t.map.setMapCursor("pointer");
				}));
				// create water fund point feature layer
				t.waterFundPoint = new FeatureLayer(t.url + "/1", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				// create water fund polygon layer
				t.waterFundPoly = new FeatureLayer(t.url + "/3", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });
				// on water fund selection complete
				t.waterFundPoint.on('selection-complete', lang.hitch(t,function(evt){
					t.esriapi.waterFundAttributeBuilder(evt,t);
				}));
				// on water fund selection complete
				t.waterFundPoly.on('selection-complete', lang.hitch(t,function(evt){
					if (t.zoomTo == 'yes'){
						var fExt = evt.features[0].geometry.getExtent().expand(1.5);	
						t.map.setExtent(fExt, true);
						t.zoomTo = 'no';
					}else{	
						t.esriapi.waterFundAttributeBuilder(evt,t);
					}	
				}));
				// call the filter function to update the vis layers when on zoom. 
				t.map.on("zoom-end", lang.hitch(t, function(evt){
					t.mapScale  = t.map.getScale();
					t.clicks.filterChange(t);
					t.map.setMapCursor("pointer");
				}));
				t.map.on("update-end", lang.hitch(t,function(e){
					t.map.setMapCursor("pointer");
				}));
				// on map click do below
				t.map.on("click", lang.hitch(t, function(evt) {
					if (t.open == "yes"){
						// clear graphics
						t.map.graphics.clear();
						var centerPoint = new esri.geometry.Point(evt.mapPoint.x,evt.mapPoint.y,evt.mapPoint.spatialReference);
						var mapWidth = t.map.extent.getWidth();
						var mapWidthPixels = t.map.width;
						var pixelWidth = mapWidth/mapWidthPixels;
						// change the tolerence below to adjust how many pixels will be grabbed when clicking on a point or line
						var tolerance = 10 * pixelWidth;
						var pnt = evt.mapPoint;
						var ext = new esri.geometry.Extent(1,1, tolerance, tolerance, evt.mapPoint.spatialReference);
						var q = new Query();
						q.geometry = ext.centerAt(centerPoint);
						if(t.map.getScale() > 8000000){
							t.waterFundPoint.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
						}else{
							t.waterFundPoly.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW);
						}
					}
					
				}));					
			},
			// build the attribute table for the water fund click
			waterFundAttributeBuilder: function(evt,t){
				var index = t.obj.visibleLayers.indexOf(t.selectedBasinPoint);
				var index1 = t.obj.visibleLayers.indexOf(t.selectedBasinPoly);
				
				t.layerDefinitions = [];
				if(evt.features[0] != undefined){
					if ( $('#' + t.id + 'mainAccord').is(':hidden') ){
						$('#' + t.id + 'getHelpBtn').trigger('click');
					}
					t.atts = evt.features[0].attributes;
					t.oid = t.atts.OBJECTID
					t.clicks.filterChange(t);
					
					$('#' + t.id + 'wf_attributeWrap .wf_attSpan').each(lang.hitch(t,function(i,v){
						var field = v.id.split("-").pop();
						var val = t.atts[field];
						if ( isNaN(val) == false ){
							if (field != 'OperationalYear'){
								if (val == -99){
									val = "No Data"
								}else{	
									val = Math.round(val);
									val = t.esriapi.commaSeparateNumber(val);
								}	
							}	
						}	
						$('#' + v.id).html(val)
					}));
					
					$('#' + t.id + 'wf_imagePlace').slideUp()
					if (t.atts.imgName.length > 0){		
						$('#' + t.id + 'wfPic').attr("src","plugins/water_funds/images/" + t.atts.imgName);
						$('#' + t.id + 'wf_imagePlace').slideDown()
					}
					// slide down attribute wrapper
					$('#' + t.id + 'idenHeader').hide();
					$('#' + t.id + 'wf_attributeWrap').slideDown();
					$('#' + t.id + 'wf_largeHeader').trigger('click');
				}else{
					t.selectedBasinWhere = '';
					if (index > -1) {
						t.obj.visibleLayers.splice(index, 1);						
					}
					if (index1 > -1) {
						t.obj.visibleLayers.splice(index1, 1);						
					}
					t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
					t.oid = 0;
					$('#' + t.id + 'wf_attributeWrap').slideUp();
					$('#' + t.id + 'idenHeader').show();
				}	
			},
			commaSeparateNumber: function(val){
				while (/(\d+)(\d{3})/.test(val.toString())){
					val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
				}
				return val;
			}
		});
    }
);