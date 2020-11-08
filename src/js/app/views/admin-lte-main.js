Framework.defineResource("AdminLTEView", "view", function(sandbox)
{
    return sandbox.getResourceDefinition("MainView").extend({
        el: "#application .application-wrapper",
        partials: {},
        initialize: function()
        {
            var self = this;

            sandbox.getResourceDefinition("MainView").prototype.initialize.apply(this, arguments);

            this.on("destroy", function()
            {
                jQuery.each(this.createdPartials, function(name, view)
                {
                    view.destroy();
                    delete self.createdPartials[name];
                });
            }, this);
        },
        _getRenderDeferreds: function()
        {
            var deferreds = sandbox.getResourceDefinition("MainView").prototype._getRenderDeferreds.apply(this, arguments);

            jQuery.each(this.partials, function(selector, viewName)
            {
                var prototype = sandbox.getResourceDefinition(viewName).prototype,
                    templatePath = prototype.templatePath,
                    templateCache = prototype.templateCache;

                deferreds = jQuery.merge(deferreds, sandbox.getCreatedComponent("TemplateLoader").load({
                    path: templatePath,
                    cache: templateCache
                }));
            });

            return deferreds;
        },
        getTemplateData: function()
        {
            var data = sandbox.getResourceDefinition("MainView").prototype.getTemplateData.apply(this, arguments);
            data["user"] = sandbox.getCreatedComponent("AuthManager").getUser().toJSON();
            return data;
        },
        _onAfterRender: function()
        {
            sandbox.getResourceDefinition("MainView").prototype._onAfterRender.call(this);
            var readyDeferreds = [];

            jQuery.each(this.createdPartials, function(viewName, view)
            {
                readyDeferreds.push(view.readyDeferred);
            });

            jQuery.when.apply(null, readyDeferreds).done(function()
            {
                //Extend options if external options exist
                if(typeof AdminLTEOptions !== "undefined")
                {
                    $.extend(true,
                        $.AdminLTE.options,
                        AdminLTEOptions);
                }

                //Easy access to options
                var o = $.AdminLTE.options;

                //Set up the object
                _init();

                //Activate the layout maker
                $.AdminLTE.layout.activate();

                //Enable sidebar tree view controls
                $.AdminLTE.tree('.sidebar');

                //Enable control sidebar
                if(o.enableControlSidebar)
                {
                    $.AdminLTE.controlSidebar.activate();
                }

                //Add slimscroll to navbar dropdown
                if(o.navbarMenuSlimscroll && typeof $.fn.slimscroll != 'undefined')
                {
                    $(".navbar .menu").slimscroll({
                        height: o.navbarMenuHeight,
                        alwaysVisible: false,
                        size: o.navbarMenuSlimscrollWidth
                    }).css("width", "100%");
                }

                //Activate sidebar push menu
                if(o.sidebarPushMenu)
                {
                    $.AdminLTE.pushMenu.activate(o.sidebarToggleSelector);
                }

                //Activate Bootstrap tooltip
                if(o.enableBSToppltip)
                {
                    $('body').tooltip({
                        selector: o.BSTooltipSelector
                    });
                }

                //Activate box widget
                if(o.enableBoxWidget)
                {
                    $.AdminLTE.boxWidget.activate();
                }

                //Activate fast click
                if(o.enableFastclick && typeof FastClick != 'undefined')
                {
                    FastClick.attach(document.body);
                }

                //Activate direct chat widget
                if(o.directChat.enable)
                {
                    $(o.directChat.contactToggleSelector).on('click', function()
                    {
                        var box = $(this).parents('.direct-chat').first();
                        box.toggleClass('direct-chat-contacts-open');
                    });
                }

                $('.btn-group[data-toggle="btn-toggle"]').each(function()
                {
                    var group = $(this);
                    $(this).find(".btn").on('click', function(e)
                    {
                        group.find(".btn.active").removeClass("active");
                        $(this).addClass("active");
                        e.preventDefault();
                    });
                });
            });
        }
    });
});