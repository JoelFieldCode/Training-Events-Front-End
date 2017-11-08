var $$event = Vue.extend({
  data: function(){
    return {
      // holds our detail event
      event: {},
    }
  },

  template: `

        <div class = "row" style = "margin-top: 50px; margin-bottom: 50px;">
          <div class="page-header">
            <h1>{{event.title}}
              <small>{{event.location}} on {{event.datetime | timestamp}}</small>

            </h1>
            <!--
              Seats available conditional styling component based on number of seats left
            -->
            <seats :seats_available="event.seats_available"> </seats>
            <!--
              Uses relative time component which displays a red warning message
              if the event is less than a month away
            -->
            <relative-time :event_time="event.datetime"> </relative-time>
          </div>
        </div>

        <div class = "row">
            <div class = "col-md-6">
                <img v-bind:src="event.img_url" class="img-fluid" alt="Responsive image">
            </div>
            <div class = "col-md-6">
                {{event.desc}}
            </div>
        </div>

  `,

  //init, get event
  ready: function(){
    this.getEvent();
  },

  methods: {

    // get event from json by filtering for the event ID from the route params
    getEvent: function(){
      this.$http.get("data.json").then(function(resp){
        this.event = resp.body.filter(function(event){
          return parseFloat(event.id) === parseFloat(this.$route.params.eventId);
        }.bind(this))[0];
      });
    }

  }
})

//tests

// test that event detail component finds the correct event to display
function testEventFind(){
  var vm = new $$event();

  vm.$route = {};
  vm.$route.params = {};
  vm.$route.params.eventId = 3;

  vm.$watch("event", function(){
    if(vm.event.unique_key_to_find !== "find_me"){
      console.error("Not displaying the correct event based on the route param")
    }
  })

  vm.getEvent();

}

testEventFind();
