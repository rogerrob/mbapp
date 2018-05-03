//creating initial database
var db;
var databaseName = 'dbdiet';
var databaseVersion = 2;
var openRequest = indexedDB.open(databaseName, databaseVersion);
openRequest.onupgradeneeded = function (event) {
    // This is either a newly created database, or a new version number
    // has been submitted to the open() call.
    var db = event.target.result;

     if(!db.objectStoreNames.contains('tableentry')){
      var os = db.createObjectStore('tableentry', { keyPath: 'timedate'});
      //Create Index for Name
      os.createIndex('activity','activity',{unique:false});

    db.onerror = function () {
        console.log(db.errorCode);
    };
  };

    // Create an object store and indexes. A key is a data value used to organize
    // and retrieve values in the object store. The keyPath option ideentifies where
    // the key is stored. If a key path is specified, the store can only contain
    // JavaScript objects, and each object stored must have a property with the
    // same name as the key path (unless the autoIncrement option is true).
    var store = db.createObjectStore('tableentry', { keyPath: 'timedate'});

//problems with the storing name if not unique from previous

    // Define the indexes we want to use. Objects we add to the store don't need
    // to contain these properties, but they will only appear in the specified
    // index of they do.
    //
    // syntax: store.createIndex(indexName, keyPath[, parameters]);
    //
    // All these values could have duplicates, so set unique to false
    //store.createIndex('id', 'id', { unique: true });
    store.createIndex('activity', 'activity', { unique: false });
    store.createIndex('calories', 'calories', { unique: false });
    store.createIndex('meal', 'meal', { unique: false });
    store.createIndex('notes', 'notes', { unique: false });
    store.createIndex('timedate', 'timedate', {unique: false});

    // Once the store is created, populate it
    store.transaction.oncomplete = function(event) {
      // Store values in the newly created objectStore.
      var ObjectStore = db.transaction("tableentry", "readwrite").objectStore("tableentry");
      // change the XXX.foreach name if DB = "name exists"
      tables.forEach(function(tableentrys) {
        ObjectStore.add(tableentrys);
      });
    };
};

openRequest.onsuccess = function (event) {
    // Database is open and initialized - we're good to proceed.
    db = openRequest.result;
};
openRequest.onerror = function (event) {
    console.log(openRequest.errorCode);
};

function addData() {
  var activity = $$('#activity').val();
  var meal = $$('#meal').val();
  var calories = $$('#calories').val();
  var notes = $$('#notes').val();
  var timedate = $$('#timedate').val();


  if(activity == "")
  {
      alert("Please enter a activity name!");
      return;
  }
  if(calories == "")
  {
      alert("Please fill in calories, cannot be blank");
      return;
  }
  if(timedate == "")
  {
      alert("Please select a time & date");
      return;
  }

  // open a read/write db transaction, ready for adding the data
  var transaction = db.transaction("tableentry", "readwrite");

  // create an object store on the transaction
  var objectStore = transaction.objectStore("tableentry");

  // Create a new object ready for being inserted into the ideB
  var newItem = {
    activity: activity,
    meal: meal,
    calories: calories,
    timedate: timedate,
    notes: notes
  }

  // add our newItem object to the object store
  var objectStoreRequest = objectStore.add(newItem);

  objectStoreRequest.onsuccess = function(event) {
    // report the success of the request (this does not mean the item
    // has been stored successfully in the DB - for that you need transaction.onsuccess)
    console.log("Request successful");
    alert("Data submitted!");
    window.location.href="index.html";

  // report on the success of opening the transaction
  transaction.oncomplete = function(event) {
    console.log("Transaction completed: database modification finished");
  };

  transaction.onerror = function(event) {
    alert("Transaction not opened due to error. Duplicate items not allowed");
    console.log("error", e.target.error.name);
  };
  };
};

function displayData(event) {
  var transaction = db.transaction(["tableentry"],"readonly");
	//Ask for ObjectStore
	var store = transaction.objectStore("tableentry");
	var index = store.index('activity');

	var output = '';
	index.openCursor().onsuccess = function(event){
		var cursor = event.target.result;
		if(cursor){
      output += "<tr id='newItem_"+cursor.value.activity+"'>";
      output += "<td<span class='cursor newItem'>">+cursor.value.activity+"</span></td>";
			output += "<td><span class='cursor newItem'>"+cursor.value.meal+"</span></td>";
      output += "<td><span class='cursor newItem'>"+cursor.value.calories+"</span></td>";
      output += "<td><span class='cursor newItem'>"+cursor.value.notes+"</span></td>";
      output += "<td><span class='cursor newItem'>"+cursor.value.timedate+"</span></td>";
			output += "</tr>";
			cursor.continue();

		}
    $$('#foodentries > tbody:last-child').html(output);
	};
};
//https://www.eduonix.com/dashboard/Learn-HTML5-IndexedDB-App

function deleteDB(){
  indexedDB.deleteDatabase(databaseName);
  alert("Database deleted, please reload program");
  window.location.href="index.html";
}
