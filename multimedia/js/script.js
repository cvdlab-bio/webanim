!(function(exports) {
	// Animation Canvas
	var canvas = $('#canvas')[0];
	var c2d = canvas.getContext('2d');
	c2d.fillStyle = "#FF8800";
	c2d.translate(canvas.width / 2, canvas.height / 2);

	// Controls
	var videoNameTextBox = $('#videoName');
	var idTagTextBox = $('#idTag'); // Not Used, Yet
	var fpsVideoTextBox = $('#fpsVideo'); // Not Used, Yet
	var getFrameButton = $('#getFrameButton');
	var startStopButton = $('#startStop');
	var createVideoButton = $('#createVideo');

	// Data Structure for containing Video properties
	var videoObject = {
		width: canvas.width,
		height: canvas.height,
		videoName: videoNameTextBox.val(),
		frameNumber: 0,
		capturedFrames: {}
	};

	// Canvas Image Data container
	var imageData;


	// BEGIN 
	// Dummy Elements added only for testing
	var frame = $('#frame')[0];
	var timingGetFrame;
	var rotationAngle = Math.PI / 256;
	var squarePosition = {
		s: canvas.height / 20,
		x: canvas.width / 4,
		y: canvas.height / 4
	};
	var timingAnimation = setInterval(function() {
		c2d.clearRect(0, 0, canvas.width, canvas.height);
		c2d.fillRect(squarePosition.x, squarePosition.y, squarePosition.s, squarePosition.s);
		c2d.rotate(rotationAngle);
	}, 40);
	// END


	// Add Event Handlers
	videoNameTextBox.on('keyup', function() {
		videoObject.videoName = $(this).val();
	});

	getFrameButton.on('click', function(e) {
		videoObject.capturedFrames[videoObject.frameNumber++] = canvas.toDataURL('image/bmp');
		var c2df = frame.getContext('2d');
		c2df.putImageData(c2d.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
	});

	startStopButton.on('click', function(e) {
		if (timingGetFrame !== undefined) {
			clearInterval(timingGetFrame);
			timingGetFrame = undefined;
		} else {
			timingGetFrame = setInterval(function(e) {
				videoObject.capturedFrames[videoObject.frameNumber++] = canvas.toDataURL();
				var c2df = frame.getContext('2d');
				c2df.putImageData(c2d.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
			}, 40);
		}
	});

	createVideoButton.on('click', function(e) {
		$.ajax({
			type: "POST",
			url: ("http://localhost:8080/encodeVideo"),
			data: videoObject,
			success: function() {
				alert("Video caricato correttamente :D\nPer scaricarlo accedi al copia il seguente link "+
						"http://localhost:8080/media/video/"+videoObject.videoName+".ogv");
			}
		});
	});

}(this));