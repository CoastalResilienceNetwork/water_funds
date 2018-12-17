// Bring in dojo and javascript api classes as well as varObject.json, js files, and content.html
define([
	"dojo/_base/declare", "framework/PluginBase", "dijit/layout/ContentPane", "dojo/dom", "dojo/dom-style", "dojo/dom-geometry", "dojo/_base/lang", "dojo/text!./obj.json", 
	"dojo/text!./html/content.html", './js/navigation', './js/esriapi', './js/clicks', './js/barChart'
],
function ( 	declare, PluginBase, ContentPane, dom, domStyle, domGeom, lang, obj, 
			content, navigation, esriapi, clicks, barChart ) {
	return declare(PluginBase, {
		// The height and width are set here when an infographic is defined. When the user click Continue it rebuilds the app window with whatever you put in.
		toolbarName: "Water Funds", showServiceLayersInLegend: true, allowIdentifyWhenActive: false, rendered: false, resizable: false,
		hasCustomPrint: true, usePrintPreviewMap: true, previewMapSize: [1000, 550], size:'small',
		
		// First function called when the user clicks the pluging icon. 
		initialize: function (frameworkParameters) {
			// Access framework parameters
			declare.safeMixin(this, frameworkParameters);
			
			// Define object to access global variables from JSON object. Only add variables to varObject.json that are needed by Save and Share. 
			this.obj = dojo.eval("[" + obj + "]")[0];	
			this.url = "https://services2.coastalresilience.org/arcgis/rest/services/Water_Blueprint/Water_Funds/MapServer";
			this.layerDefs = [];
		},
		// Called after initialize at plugin startup (why the tests for undefined). Also called after deactivate when user closes app by clicking X. 
		hibernate: function () {
			if (this.appDiv != undefined){
				this.dynamicLayer.setVisibleLayers([-1])
			}
			this.open = "no";
		},
		// Called after hibernate at app startup. Calls the render function which builds the plugins elements and functions.   
		activate: function () {
			$('.sidebar-nav .nav-title').css("margin-left", "25px");
			if (this.rendered == false) {
				this.rendered = true;							
				this.render();
				$(this.printButton).hide();
			}else{
				this.dynamicLayer.setVisibleLayers(this.obj.visibleLayers);
				$('#' + this.id).parent().parent().css('display', 'flex');
				this.clicks.updateAccord(this);
			}	
			this.open = "yes";
		},
		// Called when user hits the minimize '_' icon on the pluging. Also called before hibernate when users closes app by clicking 'X'.
		deactivate: function () {
			if (this.appDiv != undefined){
				this.dynamicLayer.setVisibleLayers([-1])
			}
			this.open = "no";	
		},	
		// Called when user hits 'Save and Share' button. This creates the url that builds the app at a given state using JSON. 
		// Write anything to you varObject.json file you have tracked during user activity.		
		getState: function () {
			// remove this conditional statement when minimize is added
			if ( $('#' + this.id ).is(":visible") ){
				//accrodions
				if ( $('#' + this.id + 'mainAccord').is(":visible") ){
					this.obj.accordVisible = 'mainAccord';
					this.obj.accordHidden = 'infoAccord';
				}else{
					this.obj.accordVisible = 'infoAccord';
					this.obj.accordHidden = 'mainAccord';
				}	
				this.obj.accordActive = $('#' + this.id + this.obj.accordVisible).accordion( "option", "active" );
				// main button text
				this.obj.buttonText = $('#' + this.id + 'getHelpBtn').html();
				// Population checkboxes
				$('#' + this.id + 'cbWrap input').each(lang.hitch(this,function(i,v){
					if ($(v).prop('checked')){
						var pop = $(v).val();
						this.obj.checkedPopulation.push(pop)
					}	
				}));
				//extent
				this.obj.extent = this.map.geographicExtent;
				this.obj.stateSet = "yes";	
				var state = new Object();
				state = this.obj;
				console.log(this.obj)
				return state;	
			}
		},
		// Called before activate only when plugin is started from a getState url. 
		//It's overwrites the default JSON definfed in initialize with the saved stae JSON.
		setState: function (state) {
			this.obj = state;
		},
		// Called when the user hits the print icon
		beforePrint: function(printDeferred, $printArea, mapObject) {
			printDeferred.resolve();
		},	
		// Called by activate and builds the plugins elements and functions
		render: function() {
			//this.oid = -1;
			//$('.basemap-selector').trigger('change', 3);
			this.mapScale  = this.map.getScale();
			// BRING IN OTHER JS FILES
			this.barChart = new barChart();
			this.navigation = new navigation();
			this.esriapi = new esriapi();
			this.clicks = new clicks();
			// ADD HTML TO APP
			$(this.container).parent().append('<button id="viewWfInfoGraphicIcon" class="button button-default ig-icon"><img src="plugins/water_security/images/InfographicIcon_v1_23x23.png" alt="show overview graphic"></button>')
			$(this.container).parent().find("#viewWfInfoGraphicIcon").on('click',function(c){
				TINY.box.show({
					animate: false,
					html: "<img src='plugins/water_funds/images/infoGraphic.png'/>",
					fixed: true
				});
			})
			// Define Content Pane as HTML parent		
			this.appDiv = new ContentPane({style:'padding:0; color:#000; flex:1; display:flex; flex-direction:column;}'});
			this.id = this.appDiv.id
			dom.byId(this.container).appendChild(this.appDiv.domNode);	
			$('#' + this.id).parent().addClass('sty_flexColumn')
			$('#' + this.id).addClass('accord')
			if (this.obj.stateSet == "no"){
				$('#' + this.id).parent().parent().css('display', 'flex')
			}		
			// Get html from content.html, prepend appDiv.id to html element id's, and add to appDiv
			var idUpdate0 = content.replace(/for="/g, 'for="' + this.id);	
			var idUpdate = idUpdate0.replace(/id="/g, 'id="' + this.id);
			$('#' + this.id).html(idUpdate);
			// bar chart
			//this.barChart.makeChart(this);
			// Click listeners
			this.clicks.clickListener(this);
			// CALL NAVIGATION BUTTON EVENT LISTENERS 
			this.navigation.navListeners(this);
			// CREATE ESRI OBJECTS AND EVENT LISTENERS	
			this.esriapi.esriApiFunctions(this);
			this.rendered = true;	
			$("#viewWfInfoGraphicIcon").animate({backgroundColor:"rgba(243,243,21,0.3)"}, 1050, function(){
				$("#viewWfInfoGraphicIcon").animate({backgroundColor:"#ffffff"}, 1050, function(){
					$("#viewWfInfoGraphicIcon").animate({backgroundColor:"rgba(243,243,21,0.3)"}, 1050, function(){
						$("#viewWfInfoGraphicIcon").animate({backgroundColor:"#ffffff"}, 1000)
					});
				});
			});
		},
	});
});
