/* Events. */

Event = function() {
	this.ingoingSegments = [];
	this.outgoingSegments = [];
	this.tMin = Number.NEGATIVE_INFINITY;
	this.tMax = Number.POSITIVE_INFINITY;
};

Event.prototype.setId = function(id) {
	this.id = id;
};

Event.prototype.setDescription = function(desc) {
	this.desc = desc;
};

Event.prototype.addIngoingSegment = function(segment) {
	this.ingoingSegments.push(segment);
};

Event.prototype.addOutgoingSegment = function(segment) {
	this.outgoingSegments.push(segment);
};

Event.prototype.removeIngoingSegment = function(segment) {
	var index = this.ingoingSegments.indexOf(segment);
	this.ingoingSegments.splice(index,1);
};

Event.prototype.removeOutgoingSegment = function(segment) {
	var index = this.outgoingSegments.indexOf(segment);
	this.outgoingSegments.splice(index,1);
};

Event.prototype.hasZeroInDegree = function() {
	return this.ingoingSegments.length === 0;
};

Event.prototype.hasZeroOutDegree = function() {
	return this.outgoingSegments.length === 0;
}

Event.prototype.hasZeroDegree = function() {
	return this.hasZeroInDegree() && this.hasZeroInDegree();
};

Event.prototype.setTMin = function(t) {
	this.tMin = t;
};

Event.prototype.setTMax = function(t) {
	this.tMax = t;
};

Event.prototype.setStartTime = function(t) {
	this.outgoingSegments.forEach(
		function (segment) {
			segment.setStartTime(t);
		};
	);
};

/* Transition info, with information needed by the rendering part of the project */

TransitionInfo = function() {
	this.dx = 0;
	this.dy = 0;
	this.dz = 0;
	this.osx = 1;
	this.osy = 1;
	this.osz = 1;
	this.ini = false;
	this.rx = 0;
	this.ry = 0;
	this.rz = 0;
};

/* Used to identify the object referenced in the segment */
TransitionInfo.prototype.setIdObject = function(idObject) {
	this.idObject = idObject;
}

/* The same as segment.id */
TransitionInfo.prototype.setId = function(id) {
	this.id = id;
}

/* translate, rotate or scale */
TransitionInfo.prototype.setType = function(type) {
	this.type = type;
}


/* Info needed by the "translate" type of action */
TransitionInfo.prototype.setDxf = function(dxf) {
	this.dxf = dxf;
}

TransitionInfo.prototype.setDyf = function(dyf) {
	this.dyf = dyf;
}

TransitionInfo.prototype.setDzf = function(dzf) {
	this.dzf = dzf;
}


/* Info needed by the "scale" type of action */
TransitionInfo.prototype.setX = function(x) {
	this.x = x;
}

TransitionInfo.prototype.setY = function(y) {
	this.y = y;
}

TransitionInfo.prototype.setZ = function(z) {
	this.z = z;
}


/* Info needed by the "rotate" type of action */
TransitionInfo.prototype.setDgx = function(dgx) {
	this.dgx = dgx;
}

TransitionInfo.prototype.setDgy = function(dgy) {
	this.dgy = dgy;
}

TransitionInfo.prototype.setDgz = function(dgz) {
	this.dgz = dgz;
}


/* Start and end times*/
TransitionInfo.prototype.setStartTime = function(startTime) {
	this.startTime = startTime;
}

TransitionInfo.prototype.setEndTime = function(endTime) {
	this.endTime = endTime;
}



/* Segments. */

Segment = function() {};

Segment.prototype.setId = function(id) {
	this.id = id;
};

Segment.prototype.setDescription = function(desc) {
	this.desc = desc;
};

Segment.prototype.setFrom = function(from) {
	this.from = from;
};

Segment.prototype.setTo = function(to) {
	this.to = to;
};

Segment.prototype.setDuration = function(duration) {
	this.duration = duration;
};

