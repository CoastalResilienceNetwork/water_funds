define([
	"esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui', './esriapi', 'esri/dijit/editing/AttachmentEditor'
],
function ( Query, QueryTask, declare, FeatureLayer, lang, on, $, ui, esriapi, AttachmentEditor ) {
        "use strict";

        return declare(null, {
			clickListener: function(t){
				// work with attachments testing area
				t.testFeatureLayer =  new FeatureLayer(t.url + "/0",{mode: FeatureLayer.MODE_ONDEMAND, outFields: ["*"] });
	//t.waterFundPoly = new FeatureLayer(t.url + "/3", { mode: FeatureLayer.MODE_SELECTION, outFields: ["*"] });			
				t.map.addLayer(t.testFeatureLayer);
				
				
				//t.map.infoWindow.setContent("<div id="+ '#' + t.id + 'content' + " style='width:100%'></div>");
				//t.map.infoWindow.resize(350,200);
				var attachmentEditor = new AttachmentEditor({}, '#' + t.id + 'content');
				attachmentEditor.startup();
				t.testFeatureLayer.on('click', lang.hitch(t,function(evt){
					console.log('test click')
					var objectId = evt.graphic.attributes[t.testFeatureLayer.objectIdField];
					console.log(objectId);
					attachmentEditor.showAttachments(evt.graphic,t.testFeatureLayer);
				}));
				
				
				// toggle filter and attribute areas.
				$('#' + t.id + ' .wf_hs').on('click',lang.hitch(this,function(c){
					if ($(c.currentTarget).next().is(":visible")){
						//$(c.currentTarget).children().html("&#xBB;");	
					}else{
						//$(c.currentTarget).children().html("&#xAB;");
					}	
					$(c.currentTarget).next().slideToggle()
				}));
// WORK WITH CHECKBOX'S//////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// population checkbox
				t.populationArray = []
				$('#' + t.id + 'wf_cbListener .popCbWrap').on('click',lang.hitch(t,function(c){
					var val = c.target.value;
					console.log(val);
					
					
					// if they click a label toggle the checkbox
					if (c.target.checked == undefined){
						$(c.currentTarget.children[0]).prop("checked", !$(c.currentTarget.children[0]).prop("checked") )	
					}
					if ($(c.currentTarget.children[0]).prop('checked') === true){
						t.populationArray.push(val);
					}else{
						console.log(val);
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
								t.popExp = "(PopSize = '" + v +"')";
								cnt = 1;
							}else{
								t.popExp = t.popExp + " AND " + "(PopSize = '" + v +"')";
								cnt+=1;
							}
						}
					}));
					console.log(t.popExp);
					t.clicks.filterChange(t);
				}));
				
				
				// t.activityArray = []
				// $('#' + t.id + 'ch-activity').chosen().change(lang.hitch(t,function(c, p){
					// if (p.selected != undefined){
						// t.activityArray.push(p.selected)
					// }
					// if (p.deselected != undefined){
						// var index = t.activityArray.indexOf(p.deselected);
						// if (index > -1) {
							// t.activityArray.splice(index, 1);
						// }
					// }
				
				// t.actExpArray = [];
				// t.actExp = '';
				// var cnt = 0;
				// $.each(t.activityArray, lang.hitch(t,function(i,v){
					// if(v.length > 0){
						// if(t.actExp.length == 0){
							// t.actExp = "("+v + " = " + 1+")";
							// cnt = 1;
						// }else{
							// t.actExp = t.actExp + " AND " + "("+v+ " = " + 1+")";
							// cnt+=1;
						// }
					// }
				// }));
				
				
				
				// partner checkbox
				// $('#' + t.id + 'wf_cbListener .wf_partCheckBox').on('click',lang.hitch(this,function(c){
					// var val = c.target.value;
					////if they click a label toggle the checkbox
					// if (c.target.checked == undefined){
						// $(c.currentTarget.children[0]).prop("checked", !$(c.currentTarget.children[0]).prop("checked") )	
					// }
					// if ($(c.currentTarget.children[0]).prop('checked') === true){
						// $(c.currentTarget).parent().find('.wf_rangeWrap').slideDown();
						// var values = $('#' + t.id + val).slider("option", "values");
						// $('#' + t.id + val).slider('values', values); 
					// }else{
						// $(c.currentTarget).parent().find('.wf_rangeWrap').slideUp();
					// }	
				// }));
				// activity checkbox
				/* $('#' + t.id + 'wf_cbListener .wf_activityCheckBox').on('click',lang.hitch(this,function(c){
					var val = c.target.value;
					// if they click a label toggle the checkbox
					if (c.target.checked == undefined){
						$(c.currentTarget.children[0]).prop("checked", !$(c.currentTarget.children[0]).prop("checked") )	
					}
					if ($(c.currentTarget.children[0]).prop('checked') === true){
						$(c.currentTarget).parent().find('.wf_activityWrapper').slideDown();
						var values = $('#' + t.id + val).slider("option", "values");
						$('#' + t.id + val).slider('values', values); 
					}else{
						$(c.currentTarget).parent().find('.wf_activityWrapper').slideUp();
					}	
				})); */
				// benefits checkbox
				/* $('#' + t.id + 'wf_cbListener .wf_benefitCheckBox').on('click',lang.hitch(this,function(c){
					var val = c.target.value;
					// if they click a label toggle the checkbox
					if (c.target.checked == undefined){
						$(c.currentTarget.children[0]).prop("checked", !$(c.currentTarget.children[0]).prop("checked") )	
					}
					if ($(c.currentTarget.children[0]).prop('checked') === true){
						$(c.currentTarget).parent().find('.wf_benefitWrapper').slideDown();
						var values = $('#' + t.id + val).slider("option", "values");
						$('#' + t.id + val).slider('values', values); 
					}else{
						$(c.currentTarget).parent().find('.wf_benefitWrapper').slideUp();
					}	
				})); */
				
				/* $('#' + t.id + 'hover1').on('mouseover',lang.hitch(this,function(c){
					$('#' + t.id + 'hover2').slideDown();
				}));
				 */
				// Create range sliders and handlers
				// $( '#' + t.id + 'population-slider' ).slider({
					// range: true, min: 0, max: 6, values: [0,  6 ], step: 1,
					// slide: function( event, ui ) {
						// t.ui1 = ui.values[0]
						// t.ui2 = ui.values[1]
						// t.clicks.populationSliderPopulate(t.ui1, t.ui2,t);
					// }
				// });
// WORK WITH SLIDER BARS ////////////////////////////////////////////////////////////////////////////////////////////////////
				// $( '#' + t.id + 'population-slider' ).slider({
					// range: true, min: 0, max: 6, values: [0,  6 ], step: 1,
					// change: function( event, ui ) {
						
						// t.ui1 = ui.values[0]
						// t.ui2 = ui.values[1]
						// t.clicks.populationSliderPopulate(t.ui1, t.ui2,t);
						// t.clicks.filterChange(t);
					// }
				// });
				
				
				// work with the partner slider
				$( '#' + t.id + 'partner-slider' ).slider({
					min: 0, max: 60,
					change: function( event, ui ) {
						if (ui.value == 60){
							var partVal = '60 or less'
							t.partVal = "(Partners = '60')";
						}else if(ui.value == 0){
							var partVal = 'All Values';
						}else{
							var partVal = ui.value.toString() + " or less";
							console.log(ui.value)
							t.partVal =  "(Partners >= " + "'" + ui.value.toString() + "'" + ")";
						}
						$('#' + t.id + 'part-range').html("(" + partVal + ")");
						t.clicks.filterChange(t);
					}
				});
				
// Work with Multi select dropdowns///////////////////////////////////////////////////////////////				
				require(["jquery", "plugins/water_funds/js/chosen.jquery"],lang.hitch(this,function($) {
					var configCrs =  { '.chosen-islands' : {allow_single_deselect:true, width:"275px", disable_search:true}}
					for (var selector in configCrs)  { $(selector).chosen(configCrs[selector]); }
				}));
				// User selections on chosen menus for activities
				require(["jquery", "plugins/water_funds/js/chosen.jquery"],lang.hitch(t,function($) {	
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
									t.actExp = "("+v + " = " + 1+")";
									cnt = 1;
								}else{
									t.actExp = t.actExp + " AND " + "("+v+ " = " + 1+")";
									cnt+=1;
								}
							}
						}));
						t.clicks.filterChange(t);
					}));
				}));
				// User selections on chosen menus for benefits
				require(["jquery", "plugins/water_funds/js/chosen.jquery"],lang.hitch(t,function($) {	
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
									t.benExp = "("+v + " = " + 1+")";
									cnt = 1;
								}else{
									t.benExp = t.benExp + " AND " + "("+v+ " = " + 1+")";
									cnt+=1;
								}
							}
						}));
						// call filter change function 
						t.clicks.filterChange(t);
					}));
				}));
			},
