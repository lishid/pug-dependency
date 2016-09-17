'use strict';

var path = require('path');
var fs = require('fs');
var glob = require('glob');

var edgestore = require('edgestore');
var lex = require('pug-lexer');
var parse = require('pug-parser');
var walk = require('pug-walk');

module.exports = function (globs, options) {
    var paths = glob.sync(globs);

    var edges = edgestore();

    function resolve_file(file_path) {
        var abs_path = path.resolve(file_path);

        var file_content = '';
        try {
            file_content = fs.readFileSync(abs_path, 'utf8');
        } catch (e) {
            // File might be gone. Let's untrack that file for now.
        }

        edges.remove_for_x(abs_path);

        var dependencies = [];

        if (file_content) {
            var tokens = lex(file_content);
            var ast = parse(tokens, {src: abs_path});
            walk(ast, function (node) {
                if (node.type === 'Include' || node.type === 'RawInclude' || node.type === 'Extends') {
                    var file = node.file;
                    if (file.type !== 'FileReference') {
                        throw new Error('Expected file.type to be "FileReference"');
                    }
                    try {
                        var dependency = path.resolve(path.dirname(abs_path), file.path);
                        dependencies.push(dependency);
                    } catch (ex) {
                        ex.message += '\n    at ' + node.filename + ' line ' + node.line;
                        throw ex;
                    }
                }
            });
        }

        dependencies.map(function (dependency) {
            edges.add(abs_path, dependency);
        });
    }

    function bfs_dependency(file_abs_path, get_for_file) {
        var stack = [file_abs_path];
        var visited = {};
        var results = [];
        while (stack.length) {
            var abs_paths = get_for_file(stack.pop());
            abs_paths.map(function (abs_path) {
                if (!visited[abs_path]) {
                    visited[abs_path] = true;
                    results.push(abs_path);
                    stack.push(abs_path);
                }
            })
        }
        return results;
    }

    function find_dependents(file_path) {
        return bfs_dependency(path.resolve(file_path), function (abs_path) {
            return edges.get_for_y(abs_path);
        });
    }

    function find_dependencies(file_path) {
        return bfs_dependency(path.resolve(file_path), function (abs_path) {
            return edges.get_for_x(abs_path);
        });
    }

    // First let's resolve everything
    paths.map(resolve_file);

    return {
        file_changed: resolve_file,
        find_dependents: find_dependents,
        find_dependencies: find_dependencies
    };
};
