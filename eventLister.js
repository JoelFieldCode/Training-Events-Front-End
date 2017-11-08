var $$eventLister = Vue.extend({
  data: function(){
    return {
      // holds our events that will be filtered/sorted/sliced later
      events: [],
      //loading spinner while google maps api computes user location
      loading: true,
      // users location
      userLocation: "",
    }
  },

  template: `

      <div class="row">
        <div class="col-lg-12 text-center">
          <h1 class="mt-5">Latest Events</h1>

        </div>
      </div>

      <div v-show="loading" class = "row" style = "margin-top: 100px;">
        <div class = "col-md-6"></div>
        <div class = "col-md-6">
          <div class = "loading">
          </div>
        </div>
      </div>

      <i v-if="noEventsFound && !loading">
        No events found in your area.
        <button style = "cursor: pointer;"class = "btn btn-success" v-on:click="userLocation = ''"> Show all events? </button>
      </i>

      <i v-if="userLocation === '' && !loading">
          Seeing events that aren't in your area? Click the "compass" icon far right
          in your browser URL box to allow us to see your location so we can tailor
          which events you will see listed here.
      </i>

      <div class = "row" v-show="!loading" style = "margin-bottom: 30px;">
          <!--
            Bootstrap card for each event, the | filters will do the following:
            - Remove events older than today
            - Remove events not from the users location (if they allow geo location API)
            - Remove events that have no seats available (0 seats)
            - Sort from now to latest future events
            - Grab the 5 most recent events starting from today

            Clicking a card will route to the detail page for the event
          -->
          <div v-on:click="loadEvent(event)" v-for="event in events | dontShowOldEvents | events_in_users_location | seatsAvailable | latest | first_five" class="card" style="width: 20rem;">
              <img style = "height: 200px;"class="card-img-top" v-bind:src="event.img_url" alt="Card image cap">
              <div class="card-block">
                <h4 class="card-title">{{event.title}}</h4>
                <p class="card-text">{{event.location}}</p>
                <p class="card-text">
                  <i> {{event.datetime | timestamp}} </i>
                  <!--
                    Uses relative time component which displays a red warning message
                    if the event is less than a month away
                  -->
                  <relative-time :event_time="event.datetime"> </relative-time>
                </p>

                <p class="card-text">
                  <!--
                    Seats available conditional styling component based on number of seats left
                  -->
                  <seats :seats_available="event.seats_available"> </seats>
                </p>

              </div>
          </div>
      </div>

  `,

  filters: {

    // Only show events from the users current location
    events_in_users_location: function(events){

      // if user didn't allow geo location API usage
      if(this.userLocation === ""){
        return events;
      }

      return events.filter(function(event){
        return event.location === this.userLocation;
      }.bind(this));

    },

    //Don't show events older than the current day
    dontShowOldEvents: function(events){
      return events.filter(function(event){
        return moment().isBefore(moment(event.datetime));
      })
    },

    // Only show events where there are actually seats available
    seatsAvailable: function(events){
      return events.filter(function(event){
        return event.seats_available > 0;
      });
    },

    // Sort by most recent
    latest: function(events){
      return events.slice().sort(function(eventA,eventB){
        return parseFloat(moment(eventA.datetime).format("X")) - parseFloat(moment(eventB.datetime).format("X"));
      });
    },

    /*
    ** Since we are sorting from now to the future
    ** we can just slice the first five events from the array to get
    ** the five most recent.
    */
    first_five: function(events){
      return events.slice(0,5);
    },

  },

  //init, get events and also User's current location.
  ready: function(){
    this.getEvents();
    this.getUserLocation();
  },

  computed: {

    // determine if no Events were found with the given filters & the user's current location.
    noEventsFound: function(){
      return this.$eval("events | dontShowOldEvents | events_in_users_location | seatsAvailable | latest | first_five").length === 0;
    }

  },

  methods: {

    // route to detail page for a event
    loadEvent: function(event){
      window.location.href = `#!/event/${event.id}`
    },

    // google maps api to get users current location
    findCity: function(position){

      this.$http.get(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDiDSpDN0Ps7F2WiXyqqTUbc9vHFVBPjEM&latlng=${position.coords.latitude},${position.coords.longitude}&sensor=true`).then(response => {
        this.loading = false;
        this.userLocation = response.body.results[2].formatted_address;
        $$userLocation = this.userLocation;
      }, error => {
        this.loading = false;
      });

    },

    // grab the users current location via the google maps api
    getUserLocation: function(){

      //detect if browser supports geo location
      if(!'geolocation' in window){
        this.loading = false;
        return;
      }

      // access cached user location for when user navigates back from
      // detail page to the main event listing
      if($$userLocation !== null){
        this.userLocation = $$userLocation;
        this.loading = false;
        return
      }

      // attempt to get users location by asking for to use
      // the geolocation API
      navigator.geolocation.getCurrentPosition(this.findCity,function(){
          this.loading = false;
      }.bind(this));

    },

    // grab events from json
    getEvents: function(){
      this.$http.get("data.json").then(function(resp){
        this.events = resp.body;
      });
    }

  }
});

//tests

// test filtering of events
function testEventFiltering(){
  var vm = new $$eventLister();

  vm.$watch("events", function(){
    vm.userLocation = "Brisbane QLD, Australia";
    var brisbaneEvents = vm.$eval("events | dontShowOldEvents | events_in_users_location | seatsAvailable | latest | first_five");

    if(findEventById(brisbaneEvents,10).length > 0){
      console.error("Shoudn't show event with ID 10 as it is from 2016");
    }

    if(findEventById(brisbaneEvents,1).length > 0){
      console.error("Shoudn't show event with ID 1 as it is in Sydney and the Users location is Brisbane QLD, Australia");
    }

    if(findEventById(brisbaneEvents,9).length > 0){
      console.error("Shoudn't show event with ID 9 as it has no seats available");
    }

    if(findEventById(brisbaneEvents,12).length > 0){
      console.error(`Shoudn't show event with ID 12 as there are 5 events that are sooner compared to today's date of ${moment().format('DD/MM/YYYY')}`);
    }

    if(findEventById(brisbaneEvents,8).length < 1){
      console.error(`Should be showing event with ID 8 as it is the second most recent event compared to today's date of ${moment().format('DD/MM/YYYY')}`);
    }

    if(brisbaneEvents[0].id !== 6){
      console.error(`Based on today's date of ${moment().format('DD/MM/YYYY')} the Event with ID 6 should be the first in the list`);
    }

    if(brisbaneEvents[4].id !== 2){
      console.error(`Based on today's date of ${moment().format('DD/MM/YYYY')} the Event with ID 2 should be the fifth item in the list`);
    }

    vm.userLocation = "Sydney QLD, Australia";
    var sydneyEvents = vm.$eval("events | dontShowOldEvents | events_in_users_location | seatsAvailable | latest | first_five");

    if(findEventById(sydneyEvents,1).length < 1){
      console.error("Should be showing event with ID 1 as the User location is set to Sydney");
    }

    vm.userLocation = "test wrong city";

    if(!vm.noEventsFound){
      console.error("No events should be listed as none of the events have a location of: 'test wrong city'");
    }

  });

  vm.getEvents();
}

/*
** test that given static postion co-ordinates the app produces Brisbane QLD, Australia
** as we filter on this exact match later.
*/
function testLocationGrabbing(){
  var vm = new $$eventLister();

  //carina position
  var position = {
    coords: {
      latitude: -27.483071199999998,
      longitude: 153.1393692
    }
  };

  //underwood position
  var position = {
    coords: {
      latitude: -27.6062687,
      longitude: 153.1088614
    }
  };

  vm.$watch("userLocation", function(){
    if(vm.userLocation !== "Brisbane QLD, Australia"){
      console.error(`User location should be Brisbane QLD, Australia with coordinates of lat: ${position.coords.latitude}, long: ${position.coords.longitude}`);
    }
  });

  vm.findCity(position);

}

function findEventById(events,id){
    return events.filter(function(event){
      return event.id === id;
    });
}

testEventFiltering();
testLocationGrabbing();
