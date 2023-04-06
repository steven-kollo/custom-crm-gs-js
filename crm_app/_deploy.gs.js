function doGet() {
  const iconUrl = '******'
  return HtmlService.createTemplateFromFile('index').evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle('******')
    .setFaviconUrl(iconUrl)
} 

function includeExternalFile(fileName) {
  return HtmlService.createHtmlOutputFromFile(fileName).getContent()
}
