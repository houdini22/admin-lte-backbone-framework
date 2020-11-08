module.exports = function(_paths)
{
    return {
        devCSS: {
            expand: true,
            cwd: _paths.css_compile_dir,
            src: "**",
            dest: _paths._dest + "css"
        },
        devJS: {
            expand: true,
            cwd: _paths.js_compile_dir,
            src: "**",
            dest: _paths.js_dest
        },
        devConfig: {
            src: _paths.js_src + "config-dev.js",
            dest: _paths.js_dest + "config.js"
        },
        img: {
            expand: true,
            cwd: _paths._src + "img/",
            src: "**",
            dest: _paths._dest + "img/"
        },
        fonts: {
            expand: true,
            cwd: _paths._src + "fonts/",
            src: "**",
            dest: _paths._dest + "fonts/"
        },
        vendor: {
            expand: true,
            cwd: _paths._src + "vendor",
            src: "**",
            dest: _paths._dest + "vendor"
        },
        prodConfig: {
            src: _paths.js_src + "config-prod.js",
            dest: _paths.js_dest + "config.js"
        }
    }
};