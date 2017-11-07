var router = new VueRouter();

Vue.filter("timestamp", function(iso){
  return moment(iso).format("DD MMM YYYY");
});

var $$userLocation = null;

Vue.component('seats', $$seatComponent);

var app = Vue.extend({
  el: "body",
})

router.map({
  '/': {
    component: $$eventLister
  },

  '/event/:eventId': {
    component: $$event
  }

});

router.start(app, "body");
