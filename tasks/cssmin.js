module.exports = function(_paths)
{
    return {
        minify: {
            expand: true,
            cwd: _paths.css_compile_dir,
            src: ["*.css", "!*.min.css"],
            dest: _paths.css_dest,
            ext: ".css"
        }
    }
};