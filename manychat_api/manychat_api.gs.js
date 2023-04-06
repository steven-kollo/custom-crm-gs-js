const MANYCHAT_MANAGERS_SUBSCRIBED_IDS = ["*******" "*******" "*******"]
const MANYCHAT_FLOW_ID = "*******"
const MANYCHAT_KEY = "*******"

function createInfoFromOrder(order, local_id) {
  return {
    order_id: local_id,
    product: order.order_product,
    price: Number(order.order_price) + Number(order.order_shipping_price),
    date_delivery: order.order_delivery_date,
    time_delivery: order.order_delivery_time_range,
    source: order.source,
    order_url: order.source_url,
  }
}

function createMessageFromOrderInfo(info) {
  return `
    ${info.order_id}\nNew order from ${info.source}
    \nProduct: ${info.product}\Price: ${info.price}\nWaiting for delivery ${info.date_delivery} at ${info.time_delivery}
    \n${info.order_url}
  `
}

function sendManychatAlert(message, order_id) {
  MANYCHAT_MANAGERS_SUBSCRIBED_IDS.forEach(subscriber_id => {
    manychatPostAlert(subscriber_id, message, order_id)
  })
}

function manychatPostAlert(subscriber_id, message, order_id) {
  const headers = {
    "Content-Type" : "application/json",
    "Accept" : "application/json",
    "Authorization" : `Bearer ${MANYCHAT_KEY}`
  }

  const content = {
    "subscriber_id": subscriber_id,
    "message_tag": "ACCOUNT_UPDATE",
    "data": {
      "version": "v2",
      "content": { 
        "messages": [
          {
            "type": "text",
            "text": message,
            "buttons": [{
              "type": "flow",
              "caption": `✅ Confirm ${order_id}`,
              "target": MANYCHAT_FLOW_ID
            }]
          }
        ]
      }
    }
  }
  let payload = JSON.stringify(content)

  const options = {
    "muteHttpExceptions": true,
    "contentType" : "application/json",
    'followRedirects' : false,
    'method' : 'POST',
    'headers' : headers,     
    'payload': payload
  }
  
  const response = UrlFetchApp.fetch("https://api.manychat.com/fb/sending/sendContent", options)
  try {
    const CONTENT_JSON = JSON.parse(response.getContentText())
    return {
      url: CONTENT_JSON,
      response_code: response.getResponseCode(),
      error: false 
    }
  } catch (e) {
    return { error: e }
  }
}
