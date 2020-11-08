Framework.Application = (function()
{
    var instances = {};

    /**
     * Application class. We are registering components here and give public method for start.
     * @param appName
     * @constructor
     */
    var AppClass = function(appName)
    {
        this.name = appName;

        var isStarted = false,
            components = {},
            config = CONFIG,
            debug = config.debug,
            sandbox = Framework.Sandbox, // TODO: dynamic?
            registerComponent = function(name) // TODO: dynamic?
            {
                if(!Framework.Components[name])
                {
                    throw "Component '" + name + "' doesn't exists!";
                }
                components[name] = new Framework.Components[name](sandbox);

                delete Framework.Components[name]; // delete definition for security
            };

        sandbox = new sandbox(this, {
            components: components
        }); // create sandbox

        // security
        delete Framework.Sandbox;

        // start registering components
        registerComponent("FilterManager");
        registerComponent("RoutingManager");
        registerComponent("TemplateLoader");
        registerComponent("AuthManager");

        // public methods
        this.start = function()
        {
            if(isStarted)
            {
                return false;
            }
            isStarted = true;

            sandbox.trigger("application:start"); // start app
        };

        this.log = function()
        {
            if(debug === true) // log only when saved DEBUG var is equal true
            {
                console.log.apply(console, arguments);
            }
        };

        this.getConfig = function()
        {
            return config;
        };
    };

    /**
     * Singleton and Factory
     */
    return {
        getInstance: function(name)
        {
            if(!instances[name])
            {
                instances[name] = {
                    instance: new AppClass(name)
                };
            }
            return instances[name].instance;
        }
    };
}());