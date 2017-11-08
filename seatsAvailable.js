var $$seatComponent = Vue.extend({
  props: ['seats_available'],

  template: `

    <!--
      Bootstrap button with a conditional class colour style based on
      how many seats are available
    -->
    <button type="button" class="btn" v-bind:class="getClass">
        Available Seats:
        <span class="badge">{{seats_available}}
        </span>
    </button>
  `,

  computed: {

    /*
    ** Computes a Vue.js colour class style binding based on seats available.
    ** E.g if there are less than 5 seats the button will be red to indiciate
    ** to the user they should act quickly if they want to book the event.
    */
    getClass: function(){
      return {
        'btn-primary': (this.seats_available > 15),
        'btn-warning': (this.seats_available <= 15 && this.seats_available > 5),
        'btn-danger': (this.seats_available <= 5),
      }
    }

  },

});

//tests

// test button styling
function testButtonStyling(){
  var mount = document.createElement('div');

  var vm = new $$seatComponent({el: mount, propsData: {'seats_available': 6}});
  vm.seats_available = 7;

  if(vm.getClass["btn-warning"] !== true){
    console.error("With 7 seats available the button class should be the bootstrap warning class")
  }

}

testButtonStyling();
