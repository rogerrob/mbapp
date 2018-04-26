// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

var storage = window.localStorage;

function addData(){
storage.setItem('Activity', document.getElementById('activity').value); // Pass a key name and its value to add or update that key.
storage.setItem('Meal', document.getElementById('meal').value);
storage.setItem('Calories', document.getElementById('calories').value);
storage.setItem('Notes', document.getElementById('notes').value);
storage.setItem('TimeDate', document.getElementById('timedate').value);
};

function getData(){
  document.getElementById("activity").innerHTML = localStorage.getItem("activity");
}

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});
