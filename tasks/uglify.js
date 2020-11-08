module.exports = function(_paths)
{
    return {
        minify: {
            options: {
                compress: {
                    drop_console: true
                },
                beautify: {
                    ascii_only: true,
                    quote_keys: true
                }
            },
            files: [
                {
                    expand: true,
                    cwd: _paths.js_compile_dir,
                    src: ['*.js', '!*.min.js'],
                    dest: _paths.js_dest,
                    rename: function(dest, src)
                    {
                        var path = require('path');
                        // Prefix each javascript file with the folder name into the destination
                        return path.join(dest, path.basename(src));
                    }
                }
            ]
        }
    }
};