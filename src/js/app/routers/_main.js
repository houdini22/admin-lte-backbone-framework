Framework.defineResource("MainRouter", "router", function(sandbox)
{
    return Backbone.Router.extend({
        initialize: function()
        {
            Backbone.Router.prototype.initialize.apply(this.arguments);

            this.currentView = null;
        },
        route: function(route, obj, callback)
        {
            obj = obj || {};

            var routeKey = route; // save - its a key of this.routes object

            if(!_.isRegExp(route))
            {
                route = this._routeToRegExp(route);
            }
            if(_.isFunction(obj.callback)) // callback passed in this.routes.[*].callback as a function
            {
                callback = obj.callback;
            }
            if(!callback)
            {
                callback = this[obj.callback]; // its a string which describes method in router
            }
            var router = this;
            Backbone.history.route(route, function(fragment)
            {
                var args = router._extractParameters(route, fragment);

                //router.trigger.call(router, "before", obj, args); no need to use that
                //router.execute(callback, args, obj); don't use it
                //router.trigger.apply(router, ['route:' + obj].concat(args)); no need to use that
                router.trigger('route', obj, args, routeKey);
                Backbone.history.trigger('route', router, obj, args);
            });
            return this;
        },
        redirect: function(route, options)
        {
            options = options || {};
            options["trigger"] = true;

            sandbox.log("Redirecting", "#" + route);

            return this.navigate(route, options);
        }
    })
});