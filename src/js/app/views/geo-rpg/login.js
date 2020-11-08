Framework.defineResource("LoginView", "view", function(sandbox)
{
    return sandbox.getResourceDefinition("AdminLTEView").extend({
        templatePath: "login",
        events: {
            "click .js-user-sign-in": "_onClickSignInButton"
        },
        initialize: function()
        {
            this.events = jQuery.extend(sandbox.getResourceDefinition("MainView").prototype.events, this.events);
            this.partials = {};
            sandbox.getResourceDefinition("MainView").prototype.initialize.apply(this, arguments);
        },
        _onClickSignInButton: function(e)
        {
            sandbox.getCreatedComponent("AuthManager").login(null, null, {
                success: function()
                {
                    sandbox.getRouter().redirect("dashboard", {
                        replace: true
                    });
                }
            });
            return false;
        }
    });
});