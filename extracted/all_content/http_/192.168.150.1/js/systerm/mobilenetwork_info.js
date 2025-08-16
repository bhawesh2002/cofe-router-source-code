/**
 * �豸״̬����ģ��
 * @module Mobile Network Info
 * @class network
 */
define([ 'jquery', 'knockout', 'config/config', 'service', 'underscore' ],
function($, ko, config, service, _) {
    /**
     * ����״̬��Ϣview model
     * @class NetworkInfoViewModel
     */
	function NetworkInfoViewModel(){
        var self = this;		
//        var data = service.getNetworkStatue();	
		self.network_provider = ko.observable("--");
		self.network_type = ko.observable("--");
		self.sub_network_type = ko.observable("--");

		self.ModemStatue = ko.observable("--");
		self.DailStatue = ko.observable("--");
		self.CurrentBand = ko.observable("--");	

		self.CurrentBandwidth = ko.observable("--");
		self.CurrentAfrcn = ko.observable("--");
	
		self.EnodebID = ko.observable("--");
		self.CellID = ko.observable("--");
	
		self.GlobleID = ko.observable("--");		
	
		self.PhycellID = ko.observable("--");
		self.RSRP = ko.observable("--");	
		
		self.RSRQ = ko.observable("--");
		self.SINR = ko.observable("--");
		self.RSSI = ko.observable("--");


		self.FreshParam = function(){
			var data = service.getNetworkStatue()
			if(data.errorId == "123"){
				self.network_provider("--");
				self.network_type("--");
				self.ModemStatue("--");
				self.DailStatue("--");
				self.CurrentBand("--");	

				self.CurrentBandwidth("--");
				self.CurrentAfrcn("--");
				self.GlobleID ("--");					
				self.EnodebID("--");
				self.CellID("--");			
				self.PhycellID("--");
				self.RSRP("--");
				self.RSRQ("--");
				self.SINR("--");
				self.RSSI("--");
			}
			else{
				if(data.network_provider == ""){
					self.network_provider("--");
				}
				else{
					self.network_provider(data.network_provider);
				}
				self.network_type(data.network_type);
				self.sub_network_type(data.sub_network_type);
				
				self.ModemStatue(data.ModemStatue);
				self.DailStatue = ko.observable(data.ppp_status);
				if(self.DailStatue() == "ppp_connected" || self.DailStatue() == "ipv6_connected")
				{
					self.DailStatue("Connected");
				}
				else
				{
					self.DailStatue("Disconnected");
				}
				self.CurrentBand(data.nv_band);	

				self.CurrentBandwidth = ko.observable(data.CurrentBandwidth);
				self.CurrentAfrcn(data.nv_arfcn);
				
				self.GlobleID = ko.observable(data.nv_globecellid);					
				
				self.EnodebID = ko.observable(data.nv_enodebid);
				self.CellID = ko.observable(data.nv_cellid);			
				self.PhycellID(data.nv_pci);
				self.SINR(data.nv_sinr);
				if(self.network_type() == "LTE") //LTE  //modify by lzj, was 16 
				{
					self.RSRP(rsrp_format(data.nv_rsrp));	
					self.RSRQ(rsrq_format(data.nv_rsrq));
					self.RSSI("--");
				}
				else if(self.network_type() == 1 || self.network_type() == 2)//3g 
				{
					self.RSRP(rscp_format(data.nv_rsrp));	
					self.RSRQ("--");
					self.RSSI("--");				
				}
				else if(self.network_type() == 4)//2g 
				{
					self.RSRP("--");	
					self.RSRQ("--");
					self.RSSI(tw_rssi_format(data.nv_rsrp));				
				}
				else
				{
					self.RSRP("--");	
					self.RSRQ("--");
					self.RSSI("--");					
				}	
			}	
		};
		self.FreshParam();	
}
    /**
     * ��ʼ��
     * @method init
     */
	function init() {
		var container = $('#container');
		ko.cleanNode(container[0]);
		var vm = new NetworkInfoViewModel();
		ko.applyBindings(vm, container[0]);
		
		addInterval(function(){
			vm.FreshParam();
			},1000);		
    }
    
    return {
        init: init
    };
});
