Vue.filter("timestamp", function(iso){
  return moment(iso).format("DD MMM YYYY");
});

var relativeMixin = {

  methods: {
    relativeDiff: function(event){
      var diff = moment().diff(moment(event.datetime),"days");
      return diff;
    },

      eventIsLessThanAMonthAway: function(event){
        return this.relativeDiff(event) > -30;
      },
  }

};
