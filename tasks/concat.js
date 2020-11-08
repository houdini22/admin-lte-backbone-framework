module.exports = function(_paths, grunt)
{
    var pathsJS = function(srcs)
    {
        var i = 0,
            l = srcs.length;

        for(i, l; i < l; i++) srcs[i] = _paths.js_src + srcs[i];
        return srcs;
    };

    var pathsCSS = function(srcs)
    {
        var i = 0,
            l = srcs.length;
        for(i, l; i < l; i += 1) srcs[i] = _paths.css_src + srcs[i];
        return srcs;
    };

    return {
        buildCSS: {
            options: {
                separator: "\n"
            },
            files: [
                {
                    dest: _paths.css_compile_dir + "main.css",
                    src: pathsCSS([
                        "sass/_compiled/screen.css"
                    ])
                },
                {
                    dest: _paths.css_compile_dir + "ie.css",
                    src: pathsCSS([
                        "sass/_compiled/ie.css"
                    ])
                },
                {
                    dest: _paths.css_compile_dir + "print.css",
                    src: pathsCSS([
                        "sass/_compiled/print.css"
                    ])
                }
            ]
        },
        buildJS: {
            options: {
                separator: "\n;\n"
            },
            files: [
                // LIBS
                {
                    dest: _paths.js_compile_dir + "libs.js",
                    src: pathsJS([
                        "libs/jQuery-2.1.4.min.js",
                        "libs/jquery-ui.min.js",
                        "libs/common.min.js",
                        "libs/underscore.min.js",
                        "libs/backbone.min.js",
                        "libs/backbone-relational.js",
                        "libs/handlebars.js",
                        "libs/bootstrap.min.js",
                        "libs/raphael-min.js",
                        "libs/plugins/icheck.min.js",
                        "libs/plugins/morris.min.js",
                        "libs/plugins/jquery.sparkline.min.js",
                        "libs/plugins/jquery-jvectormap-1.2.2.min.js",
                        "libs/plugins/jquery-jvectormap-world-mill-en.min.js",
                        "libs/plugins/jquery.knob.min.js",
                        "libs/plugins/moment.min.js",
                        "libs/plugins/daterangepicker.min.js",
                        "libs/plugins/bootstrap-datepicker.min.js",
                        "libs/plugins/jquery.slimscroll.min.js",
                        "libs/plugins/fastclick.min.js",
                        "libs/AdminLTE.js"
                    ])
                },
                // APP
                {
                    dest: _paths.js_compile_dir + "app.js",
                    src: pathsJS([
                        "app/**/*.js"
                    ])
                },
                // IE9
                {
                    dest: _paths.js_compile_dir + "ie9.js",
                    src: pathsJS([
                        "libs/ie9/*.js"
                    ])
                }
            ]
        }
    }
};