var sbc = new StoryboardController(new Listener());
sbc.addEvent("A");
sbc.addEvent("B");
sbc.startAddSegment("1->A");
sbc.setFromEventForNewSegment(1);
sbc.setToEventForNewSegment(3);
sbc.setDurationForNewSegment(4);
sbc.addSegment();
sbc.startAddSegment("A->B");
sbc.setFromEventForNewSegment(3);
sbc.setToEventForNewSegment(4);
sbc.setDurationForNewSegment(3);
sbc.addSegment();
sbc.startAddSegment("1->B");
sbc.setFromEventForNewSegment(1);
sbc.setToEventForNewSegment(4);
sbc.setDurationForNewSegment(5);
sbc.addSegment();
sbc.startAddSegment("B->2");
sbc.setFromEventForNewSegment(4);
sbc.setToEventForNewSegment(2);
sbc.setDurationForNewSegment(2);
sbc.addSegment();
sbc.processStoryboard();