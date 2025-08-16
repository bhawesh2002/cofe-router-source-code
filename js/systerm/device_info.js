/**
 * 设备状态设置模块
 * @module DeviceInfo
 * @class DDNS
 */
define([ 'jquery', 'knockout', 'config/config', 'service', 'underscore' ],
function($, ko, config, service, _) {
	  var CONNECT_STATUS = {CONNECTED: 1, DISCONNECTED: 2, CONNECTING: 3, DISCONNECTING: 4};
	
    /**
     * DDNS设置view model
     * @class DeviceInfoViewModel
     */
	function DeviceInfoViewModel(){
        var self = this;
        var data = service.getDeviceRuninfo();
		
			//add by cwp 0170308 
		self.sw_version = ko.observable("--");
		self.hw_version = ko.observable("--");
		self.run_time = ko.observable("--");
		self.pd_version = ko.observable("--");
		self.imei = ko.observable("--");	
		self.iccid = ko.observable("--");
		self.imsi = ko.observable("--");
		self.device_mac_addr = ko.observable("--");	
		
		self.FreshParam = function(){
			var data = service.getDeviceRuninfo()
			if(data.errorId == "123")
			{
				self.sw_version("--");
				self.hw_version("--");
				self.run_time("--");
				self.pd_version("--");
				self.imei("--");
				self.iccid("--");
				self.imsi("--");
			}
			else
			{
				self.sw_version(data.sw_version);
				self.hw_version(data.hw_version);
				self.run_time(transSecond2Time_day(data.run_time));
				self.pd_version(data.pd_version);
				self.iccid(data.ziccid);
				self.run_time(transSecond2Time_day(data.run_time));	
				if(data.imei == ""){
					self.imsi("--");
				}
				else{
					self.imei(verifyDeviceInfo(data.imei));		
				}
				if(data.ziccid == ""){
					self.imsi("--");
				}
				else{
					self.iccid(data.ziccid);;	
				}	
				if(data.sim_imsi == ""){
					self.imsi("--");
				}
				else{
					self.imsi(data.sim_imsi);			
				}	
			}
		};
		
		self.FreshParam();	
	}
    /**
     * 初始化
     * @method init
     */
	function init() {
		var container = $('#container');
		ko.cleanNode(container[0]);
		var vm = new DeviceInfoViewModel();
		ko.applyBindings(vm, container[0]);
		
		addInterval(function(){
			vm.FreshParam();
			},1000);		
    }
    
    return {
        init: init
    };
});
