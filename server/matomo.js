var MatomoTracker = Npm.require('matomo-tracker');

var site_id = process.env.MATOMO_SITE_ID || Meteor.settings.matomo.site_id ;
var matomo_url = process.env.MATOMO_URL || Meteor.settings.matomo.url;


//stup for development settings
var matomo = {};

if (typeof(site_id) != 'undefined') {
    console.log(site_id);
    console.log(matomo_url)
    matomo = new MatomoTracker(site_id, matomo_url);
} else {
    console.log("Matomo settings missing. Add settings to your settings.json file.");
}

matomo.on('error', function(err) {
    console.log('error tracking request: ', err);
});

Meteor.methods({
    trackPage: function (url, userInfo) {
        console.log(matomo);
        if (!url) throw new Meteor.Error("Invalid Arguments");
        var trackingVars = {
            url: url//,
        };
        if(this.connection && this.connection.clientAddress) {
            trackingVars.cip = this.connection.clientAddress;
        }
        if(_.isObject(userInfo)) {
            trackingVars.uid = userInfo.uid;
            trackingVars.res = userInfo.res;
            trackingVars.ua = userInfo.ua;
            trackingVars.urlref = userInfo.urlref;
        }
        Object.keys(trackingVars).forEach(function(k) {
            if (!trackingVars[k]) {
                delete trackingVars[k];
            }
        });
        matomo.track(url)
    },
    trackDownload: function(url, download, userInfo) {
        if (!url || !download) throw new Meteor.Error("Invalid Arguments");
        var trackingVars = {
            url: url,
            download: download,
            token_auth:  process.env.MATOMO_TOKEN
        };
        if(this.connection && this.connection.clientAddress) {
            trackingVars.cip = this.connection.clientAddress;
        }
        if(_.isObject(userInfo)) {
            trackingVars.uid = userInfo.uid;
            trackingVars.res = userInfo.res;
            trackingVars.ua = userInfo.ua;
            trackingVars.urlref = userInfo.urlref;
        }
        Object.keys(trackingVars).forEach(function(k) {
            if (!trackingVars[k]) {
                delete trackingVars[k];
            }
        });
        matomo.track(trackingVars);
    },
    trackLink: function(url, link, userInfo) {
        if (!url || !link) throw new Meteor.Error("Invalid Arguments");
        var trackingVars = {
            url: url,
            link: link,
            token_auth: process.env.MATOMO_TOKEN
        };
        if(this.connection && this.connection.clientAddress) {
            trackingVars.cip = this.connection.clientAddress;
        }
        if(_.isObject(userInfo)) {
            trackingVars.uid = userInfo.uid;
            trackingVars.res = userInfo.res;
            trackingVars.ua = userInfo.ua;
            trackingVars.urlref = userInfo.urlref;
        }
        Object.keys(trackingVars).forEach(function(k) {
            if (!trackingVars[k]) {
                delete trackingVars[k];
            }
        });
        matomo.track(trackingVars);
    },
    trackSearch: function(url, search, userInfo) {
        if (!url || !search) throw new Meteor.Error("Invalid Arguments");
        var trackingVars = {
            url: url,
            search: search.search,
            search_cat: search.search_cat,
            search_count: search.search_count,
            token_auth:  process.env.MATOMO_TOKEN
        };
        if(this.connection && this.connection.clientAddress) {
            trackingVars.cip = this.connection.clientAddress;
        }
        if(_.isObject(userInfo)) {
            trackingVars.uid = userInfo.uid;
            trackingVars.res = userInfo.res;
            trackingVars.ua = userInfo.ua;
            trackingVars.urlref = userInfo.urlref;
        }
        Object.keys(trackingVars).forEach(function(k) {
            if (!trackingVars[k]) {
                delete trackingVars[k];
            }
        });
        matomo.track(trackingVars);
    },
    trackGoal: function(url, goalId, userInfo) {
        if (!url || !goalId) throw new Meteor.Error("Invalid Arguments");
        var trackingVars = {
            url: url,
            goalId: goalId,
            token_auth: process.env.MATOMO_TOKEN
        };
        if(this.connection && this.connection.clientAddress) {
            trackingVars.cip = this.connection.clientAddress;
        }
        if(_.isObject(userInfo)) {
            trackingVars.uid = userInfo.uid;
            trackingVars.res = userInfo.res;
            trackingVars.ua = userInfo.ua;
            trackingVars.urlref = userInfo.urlref;
        }
        Object.keys(trackingVars).forEach(function(k) {
            if (!trackingVars[k]) {
                delete trackingVars[k];
            }
        });
        matomo.track(trackingVars);
    },
    trackEvent: function (url, event, options, userInfo) {
        if (!url || !event) throw new Meteor.Error("Invalid Arguments");
        var trackingVars = {
            url: url,
            token_auth: process.env.MATOMO_TOKEN,
            e_c: event.category,
            e_a: event.action,
            e_n: event.name,
            e_v: event.value
        };
        if(_.isObject(options)){
            trackingVars.cvar = JSON.stringify(options);
        }
        if(this.connection && this.connection.clientAddress) {
            trackingVars.cip = this.connection.clientAddress;
        }
        if(_.isObject(userInfo)) {
            trackingVars.uid = userInfo.uid;
            trackingVars.res = userInfo.res;
            trackingVars.ua = userInfo.ua;
            trackingVars.urlref = userInfo.urlref;
        }
        Object.keys(trackingVars).forEach(function(k) {
            if (!trackingVars[k]) {
                delete trackingVars[k];
            }
        });
        matomo.track(trackingVars);
    }
});