Segment.prototype.setStartTime = function(t) {
	this.start = t;
	this.stop = t + this.duration;
};

/* Storyboard. */

Storyboard = function() {
	this.events = [];
	this.segments = [];
	this.validityIssues = [];
};

Storyboard.prototype.setSource = function(event) {
	this.source = event;
};

Storyboard.prototype.setSink = function(event) {
	this.sink = event;
};

Storyboard.prototype.newEvent = function(id) {
	return function(desc) {
		var event = new Event();

		event.setId(id);
		event.setDescription(desc);

		return event;
	};
};

Storyboard.prototype.addEvent = function(event) {
	this.events.push(event);
};

Storyboard.prototype.getEvent = function(id) {
	var results = this.events.filter(function (item, index) {
		return item.id === id;
	});
	return results[0];
};

Storyboard.prototype.removeEvent = function(event) {
	var index = this.events.indexOf(event);
	this.events.splice(index,1);
};

Storyboard.prototype.newSegment = function(id) {
	return function(desc) {
		var newSegment = new Segment();

		newSegment.setId(id);
		newSegment.setDescription(desc);
		segment.marked = false;

		return newSegment;
	};
};

Storyboard.prototype.addSegment = function(segment) {
	var from = segment.from;
	var to = segment.to;

	from.addOutgoingSegment(segment);
	to.addIngoingSegment(segment);

	this.segments.push(segment);
};

Storyboard.prototype.getSegment = function(id) {
	var results = this.segments.filter(function (item, index){
		return item.id === id;
	})
	return results[0];
};

Storyboard.prototype.removeSegment = function(segment) {
	// First, update FROM & TO Events
	var from = segment.from;
	var to = segment.to;

	from.removeOutgoingSegment(segment);
	to.removeIngoingSegment(segment);

	// Finally remove Segment
	var index = this.segments.indexOf(segment);
	this.segments.splice(index,1);
};

Storyboard.prototype.changeFrom = function(segment) {
	return function(event) {
		var oldFrom = segment.from;
		oldFrom.removeOutgoingSegment(segment);

		event.addOutgoingSegment(segment);
		segment.from = event;
	};
};

Storyboard.prototype.changeTo = function(segment) {
	return function(event) {
		var oldTo = segment.to;
		oldTo.removeIngoingSegment(segment);

		event.addIngoingSegment(segment);
		segment.to = event;
	};
};

Storyboard.prototype.validateEvents = function() {
	for (var i = 0; i < events.length && valid; i++) {
		if (events[i] === this.source) {
			if (!events[i].hasZeroInDegree()) {
				this.validityIssues.push("Source Event has ingoing Segments.");
			};
		} else if (events[i] === this.sink) {
			if (!events[i].hasZeroOutDegree()) {
				this.validityIssues.push("Sink Event has outgoing Segments.");
			};
		} else {
			if (events[i].hasZeroInDegree()) {
				this.validityIssues.push("Event "+ events[i] +" has no ingoing Segments.");
			};
			if (events[i].hasZeroOutDegree()) {
				this.validityIssues.push("Event "+ events[i] +" has no outgoing Segments.");
			};
		};
	};
};

/*
 * Kahn's algorithm for topological sorting.
 * It is also suitable for detecting cycles.
 */
Storyboard.prototype.topologicalSort = function() {
	var S = [ this.source ];
	var k = 0;

	while (S.length != 0) {
		// Remove an Event from S
		var event = S.pop();
		// Number the chosen Event
		event.topologicalOrder = k;

		// For each outgoing Segment ...
		event.outgoingSegments.forEach(
			function(segment) {
				// ... mark it
				segment.marked = true;

				// ... push its TO Event into S iff it has no marked ingoing Segments
				var to = segment.to;
				var ingoings = to.ingoingSegments;
				var found = false;
				while (var i = 0; i < ingoings.length && !found; i++) {
					if (!ingoings[i].marked) found = true;
				};
				if (!found) S.push(to);
			};
		);
	};

	// Search for non-marked Segments
	var found = false;
	for (var i = 0; i < this.segments.length && !found; i++) {
		if (!this.segments[i].marked) found = true;
	};

	// Iff there are non-marked Segments, the Storyboard contains cycles
	if (found) {
		this.validityIssues.push("Storyboard contains cycles.");
	} else {
		this.topologicallySorted = true;
	};
};

