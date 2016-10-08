/**
 * JSONLayout write the logs in JSON format.
 * JSON library is required to use this Layout. See also {@link http://www.json.org}
 * @constructor
 * @extends Log4js.Layout
 * @author Stephan Strittmatter
 */
Log4js.JSONLayout = function() {
       this.df = new Log4js.DateFormatter();
};
Log4js.JSONLayout.prototype = Log4js.extend(new Log4js.Layout(), /** @lends Log4js.JSONLayout# */ {
	/**
	 * Implement this method to create your own layout format.
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to format
	 * @return formatted String
	 * @type String
	 */
	format: function(loggingEvent) {

				var useragent = "unknown";
		try {
			useragent = navigator.userAgent;
		} catch(e){
			useragent = "unknown";
		}

		var referer = "unknown";
		try {
			referer = location.href;
		} catch(e){
			referer = "unknown";
		}

    var obj = {LoggingEvent: {}};
    var event = obj.LoggingEvent;
    event.logger = loggingEvent.categoryName;
    event.level = loggingEvent.level.toString();
    if(typeof loggingEvent.message === 'string'){
      event.message = loggingEvent.message;
    }else if(typeof loggingEvent.message === 'object'){
      for(var nextKey in loggingEvent.message){
        if(loggingEvent.message.hasOwnProperty(nextKey)){
          event[nextKey] = loggingEvent.message[nextKey];
        }
      }
    }
    event.referer = referer;
    event.useragent = useragent;
    if(loggingEvent.exception){
      event.exception = loggingEvent.exception.toString();
    }
    event.timestamp = loggingEvent.getFormattedTimestamp();

    return JSON.stringify(obj);

    /*var jsonString = "{\n \"LoggingEvent\": {\n";

		jsonString += "\t\"logger\": \"" +  loggingEvent.categoryName + "\",\n";
		jsonString += "\t\"level\": \"" +  loggingEvent.level.toString() + "\",\n";
		jsonString += this.formatMessage(loggingEvent.message);
		jsonString += "\t\"referer\": \"" + referer + "\",\n";
		jsonString += "\t\"useragent\": \"" + useragent + "\",\n";
    if(loggingEvent.exception){
      jsonString += "\t\"exception\": \"" +  loggingEvent.exception + "\",\n";
    }
		jsonString += "\t\"timestamp\": \"" +  loggingEvent.getFormattedTimestamp() + "\"\n";
		jsonString += "}}";

    return jsonString;*/
	},

  /**
   * Writes message object or string into given string stream.
   */
  formatMessage: function(message) {
    var stream = "";
    if((typeof message) == "string") {
      stream += "\t\"message\": \"" + message + "\",\n";
    } else if((typeof message) == "object") {
      if(message && message.message) {
        stream += "\t\"message\": \"" + message.message + "\",\n";
      }
      for(var property in message) {
        if(property == "message") continue;
        var val = message[property];
        if(val instanceof Date)
          stream += "\t\"" + property + "_dt\": \"" + this.df.formatUTCDate(val, "yyyy-MM-ddThh:mm:ssZ") + "\",\n";
        else {
          switch(typeof val) {
          case "string":
            stream += "\t\"" + property + "_s\": \"" + val + "\",\n";
            break;
          case "number":
            stream += "\t\"" + property + "_l\": " + val + ",\n";
            break;
          default:
            stream += "\t\"" + property + "_s\": \"" + val.toString() + "\",\n";
            break;
          }
        }
      }
    } else {
      stream += "\t\"message\": \"" + message.toString() + "\",\n";
    }
    return stream;
  },
	/**
	 * Returns the content type output by this layout.
	 * @return The base class returns "text/xml".
	 * @type String
	 */
	getContentType: function() {
		return "text/json";
	},
	/**
	 * @return Returns the header for the layout format. The base class returns null.
	 * @type String
	 */
	getHeader: function() {
		return "{\"Log4js\": [\n";
	},
	/**
	 * @return Returns the footer for the layout format. The base class returns null.
	 * @type String
	 */
	getFooter: function() {
		return "\n]}";
	},

	getSeparator: function() {
		return ",\n";
	}
});
