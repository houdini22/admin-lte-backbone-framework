Framework.defineResource("PartialMainView", "view", function(sandbox)
{
    return sandbox.getResourceDefinition("MainView").extend({
        partials: {},
        initialize: function()
        {
            sandbox.getResourceDefinition("MainView").prototype.initialize.apply(this, arguments);
        },
        _onAfterRender: function()
        {
            sandbox.getResourceDefinition("MainView").prototype._onAfterRender.call(this);
        },
        getTemplateData: function()
        {
            var data = sandbox.getResourceDefinition("MainView").prototype.getTemplateData.apply(this, arguments);
            data["user"] = sandbox.getCreatedComponent("AuthManager").getUser().toJSON();
            return data;
        }
    });
});