/*
 * If it is topologically sorted, there is a smart way
 * to check wether a graph is connected or not: you just
 * check if all nodes are numbered.
 */
Storyboard.prototype.checkConnection = function {
	if (this.topologicallySorted) {
		var allNumbered = true;

		for (var i = 0; i < this.events.length && allNumbered; i++) {
			if (this.events[i].topologicalOrder === undefined) allNumbered = false;
		};

		if (!allNumbered) this.validityIssues.push("Storyboard graph is not connected.");
	} else {
		// Connection check for non topologically sorted graphs
		// (Not so relevant for us)
	};
};

/*
 * Performs a full validation.
 */
Storyboard.prototype.validate = function() {
	this.validateEvents();
	this.topologicalSort(); // useful for cycle detection
	this.checkConnection();
};

/*
 * For proper working, the Storyboard Events must
 * be topologically sorted and times must be reset.
 */
Storyboard.prototype.executeCPM = function() {
	this.events.sort(
		function(e1, e2) {
			return e1.topologicalOrder > e2.topologicalOrder;
		};
	);

	// Forward
	this.events[0] = setTMin(0);
	for (var i = 1; i < this.events.length; i++) {
		var segments = this.events[i].ingoingSegments;
		for (var j = 0; j < segments.length; j++) {
			var from = segments[j].from;
			var duration = segments[j].duration;
			this.events[i].tMin = Math.max(this.events[i].tMin, from.tMin + duration);
		};
	};

	// Backward
	var last = this.events.length - 1;
	this.events[last].tMax = this.events[last].tMin;
	for (var i = last - 1; i >= 0; i--) {
		var segments = this.events[i].outgoingSegments;
		for (var j = 0; j < segments.length; j++) {
			var to = segments[j].to;
			var duration = segments[j].duration;
			this.events[i].tMax = Math.min(this.events[i].tMax, to.tMax - duration);
		};
	};
};

Storyboard.prototype.setStartTimeForEvents = function() {
	this.events.forEach(function (event) {
		event.setStartTime( (event.tMax + event.tMin) / 2 );
	});
};


Storyboard.prototype.computeActor2SegmentsFunction = function() {
	var timeline = [];
	this.segments.forEach(function (item, index) {
		var start = item.from.startTime * 1000;
		var end = item.to.startTime * 1000;
		var transitionInfo = item.desc; // transitionInfo's properties updated
		transitionInfo.setStartTime(start);
		transitionInfo.setEndTime(end);
		timeline.push(transitionInfo);
	})
	timeline.sort(function (transition1, transition2) {
		return transition1.startTime - transition2.startTime;
	});
	return timeline;
};

Storyboard.prototype.resetTimes = function() {
	this.events.forEach(
		function (event) {
			event.setTMin(Number.NEGATIVE_INFINITY);
			event.setTMax(Number.POSITIVE_INFINITY);
			event.setStartTime(undefined);
		};
	);
};

/*
 * For performances issues, some algorithms need to
 * mark Events and / or Segments, instead of copy or delete.
 * This method cleans the marks on the Storyboard, thus it
 * should be invoked each before using any mark-setting
 * algorithm.
 */
Storyboard.prototype.resetMarks = function() {
	this.segments.forEach(
		function (segment) {
			segment.marked = false;
		};
	);
};

Storyboard.prototype.resetTopologicalOrder = function() {
	this.events.forEach(
		function (event) {
			event.topologicalOrder = undefined;
		};
	);
};