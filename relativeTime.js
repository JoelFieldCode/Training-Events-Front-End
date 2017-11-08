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

//tests

// test relative time computation
function testRelativeTimeComputation(){
  var mount = document.createElement('div');

  var vm = new $$relativeTime({el: mount, propsData: {'event_time': '2017-12-02T09:03:55+00:00'}});
  vm.event_time = '2017-12-02T09:03:55+00:00';

  if(vm.eventIsLessThanAMonthAway !== true){
    console.error("The event is less than a month away so this computed property should return true")
  }

}

testRelativeTimeComputation();
