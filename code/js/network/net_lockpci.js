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
		var mode = service.getlockcellinfo();
		var afrcn_cellid = mode.nv_arfcn+ "/" + mode.nv_pci;
		var self = this;
		//add by cwp at 20170311
		self.network_type = ko.observable("--");
		self.sub_network_type = ko.observable("--");
	
		self.current_network_pci = ko.observable(afrcn_cellid);
		self.current_network_pci_list_info =  ko.observable("--");
		
		
		self.isEnableflag = ko.observable(true);

		self.isAllowPciLock = ko.observable(mode.actionlte);
		self.celllockstatue = ko.observable(mode.CellLockState);	
		self.locked_pci_info = ko.observable(mode.cellParaIdlte);
		self.locked_arfrcn_info = ko.observable(mode.uarfcnlte);

		self.user_input_arfrcn = ko.observable("");
		self.user_input_pci_info = ko.observable("");
	
		if(self.celllockstatue() == "UnLocked" || self.isAllowPciLock() == "0")
		{
			self.locked_pci_info = ko.observable("---");
			self.locked_arfrcn_info = ko.observable("---");
		}
		else
		{
			self.locked_arfrcn_info = ko.observable(mode.uarfcnlte);
			self.locked_pci_info = ko.observable(mode.cellParaIdlte);			
		}
	

		var timerState;
		
		function getCellLockState() {
            return setInterval(function () {
                var CellLockSet = service.getlockcellinfo().CellLockSet;
                if (CellLockSet == "CellSuccess") {
                    window.clearInterval(timerState);
                    if(self.isAllowPciLock() == "1"){
						self.celllockstatue("Locked");
						self.locked_pci_info(self.user_input_pci_info());
						self.locked_arfrcn_info (self.user_input_arfrcn());
					}
					else{
						self.celllockstatue("UnLocked");
						self.locked_pci_info("--");
						self.locked_arfrcn_info("--");
					}
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
                } else if (CellLockSet == "CellFail") {
                    window.clearInterval(timerState);
                    errorOverlay();
                }
            }, 2000);
        }

		self.savepciconfig = function(){
			if(self.isAllowPciLock() == "1")
			{
				var uarfcn = parseInt($("#user_input_arfrcn").val(), 10);
	            if (isNaN(uarfcn)) {
	                showAlert("Uarfcn is not positive_integer!");
	                return false;
	            }
	            if (uarfcn < 0 || uarfcn > 65535) {
	                showAlert("Uarfcn is incorrect!");
	                return false;
	            }	

				 var pci = parseInt($("#user_input_pci").val(), 10);
	            if (isNaN(pci)) {
	                showAlert("PCI is not positive_integer!");
	                return false;
	            }
	            if (pci < 0 || pci > 65535) {
	                showAlert("PCI is incorrect!");
	                return false;
	            }
			}
	
	        showLoading();		
			
            service.setlockcellcfg({
				actionlte:self.isAllowPciLock(),
				uarfcnlte:self.user_input_arfrcn(),
				cellParaIdlte:self.user_input_pci_info(),

            }, function (result) {
                if (result.result == "success") {
					showLoading("waiting");
					timerState = getCellLockState();					
/*                    successOverlay();
					if(self.isAllowPciLock() == "1"){
						self.celllockstatue("Locked");
						self.locked_pci_info(self.user_input_pci_info());
						self.locked_arfrcn_info (self.user_input_arfrcn());
					}
					else{
						self.celllockstatue("UnLocked");
						self.locked_pci_info("--");
						self.locked_arfrcn_info("--");
					}*/
                } else {
                    errorOverlay();
                }
				self.user_input_arfrcn("");
				self.user_input_pci_info("");
            });			
			
		};
// cwp add end 		

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
