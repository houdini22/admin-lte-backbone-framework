Framework.Filters["isLoggedIn"] = function()
{
    var authManager = this.sandbox.getCreatedComponent("AuthManager");
    if(!authManager.isLoggedIn())
    {
        this.cancelRequest();
        this.sandbox.getRouter().redirect(""); // login route
    }
    return this.next();
};