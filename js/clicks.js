define([
	"esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", "dojo/_base/lang", "dojo/on", "jquery", './jquery-ui-1.11.2/jquery-ui', './esriapi'
],
function ( Query, QueryTask, declare, FeatureLayer, lang, on, $, ui, esriapi ) {
        "use strict";

        return declare(null, {
			clickListener: function(t){
				$('#' + t.id + ' .wf_hs').on('click',lang.hitch(this,function(c){
					if ($(c.currentTarget).next().is(":visible")){
						$(c.currentTarget).children().html("&#xBB;");	
					}else{
						$(c.currentTarget).children().html("&#xAB;");
					}	
					$(c.currentTarget).next().slideToggle()
				}));
				// population checkbox
				$('#' + t.id + 'wf_cbListener .wf_popCheckBox').on('click',lang.hitch(this,function(c){
					var val = c.target.value;
					// if they click a label toggle the checkbox
					if (c.target.checked == undefined){
						$(c.currentTarget.children[0]).prop("checked", !$(c.currentTarget.children[0]).prop("checked") )	
					}
					if ($(c.currentTarget.children[0]).prop('checked') === true){
						$(c.currentTarget).parent().find('.wf_rangeWrap').slideDown();
						var values = $('#' + t.id + val).slider("option", "values");
						$('#' + t.id + val).slider('values', values); 
					}else{
						$(c.currentTarget).parent().find('.wf_rangeWrap').slideUp();
					}	
				}));
				// partner checkbox
				$('#' + t.id + 'wf_cbListener .wf_partCheckBox').on('click',lang.hitch(this,function(c){
					var val = c.target.value;
					// if they click a label toggle the checkbox
					if (c.target.checked == undefined){
						$(c.currentTarget.children[0]).prop("checked", !$(c.currentTarget.children[0]).prop("checked") )	
					}
					if ($(c.currentTarget.children[0]).prop('checked') === true){
						$(c.currentTarget).parent().find('.wf_rangeWrap').slideDown();
						var values = $('#' + t.id + val).slider("option", "values");
						$('#' + t.id + val).slider('values', values); 
					}else{
						$(c.currentTarget).parent().find('.wf_rangeWrap').slideUp();
					}	
				}));
				// activity checkbox
				$('#' + t.id + 'wf_cbListener .wf_activityCheckBox').on('click',lang.hitch(this,function(c){
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
				}));
				// benefits checkbox
				$('#' + t.id + 'wf_cbListener .wf_benefitCheckBox').on('click',lang.hitch(this,function(c){
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
				}));
				
				/* $('#' + t.id + 'hover1').on('mouseover',lang.hitch(this,function(c){
					$('#' + t.id + 'hover2').slideDown();
				}));
				 */
				// Create range sliders and handlers
				$( '#' + t.id + 'population-slider' ).slider({
					range: true, min: 0, max: 6, values: [0,  6 ], step: 1,
					slide: function( event, ui ) {
						t.ui1 = ui.values[0]
						t.ui2 = ui.values[1]
						t.clicks.populationSliderPopulate(t.ui1, t.ui2,t);
					}
				});
				// work with the partner slider
				$( '#' + t.id + 'partner-slider' ).slider({
					min: 0, max: 100,
					slide: function( event, ui ) {
						if (ui.value == 100){
							partVal = '100+'
						}else{
							t.partVal =  ui.value;
						}
						$('#' + t.id + 'part-range').html("(" + t.partVal + ")");
					}
				});
			},
			populationSliderPopulate: function(ui1, ui2, t){
				var val1, val2
				// logic for first slider
				if (ui1 == 0){
					val1 = '>50,000'
				}
				if (ui1 == 1){
					val1 = '50,000'
				}
				if (ui1 == 2){
					val1 = '100,000'
				}
				if (ui1 == 3){
					val1 = '500,000'
				}
				if (ui1 == 4){
					val1 = '1,000,000'
				}
				if (ui1 == 5){
					val1 = '5,000,000'
				}
				if (ui1 == 6){
					val1 = '5,000,000 +'
				}
				// logic for second slider
				if (ui2 == 0){
					val2 = '>50,000'
				}
				if (ui2 == 1){
					val2 = '50,000'
				}
				if (ui2 == 2){
					val2 = '100,000'
				}
				if (ui2 == 3){
					val2 = '500,000'
				}
				if (ui2 == 4){
					val2 = '1,000,000'
				}
				if (ui2 == 5){
					val2 = '5,000,000'
				}
				if (ui2 == 6){
					val2 = '5,000,000 +'
				}
				t.populationRange = val1 + ' ' + val2;
				$('#' + t.id + 'pop-range').html("(" + val1 + " - " + val2 +')');
			}
	
        });
    }
);