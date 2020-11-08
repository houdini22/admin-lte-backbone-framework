Framework.Components["AuthManager"] = function(sandbox)
{
    var instance;

    var AuthManagerClass = function()
    {
        this.loggedIn = false;
        this.user = sandbox.createResource("UserModel");
    };

    AuthManagerClass.prototype = jQuery.extend(AuthManagerClass.prototype, {
        login: function(username, password, options)
        {
            options = options || {};
            options = jQuery.extend(true, {
                success: function()
                {

                },
                error: function()
                {

                }
            }, options);

            // TODO: create user
            this.user.set({
                "id": "10000297",
                "meta": {
                    "created": "2013-09-13T15:24:44.000+0200"
                },
                "schemas": [
                    "urn:scim:schemas:core:2.0:User",
                    "urn:scim:schemas:extension:enterprise:2.0:User"
                ],
                "userName": "john.doe",
                "name": {
                    "familyName": "ss",
                    "givenName": "sss"
                },
                "displayName": "Test business client",
                "emails": [
                    {
                        "value": "ss",
                        "primary": true
                    }
                ],
                "phoneNumbers": [
                    {
                        "value": "sss",
                        "primary": true
                    }
                ],
                "addresses": [
                    {
                        "streetAddress": "",
                        "locality": "s",
                        "region": "",
                        "postalCode": "",
                        "country": "SH",
                        "primary": true
                    }
                ],
                "groups": [
                    {
                        "value": "user"
                    }
                ],
                "urn:scim:schemas:extension:enterprise:2.0:User": {
                    "organization": "10000000"
                }
            });

            // TODO: create request
            this.loggedIn = true;
            options.success();
        },
        logout: function(options)
        {
            if(this.isLoggedIn())
            {
                // TODO: create request
                if(jQuery.isFunction(options.success))
                {
                    options.success();
                }
            }
        },
        isLoggedIn: function()
        {
            return this.loggedIn;
        },
        getUser: function()
        {
            return this.user;
        }
    });

    return {
        getInstance: function() // singleton
        {
            if(!instance)
            {
                instance = new AuthManagerClass;
            }
            return instance;
        }
    };
};