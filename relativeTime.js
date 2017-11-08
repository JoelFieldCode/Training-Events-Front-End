var $$relativeTime = Vue.extend({

  //takes a timestamp
  props: ['event_time'],

  computed: {

    // calculate diff in days from today to a ISO date
    relativeDiff: function(){
      return moment().diff(moment(this.event_time),"days");
    },

    //assert whether a event is less then one month away
    eventIsLessThanAMonthAway: function(){
      return this.relativeDiff > -30;
    },

  },

  filters : {

    // remove minus negative sign that we got from the diff calculation
    fixDiffString: function(diff){
        return diff.toString().replace("-", "");
    }

  },

  // Displays a red warning message if the event is less than a month away
  template: `

      <template v-if="eventIsLessThanAMonthAway">
          <span class = "glyphicon glyphicon-exclamation-sign" style = "color: red;">
            <i> {{relativeDiff | fixDiffString}} days left! </i>
          </span>
      </template>
  `
});
