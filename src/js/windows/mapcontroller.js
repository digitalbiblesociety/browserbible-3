//import { Dispatcher } from '../core/dispatcher.js'

class MapController extends Dispatcher {
    constructor(id, window, data) {
        super();

        this.id = id;    
        this.window = window;
        this.data = data;
        this.googleApiKey = this.data.googleApiKey;

        this.latitude = 31.7833;
        this.longitude = 35.2167;

        this.createNodes();
        this.createMap();
    }

    createNodes() {

        this.mapContainer = $(`<div class="sofia-window-maps" id="${this.id}"></div>`)
                .appendTo(this.window.body); 

        this.input = $(`<div class="sofia-text-chooser"><input class="sofia-header-input" type="text"></div>`)
                .appendTo(this.window.header)
                .find('input');


    }

    
    createMap() {

        this.loadMapFunctionName = 'loadMap_' + this.id,
   
        
        // bind init method to window object
        window[this.loadMapFunctionName] = () => {

            let mapOptions = {
                zoom: 6,
                disableDefaultUI: true,
                center: new google.maps.LatLng(this.latitude, this.longitude),
                //mapTypeId: google.maps.MapTypeId.ROADMAP,

                mapTypeId: google.maps.MapTypeId.HYBRID,
                mapTypeControl: false,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.BOTTOM_CENTER
                },
                panControl: false,
                    panControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.LARGE,
                    position: google.maps.ControlPosition.LEFT_CENTER
                },
                scaleControl: false,
                    scaleControlOptions: {
                    position: google.maps.ControlPosition.TOP_LEFT
                },
                streetViewControl: false,
                    streetViewControlOptions: {
                    position: google.maps.ControlPosition.LEFT_TOP
                }
            };

            this.map = new google.maps.Map(document.getElementById(this.id), mapOptions); 
        }   
        
        // dynamically load map
        if (typeof window.google == 'undefined' ||
            typeof window.google.maps == 'undefined' ||
            typeof window.google.maps.Map == 'undefined') {

            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://maps.googleapis.com/maps/api/js?key=${this.googleApiKey}&callback=${this.loadMapFunctionName}`;

            document.body.appendChild(script);

        } else {        

            // load now!
            window[this.loadMapFunctionName]();
        }        
    }
}

//export { TextController }