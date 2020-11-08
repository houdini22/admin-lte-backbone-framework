Framework.defineResource("_MainSidebarView", "view", function(sandbox)
{
    return sandbox.getResourceDefinition("PartialMainView").extend({
        templatePath: "partials/sidebars/sidebar-main",
        events: {
            "click .js-search-submit": "_onClickSearchSubmit"
        },
        initialize: function()
        {
            sandbox.getResourceDefinition("PartialMainView").prototype.initialize.apply(this, arguments);
        },
        _onClickSearchSubmit: function(e)
        {
            alert("Not implemented");
            return false;
        }
    });
});