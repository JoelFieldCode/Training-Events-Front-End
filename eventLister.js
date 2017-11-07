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
    <div>
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

      <div class = "row" v-show="!loading" style = "margin-bottom: 30px;">
          <div v-on:click="loadEvent(event)" v-for="event in events | dontShowOldEvents | events_in_users_location | latest | showEventsWithSeatsAvailable | last_five" class="card" style="width: 20rem;">
              <img class="card-img-top" src={{event.img_url}} alt="Card image cap">
              <div class="card-block">
                <h4 class="card-title">{{event.title}}</h4>
                <p class="card-text">{{event.location}}</p>
                <p class="card-text">{{event.datetime | timestamp}}</p>
                <p class="card-text">
                  <seats :seats_available="event.seats_available"> </seats>

                </p>
              </div>
          </div>
      </div>
    </div>

  `,

  filters: {

    events_in_users_location: function(events){
      return events.filter(function(event){
        return event.location === this.userLocation;
      }.bind(this));
    },

    dontShowOldEvents: function(events){
      return events.filter(function(event){
        return moment().isBefore(moment(event.datetime));
      })
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
      
      if($$userLocation !== null){
        this.userLocation = $$userLocation;
        this.loading = false;
        return
      }

      navigator.geolocation.getCurrentPosition(function(position){
        this.$http.get(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDiDSpDN0Ps7F2WiXyqqTUbc9vHFVBPjEM&latlng=${position.coords.latitude},${position.coords.longitude}&sensor=true`).then(response => {
          this.loading = false;
          this.userLocation = response.body.results[2].formatted_address;
          $$userLocation = this.userLocation;
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
