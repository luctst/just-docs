module.exports = `
<!DOCTYPE html>
<html <%- htmlAttributes %>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <meta name="generator" content="Docusaurus">
    <%- headTags %>
    <% metaAttributes.forEach((metaAttribute) => { %>
      <%- metaAttribute %>
    <% }); %>
    <% stylesheets.forEach((stylesheet) => { %>
      <link rel="stylesheet" type="text/css" href="<%= baseUrl %><%= stylesheet %>" />
    <% }); %>
  </head>
  <body <%- bodyAttributes %>>
    <%- preBodyTags %>
    <div id="__docusaurus">
      <%- appHtml %>
    </div>
    <% scripts.forEach((script) => { %>
      <script type="text/javascript" src="<%= baseUrl %><%= script %>"></script>
    <% }); %>
    <%- postBodyTags %>
  </body>
</html>
`;
