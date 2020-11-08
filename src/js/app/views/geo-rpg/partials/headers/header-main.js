Framework.defineResource("_MainHeaderView", "view", function(sandbox)
{
    return sandbox.getResourceDefinition("PartialMainView").extend({
        templatePath: "partials/headers/header-main",
        events: {
            "click .js-user-sign-out": "_onClickUserSignOut"
        },
        initialize: function()
        {
            this.events = jQuery.extend(sandbox.getResourceDefinition("PartialMainView").prototype.events, this.events);
            sandbox.getResourceDefinition("PartialMainView").prototype.initialize.apply(this, arguments);
        },
        _onClickUserSignOut: function(e)
        {
            sandbox.getCreatedComponent("AuthManager").logout({
                success: function()
                {
                    sandbox.getRouter().redirect("", {
                        replace: true
                    });
                }
            });
            return false;
        }
    });
});