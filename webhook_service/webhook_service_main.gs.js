// CONSTS
const ERROR_REPORT_URL = "https://docs.google.com/spreadsheets/d/*****/edit#gid=0"
const PROJECT_ID = "****"
const QUERY_BASE = "INSERT INTO `*****.main.orders` "


// MAIN FUNCTIONS
function doGet(e) {
  return HtmlService.createHtmlOutput("doGet request");
}

function doPost(e) {
  if (e && e.postData && e.postData.type === "application/json") {
    let string = JSON.stringify(JSON.parse(e.postData.contents))
    try {
      let object = JSON.parse(string)
      processWebhook(object)
      Logger.log('2')
      pasteReport(string, '200')
    } catch (e) {
      Logger.log('400')
      Logger.log(e)
      pasteReport(string, '400')
    }
  }
  return HtmlService.createHtmlOutput("");
}

function processWebhook(json) {
  let order = createOrderObject(json)
  if (is_unique_order(order.shopify_order_id_long) == true) {
    let query = createQuery(order)
    runQuery(query.query)
    sendManychatAlert(createMessageFromOrderInfo(query.info), query.info.order_id)
  }
}

function is_unique_order(order_id) {
  console.log(order_id)
  const existing_orders = checkExistingOrders()
  let previous_orders = existing_orders.existing_orders_id_array
  console.log(previous_orders)
  if(previous_orders == undefined) {
    previous_orders = [""]
  } 
  if(previous_orders.indexOf(order_id.toString()) == -1) {
    return true
  }
  return false
}

// CREATE ORDER OBJECT
function createOrderObject(json) {
  let deleteExtraSpaces = (string) => { 
    if(string != null) {
      return string.toString().replace(/\s+/g, ` `).replace(/"/g, `'`).trim()
    }
    return ""
  }
  let note_attribute_values = readNoteAttributeValues(json.note_attributes)
  let product = createProductString(json.line_items)
  let order_address
  let order_comuna 
  let order_recipient_name
  let order_recipient_phone
  let is_paid = json.financial_status == "paid" ? "true" : "false"
  try {
    order_address = deleteExtraSpaces(`${json.shipping_address.address1}, ${json.shipping_address.address2}`)
    order_comuna = deleteExtraSpaces(json.shipping_address.zip)
    order_recipient_name = deleteExtraSpaces(json.shipping_address.name)
    order_recipient_phone = deleteExtraSpaces(json.shipping_address.phone.toString())
  } catch {
    order_address = deleteExtraSpaces(`${json.customer.default_address.address1}, ${json.customer.default_address.address2}`)
    order_comuna = deleteExtraSpaces(json.customer.default_address.zip)
    order_recipient_name = deleteExtraSpaces(json.customer.default_address.name)
    order_recipient_phone = deleteExtraSpaces(json.customer.default_address.phone.toString())
  }
  let order = {
    client_uuid: 'client_uuid',
    client_manychat_id: 'client_manychat_id',
    client_email: deleteExtraSpaces(json.customer.email),
    client_phone: deleteExtraSpaces(json.customer.phone),
    client_first_name: deleteExtraSpaces(json.customer.first_name),
    client_last_name: deleteExtraSpaces(json.customer.last_name),
    client_source: deleteExtraSpaces(json.source_name),	
    order_created_datetime: stringFromDate(new Date(json.created_at)).datetime,
    order_delivery_date: stringFromDate(note_attribute_values.date_delivery).date,
    order_delivery_time_range: note_attribute_values.time_range_delivery,
    order_address: order_address,
    order_comuna: order_comuna,
    order_product: deleteExtraSpaces(product),
    order_price: Number(json.total_line_items_price),
    order_shipping_price: Number(json.total_shipping_price_set.shop_money.amount),
    order_is_paid: is_paid,
    order_status: 'new',
    order_recipient_name: order_recipient_name,
    order_recipient_phone: order_recipient_phone,
    order_recipient_postcard_text: deleteExtraSpaces(json.note.toString()),
    order_manager_comment: '',
    shopify_order_id: json.order_number,
    shopify_order_id_long: json.id
  }
  return order
  // console.log(order)
}

// function test_localID(){
//   const service_id = "4902674563243"
//   console.log(createLocalId(service_id))
// }
function createLocalId(service_id) {
  return `S-${new Date().getHours()+new Date().getMinutes()}-${service_id}`
}

// CREATE QUERY
function createQuery(order) {
  const last_local_id = Number(getLastLocalId()) + 1
  const order_search_id = createLocalId(order.shopify_order_id)
  let query_values = `VALUES (
    GENERATE_UUID(),
    CURRENT_TIMESTAMP(),
    "${order.client_uuid}",
    "${order.client_manychat_id}",
    "${order.client_email}",
    "${order.client_phone}",
    "${order.client_first_name}",
    "${order.client_last_name}",
    "${order.client_source}",
    CAST("${order.order_created_datetime}" AS DATETIME),
    CAST("${order.order_delivery_date}" AS DATE),
    "${order.order_delivery_time_range}",
    "${order.order_address}",
    "${order.order_comuna}",
    "${order.order_product}",
    ${order.order_price},
    ${order.order_shipping_price},
    ${order.order_is_paid},
    "${order.order_status}",
    "${order.order_recipient_name}",
    "${order.order_recipient_phone}",
    "${order.order_recipient_postcard_text}",
    "${order.order_manager_comment}",
    "https://****.myshopify.com/admin/orders/${order.shopify_order_id_long}",
    "Shopify",
    "${order.shopify_order_id_long}",
    ${last_local_id},
    "${order_search_id}"
  )`
  // console.log(QUERY_BASE + query_values)
  return {
    query: QUERY_BASE + query_values,
    info: createInfoFromOrder(order, order_search_id)
  }
}


// RUN QUERY
function runQuery(query) {
  const request = {
    query: query,
    useLegacySql: false
  };
  let queryResults = BigQuery.Jobs.query(request, PROJECT_ID);
  const jobId = queryResults.jobReference.jobId;

  // Check on status of the Query Job.
  let sleepTimeMs = 500;
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    queryResults = BigQuery.Jobs.getQueryResults(PROJECT_ID, jobId);
  }
}


// HELPERS
function pasteReport(json, status) {
  let sheet = SpreadsheetApp.openByUrl(ERROR_REPORT_URL).getSheetByName("Webhook Shopify on Order Created")
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, 3).setValues([[new Date(), status, json]])
}


function readNoteAttributeValues(note_attributes) {
  let note_attribute_values = {
    date_delivery: '',
    time_range_delivery: ''
  }
  note_attributes.forEach(attribute => {
    switch (attribute.name) {
      case 'Delivery Time':
        note_attribute_values.time_range_delivery = attribute.value
        break

      case 'Delivery Date':
        let date_arr = attribute.value.toString().split('/')
        note_attribute_values.date_delivery = new Date(date_arr[2],date_arr[1]-1,date_arr[0])
        break

      default:
        break
    }
  })
  return note_attribute_values
}

function createProductString(line_items) {
  let product = ''
  line_items.forEach(line => {
    if (product.length > 0) {
      product = product + ', ' + line.name
    } else {
      product = line.name
    }
  })
  return product
}

function stringFromDate(date) {
  // date 2020-12-25
  // datetime 2020-12-25 03:22:01

  let year = date.getFullYear()
  let month = date.getMonth() + 1 < 10 ? '0'+(date.getMonth() + 1) : date.getMonth() + 1
  let day = date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()
  let seconds = date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds()
  let minutes = date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()
  let hours = date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()

  return {
    date: `${year}-${month}-${day}`,
    datetime: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
}
