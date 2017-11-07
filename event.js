var $$event = Vue.extend({
  data: function(){
    return {
      event: {},
    }
  },

  template: `

        {{event.title}}
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
