/**
 * Change History:
 *
 * May 26, 2010 - v1.0 --- Initial version.
 *
 * Seth Lenzi
 * slenzi@gmail.com
 */ 
(function($) {

	// keep track of options for each instance
	var allOptions = new Array();

	var dayNames = new Array();
	dayNames[0] = "Sun";
	dayNames[1] = "Mon";
	dayNames[2] = "Tue";
	dayNames[3] = "Wed";
	dayNames[4] = "Thu";
	dayNames[5] = "Fri";
	dayNames[6] = "Sat";
	
	/**
	 * String startsWith function. 
	 */
	String.prototype.startsWith = function(str){
		return (this.match("^"+str)==str);
	}	
	
	$.fn.jFrontierCal = function(attr,options) {
	
		// reference to calendar element
		var calElm;
		var calId = $(this).attr('id');
	
		// default options.
		var opts;
		var defaults = {
			foo: 'bar'
		};
		
		// Date object - the year & month to show
		var DisplayDate = Date.today();
		var currentYearNum = parseInt(DisplayDate.toString("yyyy"));
		var currentMonthNum = parseInt(DisplayDate.toString("M")) - 1;
		var dayCellIdPrefix = "CAL";
	
		// width of the calendar
		var calWidth = 0;
		// inner width of the calendar
		var calInnerWidth = 0;
		// left padding of the calendar element
		var calPaddingLeft = 0;
		// right padding of the calendar element
		var calPaddingRight = 0;
		// inner width of calendar element minus the padding
		var calInnerWidthWithoutPad = 0;
		// width of the calendar border
		var calBorder = 0;		
		// the width of the day cell borders in pixels.
		var dayCellBorderWidth = 1;
		// the amount of padding for a day cell
		var dayCellPadding = 3;			
		// the number of pixels taken up by all the left & right borders on the day cells
		var dayCellBoderTotal = dayCellBorderWidth * 8;
		// number of pixels taken up by the left & right padding in the day cells 
		var dayCellPaddingTotal = (dayCellPadding * 2) * 7;
		// the width of all the day cells besides the last one in the last column (Saturday)
		var dayCellWidth = Math.floor(calInnerWidthWithoutPad / dayNames.length) - dayCellBorderWidth - (dayCellPadding*2);
		// make the last day cell take up the rest of the space
		var lastDayCellWidth = dayCellWidth + ( calInnerWidthWithoutPad - (dayCellWidth * dayNames.length)) - dayCellBoderTotal - dayCellPaddingTotal;
		// day cel height
		var dayCellHeight = 75;
		// day cel height
		var headerCellHeight = 17;		
		// the day number that shows in each day cell
		var displayDayNumber = 1;
	
		// Check to see if an object is a plain object (created using "{}" or "new Object").
		if($.isPlainObject(attr)){
			
			// extend default options with any that were provided by user
			options = attr;
			opts = $.extend(defaults, options);
			allOptions[calId] = opts;			
			
		}else{
			

		}	
		
		// apply jFrontierCal to all matching elements
        return this.each(function() {
		
			calElm = $(this);
			
			buildCal();
			
			$(window).resize(handleResizeEvent);
			
			buildCal();
			
        });
		
		
		function handleResizeEvent(){
			buildCal();
		}
		
		function buildCal(){
			
			calElm.html("");
			
			calElm.css("border",calBorder+"px solid #dddddd");
			
			var windowWidth = $(window).width();
			var documentWidth = $(document).width();
			
			calWidth = calElm.width();
			calInnerWidth = calElm.innerWidth();
			calPaddingLeft = calElm.css("padding-left").replace("px","");
			calPaddingRight = calElm.css("padding-right").replace("px","");
			calInnerWidthWithoutPad = calInnerWidth - calPaddingLeft - calPaddingRight;
			// the width of the day cell borders in pixels.
			dayCellBorderWidth = 1;
			// the amount of padding for a day cell
			dayCellPadding = 3;			
			// the number of pixels taken up by all the left & right borders on the day cells
			dayCellBoderTotal = dayCellBorderWidth * 8;
			// number of pixels taken up by the left & right padding in the day cells 
			dayCellPaddingTotal = (dayCellPadding * 2) * 7;
			// the width of all the day cells besides the last one in the last column (Saturday)
			dayCellWidth = Math.floor(calInnerWidthWithoutPad / dayNames.length) - dayCellBorderWidth - (dayCellPadding*2);
			// make the last day cell take up the rest of the space
			lastDayCellWidth = dayCellWidth + ( calInnerWidthWithoutPad - (dayCellWidth * dayNames.length)) - dayCellBoderTotal - dayCellPaddingTotal;
			
			// create calendar header elements (names of days at the top)			
			var calHeaderCell;
			var calHeader = buildCalendarHeader();
			for(var dayIndex = 0; dayIndex < dayNames.length; dayIndex++){
				calHeaderCell = buildCalendarHeaderCell();
				calHeaderCell.setHtml(dayNames[dayIndex]);
				if(dayIndex == (dayNames.length - 1)){
					// last day cell in the list, make it take up the rest of the space.
					calHeaderCell.setCss("width",lastDayCellWidth+"px");
					calHeaderCell.setCss("border-right",dayCellBorderWidth+"px solid #FFFFFF");
				}else{
					// give standard width
					calHeaderCell.setCss("width",dayCellWidth+"px");
				}				
				calHeader.appendCalendarHeaderCell(calHeaderCell);
			}			
			
			var daysInCurrentMonth = parseInt(Date.getDaysInMonth(DisplayDate.toString("yyyy"), DisplayDate.toString("M") - 1));
			var daysInPreviousMonth = parseInt(Date.getDaysInMonth(DisplayDate.toString("yyyy"), DisplayDate.toString("M") - 2));
			var daysInNextMonth = parseInt(Date.getDaysInMonth(DisplayDate.toString("yyyy"), DisplayDate.toString("M")));
			var dtFirstConfig = {year: currentYearNum, month: currentMonthNum, day: 1};
			var dtLastConfig = {year: currentYearNum, month: currentMonthNum, day: daysInCurrentMonth};
			var dtFirst = Date.today().set(dtFirstConfig);
			var dtLast = Date.today().set(dtLastConfig);
			var firstDayWkIndex = getWeekIndex(dtFirst.toString("dddd"));
			var lastDayWkIndex = getWeekIndex(dtLast.toString("dddd"));
			
			// number of day cells that appear on the calendar (days for current month + any days from 
			// previous month + any days from next month.) No more than 42 days, (7 days * 6 weeks.)
			var totalDayCells = daysInCurrentMonth + firstDayWkIndex;
			if(lastDayWkIndex > 0){
				totalDayCells += dayNames.length - lastDayWkIndex - 1;
			}
			// number of week cells (rows) that appear on the calendar
			var numberWeekRows = Math.ceil(totalDayCells / dayNames.length);
			
			// reset display number for day
			displayDayNumber = 1;
			
			// build the first week cell
			var firstWeek = buildFirstWeekCell(daysInPreviousMonth,firstDayWkIndex);
			
			// add calendar header and first week to dom
			calElm.html(calHeader.jqyObj);
			calElm.append(firstWeek);
			
			// build middle weeks for month and append to dom
			var weekCell;
			var weekIndex = 2;
			for(weekIndex = 2; weekIndex < numberWeekRows; weekIndex++){
				weekCell = buildWeekCell();
				calElm.append(weekCell);
			}
			
			var lastWeek = buildLastWeekCell(daysInCurrentMonth);
			calElm.append(lastWeek);
			
			// height of all calendar elements
			var totalCalendarHeight = 
				(numberWeekRows * dayCellHeight) +  	   // height of week rows
				(numberWeekRows * (dayCellBorderWidth)) +  // plus top & bottom borders of day cells.
				headerCellHeight + (dayCellBorderWidth);   // plus height of header cells and their top & bottom borders.
				
			calElm.css("height",totalCalendarHeight+"px");
			
			$("#calDebug").html(
				"<b>Today's Date:</b> " + Date.today() + "<br>" + 
				"<b>First Day of Current Month:</b> " + dtFirst + "<br>" + 
				"<b>First Day of Current Month Wk Index:</b> " + firstDayWkIndex + "<br>" + 
				"<b>Last Day of Current Month Wk Index:</b> " + lastDayWkIndex + "<br>" + 
				"<b>Year:</b> " + Date.today().toString("yyyy") + "<br>" + 
				"<b>Month Num:</b> " + Date.today().toString("M") + "<br>" + 
				"<b>Month Name:</b> " + Date.today().toString("MMMM") + "<br>" + 
				"<b>Day Num:</b> " + Date.today().toString("d") + "<br>" + 
				"<b>Day Name:</b> " + Date.today().toString("dddd") + "<br>" + 
				"<b>Days in Current Month:</b> " + daysInCurrentMonth + "<br>" +
				"<b>Days in Previous Month:</b> " + daysInPreviousMonth + "<br>" +
				"<b>Days in Next Month:</b> " + daysInNextMonth + "<br>" +
				"<b>calWidth:</b> " + calWidth + "<br>" +
				"<b>calHeight:</b> " + calElm.height() + "<br>" +
				"<b>calInnerWidth:</b> " + calInnerWidth + "<br>" +
				"<b>calPaddingLeft:</b> " + calPaddingLeft + "<br>" +
				"<b>calPaddingRight:</b> " + calPaddingRight + "<br>" +
				"<b>calInnerWidthWithoutPad:</b> " + calInnerWidthWithoutPad + "<br>" +
				"<b>dayCellWidth:</b> " + dayCellWidth + "<br>" +
				"<b>lastDayCellWidth:</b> " + lastDayCellWidth + "<br>" +
				"<b>totalDayCells:</b> " + totalDayCells + "<br>" +
				"<b>numberWeekRows:</b> " + numberWeekRows + "<br>"
			);			
			
		}
		
		/**
		 * Build the first week row.
		 *
		 * @param daysPreviousMonth - Number of days in the previous month.
		 * @param firstDayOfMonthIndex - Index of the first day of the current month (0 = Sun, 1 = Mon, 2 = Tue, etc)
		 */
		function buildFirstWeekCell(daysPreviousMonth,firstDayOfMonthIndex){

			var firstDayPrevMonth = (daysPreviousMonth - firstDayOfMonthIndex) + 1;
			
			var dayCell;
			var calWeekCell = $("<div/>");
			calWeekCell.css("width",calWidth+"px");
			
			for(var dayIndex = 0; dayIndex < dayNames.length; dayIndex++){
				dayCell = buildCalDivCell();
				if(dayIndex < firstDayOfMonthIndex){
					// previous month
					dayCell.html(firstDayPrevMonth);
					dayCell.attr("id",dayCellIdPrefix + "_" + currentYearNum + "_" + (currentMonthNum-1) + "_" + firstDayPrevMonth);
					dayCell.css("background-color","#cccccc");
					dayCell.css("color","#999999");
					firstDayPrevMonth += 1;
				}else{
					// this month
					dayCell.html(displayDayNumber);
					dayCell.attr("id",dayCellIdPrefix + "_" + currentYearNum + "_" + currentMonthNum + "_" + displayDayNumber);
					displayDayNumber += 1;
				}
				if(dayIndex == (dayNames.length - 1)){
					// last day cell in the list, make it take up the rest of the space.
					dayCell.css("width",lastDayCellWidth + "px");
					dayCell.css("border-right",dayCellBorderWidth+"px solid #ffffff");
				}else{
					dayCell.css("width",dayCellWidth + "px");
				}			
				calWeekCell.append(dayCell);
			}
			return calWeekCell;
		}
		
		/**
		 * Build the last week row.
		 *
		 * @param daysInCurrentMonth - Number of days in the month.
		 */
		function buildLastWeekCell(daysInCurrentMonth){
			
			var dayCell;
			var calWeekCell = $("<div/>");
			calWeekCell.css("width",calWidth+"px");
			
			var nextMonthDisplayDayNum = 1;
			
			for(var dayIndex = 0; dayIndex < dayNames.length; dayIndex++){
				dayCell = buildCalDivCell();			
				if(displayDayNumber <= daysInCurrentMonth){
					// this month
					dayCell.html(displayDayNumber);	
					dayCell.attr("id",dayCellIdPrefix + "_" + currentYearNum + "_" + currentMonthNum + "_" + displayDayNumber);
				}else{
					// next month
					dayCell.html(nextMonthDisplayDayNum);
					dayCell.attr("id",dayCellIdPrefix + "_" + currentYearNum + "_" + (currentMonthNum+1) + "_" + nextMonthDisplayDayNum);				
					dayCell.css("background-color","#cccccc");
					dayCell.css("color","#999999");
					nextMonthDisplayDayNum += 1;
				}
				if(dayIndex == (dayNames.length - 1)){
					// last day cell in the list, make it take up the rest of the space.
					dayCell.css("width",lastDayCellWidth + "px");
					dayCell.css("border-right",dayCellBorderWidth+"px solid #FFFFFF");
				}else{
					dayCell.css("width",dayCellWidth + "px");
				}					
				displayDayNumber += 1;
				calWeekCell.append(dayCell);
			}
			return calWeekCell;
		}		
		
		/**
		 * Build a generic week cell.
		 */
		function buildWeekCell(){
			
			var calDay;
			var dayCell;
			var calWeekCell = $("<div/>");
			calWeekCell.css("width",calWidth+"px");
			
			for(var dayIndex = 0; dayIndex < dayNames.length; dayIndex++){
				calDay = buildCalendarDayCell();
				dayCell = calDay.jqyObj;
				dayCell.html(displayDayNumber);
				dayCell.attr("id",dayCellIdPrefix + "_" + currentYearNum + "_" + currentMonthNum + "_" + displayDayNumber);
				displayDayNumber += 1;
				if(dayIndex == (dayNames.length - 1)){
					// last day cell in the list, make it take up the rest of the space.
					dayCell.css("width",lastDayCellWidth + "px");
					dayCell.css("border-right",dayCellBorderWidth+"px solid #FFFFFF");
				}else{
					dayCell.css("width",dayCellWidth + "px");
				}			
				calWeekCell.append(dayCell);
			}
			return calWeekCell;
		}

		/**
		 * Build a generic jquery cell for the calendar.
		 *
		 * @return A jQuery object for the <div/>
		 */
		function buildCalDivCell(){
			var dayCell = $('<div/>');
			dayCell.css("background-color","#efefef");
			dayCell.css("padding-left",dayCellPadding+"px");
			dayCell.css("padding-right",dayCellPadding+"px");
			//dayCell.css("border-top",dayCellBorderWidth+"px solid #FFFFFF");
			dayCell.css("border-bottom",dayCellBorderWidth+"px solid #FFFFFF");
			dayCell.css("border-left",dayCellBorderWidth+"px solid #FFFFFF");
			dayCell.css("color","#444444");
			dayCell.css("font","13px verdana, georgia, times, arial, helvetica, sans-serif");
			dayCell.css("height",dayCellHeight+"px");
			dayCell.css("float","left");
			dayCell.css("clear","right");
			dayCell.bind("click",handleDayClickEvent);			
			return dayCell;
		}
		
		/**
		 * Builds a CalendarDayCell object.
		 *
		 * @return a CalendarDayCell object.
		 */
		function buildCalendarDayCell(){
			var dayCell = buildCalDivCell();
			var calDay = new CalendarDayCell(dayCell);
			return calDay;
		}
		
		/**
		 * Builds a CalendarHeaderCell object.
		 *
		 * @return a CalendarHeaderCell object.
		 */
		function buildCalendarHeaderCell(){
			var dayCell = buildCalDivCell();
			dayCell.css("height",headerCellHeight+"px");
			dayCell.css("background-color","#3399DD");
			dayCell.css("color","#FFFFFF");
			dayCell.css("font-weight","bold");			
			var calDay = new CalendarHeaderCell(dayCell);
			return calDay;
		}

		/**
		 * Builds a CalendarHeader object.
		 *
		 * @return a CalendarHeader object.
		 */
		function buildCalendarHeader(){
			var headCell = $("<div/>");
			headCell.css("width",calWidth+"px");
			var calHeader = new CalendarHeader(headCell);			
			return calHeader;
		}
		
		/**
		 * Gets the day index within the week for the day name
		 *
		 * getWeekIndex("Sun") = 0;
		 * getWeekIndex("Mon") = 1;
		 * getWeekIndex("Tue") = 2;
		 * getWeekIndex("Wed") = 3;
		 * getWeekIndex("Thu") = 4;
		 * getWeekIndex("Fri") = 5;
		 * getWeekIndex("Sat") = 6;
		 *
		 * @param dayName - The name of the day, fullname or abbreviated name.
		 @ @return number - Index of day within the week.
		 */
		function getWeekIndex(dayName){
			if(dayName.toUpperCase() == "SUN" || dayName.toUpperCase() == "SUNDAY"){
				return 0;
			}else if(dayName.toUpperCase() == "MON" || dayName.toUpperCase() == "MONDAY"){
				return 1;
			}else if(dayName.toUpperCase() == "TUE" || dayName.toUpperCase() == "TUESDAY"){
				return 2;
			}else if(dayName.toUpperCase() == "WED" || dayName.toUpperCase() == "WEDNESDAY"){
				return 3;
			}else if(dayName.toUpperCase() == "THU" || dayName.toUpperCase() == "THURSDAY"){
				return 4;
			}else if(dayName.toUpperCase() == "FRI" || dayName.toUpperCase() == "FRIDAY"){
				return 5;
			}else if(dayName.toUpperCase() == "SAT" || dayName.toUpperCase() == "SATURDAY"){
				return 6;
			}else{
				return -1
			}			
		}
		
		/**
		 * Test function for handling click events on day cells.
		 */
		function handleDayClickEvent(eventObj){
			var dayCell = $(eventObj.target);
			var dayCellId = dayCell.attr("id");
			var position = dayCell.position();
			var width = dayCell.width();
			var height = dayCell.height();
			//alert("Id: " + dayCellId + ", X: " + position.left + ", Y: " + position.top + ", W: " + width + ", H: " + height);
			var calItem = $('<div/>');
			calItem.css("position","absolute");
			calItem.css("left",position.left+"px");
			calItem.css("top",position.top+"px");
			calItem.css("height","15px");
			calItem.css("width","250px");
			calItem.css("background-color","red");
			calItem.css("color","white");
			calItem.css("padding","2px");
			calItem.css("font","12px verdana, georgia, times, arial, helvetica, sans-serif");
			calItem.html("This is a test");
			dayCell.append(calItem);
		}
		
		/**
		 * One day cell in the calendar.
		 *
		 * Contains a reference to the JQuery Object for the day cell <div/> tag.
		 * Contains an array of all calendar events (will in the future.)
		 */
		function CalendarDayCell(jqyObj) {
			this.jqyObj = jqyObj;
			this.getAgendaItems = getAgendaItemsForDay;
		}
		function getAgendaItemsForDay(){
			return 5;
		}

		/**
		 * One header cell in the calendar header.
		 *
		 * Contains a reference to the JQuery Object for the header cell <div/> tag.
		 */
		function CalendarHeaderCell(jqyObj) {
			this.jqyObj = jqyObj;
			this.setHtml = function(htmlData){
				this.jqyObj.append(htmlData);
			};
			// add css style element
			this.setCss = function(attr,value){
				this.jqyObj.css(attr,value);
			}
		}

		/**
		 * Calendar header object
		 *
		 * Contains a reference to the JQuery Object for the header <div/> tag.
		 */
		function CalendarHeader(jqyObj) {
			this.jqyObj = jqyObj;
			// append the header cell to the header
			this.appendCalendarHeaderCell = function (calHeaderCell){ 
				this.jqyObj.append(calHeaderCell.jqyObj);
			};
		}		

	};
		
})(jQuery);