// UPDATE FILTER EXPRESION ///////////////////////////////////////////////////////////////////////////////////////////////////
			filterChange: function(t){
				// make a list of the various expresions.
				t.expList = [t.popExp, t.partVal, t.actExp, t.benExp];
				t.exp = '';
				t.cnt = 0;
				$.each(t.expList, lang.hitch(t, function(i,v){
					if(v.length > 0){
						if(t.exp.length == 0){
							t.exp = v;
							t.cnt = 1;
						}else{
							t.exp = t.exp + " AND " + v;
							t.cnt+=1;
						}
					}
				}));
				
				if (t.exp.length == 0){
					if (t.mapScale > 8000000 ){
						t.obj.visibleLayers = [1];
						t.map.addLayer(t.waterFundPoint);
					}else{
						t.obj.visibleLayers = [3];
						t.map.addLayer(t.waterFundPoly);
					}
					
				}else{
					if (t.mapScale > 8000000 ){
						t.obj.visibleLayers = [0,1];
						t.map.addLayer(t.waterFundPoint);
					}else{
						t.obj.visibleLayers = [2,3];
						t.map.addLayer(t.waterFundPoint);
					}
				}
				var layerDefinitions = [];
				console.log(t.exp);
				layerDefinitions[0] = t.exp;
				layerDefinitions[2] = t.exp;
				t.dynamicLayer.setLayerDefinitions(layerDefinitions);
				t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);		
			},
        });
    }
);