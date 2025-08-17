/**
 * 联网设置模块
 * @module dial_setting
 * @class dial_setting
 */
define([ 'jquery', 'knockout', 'config/config', 'service', 'underscore' ],

function($, ko, config, service, _) {

    /**
     * 联网设置view model
     * @class DialVM
     */
	function DialVM() {
		var mode = service.getlockbandinfo();
		var self = this;
		
		//add by cwp at 20170311
		self.isBand1Select = ko.observable(mode.band1);
		self.isBand2Select = ko.observable(mode.band2);	
		self.isBand3Select = ko.observable(mode.band3);
		self.isBand4Select = ko.observable(mode.band4);		
		self.isBand5Select = ko.observable(mode.band5);
		self.isBand7Select = ko.observable(mode.band7);
		self.isBand8Select = ko.observable(mode.band8);
		self.isBand17Select = ko.observable(mode.band17);		
		self.isBand20Select = ko.observable(mode.band20);		
		self.isBand28Select = ko.observable(mode.band28);		
		self.isBand34Select = ko.observable(mode.band34);	
		self.isBand38Select = ko.observable(mode.band38);
		self.isBand39Select = ko.observable(mode.band39);
		self.isBand40Select = ko.observable(mode.band40);
		self.isBand41Select = ko.observable(mode.band41);

		self.amt_band_1 = ko.observable(mode.amt_band1);
		self.amt_band_2 = ko.observable(mode.amt_band2);	
		self.amt_band_3 = ko.observable(mode.amt_band3);
		self.amt_band_4 = ko.observable(mode.amt_band4);		
		self.amt_band_5 = ko.observable(mode.amt_band5);
		self.amt_band_7 = ko.observable(mode.amt_band7);
		self.amt_band_8 = ko.observable(mode.amt_band8);
		self.amt_band_17 = ko.observable(mode.amt_band17);		
		self.amt_band_20 = ko.observable(mode.amt_band20);		
		self.amt_band_28 = ko.observable(mode.amt_band28);		
		self.amt_band_34 = ko.observable(mode.amt_band34);	
		self.amt_band_38 = ko.observable(mode.amt_band38);
		self.amt_band_39 = ko.observable(mode.amt_band39);
		self.amt_band_40 = ko.observable(mode.amt_band40);
		self.amt_band_41 = ko.observable(mode.amt_band41);	

		
		self.setBand1Select = function(){
                var checkbox = $("#isBand1Select:checked");
                if(checkbox && checkbox.length == 0){
                    self.isBand1Select("1");
                }else{
                    self.isBand1Select("0");
                }
		};
		self.setBand2Select = function(){
                var checkbox = $("#isBand2Select:checked");
                if(checkbox && checkbox.length == 0){
                    self.isBand2Select("1");
                }else{
                    self.isBand2Select("0");
                }		
		};
		
		self.setBand3Select = function(){
                var checkbox = $("#isBand3Select:checked");
                if(checkbox && checkbox.length == 0){
                    self.isBand3Select("1");
                }else{
                    self.isBand3Select("0");
                }		
		};	
		self.setBand4Select = function(){
                var checkbox = $("#isBand4Select:checked");
                if(checkbox && checkbox.length == 0){
                    self.isBand4Select("1");
                }else{
                    self.isBand4Select("0");
                }		
		};
		
		self.setBand5Select = function(){
                var checkbox = $("#isBand5Select:checked");
                if(checkbox && checkbox.length == 0){
					 self.isBand5Select("1");
                }else{
                    self.isBand5Select("0");
                }		
		};	
		self.setBand7Select = function(){
                var checkbox = $("#isBand7Select:checked");
                if(checkbox && checkbox.length == 0){
					self.isBand7Select("1");
                }else{
                    self.isBand7Select("0");
                }			
		};	
		self.setBand8Select = function(){
                var checkbox = $("#isBand8Select:checked");
                if(checkbox && checkbox.length == 0){
                    self.isBand8Select("1");
                }else{
                    self.isBand8Select("0");
                }		
		};	

		self.setBand17Select = function(){
                var checkbox = $("#isBand17Select:checked");
                if(checkbox && checkbox.length == 0){
                    self.isBand17Select("1");
                }else{
                    self.isBand17Select("0");
                }		
		};	
		
		self.setBand20Select = function(){
                var checkbox = $("#isBand20Select:checked");
                if(checkbox && checkbox.length == 0){
                    self.isBand20Select("1");
                }else{
                    self.isBand20Select("0");
                }		
		};	
		
		self.setBand28Select = function(){
                var checkbox = $("#isBand28Select:checked");
                if(checkbox && checkbox.length == 0){
                    self.isBand28Select("1");
                }else{
                    self.isBand28Select("0");
                }		
		};
		self.setBand34Select = function(){
                var checkbox = $("#isBand34Select:checked");
                if(checkbox && checkbox.length == 0){
                    self.isBand34Select("1");
                }else{
                    self.isBand34Select("0");
                }		
		};
		
		self.setBand38Select = function(){
                var checkbox = $("#isBand38Select:checked");
                if(checkbox && checkbox.length == 0){
                    self.isBand38Select("1");
                }else{
                    self.isBand38Select("0");
                }		
		};			
		self.setBand39Select = function(){
                var checkbox = $("#isBand39Select:checked");
                if(checkbox && checkbox.length == 0){
                    self.isBand39Select("1");
                }else{
                    self.isBand39Select("0");
                }		
		};			
		self.setBand40Select = function(){
                var checkbox = $("#isBand40Select:checked");
                if(checkbox && checkbox.length == 0){
                    self.isBand40Select("1");
                }else{
                    self.isBand40Select("0");
                }		
		};			
		self.setBand41Select = function(){
                var checkbox = $("#isBand41Select:checked");
                if(checkbox && checkbox.length == 0){
                    self.isBand41Select("1");
                }else{
                    self.isBand41Select("0");
                }		
		};	
		var timerState;
		
		function getBandLockState() {
            return setInterval(function () {
                var LteBandLockSet = service.getlockbandinfo().LteBandLockSet;
                if (LteBandLockSet == "LockBandSuc") {
                    window.clearInterval(timerState);
                	showConfirm("confirm_data_effect", function () {
		                showLoading("restarting");
	            		service.restart({}, function (data) {
	                		if (data && data.result == "success") {
	                    		successOverlay();
	                		} else {
	                    		errorOverlay();
	                		}
	            		}, $.noop);
		            });
                } else if (LteBandLockSet == "LockBandFail") {
                    window.clearInterval(timerState);
                    errorOverlay();
                }
            }, 2000);
        }
		
		self.savebandconfig = function(){
            showLoading();
			
            service.setlockbandcfg({
                band1: self.isBand1Select(),
				band2: self.isBand2Select(),
				band3: self.isBand3Select(),
				band4: self.isBand4Select(),
				band5: self.isBand5Select(),
				band7: self.isBand7Select(),
				band8: self.isBand8Select(),
				band17: self.isBand17Select(),
				band20: self.isBand20Select(),
				band28: self.isBand28Select(),
				band34: self.isBand34Select(),
				band38: self.isBand38Select(),
				band39: self.isBand39Select(),
				band40: self.isBand40Select(),
				band41: self.isBand41Select(),
            }, function (result) {
                if (result.result == "success") {
					showLoading("waiting");
					timerState = getBandLockState();	
//                    successOverlay();
                } else {
                    errorOverlay();
                }
            });			
			
		};
// cwp add end 		

        var checkbox = $(".checkboxToggle");
        self.checkEnable = function() {
            var status = service.getStatusInfo();

            if (checkConnectedStatus(status.connectStatus) || status.connectStatus == "ppp_connecting") {
                self.enableFlag(false);
                disableCheckbox(checkbox);
            }
            else {
                self.enableFlag(true);
                enableCheckbox(checkbox);
            }
        };

	}

    /**
     * 联网设置初始化
     * @method init
     */
	function init() {
		var container = $('#container');
		ko.cleanNode(container[0]);
		var vm = new DialVM();
		ko.applyBindings(vm, container[0]);
 //       addInterval( vm.checkEnable, 1000);
	}
	
	return {
		init: init
	};
});
