import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {ServerRouter, createServerRenderContext} from "react-router";
import App from "./App";
import html from "./index.html"

export default function render(locals, cb) {
  const context = createServerRenderContext();
  const markup = renderToStaticMarkup(
    <ServerRouter location={locals.path} context={context}>
      <App/>
    </ServerRouter>
  )
  const result = context.getResult();
  if (result.redirect) throw new Error("Found redirect for " + locals.path);
  if (result.missed) throw new Error("No route for " + locals.path);
  cb(null, html
    .replace("></div>", `>${markup}</div><script src=${locals.assets.main} type="text/javascript"></script>`)
  );
};