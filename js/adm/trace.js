/**
 * PINT TEST设置模块
 * @module PING Test
 * @class PING Test
 */
define([ 'jquery', 'knockout', 'config/config', 'service', 'underscore' ],
function($, ko, config, service, _) {
    /**
     * PING TEST设置view model
     * @class PingTestViewModel
     */
	function TraceViewModel(){
        var self = this;		
        self.hasUssd = config.HAS_USSD;
        self.SNTPSupport = config.HAS_SNTP;
	    self.hasUpdateCheck = config.HAS_UPDATE_CHECK;
		self.hasDdns = config.DDNS_SUPPORT;
		self.hasTelnetd = ko.observable(service.getLoginMode().login_mode);
		self.hastr069 = ko.observable(config.HAS_TW_TR069);
		self.showtr069 = ko.observable(service.showTr069().tr069_need_display === 'yes' ? true : false);
		self.showvpn = ko.observable(service.showVPN().vpn_need_display === 'yes' ? true : false);

		var data = service.getTraceLog();
		
		self.enable = ko.observable(true);
		self.operate = ko.observable("");
		self.trace_ip_url = ko.observable(""); 	
		self.tracestatue = ko.observable(data.tracestatue);
		self.trace_log_show = ko.observable("");

	
		
		self.checkLogoInfo = function() {
			var data = service.getTraceLog();
			self.tracestatue(data.tracestatue);
			
			if(data.tracestatue == "1" && self.operate() != "")
			{
				var ping_text = data.trace_log_show;
				ping_text = ping_text.replace(/\+/g, "\r\n");
				self.trace_log_show(ping_text);
				self.enable(false);
			}
		};
		
		self.checkLogoInfo();	
		
		/**
         * ping操作
         * @method pingstartoperate
         */
		self.starttrace = function() {
    		var url = trim($('#trace_ipurl').val());
            if (url == "") {
                showAlert("IP or Url not null");
                return false;
            }
            clickStyle('btn_start_trace');
				
			var params = {};
			params.trace_ip_url = self.trace_ip_url();

			service.StartTrace(params, function(result) {
				if (result.result == "success") {
					self.operate("start");
//					successOverlay();
				} else {
					errorOverlay();
        		    clickStyle('btn_stop_trace');
					self.operate("stop");
				}
			});
		};	

       /**
         * ping操作
         * @method pingstopoperate
         */
		self.stoptrace = function() {
			//AutoSelect call SetBearerPreference
			var params = {};
			
	          clickStyle('btn_stop_trace');
		
			service.StopTrace(params, function(result) {
				if (result.result == "success") {
					self.operate("stop");
//					successOverlay();
				} else {
//					errorOverlay();
				}
			});
		};		   
}		
    function clickStyle(btn) {
        var flag = false;
        if (btn == "btn_start_trace") {
            $("#tracelog").text("");
            flag = true;
        }

        $("#btn_start_trace").attr("disabled", flag);
        $("#btn_stop_trace").attr("disabled", !flag);
        $("#trace_ipurl").attr("disabled", flag);

        if (btn == 'btn_stop_trace') {
        }
    } 
    /**
     * 初始化
     * @method init
     */
	function init() {
		var container = $('#container');
		ko.cleanNode(container[0]);
		var vm = new TraceViewModel();
		ko.applyBindings(vm, container[0]);
		
		addInterval(function (){vm.checkLogoInfo();}, 1000);
    }
    
    return {
        init: init
    };
});


