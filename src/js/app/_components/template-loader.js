Framework.Components["TemplateLoader"] = function(sandbox)
{
    var instance, // singleton
        deferredsCache = {}, // deferreds for all requests
        cache = {}, // template cache
        path = "/templates/", // TODO: config
        extension = "html";

    var TemplateLoaderClass = function TemplateLoaderClass()
    {
        /**
         * Templates to load stack
         */
        var queue;

        /**
         *
         * @param opts Conf opts
         * @param callback Fired after all templates fetch
         * @returns $.Deferred()
         */
        this.load = function(opts, callback)
        {
            var i,
                ifUrl = !!opts.url,
                paths = opts.url || opts.path,
                ifCache = opts.cache;

            queue = []; // reset queue

            if(Object.prototype.toString.call(paths) === "[object Array]") // is array
            {
                for(i = 0; i < paths.length; i += 1)
                {
                    this.addToQueue(paths[i], ifUrl, ifCache);
                }
            }
            else
            {
                this.addToQueue(paths, ifUrl, ifCache);
            }

            return this.fetch(callback);
        };

        /**
         * Adds path to urls queue
         * @param url
         * @param ifUrl Flag if not generate url to fetch
         * @param ifCache Flag if template should be cached
         */
        this.addToQueue = function(url, ifUrl, ifCache)
        {
            if(!ifUrl) // generate url - path is given
            {
                url = path + url + "." + extension;
            }
            if(!ifCache) // delete cache and deferred
            {
                delete deferredsCache[url];
                delete cache[url];
            }
            if(!deferredsCache[url]) // create deferred
            {
                deferredsCache[url] = new jQuery.Deferred();
            }
            queue.push(url);
        };

        /**
         * Fetch all templates from queue
         * @param callback Fired after all downloads
         * @returns {Array} Array of deferreds
         */
        this.fetch = function(callback)
        {
            var deferreds = [],
                i;

            for(i = 0; i < queue.length; i += 1)
            {
                deferreds.push(deferredsCache[queue[i]]);
            }

            jQuery.when.apply(null, deferreds).done((function(queueCopy) // fire when all downloads are completed
            {
                // remember queue - it may be changed
                return function()
                {
                    var loadedTemplates = [], j;
                    if(typeof callback === "function")
                    {
                        for(j = 0; j < queueCopy.length; j += 1)
                        {
                            loadedTemplates.push(cache[queueCopy[j]]);
                        }
                        callback.apply(null, loadedTemplates); // fire callback with responses as parameters
                    }
                }
            })(queue));

            for(i = 0; i < queue.length; i += 1)
            {
                if(!cache[queue[i]])
                {
                    jQuery.ajax({
                        url: queue[i],
                        success: (function(queueCopy, iCopy)
                        {
                            // save queue - it may change
                            return function(response)
                            {
                                cache[queueCopy[iCopy]] = response; // save template
                                deferredsCache[queueCopy[iCopy]].resolve(); // ready
                            }
                        }(queue, i))
                    });
                }
            }

            return deferreds;
        };
    };

    return {
        getInstance: function()
        {
            if(!instance)
            {
                instance = new TemplateLoaderClass;
            }
            return instance;
        }
    };
};