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
	function PingTestViewModel(){
        var self = this;		
        self.hasUssd = config.HAS_USSD;
        self.SNTPSupport = config.HAS_SNTP;
	    self.hasUpdateCheck = config.HAS_UPDATE_CHECK;
		self.hasDdns = config.DDNS_SUPPORT;
		self.hasTelnetd = ko.observable(service.getLoginMode().login_mode);
		self.hastr069 = ko.observable(config.HAS_TW_TR069);
		self.showtr069 = ko.observable(service.showTr069().tr069_need_display === 'yes' ? true : false);
		self.showvpn = ko.observable(service.showVPN().vpn_need_display === 'yes' ? true : false);

		var data = service.getPingLog();
		
		self.enable = ko.observable(true);
		self.operate = ko.observable("");

		self.ping_ip_addr = ko.observable(""); 
		self.ping_count = ko.observable("10"); 		
		self.pingstatue = ko.observable(data.pingstatue);
		//self.haslog = ko.observable(data.haslog);
		self.ping_log_show = ko.observable("");	
		
		self.checkLogoInfo = function() {
			var data = service.getPingLog();
			self.pingstatue(data.pingstatue);
			
			if(data.pingstatue == "1" && self.operate() != "")
			{
				var ping_text = data.ping_log_show;
				ping_text = ping_text.replace(/\+/g, "\r\n");
				self.ping_log_show(ping_text);
				self.enable(false);
			}
		};
		
		self.checkLogoInfo();	
		
		/**
         * ping操作
         * @method pingstartoperate
         */
		self.pingstartoperate = function() {
			//AutoSelect call SetBearerPreference

			var ping_count = parseInt($("#pingcounttxt").val(), 10);
			var pin_count = Number($('#pingcounttxt').val());
			if (pin_count > 15 || pin_count < 1 || pin_count % 1 !== 0 || isNaN(pin_count)) {
				showAlert("ping_count_tip");
                return false;
            }
            // if (ping_count < 1) {
            //     showAlert("ping_count_positive_integer");
            //     return false;
            // }
			
    		var url = trim($('#pingipurl').val());
            if (url == "") {
                showAlert("IP or Url not null");
                return false;
            }
            clickStyle('btn_start_ping');
				
			var params = {};
			params.ping_ip_addr = self.ping_ip_addr();
			params.ping_count = self.ping_count();

			service.StartPing(params, function(result) {
				if (result.result == "success") {
					self.operate("start");
//					successOverlay();
				} else {
					errorOverlay();
        		    clickStyle('btn_stop_ping');
					self.operate("stop");
				}
			});
		};	

       /**
         * ping操作
         * @method pingstopoperate
         */
		self.pingstopoperate = function() {
			//AutoSelect call SetBearerPreference
			var params = {};
			
	          clickStyle('btn_stop_ping');
		
			service.StopPing(params, function(result) {
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
        if (btn == "btn_start_ping") {
            $("#pinglog").text("");
            flag = true;
        }

        $("#btn_start_ping").attr("disabled", flag);
        $("#btn_stop_ping").attr("disabled", !flag);
        $("#pingcounttxt").attr("disabled", flag);
        $("#pingipurl").attr("disabled", flag);

        if (btn == 'btn_stop_ping') {
        }
    } 
    /**
     * 初始化
     * @method init
     */
	function init() {
		var container = $('#container');
		ko.cleanNode(container[0]);
		var vm = new PingTestViewModel();
		ko.applyBindings(vm, container[0]);
		
		addInterval(function (){vm.checkLogoInfo();}, 1000);
    }
    
    return {
        init: init
    };
});

