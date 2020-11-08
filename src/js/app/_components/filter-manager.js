Framework.Components["FilterManager"] = function(sandbox)
{
    /**
     * Singleton
     */
    var instance;

    /**
     * Setter for next filter in the filters chain
     * @param nextFilter
     * @returns {filterSetNextMethod}
     */
    var filterSetNextMethod = function filterSetNextMethod(nextFilter)
    {
        this.nextFilter = nextFilter;
        return this;
    };

    /**
     * Usage in filter:
     * return this.next();
     * @returns {*}
     */
    var filterNextMethod = function filterNextMethod()
    {
        if(this.isRequestCancelled) // do not execute route
        {
            return false;
        }
        if(this.isStopped) // this.stop() method in the filter called, do not execute next filter
        {
            return true;
        }
        if(this.nextFilter) // filter is not last
        {
            return this.nextFilter.execute();
        }
        return true;
    };

    /**
     * Helper method for request cancel flag.
     * @returns {boolean}
     */
    var filterCancelRequestMethod = function filterCancelRequestMethod()
    {
        sandbox.log("Cancelling request...");
        this.isRequestCancelled = true;
        return false;
    };

    /**
     * Helper method for stop executing filters.
     * @returns {filterStopMethod}
     */
    var filterStopMethod = function filterStopMethod()
    {
        sandbox.log("Stopping filters chain...");
        this.isStopped = true;
        return this;
    };

    var FilterManagerClass = function()
    {
        this.filters = [];
        this.filterInstances = [];
    };

    FilterManagerClass.prototype = jQuery.extend(FilterManagerClass.prototype, {
        /**
         * Adds filter to execute.
         * @param filterName
         * @returns {Framework.FilterManager}
         */
        addFilter: function(filterName)
        {
            var self = this,
                /**
                 * Filter object
                 * @param routeDefinition
                 * @param routeArguments
                 * @constructor
                 */
                filterExecuteMethod,
                filterParams = {},
                Filter = function(routeDefinition, routeArguments)
                {
                    this.name = filterName;
                    this.sandbox = sandbox;
                };

            if(typeof filterName === "string")
            {
                filterExecuteMethod = Framework.Filters[filterName]; // get created filter
            }
            else
            {
                filterExecuteMethod = Framework.Filters[filterName[0]];
                filterParams = Framework.Filters[filterName[1]];
            }

            // create filter class
            Filter.prototype = jQuery.extend(Filter.prototype, {
                setNext: filterSetNextMethod,
                execute: function()
                {
                    var result;
                    sandbox.log("Executing filter:", this.name);
                    result = filterExecuteMethod.call(this);
                    if(typeof result == "undefined")
                    {
                        throw "Wrong usage of filter:" + this.name;
                    }
                    return result;
                },
                next: filterNextMethod,
                stop: filterStopMethod,
                cancelRequest: filterCancelRequestMethod
            });
            this.filters.push(Filter);
            return this;
        },
        /**
         * Add filters to chain.
         * @param filters
         * @returns {Framework.FilterManager}
         */
        addFilters: function(filters)
        {
            var self = this;

            _.each(filters, function(filter)
            {
                self.addFilter(filter);
            });

            return this;
        },
        /**
         * Remove defined and created filters.
         * @returns {Framework.FilterManager}
         */
        clean: function()
        {
            this.filters = [];
            this.filterInstances = [];
            return this;
        },
        /**
         * Start executing filters.
         * @param routeDefinition
         * @param routeArguments
         * @returns {*}
         */
        execute: function(routeDefinition, routeArguments)
        {
            var self = this,
                result = true;

            // create filter instances
            _.each(this.filters, function(Filter)
            {
                self.filterInstances.push(new Filter(routeDefinition, routeArguments));
            });

            // create chain
            _.each(this.filterInstances, function(filter, key)
            {
                filter.setNext(self.filterInstances[key + 1]);
            });

            if(this.filterInstances[0]) // first filter exists
            {
                result = this.filterInstances[0].execute(); // start chain and save result
            }

            this.clean(); // filters executed, clean to prevent duplicated instances.

            return result;
        }
    });

    return {
        getInstance: function()
        {
            if(!instance)
            {
                instance = new FilterManagerClass();
            }
            return instance;
        }
    }
};