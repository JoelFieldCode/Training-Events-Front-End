// router init
var router = new VueRouter();

//cached user location
var $$userLocation = null;

// init seats conditional styling component and relative time component
Vue.component('seats', $$seatComponent);
Vue.component('relative-time', $$relativeTime);

//init main controller
var app = Vue.extend({
  el: "body",
})

//init route views
router.map({

  '/': {
    component: $$eventLister
  },

  '/event/:eventId': {
    component: $$event
  }

});

//start router
router.start(app, "body");
