function insertManualOrder(order) {
  const query = createInsertQuery(order)
  console.log(query.query)
  runInsertQuery(query.query)
  return query
}

function createInsertQuery(order) {
  const order_search_id = createLocalId(order.client_phone)
  if (order.order_price == "") { order.order_price = 0 }
  if (order.order_shipping_price == "") { order.order_shipping_price = 0 }
  if (order.order_delivery_date == "") { order.order_delivery_date = stringFromDate(new Date()).date }
  if (order.order_manager_comment != "") { order.order_manager_comment = `{"comments":["${order.order_manager_comment}"]}` }
  let query_values = `VALUES (
    GENERATE_UUID(),
    CURRENT_TIMESTAMP(),
    "",
    "",
    "${order.client_email}",
    "${order.client_phone}",
    "${order.client_first_name}",
    "${order.client_last_name}",
    "Manual",
    CAST("${stringFromDate(new Date()).datetime}" AS DATETIME),
    CAST("${order.order_delivery_date}" AS DATE),
    "${order.order_delivery_time_range}",
    "${order.order_address}",
    "${order.order_comuna}",
    "${order.order_product}",
    ${order.order_price},
    ${order.order_shipping_price},
    false,
    "viewed",
    "${order.order_recipient_name}",
    "${order.order_recipient_phone}",
    "${order.order_recipient_postcard_text}",
    '${order.order_manager_comment}',
    "",
    "Manual",
    "",
    0,
    "${order_search_id}"
  )`
  const info = createInfoFromOrder(order, order_search_id)
  sendManychatAlert(createMessageFromOrderInfo(info), info.order_id)
  return {
    query: QUERY_BASE + query_values,
    info: info
  }
}

function createLocalId(phone) {
  if(phone.toString().length < 5) {phone = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1)}
  return `M-${new Date().getHours()+new Date().getMinutes()}-${phone.slice(-4)}`
}
