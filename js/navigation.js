define([
	"dojo/_base/declare", "dojo/dom-style", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui', "esri/tasks/query",
	"esri/tasks/QueryTask",'esri/geometry/Extent', 'esri/SpatialReference'
],
function ( declare, domStyle, lang, on, $, ui, Query, QueryTask, Extent, SpatialReference) {
        "use strict";

        return declare(null, {

			navListeners: function(t){	
				require(["jquery", "plugins/water_funds/js/chosen.jquery"],lang.hitch(this,function($) {
					var configCrs =  { '.chosen-islands' : {allow_single_deselect:true, width:"275px", disable_search:true}}
					for (var selector in configCrs)  { $(selector).chosen(configCrs[selector]); }
				}));
				// User selections on chosen menus for activities
				require(["jquery", "plugins/water_funds/js/chosen.jquery"],lang.hitch(t,function($) {	
					//Select CRS 
					var activityArray = []
					$('#' + t.id + 'ch-activity').chosen().change(lang.hitch(t,function(c, p){
						if (p.selected != undefined){
							activityArray.push(p.selected)
						}
						if (p.deselected != undefined){
							var index = activityArray.indexOf(p.deselected);
							if (index > -1) {
								activityArray.splice(index, 1);
							}
						}
					}));
				}));
				// User selections on chosen menus for benefits
				require(["jquery", "plugins/water_funds/js/chosen.jquery"],lang.hitch(t,function($) {	
					//Select CRS 
					var benefitArray = []
					$('#' + t.id + 'ch-benefits').chosen().change(lang.hitch(t,function(c, p){
						if (p.selected != undefined){
							benefitArray.push(p.selected)
						}
						if (p.deselected != undefined){
							var index = benefitArray.indexOf(p.deselected);
							if (index > -1) {
								benefitArray.splice(index, 1);
							}
						}
					}));
				}));
			},
			setNavBtns: function(t){
					
			}	
        });
    }
);