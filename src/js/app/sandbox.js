Framework.Sandbox = (function()
{
    /**
     * Sandbox is a helper class, which is passed to all Backbone resources and Components
     * @param application
     * @param params
     */
    var sandbox = function(application, params)
    {
        var self = this,
            /**
             * Application class
             * @see AppClass
             */
            _application = application,
            /**
             * All registered components.
             * @type {components}
             * @private
             */
            _registeredComponents = params.components,
            /**
             * Created components.
             * Type is object because components are using singleton pattern.
             * @type {{}}
             * @private
             */
            _createdComponents = {},
            /**
             * All application (Backbone) resources.
             * @type {{}}
             * @private
             */
            _registeredResources = {},
            /**
             * We store here created resources.
             * Type is array because one registered resource can be created multiple times.
             * @type {Array}
             * @private
             */
            _createdResources = [],
            /**
             * Store router here, to redirect by now.
             * TODO: delete this and share only redirect method?
             * @type {null}
             * @private
             */
            _router = null,
            /**
             * Create resource by given name and parameters.
             * @param name
             * @param params
             * @returns {resource|*|any}
             * @private
             */
            _createResource = function(name, params)
            {
                if(!_registeredResources[name])
                {
                    throw "Resource '" + name + "' doesn't exists!";
                }

                params = params || {};

                var obj = _registeredResources[name], // take registered resource
                    result = obj.resource, // take result of executing resource definition (with passed sandbox)
                    resource = new result(params); // create resource

                resource["resourceName"] = name; // set name on created resource

                // save for further operations i.e. for destroy or trigger custom event
                _createdResources.push({
                    name: obj.name,
                    resource: resource,
                    type: obj.type
                });

                self.log("Creating resource", "type:" + obj.type, "name:" + name);

                return resource;
            };

        // extend sandbox from Backbone.Events
        // not used .extend because sandbox has not prototype
        jQuery.each(Backbone.Events, function(name, eventMethod)
        {
            self[name] = (function(fn) // copy eventMethod (loop)
            {
                return function()
                {
                    fn.apply(self, arguments);
                };
            }(eventMethod));
        });

        // once - prevent calling this event from manual trigger
        this.once("application:start", function()
        {
            this.log("Application starting...");

            /**
             * Framework.Resources are placeholder for definitions.
             * Here we are copying definitions to _registeredResources - not definition but result of executing definition.
             */
            jQuery.each(Framework.Resources, function(name, resourceDefinition)
            {
                _registeredResources[name] = {
                    name: name,
                    resource: resourceDefinition.fn(self), // pass sandbox
                    type: resourceDefinition.type
                };
            });

            /**
             * Create components
             */
            jQuery.each(_registeredComponents, function(name, component)
            {
                self.log("Pre-Initializing component: " + name + "...");
                _createdComponents[name] = {
                    component: component.getInstance()
                };
            });

            _router = this.getComponent("RoutingManager").getRouterInstance(_application.name); // get application router

            /**
             * Post initialize components
             * @see RoutingManager component
             */
            jQuery.each(_registeredComponents, function(name, component)
            {
                self.log("Post-Initializing component: " + name + "...");
                jQuery.isFunction(component.initialize) && component.initialize();
            });

            this.log("Application started.");
        }, this);

        /**
         * If component is registered.
         * @param name
         * @returns {boolean}
         */
        this.hasComponent = function(name)
        {
            return !!_registeredComponents[name];
        };

        /**
         * Get registered component.
         * @param name
         * @returns {*}
         */
        this.getComponent = function(name)
        {
            if(!this.hasComponent(name))
            {
                throw "Component '" + name + "' doesn't exists!";
            }
            return _registeredComponents[name];
        };

        /**
         * Get created component (singleton).
         * @param name
         * @returns {*|string|boolean}
         */
        this.getCreatedComponent = function(name)
        {
            if(!_createdComponents[name])
            {
                throw "Component '" + name + "' is not created!";
            }
            return _createdComponents[name].component;
        };

        /**
         * Get application.
         * @see AppClass
         * @returns {*}
         */
        this.getApplication = function()
        {
            return _application;
        };

        /**
         * Create registered resource.
         * @param name
         * @param params
         * @returns {resource|*|any}
         */
        this.createResource = function(name, params)
        {
            return _createResource(name, params);
        };

        /**
         * Get resource definition.
         * @param name
         * @returns {*|any|resource}
         */
        this.getResourceDefinition = function(name)
        {
            if(!_registeredResources[name])
            {
                throw "Resource '" + name + "' doesn't exists!";
            }
            return _registeredResources[name].resource;
        };

        /**
         * Destroy created Backbone resource.
         * @param resource
         * @returns {Framework.Sandbox}
         */
        this.destroyResource = function(resource)
        {
            var i;
            for(i = _createdResources.length - 1; i >= 0; i -= 1)
            {
                if(_createdResources[i].resource === resource)
                {
                    this.log("Destroying resource by resource", "type:" + _createdResources[i].type, "name:" + _createdResources[i].name);
                    delete _createdResources[i].resource;
                    _createdResources.splice(i, 1);
                }
            }
            return this;
        };

        /**
         * Destroy created Backbone resource by given name.
         * @param name
         * @returns {Framework.Sandbox}
         */
        this.destroyResourceByName = function(name)
        {
            var i;
            for(i = _createdResources.length - 1; i >= 0; i -= 1)
            {
                if(_createdResources[i].name === name)
                {
                    this.log("Destroying resource by name", "type:" + _createdResources[i].type, "name:" + _createdResources[i].name);
                    delete _createdResources[i].resource;
                    _createdResources.splice(i, 1);
                }
            }
            return this;
        };

        /**
         *
         * @param name
         * @param params
         * @returns {Framework.Sandbox}
         */
        this.triggerOnResources = function(name, params)
        {
            jQuery.each(_createdResources, function(key, obj)
            {
                if(obj && obj.resource) // resource can be empty if resource is destroyed
                {
                    obj.resource.trigger(name, params);
                }
            });
            return this;
        };

        /**
         * Application router getter.
         * @returns {*}
         */
        this.getRouter = function()
        {
            return _router;
        };

        /**
         * Log proxy.
         */
        this.log = function()
        {
            _application.log.apply(_application, arguments);
        };
    };

    return sandbox;
}());