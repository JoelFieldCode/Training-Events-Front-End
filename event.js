var $$event = Vue.extend({
  data: function(){
    return {
      event: {},
    }
  },

  mixins: [relativeMixin],

  template: `

        <div class = "row" style = "margin-top: 50px; margin-bottom: 50px;">
          <div class="page-header">
            <h1>{{event.title}}
              <small>{{event.location}} at {{event.datetime | timestamp}}</small>

            </h1>
            <seats :seats_available="event.seats_available"> </seats>
            <template v-if="eventIsLessThanAMonthAway(event)">
              <span class = "glyphicon glyphicon-exclamation-sign" style = "color: red;">
                {{relativeDiff(event).toString().replace("-", "")}} days left!
              </span>
            </template>
          </div>
        </div>

        <div class = "row">
            <div class = "col-md-6">
                <img src={{event.img_url}} class="img-fluid" alt="Responsive image">
            </div>
            <div class = "col-md-6">
                {{event.desc}}
            </div>
        </div>

  `,

  ready: function(){
    this.getEvent();
  },

  methods: {

    getEvent: function(){
      this.$http.get("data.json").then(function(resp){
        this.event = resp.body.filter(function(event){
          return parseFloat(event.id) === parseFloat(this.$route.params.eventId);
        }.bind(this))[0];
      });
    }

  }
})
