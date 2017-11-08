//global timestamp filter to format to readable date
Vue.filter("timestamp", function(iso){
  return moment(iso).format("DD MMM YYYY");
});
