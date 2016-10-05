"use strict";

/*
use like this: `import routeList from "routes!./pages/Home"`;

This will treat `Home.js` as your homepage and all other js files as routes defined by the file names.

`routeList` will return an array like this:

```
[
  {path: "/", comp: function Home() {...}},
  {path: "/about/", comp: function About() {...}}
]
````
*/

const glob = require("glob");
const path = require("path");
const loaderUtils = require("loader-utils");

const getRoutes = (homePath, cb) => {
  const homeFile = path.basename(homePath);
  const baseDir = path.dirname(homePath);

  const transformFile = (f) => ({
    location: f,
    path: `/${f === homeFile ? "" : (f.split(".").slice(0, -1).join("").toLowerCase() + "/")}`
  })

  const options = {cwd: baseDir};

  if (cb) {
    glob("**/*.js", options, (err, files) => {
      if (err) return cb(err);
      cb(null, files.map(f => transformFile(f)));
    })
  } else {
    return glob.sync("**/*.js", options).map(f => transformFile(f));
  }
}

const loader = function(source) {
  this.cacheable();
  const webpackCallback = this.async();

  let callbackCalled = false;
  const callback = (err, result) => {
    if (callbackCalled) return;
    webpackCallback(err, result);
    callbackCalled = true;
  }

  const result = [];
  let done = 0;

  getRoutes(this.resourcePath, (err, fileData) => {
    if (err) return callback(err);
    fileData.forEach(data => {
      this.resolve(this.context, `.${path.sep}${data.location}`, (err, resolved) => {
        if (err) return callback(err);
        result.push({
          path: data.path,
          comp: `require(${loaderUtils.stringifyRequest(this, resolved)}).default`
        });
        done += 1;

        if (done === fileData.length) {
          const stringified = result.map((o) => (
            `{path: ${JSON.stringify(o.path)}, comp: ${o.comp}}`
          )).join(",\n");

          // console.log(stringified);
          callback(null, `module.exports = [${stringified}]`);
        }
      })
    })
  })
};

loader.getRoutes = getRoutes;

module.exports = loader;
