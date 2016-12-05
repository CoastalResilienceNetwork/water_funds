define([
	"esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui', './esriapi', 'esri/dijit/editing/AttachmentEditor'
],
function ( Query, QueryTask, declare, FeatureLayer, lang, on, $, ui, esriapi, AttachmentEditor ) {
        "use strict";

        return declare(null, {
			clickListener: function(t){
				// Infographic section clicks
				$('.plugin-infographic .wf_accordHeader').on('click',lang.hitch(t,function(c){
					if ( $(c.currentTarget).next().is(":hidden") ){
						$('.plugin-infographic .wf_exWrap').slideUp();
						$(c.currentTarget).next().slideDown();
					}	
				}));
				$('#' + t.id + ' .wf_minfo').on('click',lang.hitch(t,function(c){
					var ben = c.target.id.split("-").pop();
					$('.plugin-help').trigger('click');
					$('.plugin-infographic .' + ben).trigger('click');
					$('.plugin-infographic .wf_infoWrap').siblings('span').children().html('Back');
				}));
				
				// toggle filter and attribute areas.
				$('#' + t.id + ' .wf_hs').on('click',lang.hitch(this,function(c){
					if ( $(c.currentTarget).next().is(":hidden") ){
						$('#' + t.id + ' .wf_sectionWrap').slideUp();
						$(c.currentTarget).next().slideDown();
					}
				}));
// WORK WITH CHECKBOX'S//////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// population checkbox
				t.populationArray = []
				$('#' + t.id + ' .wf_popCbWrap').on('click',lang.hitch(t,function(c){
					var val = "";
					// if they click a label to toggle the checkbox
					if (c.target.checked == undefined){
						$(c.currentTarget.children[0].children[0]).prop("checked", !$(c.currentTarget.children[0].children[0]).prop("checked") )	
						val = $(c.currentTarget.children[0].children[0]).val()
					}
					// they clicked on the checkbox
					else{
						val = c.target.value;
					}
					if ($(c.currentTarget.children[0].children[0]).prop('checked') === true){
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
					change: function( event, ui ) {
						var ben = "PartnersNum"
						t[ben] = ben + " >= " + ui.values[0] + " AND " + ben + " <= " + ui.values[1];	
						t.clicks.filterChange(t);
						var low = ui.values[0];
						var high = ui.values[1];
						if (low == high){						
							$('#' + t.id + ben + '-range').html(low);
						}else{
							$('#' + t.id + ben + '-range').html(low + " - " + high);
						}
					}
				});
				// hide and show slider
				$('#' + t.id + ' .wf_sliderCb').on('click',lang.hitch(t,function(c){
					var ben = "";
					// if they click a label to toggle the checkbox
					if (c.target.checked == undefined){
						$(c.currentTarget.children[0].children[0]).prop("checked", !$(c.currentTarget.children[0].children[0]).prop("checked") )	
						ben = $(c.currentTarget.children[0].children[0]).val()
					}
					// they clicked on the checkbox
					else{
						ben = c.target.value;
					}
					if ($(c.currentTarget.children[0].children[0]).prop('checked') === true){
						$(c.currentTarget).parent().find('.wf_rangeWrap').slideDown();
						var values = $('#' + t.id + ben + 'Slider').slider("option", "values");
						$('#' + t.id + ben + 'Slider').slider('values', values); 
					}else{
						$(c.currentTarget).parent().find('.wf_rangeWrap').slideUp();
						t[ben] = "";
						t.clicks.filterChange(t);
						$('#' + t.id + ben + '-range').html("")
					}
				}));	
// Work with Multi select dropdowns///////////////////////////////////////////////////////////////				
				require(["jquery", "plugins/water_funds/js/chosen.jquery"],lang.hitch(this,function($) {
					var configCrs =  { '.chosen-islands' : {allow_single_deselect:true, width:"310px", disable_search:true}}
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
				}));
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
						t.obj.visibleLayers = [1];
					}else{
						t.obj.visibleLayers = [3];
					}
				}else{
					if (t.mapScale > 8000000 ){
						t.obj.visibleLayers = [0,1];
					}else{
						t.obj.visibleLayers = [2,3];
					}
				}
				var layerDefinitions = [];
				layerDefinitions[0] = t.exp;
				layerDefinitions[2] = t.exp;
				t.dynamicLayer.setLayerDefinitions(layerDefinitions);
				t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				var query = new Query();
				var queryTask = new QueryTask(t.url + '/0');
				query.where = t.exp;
				queryTask.executeForCount(query,function(count){
					$('#' + t.id + 'fundCnt').html(count); 
				});				
			},
        });
    }
);