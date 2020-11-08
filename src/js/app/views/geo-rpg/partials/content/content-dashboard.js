Framework.defineResource("_DashboardContentView", "view", function(sandbox)
{
    return sandbox.getResourceDefinition("PartialMainView").extend({
        templatePath: "partials/content/dashboard",
        initialize: function()
        {
            sandbox.getResourceDefinition("PartialMainView").prototype.initialize.apply(this, arguments);
        }
    });
});