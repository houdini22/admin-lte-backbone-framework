Framework.defineResource("DashboardView", "view", function(sandbox)
{
    return sandbox.getResourceDefinition("AdminLTEView").extend({
        templatePath: "dashboard",
        partials: {
            "div.content-wrapper": "_DashboardContentView",
            "header.main-header": "_MainHeaderView",
            "aside.main-sidebar": "_MainSidebarView"
        },
        initialize: function()
        {
            this.partials = jQuery.extend(sandbox.getResourceDefinition("AdminLTEView").prototype.partials, this.partials);
            this.events = jQuery.extend(sandbox.getResourceDefinition("AdminLTEView").prototype.events, this.events);
            sandbox.getResourceDefinition("AdminLTEView").prototype.initialize.apply(this, arguments);
        }
    });
});