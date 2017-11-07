var router = new VueRouter();

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
