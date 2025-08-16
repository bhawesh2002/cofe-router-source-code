define([ 'jquery', 'knockout', 'config/config', 'service', 'underscore' ],

function($, ko, config, service, _) {

    function FirewallVM() {
        var self = this;
		self.hasUssd = config.HAS_USSD;
		self.hasUrlFilter = config.HAS_URL;
		self.hasUpdateCheck = config.HAS_UPDATE_CHECK;
		self.hasDdns = config.DDNS_SUPPORT;
		self.hasTelnetd = ko.observable(service.getLoginMode().login_mode);
		self.hastr069 = ko.observable(config.HAS_TW_TR069);
		self.showtr069 = ko.observable(service.showTr069().tr069_need_display === 'yes' ? true : false);
		self.showvpn = ko.observable(service.showVPN().vpn_need_display === 'yes' ? true : false);
    }

	function init() {
        var container = $('#container');
        ko.cleanNode(container[0]);
        var vm = new FirewallVM();
        ko.applyBindings(vm, container[0]);
    }

	return {
		init : init
	};
});
