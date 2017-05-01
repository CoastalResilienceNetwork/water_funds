define([
	"esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", "dojo/_base/lang", "dojo/on", './esriapi', 'esri/dijit/editing/AttachmentEditor',
	"./chosen.jquery"
],
function ( Query, QueryTask, declare, FeatureLayer, lang, on, esriapi, AttachmentEditor, chosen ) {
        "use strict";

        return declare(null, {
			clickListener: function(t){
				//make accrodians
				$( function() {
					$( "#" + t.id + "mainAccord" ).accordion({heightStyle: "fill"});
					$( "#" + t.id + "infoAccord" ).accordion({heightStyle: "fill"});
					$( '#' + t.id + 'mainAccord > h3' ).addClass("accord-header"); 
					$( '#' + t.id + 'infoAccord > div' ).addClass("accord-body");
					$( '#' + t.id + 'infoAccord > h3' ).addClass("accord-header"); 
					$( '#' + t.id + 'mainAccord > div' ).addClass("accord-body");
				});
				// update accordians on window resize
				var doit;
				$(window).resize(function(){
					clearTimeout(doit);
					doit = setTimeout(function() {
						t.clicks.updateAccord(t);
					}, 100);
				});	
				// leave the get help section
				$('#' + t.id + 'getHelpBtn').on('click',lang.hitch(t,function(c){
					$('#' + t.id + 'infoAccord').hide();
					$('#' + t.id + 'mainAccord').show();
					$('#' + t.id + 'getHelpBtnWrap').hide();
					t.clicks.updateAccord(t);
				}));						
				// Infographic section clicks
				$('#' + t.id + ' .sty_infoIcon').on('click',lang.hitch(t,function(c){
					$('#' + t.id + 'mainAccord').hide();
					$('#' + t.id + 'infoAccord').show();
					$('#' + t.id + 'getHelpBtnWrap').show();
					var ben = c.target.id.split("-").pop();
					$('#' + t.id + 'getHelpBtn').html('Back to Water Funds Explorer');
					t.clicks.updateAccord(t);	
					$('#' + t.id + 'infoAccord .' + ben).trigger('click');
				}));
				
// WORK WITH CHECKBOX'S//////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// population checkbox
				t.populationArray = []
				$('#' + t.id + 'cbWrap input').on('click',lang.hitch(t,function(c){
					var val = c.target.value;
					if (c.target.checked == true){
						t.populationArray.push(val);
					}else{
						var index = t.populationArray.indexOf(val);
						if (index > -1) {
							t.populationArray.splice(index, 1);
						}
					}
					t.popExpArray = [];
					t.popExp = '';
					var cnt = 0;
					$.each(t.populationArray, lang.hitch(t,function(i,v){
						if(v.length > 0){
							if(t.popExp.length == 0){
								t.popExp = v + " = " + 1 ;
								cnt = 1;
							}else{
								t.popExp = t.popExp + " OR " + v + " = " + 1;
							}
						}
					}));
					t.clicks.filterChange(t);
				}));
				// work with the partner slider
				$( '#' + t.id + 'PartnersNumSlider' ).slider({
					range:true, min: 0, max: 60, values:[0,60],
					slide: function( event, ui ){
						var ben = "PartnersNum"
						var low = ui.values[0];
						var high = ui.values[1];
						if (low == high){						
							$('#' + t.id + ben + '-range').html(low);
						}else{
							$('#' + t.id + ben + '-range').html(low + " - " + high);
						}
					},
					change: function( event, ui ) {
						var ben = "PartnersNum"
						t[ben] = ben + " >= " + ui.values[0] + " AND " + ben + " <= " + ui.values[1];	
						t.clicks.filterChange(t);
					}
				});
				// hide and show slider
				$('#' + t.id + 'partnerWrap input').on('click',lang.hitch(t,function(c){
					var ben = c.target.value;
					if (c.target.checked == true){
						$('#' + t.id + 'partnerWrap').find('.wf_rangeWrap').slideDown();
						$('#' + t.id + 'partnerWrap').find('.wf_rangeWrap').css("display", "flex");
						var values = $('#' + t.id + ben + 'Slider').slider("option", "values");
						$('#' + t.id + ben + 'Slider').slider('values', values); 
					}else{
						$('#' + t.id + 'partnerWrap').find('.wf_rangeWrap').slideUp();
						t[ben] = "";
						t.clicks.filterChange(t);
						$('#' + t.id + ben + '-range').html("")
					}
				}));	
// Work with Multi select dropdowns///////////////////////////////////////////////////////////////				
				//require(["jquery", "plugins/water_funds/js/chosen.jquery"],lang.hitch(this,function($) {
				var configCrs =  { '.chosen-islands' : {allow_single_deselect:true, width:"310px", disable_search:true}}
				for (var selector in configCrs)  { $(selector).chosen(configCrs[selector]); }
				//}));
				// User selections on chosen menus for activities
				//require(["jquery", "plugins/water_funds/js/chosen.jquery"],lang.hitch(t,function($) {	
					//Select activity
					t.activityArray = []
					$('#' + t.id + 'ch-activity').chosen().change(lang.hitch(t,function(c, p){
						if (p.selected != undefined){
							t.activityArray.push(p.selected)
						}
						if (p.deselected != undefined){
							var index = t.activityArray.indexOf(p.deselected);
							if (index > -1) {
								t.activityArray.splice(index, 1);
							}
						}
						t.actExpArray = [];
						t.actExp = '';
						var cnt = 0;
						$.each(t.activityArray, lang.hitch(t,function(i,v){
							if(v.length > 0){
								if(t.actExp.length == 0){
									t.actExp = v + " = " + 1;
									cnt = 1;
								}else{
									t.actExp = t.actExp + " AND " + v + " = " + 1;
									cnt+=1;
								}
							}
						}));
						t.clicks.filterChange(t);
					}));
				//}));
				// User selections on chosen menus for benefits
				//require(["jquery", "plugins/water_funds/js/chosen.jquery"],lang.hitch(t,function($) {	
					//Select benefit
					t.benefitArray = []
					$('#' + t.id + 'ch-benefits').chosen().change(lang.hitch(t,function(c, p){
						if (p.selected != undefined){
							t.benefitArray.push(p.selected)
						}
						if (p.deselected != undefined){
							var index = t.benefitArray.indexOf(p.deselected);
							if (index > -1) {
								t.benefitArray.splice(index, 1);
							}
						}
						t.benExpArray = [];
						t.benExp = '';
						var cnt = 0;
						$.each(t.benefitArray, lang.hitch(t,function(i,v){
							if(v.length > 0){
								if(t.benExp.length == 0){
									t.benExp = v + " = " + 1;
									cnt = 1;
								}else{
									t.benExp = t.benExp + " AND " + v + " = " + 1;
									cnt+=1;
								}
							}
						}));
						// call filter change function 
						t.clicks.filterChange(t);
					}));
				//}));
				// Zoom to water fund click
				$('#' + t.id + 'zoomToFund').on('click',lang.hitch(t,function(){
					t.zoomTo =  'yes';	
					var q = new Query();
					q.where = "WF_Name = '" + t.atts.WF_Name + "'"
					t.waterFundPoly.selectFeatures(q,esri.layers.FeatureLayer.SELECTION_NEW)
				}));	
			},
// UPDATE FILTER EXPRESION ///////////////////////////////////////////////////////////////////////////////////////////////////
			filterChange: function(t){
				t.layerDefinitions = [];
				// make a list of the various expresions.
				t.expList = [t.popExp, t.PartnersNum, t.actExp, t.benExp];
				t.exp = "";
				$.each(t.expList, lang.hitch(t, function(i,v){
					if(v.length > 0){
						if(t.exp.length == 0){
							t.exp = "(" + v + ")";
						}else{
							t.exp = t.exp + " AND (" + v + ")";
						}
					}
				}));
				if (t.exp.length == 0){
					t.exp = "OBJECTID < 0";
					if (t.mapScale > 8000000 ){
						t.obj.visibleLayers = [2];
						t.zoomLevel = 'out'
					}else{
						t.obj.visibleLayers = [5];
						t.zoomLevel = 'in'
					}
				}else{
					if (t.mapScale > 8000000 ){
						t.obj.visibleLayers = [1,2];
						t.zoomLevel = 'out'
					}else{
						t.obj.visibleLayers = [4,5];
						t.zoomLevel = 'in'
					}
				}
				
				t.selectedBasinPoint = '0'
				t.selectedBasinPoly = '3'
				
				var index = t.obj.visibleLayers.indexOf(t.selectedBasinPoint);
				var index1 = t.obj.visibleLayers.indexOf(t.selectedBasinPoly);
				t.selectedFundWhere = 'OBJECTID = ' + t.oid;
				
				//t.selectedFundWhere = 'OBJECTID = ' + t.atts.OBJECTID;
				t.layerDefinitions[t.selectedBasinPoint] = t.selectedFundWhere;
				t.layerDefinitions[t.selectedBasinPoly] = t.selectedFundWhere;
				t.layerDefinitions[1] = t.exp;
				t.layerDefinitions[4] = t.exp;
				t.dynamicLayer.setLayerDefinitions(t.layerDefinitions);
				if(index == -1 && t.oid > 0 && t.zoomLevel == 'out'){
					t.obj.visibleLayers.push(t.selectedBasinPoint);
				}
				if(index1 == -1 && t.oid > 0 && t.zoomLevel == 'in'){
					t.obj.visibleLayers.push(t.selectedBasinPoly);
				}
				t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				
				var query = new Query();
				var queryTask = new QueryTask(t.url + '/0');
				query.where = t.exp;
				queryTask.executeForCount(query,function(count){
					$('#' + t.id + 'fundCnt').html(count); 
				});				
			},
			updateAccord: function(t){
				var ma = $( "#" + t.id + "mainAccord" ).accordion( "option", "active" );
				var ia = $( "#" + t.id + "infoAccord" ).accordion( "option", "active" );
				$( "#" + t.id + "mainAccord" ).accordion('destroy');	
				$( "#" + t.id +  "infoAccord" ).accordion('destroy');	
				$( "#" + t.id + "mainAccord" ).accordion({heightStyle: "fill"}); 
				$( "#" + t.id + "infoAccord" ).accordion({heightStyle: "fill"});	
				$( "#" + t.id + "mainAccord" ).accordion( "option", "active", ma );		
				$( "#" + t.id + "infoAccord" ).accordion( "option", "active", ia );					
			}
        });
    }
);
