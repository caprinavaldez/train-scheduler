$(document).ready(function(){

	var config = {
		    apiKey: "AIzaSyDcw3r6mvnFXsyU8-KEllojDdYViQ4Spfo",
		    authDomain: "sleepdream-9ea95.firebaseapp.com",
		    databaseURL: "https://sleepdream-9ea95.firebaseio.com",
		    projectId: "sleepdream-9ea95",
		    storageBucket: "sleepdream-9ea95.appspot.com",
		    messagingSenderId: "831019833006"
		  };
		
	firebase.initializeApp(config);

	var database = firebase.database();

	$('#submitBtn').on('click', function(event){
		
		event.preventDefault();

		var trainName = $('#trainName').val().trim();
		var destination = $('#destination').val().trim();
		var firstTrainTime = $('#firstTrainTime').val().trim();
		var frequency = $('#frequency').val().trim();

		database.ref().push({
			trainName: trainName,
			destination: destination,
			firstTrainTime: firstTrainTime,
			frequency: frequency,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		});

		trainName = $('#trainName').val("");
		destination = $('#destination').val("");
		firstTrainTime = $('#firstTrainTime').val("");
		frequency = $('#frequency').val("");			
	});

	database.ref().orderByChild('dateAdded').limitToLast(10).on('child_added', function(snapshot) {

		var trainName = snapshot.val().trainName;
		var destination = snapshot.val().destination;
		var firstTrainTime = snapshot.val().firstTrainTime;
		var frequency = snapshot.val().frequency;

	    var tFrequency = frequency;
	    var firstTime = firstTrainTime;
	    console.log('frequency = ' + tFrequency);
	    console.log('first train time = ' + firstTime);

	    var firstTimeConverted = moment(firstTime, "hh:mm A").subtract(1, "days");
	    // Current Time
	    var currentTime = moment();
	    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm A"));
	    // Difference between the times
	    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	    // Time apart (remainder)
	    var tRemainder = diffTime % tFrequency;
	    console.log(tRemainder);
	    // Minute Until Train
	    var tMinutesTillTrain = tFrequency - tRemainder;
	    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
	    // Next Train
	    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
	    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));	

		var schedule = $('<tr>')
			.append($('<td>').text(trainName))
			.append($('<td>').text(destination))
			.append($('<td>').text(frequency))
			.append($('<td>').text((nextTrain).format("hh:mm A")))	
			.append($('<td>').text(tMinutesTillTrain));		
	
		$('#currentTrainTable > tbody').append(schedule)	    

	});
})