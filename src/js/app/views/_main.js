Framework.defineResource("MainView", "view", function(sandbox)
{
    return Backbone.View.extend({

        /**
         * Should template be cached?
         */
        templateCache: true,

        /**
         * Template path - get template from template directory
         */
        templatePath: "",

        /**
         * Template URL - get template from given URL - not from templates directory
         */
        templateUrl: "",

        /**
         * Data passed to template
         */
        templateData: {},

        /**
         * Flag if template should be appended (true) or inserted (false)
         */
        append: false,

        /**
         * Flag if template should be prepended (true) or inserted (false)
         */
        prepend: false,

        /**
         * Deferred resolved after rendering
         */
        readyDeferred: null,

        events: {
            "change :input[data-model]": "_onChangeInput" // global input change event
        },

        partials: {},

        createdPartials: {},

        /**
         * Callback executed before template HTML is appended or inserted to this.$el
         */
        _onBeforeRender: function()
        {

        },

        /**
         * Callback executed after template HTML is appended to this.$el
         */
        _onAfterRender: function()
        {
            var self = this;

            jQuery.each(this.partials, function(selector, viewName)
            {
                self.createdPartials[viewName] = sandbox.createResource(viewName, {
                    el: selector
                });
            });

            jQuery('input').iCheck({
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue',
                increaseArea: '20%' // optional
            });
        },

        /**
         * @constructor
         */
        initialize: function(opts)
        {
            if(opts.parentView)
            {
                this.parentView = opts.parentView;
            }

            if(opts.templatePath)
            {
                this.templatePath = opts.templatePath;
            }

            if(opts.templateUrl)
            {
                this.templateUrl = opts.templateUrl;
            }

            if(opts.$el)
            {
                this.$el = opts.$el;
                this.el = this.$el[0];
            }

            this.readyDeferred = new jQuery.Deferred;

            if(this.$el.size())
            {
                if(this.templatePath || this.templateUrl)
                {
                    this.render();
                }
                else
                {
                    this.$template = this.$el.find(" > *");
                }
            }
        },

        /**
         * Fetch template and execute callback on success.
         * @param callback
         * @returns {jQuery.Deferred} Promise
         */
        _fetchTemplate: function(callback)
        {
            var templateLoaderConf = {};

            if(!this.templatePath && !this.templateUrl)
            {
                throw "Set template path or URL!";
            }

            if(this.templatePath)
            {
                templateLoaderConf.path = this.templatePath;
            }
            else
            {
                if(this.templateUrl)
                {
                    templateLoaderConf.url = this.templateUrl;
                }
            }

            templateLoaderConf.cache = this.templateCache !== false;

            return sandbox.getCreatedComponent("TemplateLoader").load(templateLoaderConf, function(template)
            {
                if(typeof callback === "function")
                {
                    callback(template);
                }
            });
        },

        /**
         * Get array of jQuery.Deferred which are required to render a view
         * @returns {Array}
         */
        _getRenderDeferreds: function()
        {
            return [];
        },

        /**
         * Renders a view
         */
        render: function(callback)
        {
            var self = this,

                /**
                 * Template HTML
                 * @type {string}
                 */
                response = "";

            jQuery(".js-main-loading-overlay").show();

            /**
             * Array of deferreds. On complete all requests the template will be rendered.
             * @type Array
             */
            var renderDeferreds = jQuery.merge(this._fetchTemplate(function(templateHTML)
            {
                response = templateHTML;
            }), this._getRenderDeferreds());

            jQuery.when.apply(null, renderDeferreds).done(function() // fire when done
            {
                self.template = Handlebars.compile(response);

                var $html,
                    $bindTo,
                    html;

                if(typeof self._onBeforeRender === "function")
                {
                    self._onBeforeRender();
                }
                if(typeof callback === "function")
                {
                    callback.call(self);
                }

                html = self.template(self.getTemplateData());
                self.$template = $html = jQuery(html);

                if(self.append)
                {
                    $html.appendTo(self.$el);
                    $bindTo = $html;
                }
                else
                {
                    if(self.prepend)
                    {
                        $html.prependTo(self.$el);
                        $bindTo = $html;
                    }
                    else
                    {
                        self.$el.html($html);
                        $bindTo = self.$el;
                    }
                }

                self.setElement($bindTo[0]);

                if(typeof self._onAfterRender === "function")
                {
                    self._onAfterRender();
                }

                self.readyDeferred.resolve(); // view rendered and ready

                jQuery(".js-main-loading-overlay").hide();

                //sandbox.getApplication().getLogger().info("Render time of", self.resourceName, sandbox.getApplication().getTimeMeasurement().stop("render:" + self.resourceName), "miliseconds")
            });
        },

        getTemplateData: function()
        {
            return {};
        },

        /**
         * Global function to render a form errors.
         * @param errors {object}
         * @param [selector] {string}
         */
        displayFormErrors: function(errors, selector)
        {
            selector = selector || "form";

            var $form = this.$template.find(selector),
                self = this;

            // delete old errors
            $form.find(".has-error").removeClass("has-error");
            $form.find(".field_errors").remove();

            // parse and display errors
            jQuery.each(errors, function(key, arr)
            {
                var $errorsContainer = jQuery("<ul/>").addClass("field_errors rb-submit");

                jQuery.each(arr, function(key2, errorMessage)
                {
                    $errorsContainer.append(jQuery("<li/>").text(errorMessage));
                });

                $form.find("[data-model=" + key + "]").closest(".form-group").addClass("has-error");
                $form.find("[data-model=" + key + "]").after($errorsContainer);
            });
        },

        /**
         * Global method to get form values. Note that inputs should have the data-model attribute.
         * You can nest variables if you pass a namespace to data-model attribute. ie. data-model="data.var_1"
         * @param [selector]
         * @returns {{}}
         */
        getFormData: function(selector)
        {
            selector = selector || "form";

            var $form = this.$el.find(selector),
                result = {};

            $form.find(":input[data-model]").each(function()
            {
                var $input = $(this),
                    value = jQuery.trim($input.val()) ? jQuery.trim($input.val()) : null;

                if($input.is("input[type=radio]"))
                {
                    if($input.is(":checked"))
                    {
                        Framework.Helpers.ObjectHelper.setPropertyByPath(result, $input.attr("data-model"), value);
                    }
                }
                else
                {
                    if($input.is("input[type=checkbox]"))
                    {
                        if($input.is(":checked"))
                        {
                            Framework.Helpers.ObjectHelper.setPropertyByPath(result, $input.attr("data-model"), value);
                        }
                    }
                    else
                    {
                        Framework.Helpers.ObjectHelper.setPropertyByPath(result, $input.attr("data-model"), value);
                    }
                }
            });

            return result;
        },

        /**
         * Global method on input change - it removes form errors
         * @param e {Event}
         */
        _onChangeInput: function(e)
        {
            var $input = jQuery(e.target);

            // delete form errors
            $input.closest(".form-group").removeClass("has-error").find(".field_errors").remove();
        },

        /**
         * Destroy view.
         * @returns {*}
         */
        destroy: function()
        {
            this.stopListening();
            this.undelegateEvents();
            if(this.$template)
            {
                this.$template.removeData().unbind().off();
                this.$template.remove();
            }
            this.trigger("destroy");
            this.createdPartials = {};
            sandbox.destroyResource(this); // remove from created resources
        },

        hide: function()
        {
            this.$template.hide();
        },

        show: function()
        {
            this.$template.show();
        },

        /**
         * Extended method. Backbone delegate method set events on this.$el. If you set flag this.append === true or this.prepend === true there will be
         * event triggered on all appended/prepended elements.
         * @param eventName
         * @param selector
         * @param listener
         * @returns {delegate}
         */
        delegate: function(eventName, selector, listener)
        {
            if(this.$template)
            {
                /**
                 * this.$template doesn't exists when view constructor is executed.
                 * @see this.render
                 */
                this.$template.on(eventName + '.delegateEvents' + this.cid, selector, listener);
            }
            return this;
        }
    });
});