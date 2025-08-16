/**
 * 系统状态设置模块
 * @module Systerm Statue
 * @class DDNS
 */
define([ 'jquery', 'knockout', 'config/config', 'service', 'underscore'],
function($, ko, config, service, _) {
	  var CONNECT_STATUS = {CONNECTED: 1, DISCONNECTED: 2, CONNECTING: 3, DISCONNECTING: 4};
	  var dhcpenable = {dhcp_connect:1, dhcp_unconnect:0};
	  var pdptype = {ipv4:"IP", ipv6:"IPv6",ipv4v6:"IPv4v6"};
	  var lanconnectstatue = {plug_on:"plug_on",plug_off:"plug_off"};
    /**
     * 系统状态view model
     * @class SystermStatueViewModel
     */
	function SystermStatueViewModel(){
        var self = this;
		
        var data = service.getSystermStatue();
//		var info = service.getApnSettings();//add by litao
	
		
		//获取WAN口相关信息	

		self.wandnsserver = ko.observable("");
		self.ipv6_wandnsserver = ko.observable("");
		self.ppp_status = ko.observable(data.ppp_status);
		if(self.ppp_status() == "ppp_connected" || self.ppp_status() == "ipv6_connected" || self.ppp_status() == "ipv4_ipv6_connected")
		{
			self.wannetmask = ko.observable(data.wannetmask);		
		}
		else
		{
			self.wannetmask = ko.observable("--");
		}
		self.wandefaultnetgate = ko.observable("");
		self.ipv6_wandefaultnetgate = ko.observable("");
		
		//self.wan_ipaddr = ko.observable(data.wan_ipaddr);			
		//self.ipv6_wan_ipaddr = ko.observable(data.ipv6_wan_ipaddr);
		self.wan_ipaddr = ko.observable("");			
		self.ipv6_wan_ipaddr = ko.observable("");
		self.pdp_type = ko.observable(data.pdp_type);
	    self.pdptype_display = ko.observable("");
		self.pdptype_trans = ko.computed(function () {
                if (pdptype.ipv4 == self.pdp_type()) {
                    self.pdptype_display($.i18n.prop("IPV4"));
                    return "IPV4";
                }else if (pdptype.ipv6 == self.pdp_type()) {
                    self.pdptype_display($.i18n.prop("IPV6"));
                    return "IPV6";
                }else if (pdptype.ipv4v6 == self.pdp_type()) {
                    self.pdptype_display($.i18n.prop("IPV4V6"));
                    return "IPV4V6";
                }
            });
		
		self.lanipaddr = ko.observable("");
		self.ipv6_lanipaddr = ko.observable("");
		self.lanmacaddr = ko.observable(data.lanmacaddr);
		self.lannetmask = ko.observable(data.lannetmask);
		
		
		self.landhcpstatue = ko.observable(data.landhcpstatue);
		self.dhcpenable_display = ko.observable("");
		self.landhcpstatue_trans = ko.computed(function () {
                if (dhcpenable.dhcp_connect == self.landhcpstatue()) {
                    self.dhcpenable_display($.i18n.prop("dhcp_connect"));
                    return "dhcp_connect";
                } else {
                    self.dhcpenable_display($.i18n.prop("dhcp_unconnect"));
                    return "dhcp_unconnect";
                }
            });
			
		self.lanconnectstatue = ko.observable(data.lanconnectstatue);	
		self.lanconnectstatue_display = ko.observable("");
		self.lanconnectstatue_trans = ko.computed(function () {
                if (lanconnectstatue.plug_on == self.lanconnectstatue()) {
                    self.lanconnectstatue_display($.i18n.prop("lan_connect"));
                    return "lan_connect";
                } else {
                    self.lanconnectstatue_display($.i18n.prop("lan_unconnect"));
                    return "lan_unconnect";
                }
            });

/*
		self.waniptype = ko.observable("");
		self.wanipaddr = ko.observable("");
		self.wanipv6addr = ko.observable("");
		
		self.checkPdpType = function (data) {
                if(config.RJ45_SUPPORT){
                    var mode = checkCableMode(data.blc_wan_mode);
                    if (mode) {
						self.waniptype("IP");
                    } else if (config.IPV6_SUPPORT) {//支持IPV6
                        if (data.pdp_type == "IP") {//ipv4
							self.waniptype("IP");
                        } else if (data.ipv6PdpType == "IPv6") {
								 self.waniptype("IPv6");
                            } else {
								self.waniptype("IPv4v6");
                        }
                    } else {//不支持IPV6
						self.waniptype("IP");
                    }
                } else {
                    if (config.IPV6_SUPPORT) {//支持IPV6
                        if (data.pdp_type == "IP") {//ipv4
							self.waniptype("IP");
                        } else if(data.ipv6PdpType == "IPv6") {
								 self.waniptype("IPv6");
                            } else {
								self.waniptype("IPv4v6");
                        }
                    } else {//不支持IPV6
						 self.waniptype("IP");
                    }
                }
		};*/
            
            self.getNetInfo = function (data) {
                var addrInfo = {
                    wanIpAddress: '',
                    ipv6WanIpAddress: '',
					wanDnsServer:'',
					ipv6wanDnsServer:'',
					wan_gw:'',
					ipv6_wan_gw:'',
					lanIpaddr:'',
					ipv6_lanIpaddr:''
					
                };
                var currentMode = checkCableMode(data.blc_wan_mode);
                if (currentMode && data.ethwan_mode != "STATIC") {// 有线模式下的PPPOE、DHCP、auto
                 
                } else if (currentMode && data.ethwan_mode == "STATIC") {// 有线模式下的STATIC
                  
                } else {
                   // var pdp_type = self.getpdptype(data.pdp_type);
					 var pdp_type = data.pdp_type;
                    if (pdp_type == 'IP') {
                         self.wan_ipaddr(verifyDeviceInfo(data.wan_ipaddr));
                         self.ipv6_wan_ipaddr("--");
						 self.wandnsserver(verifyDeviceInfo(data.wandnsserver));
						 self.ipv6_wandnsserver("--");
						 self.wandefaultnetgate(verifyDeviceInfo(data.wan_gateway));
						 self.ipv6_wandefaultnetgate("--");
						 self.lanipaddr(verifyDeviceInfo(data.lanipaddr));
						 self.ipv6_lanipaddr("--");
                    } else if (pdp_type == 'IPv6') {
                         self.ipv6_wan_ipaddr(verifyDeviceInfo(data.ipv6_wan_ipaddr));
                         self.wan_ipaddr("--");		
						 self.wandnsserver("--");
						 self.ipv6_wandnsserver(verifyDeviceInfo(data.ipv6_wandnsserver));
						 self.wandefaultnetgate("--");
						 self.ipv6_wandefaultnetgate(verifyDeviceInfo(data.ipv6_wan_gateway));
						 self.lanipaddr(verifyDeviceInfo(data.lanipaddr));
						 self.ipv6_lanipaddr(verifyDeviceInfo(data.ipv6_lanipaddr));
                    } else if (pdp_type == 'IPv4v6') {
                         self.wan_ipaddr(verifyDeviceInfo(data.wan_ipaddr));
                         self.ipv6_wan_ipaddr(verifyDeviceInfo(data.ipv6_wan_ipaddr));
						 self.wandnsserver(verifyDeviceInfo(data.wandnsserver));
						 self.ipv6_wandnsserver(verifyDeviceInfo(data.ipv6_wandnsserver));
						 self.wandefaultnetgate(verifyDeviceInfo(data.wan_gateway));
						 self.ipv6_wandefaultnetgate(verifyDeviceInfo(data.ipv6_wan_gateway));
						 self.lanipaddr(verifyDeviceInfo(data.lanipaddr));
						 self.ipv6_lanipaddr(verifyDeviceInfo(data.ipv6_lanipaddr));
                    }else {
                         self.wan_ipaddr("--");
                         self.ipv6_wan_ipaddr("--");
						 self.wandnsserver("--");
						 self.ipv6_wandnsserver("--");
						 self.wandefaultnetgate("--");
						 self.ipv6_wandefaultnetgate("--");
						 self.lanipaddr("--");
						 self.ipv6_lanipaddr("--");
						self.wannetmask("--");;

                    }
                }
                return addrInfo;
            };
          /*
              self.getpdptype = function (status) {
                if (status == "IP" ){
                    return 1;
                } else if (status == "IPv6") {
                    return 2;
                } else if (status == "IPv4v6") {
                    return 3;
				}
            };
			*/
			
	

		//self.checkPdpType(data);
		self.getNetInfo(data);
		
		self.FreshParam = function(){
			var data = service.getSystermStatue();
			if(data.errorId == "123")
			{
				self.pdp_type("--");
				self.lanmacaddr("--");
				self.lannetmask("--");
				self.landhcpstatue("--");
				self.lanconnectstatue("--");
				self.ppp_status("--");
			

				self.wan_ipaddr("--");
				self.ipv6_wan_ipaddr("--");
				self.wandnsserver("--");
				self.ipv6_wandnsserver("--");
				self.wandefaultnetgate("--");
				self.ipv6_wandefaultnetgate("--");
				self.lanipaddr("--");
				self.ipv6_lanipaddr("--");			
				self.wannetmask("--");	
				self.lanconnectstatue_display("--");
				self.dhcpenable_display("--");	
			}
			else{
				//获取WAN口相关信息	
				//self.wandnsserver(data.wandnsserver);		
				//self.wandefaultnetgate(data.wandefaultnetgate);	
				
				//self.wan_ipaddr(data.wan_ipaddr);			
				//self.ipv6_wan_ipaddr(data.ipv6_wan_ipaddr);
				//self.ipv6_pdp_type(data.ipv6_pdp_type);
				self.pdp_type(data.pdp_type);
				
				//self.lanipaddr(data.lanipaddr);
				self.lanmacaddr(data.lanmacaddr);
				self.lannetmask(data.lannetmask);
				self.landhcpstatue(data.landhcpstatue);
				self.lanconnectstatue(data.lanconnectstatue);
				
				self.ppp_status(data.ppp_status);
				if(self.ppp_status() == "ppp_connected" || self.ppp_status() == "ipv6_connected"  || self.ppp_status() == "ipv4_ipv6_connected")
				{
					self.wannetmask(data.wannetmask);
				}
				else
				{
					self.wannetmask("--");
				}
				
				//self.checkPdpType(data);
				self.getNetInfo(data);					
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
		var vm = new SystermStatueViewModel();
		ko.applyBindings(vm, container[0]);
		
		addInterval(function(){
			vm.FreshParam();
			},1000);		
    }
    
    return {
        init: init
    };
});
