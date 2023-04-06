// CONSTS
const ERROR_REPORT_URL = "******"
const PROJECT_ID = "******"
const QUERY_BASE = "INSERT INTO `******.main.orders` "

// MAIN FUNCTIONS
function doGet(e) {
  return HtmlService.createHtmlOutput("doGet request");
}

function doPost(e) {
  if (e && e.postData && e.postData.type === "application/json") {
    let string = e.postData.contents
    try {
      let object = JSON.parse(JSON.parse(e.postData.contents))
      processWebhook(object.orders)
      Logger.log('2')
    } catch (e) {
      Logger.log('400')
      Logger.log(e)
      pasteReport(string, '400')
    }
  }
  return HtmlService.createHtmlOutput("");
}



function processWebhook(json) {
  console.log(json.length)
  const existing_orders = checkExistingOrders()
  let last_order_local_id = existing_orders.last_order_local_id
  let previous_orders = existing_orders.existing_orders_id_array
  console.log(previous_orders)
  if(previous_orders == undefined) {
    previous_orders = [""]
  } 

  json.forEach(order_object => {
    if(previous_orders.indexOf(order_object.order_id) == -1) {
      let order = createOrderObject(order_object)
      last_order_local_id++
      let query = createQuery(order, last_order_local_id)
      console.log(query)
      runQuery(query.query)
      sendManychatAlert(createMessageFromOrderInfo(query.info), query.info.order_id)
      pasteReport(order_object, '200')
    }
  })
}

// CREATE ORDER OBJECT
function createOrderObject(json) {
  let order_product = ""
  if (json.orders != undefined) {
    json.orders.forEach(item => {
      if (order_product == "") {
        order_product+=item.item
      } else {
        order_product+=`, ${item.item}`
      }
    })
  }
  let order = {
    order_product: order_product,
    order_total_price: json.order_total_price,
    order_service: json.order_service,
    order_corner_shop_link: json.order_corner_shop_link == undefined ? "" : json.order_corner_shop_link,
    order_created_datetime: json.order_created_datetime,
    order_delivery_date: json.order_delivery_date,
    order_delivery_time_range: json.order_delivery_time_range == undefined ? "" : json.order_delivery_time_range,
    order_id: json.order_id
  }
  
  return order
}

function createLocalId(service_id, service) {
  const letter = service == "Rappi" ? "R" : "C"
  return `${letter}-${new Date().getHours()+new Date().getMinutes()}-${service_id.substring(service_id.length - 4)}`
}

// CREATE QUERY
function createQuery(order, last_order_local_id) {
  const local_id = createLocalId(order.order_id, order.order_service)
  let query_values = `VALUES (
    GENERATE_UUID(),
    CURRENT_TIMESTAMP(),
    "",
    "",
    "",
    "",
    "",
    "",
    "${order.order_service}",
    CAST("${order.order_created_datetime}" AS DATETIME),
    CAST("${order.order_delivery_date}" AS DATE),
    "${order.order_delivery_time_range}",
    "",
    "",
    "${order.order_product}",
    ${order.order_total_price},
    0,
    true,
    "new",
    "",
    "",
    "",
    "",
    "${order.order_corner_shop_link}",
    "${order.order_service}",
    "${order.order_id}",
    ${last_order_local_id},
    "${local_id}"
  )`

  // console.log(QUERY_BASE + query_values)
  return {
    query: QUERY_BASE + query_values,
    info: createInfoFromOrder(order, local_id)
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
  let sheet = SpreadsheetApp.openByUrl(ERROR_REPORT_URL).getSheetByName("Gmail Services on Order Created")
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, 3).setValues([[new Date(), status, json]])
}

