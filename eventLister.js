var $$eventLister = Vue.extend({
  data: function(){
    return {
      events: [],
      loading: true,
      userLocation: "",
    }
  },

  template: `
    <!-- Page Content -->
    <div v-show="!loading">
      <div class="row">
        <div class="col-lg-12 text-center">
          <h1 class="mt-5">Latest Events</h1>

        </div>
      </div>
      <div class = "row">
          <div v-on:click="loadEvent(event)" v-for="event in events | events_in_users_location | latest | last_five" class="card" style="width: 20rem;">
              <img class="card-img-top" src={{event.img_url}} alt="Card image cap">
              <div class="card-block">
                <h4 class="card-title">{{event.title}}</h4>
                <p class="card-text">{{event.location}}</p>
                <p class="card-text">{{event.datetime | timestamp}}</p>
                <p class="card-text">
                  {{event.seats_available}} seats left.
                </p>
              </div>
          </div>
      </div>
    </div>

    <div v-show="loading">
        Loading...
    </div>

  `,

  filters: {

    timestamp: function(iso){
      return moment(iso).format("DD MMM YYYY");
    },

    events_in_users_location: function(events){
      return events.filter(function(event){
        return event.location === this.userLocation;
      }.bind(this));
    },

    showEventsWithSeatsAvailable: function(events){
      return events.filter(function(event){
        return event.seats_available > 0;
      });
    },

    latest: function(events){
      return events.slice().sort(function(eventA,eventB){
        return moment(eventA).format("X") - moment(eventB).format("X");
      });
    },

    last_five: function(events){
      return events.slice(0,5);
    },

  },

  ready: function(){
    this.getEvents();
    this.getUserLocation();
  },

  methods: {

    loadEvent: function(event){
      window.location.href = `#!/event/${event.id}`
    },

    getUserLocation: function(){
      navigator.geolocation.getCurrentPosition(function(position){
        this.$http.get(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDiDSpDN0Ps7F2WiXyqqTUbc9vHFVBPjEM&latlng=${position.coords.latitude},${position.coords.longitude}&sensor=true`).then(response => {
          this.loading = false;
          this.userLocation = response.body.results[2].formatted_address;
        })
      }.bind(this));
    },

    getEvents: function(){
      this.$http.get("data.json").then(function(resp){
        this.events = resp.body;
      });
    }

  }
})
