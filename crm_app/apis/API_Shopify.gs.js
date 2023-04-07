function shopify_CreateCustomOrder(data) {
  const headers = {
    "Content-Type" : "application/json",
    'X-Shopify-Access-Token': TOKEN
  }
  const product = {
    "draft_order": { 
      "line_items": [{ 
        "title": data.product_name,
        "price": data.price,
        "quantity":1,
      }]
    }
  }
  let payload = JSON.stringify(product)

  const options = {
    "muteHttpExceptions": true,
    "contentType" : "application/json",
    'method' : 'POST',
    'headers' : headers, 
    'followRedirects' : false,
    'payload': payload
  }

  const response = UrlFetchApp.fetch("https://" + SHOP_ID  + ".myshopify.com/admin/api/2022-10/draft_orders.json", options)
  try {
    const CONTENT_JSON = JSON.parse(response.getContentText())
    return {
      url: CONTENT_JSON.draft_order.invoice_url,
      response_code: response.getResponseCode(),
      error: false 
    }
  } catch (e) {
    return { error: e }
  }
}
