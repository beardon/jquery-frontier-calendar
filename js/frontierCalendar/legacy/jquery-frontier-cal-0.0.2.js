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
	
	// using jshashset.js library
	var myCalendars = new Hashtable();
	
	/**
	 * String startsWith function. 
	 */
	String.prototype.startsWith = function(str){
		return (this.match("^"+str)==str);
	}

	/**
	 * One day cell in the calendar.
	 *
	 * Contains a reference to the JQuery Object for the day cell <div/> tag.
	 * Contains an array of all calendar events (will in the future.)
	 */
	function CalendarDayCell(jqyObj) {
		
		// jquery object that reference one day cell <div/> 
		this.jqyObj = jqyObj;

		// width, not inlcuding padding. @see jquery.width() method
		this.getWidth = function(){
			return this.jqyObj.width();
		};
		
		// width, inlcuding paddings @see jquery.innerWidth() method
		this.getInnerWidth = function(){
			return this.jqyObj.innerWidth();
		};

		// return inner width plus width of left & right border
		this.getInnerWidthPlusBorder = function(){
			return this.getInnerWidth() + this.getLeftBorderWidth() + this.getRightBorderWidth();
		};
		
		// get height of cell
		this.getHeight = function(){
			return this.jqyObj.height();
		};

		// get x coord of upper left corner
		this.getX = function(){
			return this.jqyObj.position().left;
		};
		
		// get y coord of top left corner
		this.getY = function(){
			return this.jqyObj.position().top;
		};

		// set html
		this.setHtml = function(htmlData){
			this.jqyObj.html(htmlData);
		};
		
		// get html
		this.getHtml = function(){
			return this.jqyObj.html();
		};		
		
		// set css value
		this.setCss = function(attr,value){
			this.jqyObj.css(attr,value);
		};
		
		// get css value
		this.getCss = function(attr){
			return this.jqyObj.css(attr);
		};		
		
		// set attribute value
		this.setAttr = function(id,value){
			this.jqyObj.attr(id,value);
		};
		
		// get attribute value
		this.getAttr = function(id){
			return this.jqyObj.attr(id);
		};

		this.addClickHandler = function(handler){
			this.jqyObj.bind("click",{calDayObj:this},handler);
		};
	}

	/**
	 * One header cell in the calendar header.
	 *
	 * Contains a reference to the JQuery Object for the header cell <div/> tag.
	 */
	function CalendarHeaderCell(jqyObj) {
		
		// jquery object that reference one header cell <div/> in the header <div/> 
		this.jqyObj = jqyObj;
		
		this.setHtml = function(htmlData){
			this.jqyObj.html(htmlData);
		};
		
		this.getHtml = function(){
			return this.jqyObj.html();
		};		
		
		this.setCss = function(attr,value){
			this.jqyObj.css(attr,value);
		};
		
		this.getCss = function(attr){
			return this.jqyObj.css(attr);
		};		
		
		this.setAttr = function(id,value){
			this.jqyObj.attr(id,value);
		};
		
		this.getAttr = function(id){
			return this.jqyObj.attr(id);
		};
		
		this.getX = function(){
			return this.jqyObj.position().left;
		};
		
		this.getY = function(){
			return this.jqyObj.position().top;
		};

		// width, not inlcuding padding
		this.getWidth = function(){
			return this.jqyObj.width();
		};
		
		// width, inlcuding padding
		this.getInnerWidth = function(){
			return this.jqyObj.innerWidth();
		};

		// return inner width plus width of left & right border
		this.getInnerWidthPlusBorder = function(){
			return this.jqyObj.outerWidth();
		};
		
	}

	/**
	 * Calendar header object
	 *
	 * Contains a reference to the JQuery Object for the header <div/> tag.
	 */
	function CalendarHeader(jqyObj) {
		
		// jquery object that reference the calendar header <div/>
		this.jqyObj = jqyObj;
		
		// all CalendarHeaderCell objects in the header
		this.headerCells = new Array();		
		
		// append CalendarHeaderCell object to the header
		this.appendCalendarHeaderCell = function (calHeaderCell){
			// push is not supported by IE 5/Win with the JScript 5.0 engine
			this.headerCells.push(calHeaderCell);		
			this.jqyObj.append(calHeaderCell.jqyObj);
		};
		
		// returns an array of CalendarHeaderCell objects
		this.getHeaderCells = function(){
			return this.headerCells;
		}

		this.setHtml = function(htmlData){
			this.jqyObj.html(htmlData);
		};
		
		this.getHtml = function(){
			return this.jqyObj.html();
		};		
		
		this.setCss = function(attr,value){
			this.jqyObj.css(attr,value);
		};
		
		this.getCss = function(attr){
			return this.jqyObj.css(attr);
		};		
		
		this.setAttr = function(id,value){
			this.jqyObj.attr(id,value);
		};
		
		this.getAttr = function(id){
			return this.jqyObj.attr(id);
		};
		
		// set width of the calendar header <div/>
		this.setWidth = function(w){
			this.jqyObj.width(w);
		}

		// return the sum of all the header cell widths (inlcuding their padding and borders).
		// this method does not inlcude the width of the header <div/>. See getInnerWidth()
		this.getWidth = function(){
			var width = 0;
			if(this.headerCells != null && this.headerCells.length > 0){
				for(var headIndex = 0; headIndex < this.headerCells.length; headIndex++){
					width += this.headerCells[headIndex].getInnerWidthPlusBorder();
				}
			}
			return width;
		};
		
		// same as getWidth put also includes padding of the header <div/>
		this.getInnerWidth = function(){
			return this.getWidth() + getLeftPaddingWidth() + getRightPaddingWidth();
		};
		
		// same as getInnerWidth but also inlcudes the left & right border of the header <div/>
		this.getInnerWidthPlusBorder = function(){
			return this.getInnerWidth() + getLeftBorderWidth() + getRightBorderWidth();
		};
		
	}
	
	/**
	 * Calendar week object. One row in the calendar (7 days)
	 *
	 * Contains a reference to the JQuery Object for the week <div/> tag.
	 */
	function CalendarWeek(jqyObj) {
		
		// jquery object that reference the week <div/>
		this.jqyObj = jqyObj;
		
		// all CalendarDayCell objects in the week
		this.days = new Array();
		
		// append a CalendarDayCell object
		this.appendCalendarDayCell = function (calDayCell){
			// push is not supported by IE 5/Win with the JScript 5.0 engine
			this.days.push(calDayCell);
			this.jqyObj.append(calDayCell.jqyObj);
		};
		
		// returns an array of CalendarDayCell objects
		this.getDays = function(){
			return this.days;
		}
		
		this.setHtml = function(htmlData){
			this.jqyObj.html(htmlData);
		};
		
		this.getHtml = function(){
			return this.jqyObj.html();
		};		
		
		this.setCss = function(attr,value){
			this.jqyObj.css(attr,value);
		};
		
		this.getCss = function(attr){
			return this.jqyObj.css(attr);
		};		
		
		this.setAttr = function(id,value){
			this.jqyObj.attr(id,value);
		};
		
		this.getAttr = function(id){
			return this.jqyObj.attr(id);
		};

		// set width of the calendar header <div/>
		this.setWidth = function(w){
			this.jqyObj.width(w);
		}		
	}	

	/**
	 * Calendar object
	 *
	 * Contains a reference to the JQuery Object for the calendar <div/> tag.
	 */
	function Calendar(jqyObj) {
		
		this.jqyObj = jqyObj;
		
		// reference to the CalendarHeader object
		this.calHeaderObj = null;
		
		// all CalendarWeek objects in the calendar
		this.weeks = new Array();		
		
		// by default the calendar will display the current month for the current year
		this.displayDate = Date.today();
		
		// return number of days in current month
		this.getDaysCurrentMonth = function(){
			return parseInt(Date.getDaysInMonth(this.displayDate.toString("yyyy"), this.displayDate.toString("M") - 1));
		};
		
		// return number of days in previous month
		this.getDaysPreviousMonth = function(){
			return parseInt(Date.getDaysInMonth(this.displayDate.toString("yyyy"), this.displayDate.toString("M") - 2));
		};	
		
		// return number of days in next month
		this.getDaysNextMonth = function(){
			return parseInt(Date.getDaysInMonth(this.displayDate.toString("yyyy"), this.displayDate.toString("M")));
		};
		
		this.setHtml = function(htmlData){
			this.jqyObj.html(htmlData);
		};
		
		this.getHtml = function(){
			return this.jqyObj.html();
		};		
		
		this.setCss = function(attr,value){
			this.jqyObj.css(attr,value);
		};
		
		this.getCss = function(attr){
			return this.jqyObj.css(attr);
		};		
		
		this.setAttr = function(id,value){
			this.jqyObj.attr(id,value);
		};
		
		this.getAttr = function(id){
			return this.jqyObj.attr(id);
		};		
		
		// clear the calendar (all html)
		this.clear = function(){
			this.jqyObj.html("");
		};
		
		// get height
		this.getHeight = function(){
			return this.jqyObj.height();
		}		
		
		// get width of calendar
		this.getWidth = function(){
			return this.jqyObj.width();
		};
		
		// get inner width of calendar
		this.getInnerWidth = function(){
			return this.jqyObj.innerWidth();
		};
		
		// add a CalendarHeader object
		this.addHeader = function(calHeader){
			// remove existing header if there is one
			if(this.calHeaderObj != null){
				// already have header
				var headerDiv = this.jqyObj.children("div").first();
				headerDiv.remove();
				this.calHeaderObj = calHeader;
				this.jqyObj.prepend(calHeader.jqyObj);	
			}else{
				this.calHeaderObj = calHeader;
				this.jqyObj.prepend(calHeader.jqyObj);				
			}
		};
		
		// append a CalendarWeek object
		this.addWeek = function(calWeek){
			// push is not supported by IE 5/Win with the JScript 5.0 engine
			this.weeks.push(calWeek);		
			this.jqyObj.append(calWeek.jqyObj);
		};
		
		// returns an array of CalendarWeek objects
		this.getWeeks = function(){
			return this.weeks;
		}
		
		// return the number of weeks for the current month
		this.getNumberWeeks = function(){
			return this.weeks.length;
		}
		
		// append a JQuery object
		this.appendJqyObj = function(obj){
			this.jqyObj.append(obj);
		};
		
		// call this function when the browser is resized.
		this.resize = function(){
			
			var cellPadding = 3
			var cellBorderWidth = 1
			var dayCellHeight = 75;
			var headerCellHeight = 17;			
			var cellBorderTotal = cellBorderWidth * 8;
			var cellPaddingTotal = (cellPadding * 2) * 7;
			var calWidth = this.getWidth(); // excludes padding
			var cellWidth = Math.floor(calWidth / Calendar.dayNames.length) - cellBorderWidth - (cellPadding * 2);
			var cellWidthLast = cellWidth + ( calWidth - (cellWidth * Calendar.dayNames.length)) - cellBorderTotal - cellPaddingTotal;
			
			// width of all elements inside the header <div/>
			var totalHeaderWidth = (cellWidth * 6) + cellWidthLast + cellBorderTotal + cellPaddingTotal;
			
			// set the width of the header <div/> that wraps all the header cells.
			this.calHeaderObj.setWidth(totalHeaderWidth);
			//this.calHeaderObj.jqyObj.css("width",totalHeaderWidth+"px");

			// loop over all cells in header and update their size
			var headerCellsArray = this.calHeaderObj.getHeaderCells();
			if(headerCellsArray != null && headerCellsArray.length > 0){
				for(var headIndex = 0; headIndex < headerCellsArray.length; headIndex++){
					//alert("Resizing header cell " + headIndex);
					if(headIndex == (headerCellsArray.length - 1)){
						// last cell in the header
						headerCellsArray[headIndex].setCss("width",cellWidthLast+"px");
					}else{
						headerCellsArray[headIndex].setCss("width",cellWidth+"px");
					}
				}
			}				
			
			// loop through all weeks
			var weekCount = 0;
			var weekCellsArray = this.getWeeks();
			if(weekCellsArray != null && weekCellsArray.length > 0){
				weekCount = weekCellsArray.length;
				for(var weekIndex = 0; weekIndex < weekCellsArray.length; weekIndex++){
				
					// set the width of the week <div/> that wraps all the day cells.
					weekCellsArray[weekIndex].setWidth(totalHeaderWidth);
				
					var dayCellsArray = weekCellsArray[weekIndex].getDays();
					if(dayCellsArray != null && dayCellsArray.length > 0){
						// loop through all days of the week
						for(var dayIndex = 0; dayIndex < dayCellsArray.length; dayIndex++){
							if(dayIndex == (dayCellsArray.length - 1)){
								// last day cell in the week
								dayCellsArray[dayIndex].setCss("width",cellWidthLast+"px");
							}else{
								dayCellsArray[dayIndex].setCss("width",cellWidth+"px");
							}
						}
					}
				}
			}
			
			// height of all calendar elements
			var totalCalendarHeight = 
				(weekCount * dayCellHeight) +  	   			// height of week rows
				(weekCount * (cellBorderWidth)) +  		// plus bottom borders (no top) of day cells.
				headerCellHeight + (cellBorderWidth*2); 	// plus height of header cells and their top & bottom borders.

			// set height of calendar <div/>
			this.setCss("height",totalCalendarHeight+"px");
			
			$("#calDebug").html(
				"<b>calWidth:</b> " + this.getWidth() + "<br>" +
				"<b>calHeight:</b> " + this.getHeight() + "<br>" +
				"<b>calInnerWidth:</b> " + this.getInnerWidth() + "<br>" +
				"<b>dayCellWidth:</b> " + cellWidth + "<br>" +
				"<b>lastDayCellWidth:</b> " + cellWidthLast + "<br>" +
				"<b>numberWeekRows:</b> " + weekCount + "<br>"
			);			
		
		}
	
	}
	// static properties
	Calendar.dayNames = new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat");
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//
	// Begin jquery function
	//
	$.fn.jFrontierCal = function(attr,options) {
	
		// reference to calendar element
		var calElm;
		var calId = $(this).attr('id');
	
		// default options.
		var opts;
		var defaults = {
			foo: 'bar',
			date: Date.today()
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
		var calBorder = 1;		
		// the width of the day cell borders in pixels.
		var dayCellBorderWidth = 1;
		// the amount of padding for a day cell
		var dayCellPadding = 3;			
		// the number of pixels taken up by all the left & right borders on the day cells
		var dayCellBoderTotal = dayCellBorderWidth * 8;
		// number of pixels taken up by the left & right padding in the day cells 
		var dayCellPaddingTotal = (dayCellPadding * 2) * 7;
		// the width of all the day cells besides the last one in the last column (Saturday)
		var dayCellWidth = Math.floor(calInnerWidthWithoutPad / Calendar.dayNames.length) - dayCellBorderWidth - (dayCellPadding*2);
		// make the last day cell take up the rest of the space
		var lastDayCellWidth = dayCellWidth + ( calInnerWidthWithoutPad - (dayCellWidth * Calendar.dayNames.length)) - dayCellBoderTotal - dayCellPaddingTotal;
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
			
			var calObj = buildCalendarObj();
			
			// store our calendar in a global hash so we can get at it later
			var calId = calObj.getAttr("id");
			myCalendars.put(calId,calObj);
			
			$(window).resize(handleResizeEvent);
			
			// resize after build (for firefox?)
			handleResizeEvent();
			
        });
		
		// resize all calendars in our global hash
		function handleResizeEvent(){
			if(myCalendars != null && myCalendars.size() > 0){
				var numCals = myCalendars.size();
				//alert("Resizing " + numCals + " calendars.");
				var cals = myCalendars.values();
				for(var i=0; i<cals.length; i++){
					cals[i].resize();
				}
			}
		}
		
		// build the Calendar object
		function buildCalendarObj(){
			
			var windowWidth = $(window).width();
			var documentWidth = $(document).width();			
			
			// create new calendar object and pass in the jquery div element for the cal.
			var calObj = new Calendar(calElm);
			
			// clear any previous renders
			calObj.clear();
			
			// set our border
			calObj.setCss("border",calBorder+"px solid #dddddd");
			
			/*
			// width of calendar div
			calWidth = calObj.getWidth();
			// inner width of calendar div
			calInnerWidth = calObj.getInnerWidth();
			// left side padding of calendar div
			calPaddingLeft = calObj.getCss("padding-left").replace("px","");
			// right side padding of calendar div
			calPaddingRight = calObj.getCss("padding-right").replace("px","");
			// inner width of calendar minus the padding on each side
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
			dayCellWidth = Math.floor(calInnerWidthWithoutPad / Calendar.dayNames.length) - dayCellBorderWidth - (dayCellPadding*2);
			// make the last day cell take up the rest of the space
			lastDayCellWidth = dayCellWidth + ( calInnerWidthWithoutPad - (dayCellWidth * Calendar.dayNames.length)) - dayCellBoderTotal - dayCellPaddingTotal;
			*/
			
			// create calendar header (names of days at the top)			
			var calHeaderCell;
			var calHeader = buildCalendarHeader();
			for(var dayIndex = 0; dayIndex < Calendar.dayNames.length; dayIndex++){
				calHeaderCell = buildCalendarHeaderCell();
				calHeaderCell.setHtml(Calendar.dayNames[dayIndex]);
				/*
				if(dayIndex == (Calendar.dayNames.length - 1)){
					// last day cell in the list, make it take up the rest of the space.
					calHeaderCell.setCss("width",lastDayCellWidth+"px");
					calHeaderCell.setCss("border-right",dayCellBorderWidth+"px solid #FFFFFF");
				}else{
					// give standard width
					calHeaderCell.setCss("width",dayCellWidth+"px");
				}
				*/
				calHeader.appendCalendarHeaderCell(calHeaderCell);
			}

			// add header to calendar
			calObj.addHeader(calHeader);
			
			var daysInCurrentMonth = calObj.getDaysCurrentMonth();
			var daysInPreviousMonth = calObj.getDaysPreviousMonth();
			var daysInNextMonth = calObj.getDaysNextMonth();
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
				totalDayCells += Calendar.dayNames.length - lastDayWkIndex - 1;
			}
			// number of week cells (rows) that appear on the calendar
			var numberWeekRows = Math.ceil(totalDayCells / Calendar.dayNames.length);
			
			// reset display number for day
			displayDayNumber = 1;
			
			// add week cells to calendar
			var calWeekObj;
			calWeekObj = buildFirstWeekObj(daysInPreviousMonth,firstDayWkIndex);
			//alert(calWeekObj.days);
			calObj.addWeek(calWeekObj);
			for(var weekIndex = 2; weekIndex < numberWeekRows; weekIndex++){
				calWeekObj = buildWeekCellObj();
				calObj.addWeek(calWeekObj);
			}
			calWeekObj = buildLastWeekObj(daysInCurrentMonth);
			calObj.addWeek(calWeekObj);
			
			// height of all calendar elements
			var totalCalendarHeight = 
				(numberWeekRows * dayCellHeight) +  	   // height of week rows
				(numberWeekRows * (dayCellBorderWidth)) +  // plus bottom borders (no top) of day cells.
				headerCellHeight + (dayCellBorderWidth*2); // plus height of header cells and their top & bottom borders.
				
			calObj.setCss("height",totalCalendarHeight+"px");
			
			return calObj;
			
		}
		
		/**
		 * Build the first week row.
		 *
		 * @param daysPreviousMonth - Number of days in the previous month.
		 * @param firstDayOfMonthIndex - Index of the first day of the current month (0 = Sun, 1 = Mon, 2 = Tue, etc)
		 *
		 * @return a CalendarWeek object
		 */
		function buildFirstWeekObj(daysPreviousMonth,firstDayOfMonthIndex){

			var firstDayPrevMonth = (daysPreviousMonth - firstDayOfMonthIndex) + 1;
						
			var calDayCell;
			var calWeek = buildCalendarWeek();
			
			for(var dayIndex = 0; dayIndex < Calendar.dayNames.length; dayIndex++){
				calDayCell = buildCalendarDayCell();
				if(dayIndex < firstDayOfMonthIndex){
					// previous month
					calDayCell.setHtml(firstDayPrevMonth);
					calDayCell.setAttr("id",dayCellIdPrefix + "_" + currentYearNum + "_" + (currentMonthNum-1) + "_" + firstDayPrevMonth);
					calDayCell.setCss("background-color","#cccccc");
					calDayCell.setCss("color","#999999");
					firstDayPrevMonth += 1;
				}else{
					// this month
					calDayCell.setHtml(displayDayNumber);
					calDayCell.setAttr("id",dayCellIdPrefix + "_" + currentYearNum + "_" + currentMonthNum + "_" + displayDayNumber);
					displayDayNumber += 1;
				}
				/*
				if(dayIndex == (Calendar.dayNames.length - 1)){
					// last day cell in the list, make it take up the rest of the space.
					calDayCell.setCss("width",lastDayCellWidth + "px");
					calDayCell.setCss("border-right",dayCellBorderWidth+"px solid #ffffff");
				}else{
					calDayCell.setCss("width",dayCellWidth + "px");
				}
				*/
				calWeek.appendCalendarDayCell(calDayCell);
			}
			return calWeek;
		}
		
		/**
		 * Build the last week row.
		 *
		 * @param daysInCurrentMonth - Number of days in the month.
		 *
		 * @return a CalendarWeek object
		 */
		function buildLastWeekObj(daysInCurrentMonth){
						
			var calDayCell;
			var calWeek = buildCalendarWeek();
			
			var nextMonthDisplayDayNum = 1;
			
			for(var dayIndex = 0; dayIndex < Calendar.dayNames.length; dayIndex++){
				calDayCell = buildCalendarDayCell();			
				if(displayDayNumber <= daysInCurrentMonth){
					// this month
					calDayCell.setHtml(displayDayNumber);	
					calDayCell.setAttr("id",dayCellIdPrefix + "_" + currentYearNum + "_" + currentMonthNum + "_" + displayDayNumber);
				}else{
					// next month
					calDayCell.setHtml(nextMonthDisplayDayNum);
					calDayCell.setAttr("id",dayCellIdPrefix + "_" + currentYearNum + "_" + (currentMonthNum+1) + "_" + nextMonthDisplayDayNum);				
					calDayCell.setCss("background-color","#cccccc");
					calDayCell.setCss("color","#999999");
					nextMonthDisplayDayNum += 1;
				}
				/*
				if(dayIndex == (Calendar.dayNames.length - 1)){
					// last day cell in the list, make it take up the rest of the space.
					calDayCell.setCss("width",lastDayCellWidth + "px");
					calDayCell.setCss("border-right",dayCellBorderWidth+"px solid #FFFFFF");
				}else{
					calDayCell.setCss("width",dayCellWidth + "px");
				}
				*/
				displayDayNumber += 1;
				calWeek.appendCalendarDayCell(calDayCell);
			}
			return calWeek;
		}		
		
		/**
		 * Build middle week row
		 *
		 * @return a CalendarWeek object
		 */
		function buildWeekCellObj(){
			
			var calDayCell;
			var calWeek = buildCalendarWeek();			
			
			for(var dayIndex = 0; dayIndex < Calendar.dayNames.length; dayIndex++){
				calDayCell = buildCalendarDayCell();
				calDayCell.setHtml(displayDayNumber);
				calDayCell.setAttr("id",dayCellIdPrefix + "_" + currentYearNum + "_" + currentMonthNum + "_" + displayDayNumber);
				displayDayNumber += 1;
				/*
				if(dayIndex == (Calendar.dayNames.length - 1)){
					// last day cell in the list, make it take up the rest of the space.
					calDayCell.setCss("width",lastDayCellWidth + "px");
					calDayCell.setCss("border-right",dayCellBorderWidth+"px solid #FFFFFF");
				}else{
					calDayCell.setCss("width",dayCellWidth + "px");
				}
				*/
				calWeek.appendCalendarDayCell(calDayCell);
			}
			return calWeek;
		}
		
		/**
		 * Builds a CalendarDayCell object.
		 *
		 * @return a CalendarDayCell object.
		 */
		function buildCalendarDayCell(){
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
			//dayCell.bind("click",handleDayClickEvent);
			var calDay = new CalendarDayCell(dayCell);
			calDay.addClickHandler(handleDayClickEvent);
			return calDay;
		}
		
		/**
		 * Builds a CalendarHeaderCell object.
		 *
		 * @return a CalendarHeaderCell object.
		 */
		function buildCalendarHeaderCell(){
			var headCell = $('<div/>');
			headCell.css("padding-left",dayCellPadding+"px");
			headCell.css("padding-right",dayCellPadding+"px");
			headCell.css("border-top",dayCellBorderWidth+"px solid #FFFFFF");
			headCell.css("border-bottom",dayCellBorderWidth+"px solid #FFFFFF");
			headCell.css("border-left",dayCellBorderWidth+"px solid #FFFFFF");
			headCell.css("font","13px verdana, georgia, times, arial, helvetica, sans-serif");
			headCell.css("float","left");
			headCell.css("clear","right");
			headCell.css("height",headerCellHeight+"px");
			headCell.css("background-color","#3399DD");
			headCell.css("color","#FFFFFF");
			headCell.css("font-weight","bold");
			var calHeadCell = new CalendarHeaderCell(headCell);
			return calHeadCell;
		}

		/**
		 * Builds a CalendarHeader object.
		 *
		 * @return a CalendarHeader object.
		 */
		function buildCalendarHeader(){
			var headCell = $("<div/>");
			headCell.css("width",calWidth+"px");
			//headCell.css("border","1px solid red");
			var calHeader = new CalendarHeader(headCell);			
			return calHeader;
		}
		
		/**
		 * Builds a CalendarWeek object.
		 *
		 * @return a CalendarWeek object.
		 */
		function buildCalendarWeek(){
			var weekCell = $("<div/>");
			weekCell.css("width",calWidth+"px");
			var calWeek = new CalendarWeek(weekCell);			
			return calWeek;
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
			
			//var dayCell = $(eventObj.target);
			var dayObject = eventObj.data.calDayObj;
			
			//alert(dayObject.getHtml());
			
			var id = dayObject.getAttr("id");
			
			var x = dayObject.getX();
			var y = dayObject.getY();
			var w = dayObject.getWidth();
			var h = dayObject.getHeight();
			
			//var dayCell = $(eventObj.target);
			//var dayCellId = dayCell.attr("id");
			//var position = dayCell.position();
			//var width = dayCell.width();
			//var height = dayCell.height();
			
			alert("Id: " + id + ", X: " + x + ", Y: " + y + ", W: " + w + ", H: " + h);
			
			var calItem = $('<div/>');
			calItem.css("position","absolute");
			calItem.css("left",x+"px");
			calItem.css("top",y+"px");
			calItem.css("height","15px");
			calItem.css("width","250px");
			calItem.css("background-color","red");
			calItem.css("color","white");
			calItem.css("padding","2px");
			calItem.css("font","12px verdana, georgia, times, arial, helvetica, sans-serif");
			calItem.html("This is a test");
			
			dayObject.jqyObj.append(calItem);

		}		

	};
		
})(jQuery);