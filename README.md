pug-dependency
===========

Find pug file dependency (include and extend).

Example
---
```javascript

var dependency = require('pug-dependency');

var d = dependency('pug/**/*.pug');

d.find_dependencies('pug/child.pug');
// [
//   '/repo/pug/_parent.pug',
//   '/repo/pug/_grand_parent.pug',
//   '/repo/pug/_component.pug',
//   '/repo/pug/_sub_component1.pug',
//   '/repo/pug/_sub_component2.pug'
// ]

d.find_dependents('pug/_sub_component1.pug');
// [
//   '/repo/pug/_component.pug',
//   '/repo/pug/child.pug'
// ]

d.find_dependents('pug/_grand_parent.pug');
// [
//   '/repo/pug/_parent.pug',
//   '/repo/pug/child.pug'
// ]
```

API
---

### constructor(glob, options)

glob: glob to select files to keep track of
options: passed to pug

### file_changed(path)

Signal to the module that a file has changed. This is useful for using with watch.

### find_dependents(path)

Return a list of absolute paths of files which depends on the file at path.

### find_dependencies(path)

Return a list of absolute paths of files which the file at path depends on.


LICENSE
-------

The MIT License (MIT)

Copyright (c) 2016 Shida Li

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
