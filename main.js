new Vue({
  el: "body",

  data: function(){
    return {
      events: [],
      userLocation: "",
    }
  },

  filters: {

    events_in_users_location: function(events){

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

    getUserLocation: function(){
      navigator.geolocation.getCurrentPosition(function(position){
        console.log(position);
        this.$http.get(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&sensor=true`).then(response => {

        })
      }.bind(this));
    },

    getEvents: function(){
      this.$http.get("data.json").then(response =>{
        this.events = response.body;
      });
    }

  },

})
