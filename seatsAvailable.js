var $$seatComponent = Vue.extend({
  props: ['seats_available'],

  template: `
    <button type="button" class="btn" v-bind:class="getClass">
        Available Seats:
        <span class="badge">{{seats_available}}
        </span>
    </button>
  `,

  computed: {

    getClass: function(){
      return {
        'btn-primary': (this.seats_available > 5),
        'btn-warning': (this.seats_available < 5 && this.seats_available > 1),
        'btn-danger': (this.seats_available < 2),
      }
    }

  },

});
