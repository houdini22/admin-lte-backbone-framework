Framework.defineResource("GeoRPGRouter", "router", function(sandbox)
{
    return sandbox.getResourceDefinition("MainRouter").extend({
        currentView: null,
        /**
         * Routes definitions
         */
        routes: {
            '': {
                view: "LoginView"
            },
            'dashboard': {
                view: "DashboardView",
                filters: ["isLoggedIn"]
            }
        },
        initialize: function()
        {
            this.filterManager = sandbox.getCreatedComponent("FilterManager");

            this.on("route", function(routeDefinition, args, route)
            {
                /**
                 * Flag if route can be executed
                 * @see filter-manager.js ->
                 */
                var canExecute = this.filterManager.addFilters(routeDefinition.filters ? routeDefinition.filters : []).execute(routeDefinition, args);
                if(canExecute)
                {
                    sandbox.log("Executing route:", "'" + route + "'");
                    this.currentView && this.currentView.destroy();
                    this.currentView = sandbox.createResource(routeDefinition.view); // create view from route definition
                }
            }, this);

            sandbox.getResourceDefinition("MainRouter").prototype.initialize.apply(this, arguments);
        },
        redirect: function()
        {
            this.filterManager.clean();

            return sandbox.getResourceDefinition("MainRouter").prototype.redirect.apply(this, arguments);
        }
    });
});