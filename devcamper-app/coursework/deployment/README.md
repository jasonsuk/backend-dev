# Deploy the DevCamper API

## Prerequisite

`docgen` should be installed before

## Where to load documentation

### 1. Postman generated web page

**How to:**

`Public Docs` on right click of the API folder on Postman.

### 2. Static web page:

Return the documentation on '{{URL}}/'

**How to:**

    - export the API on postman (saved as `dc-postman_collection.json`)
    - type on command line `docgen build -i dc-postman_collection    .json -o index.html`
    - move.copy the output html file (`index.html`) to static folder : for this app to `public` folder
    - get to `{{URL}}/` to check if the documentation is loaded, or dissolve any error

## Error handling

Refused to execute inline script because it vailates the following Content Sec urity Policy directive: "script-src'self'" (...):

    Try adding `{contentSecurityPolicy: false}` to helmet middleware @ server.js
    i.e. `app.use(helmet({ contentSecurityPolicy: false }));`
