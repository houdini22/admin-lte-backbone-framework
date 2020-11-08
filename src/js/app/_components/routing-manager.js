Framework.Components["RoutingManager"] = function(sandbox)
{
    var instances = {},
        started = false;

    return {
        getRouterInstance: function(name) // factory and singleton
        {
            if(!instances[name]) // singleton
            {
                instances[name] = sandbox.createResource(name + "Router");
            }
            return instances[name];
        },
        getInstance: function()
        {
            return this;
        },
        initialize: function()
        {
            if(!started)
            {
                started = true;
                Backbone.history.start();
            }
        }
    }
};