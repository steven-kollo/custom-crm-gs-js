function updateOrderByUuid(query, uuid) {
  runUpdateQuery(query)
  return uuid
}

function runUpdateQuery(query) {
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

// RUN QUERY
function runInsertQuery(query) {
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

function runQuery(WHERE_STATEMENT, if_desc) {
  const projectId = PROJECT_ID
  const query = 'SELECT * FROM `******.main.orders`' + WHERE_STATEMENT
  const request = {
    query: query,
    useLegacySql: false
  }
  let queryResults = BigQuery.Jobs.query(request, projectId)
  const jobId = queryResults.jobReference.jobId

  // Check on status of the Query Job.
  let sleepTimeMs = 500
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs)
    sleepTimeMs *= 2
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId)
  }

  // Get all the rows of results.
  let rows = queryResults.rows
  while (queryResults.pageToken) {
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId, {
      pageToken: queryResults.pageToken
    })
    rows = rows.concat(queryResults.rows)
  }

  if (!rows) {
    return
  } 
  
  // Headers.
  const headers = queryResults.schema.fields.map(function(field) {
    return field.name
  });

  // Data.
  const data = new Array(rows.length)
  for (let i = 0; i < rows.length; i++) {
    const cols = rows[i].f
    data[i] = new Array(cols.length)
    for (let j = 0; j < cols.length; j++) {
      data[i][j] = cols[j].v
    }
  }
  
  let data_objects = []
  data.forEach(row => {
    data_objects.push(create_OrdersDataObject(row, headers))
  })
  if (if_desc == true) {
    return data_objects.sort((firstItem, secondItem) => firstItem.order_delivery_date - secondItem.order_delivery_date)
  }
  return data_objects.sort((firstItem, secondItem) => secondItem.order_created_datetime - firstItem.order_created_datetime)
}		

function create_OrdersDataObject(data, headers) { 
  let order_delivery_date = data[headers.indexOf('order_delivery_date')].split('-')
  return {
    order_uuid: data[headers.indexOf('uuid')],
    order_created_datetime: new Date(data[headers.indexOf('order_created_datetime')]),
    client_uuid: data[headers.indexOf('client_uuid')],
    client_first_name: data[headers.indexOf('client_first_name')],
    client_last_name: data[headers.indexOf('client_last_name')],
    order_product: data[headers.indexOf('order_product')],
    order_price: data[headers.indexOf('order_price')],
    order_shipping_price: data[headers.indexOf('order_shipping_price')],
    order_is_paid: data[headers.indexOf('order_is_paid')],
    order_status: data[headers.indexOf('order_status')],
    client_phone: data[headers.indexOf('client_phone')],
    client_source: data[headers.indexOf('client_source')],
    client_email: data[headers.indexOf('client_email')],
    client_manychat_id: data[headers.indexOf('client_manychat_id')],
    order_delivery_date: new Date(order_delivery_date[0], order_delivery_date[1] - 1, order_delivery_date[2]),
    order_delivery_time_range: data[headers.indexOf('order_delivery_time_range')],
    order_delivery_address: data[headers.indexOf('order_delivery_address')],
    order_delivery_comuna: data[headers.indexOf('order_delivery_comuna')],
    order_manager_comment: data[headers.indexOf('order_manager_comment')],
    order_recipient_name: data[headers.indexOf('order_recipient_name')],
    order_recipient_phone: data[headers.indexOf('order_recipient_phone')],
    order_recipient_postcard_text: data[headers.indexOf('order_recipient_postcard_text')],
    order_corner_shop_link: data[headers.indexOf('order_corner_shop_link')],
    order_service: data[headers.indexOf('order_service')],
    order_service_id: data[headers.indexOf('order_service_id')],
    order_local_id: data[headers.indexOf('order_local_id')],
    order_search_id: data[headers.indexOf('order_search_id')]
  }
}

function delete_Order(uuid) {
  const deleted_order = runQuery(` WHERE uuid="${uuid}"`)[0]
  insertToArchive(deleted_order)
  deleteByUuid(uuid)
  return uuid
}

function insertToArchive(order) {
  const base = "INSERT INTO `******.main.deleted_orders` "
  const query_values = `VALUES (
    "${order.order_uuid}",
    CURRENT_TIMESTAMP(),
    "${order.client_uuid}",
    "${order.client_manychat_id}",
    "${order.client_email}",
    "${order.client_phone}",
    "${order.client_first_name}",
    "${order.client_last_name}",
    "${order.client_source}",
    CAST("${stringFromDate(new Date(order.order_created_datetime)).datetime}" AS DATETIME),
    CAST("${stringFromDate(new Date(order.order_delivery_date)).date}" AS DATE),
    "${order.order_delivery_time_range}",
    "${order.order_delivery_address}",
    "${order.order_delivery_comuna}",
    "${order.order_product}",
    ${order.order_price},
    ${order.order_shipping_price},
    ${order.order_is_paid},
    "${order.order_status}",
    "${order.order_recipient_name}",
    "${order.order_recipient_phone}",
    "${order.order_recipient_postcard_text}",
    "${order.order_manager_comment}",
    "${order.order_corner_shop_link}",
    "${order.order_service}",
    "${order.order_service_id}",
    ${order.order_local_id},
    "${order.order_search_id}"
  )`
  const request = {
    query: `${base}${query_values}`,
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

function deleteByUuid(uuid) {
  const request = {
    query: "DELETE FROM `******.main.orders` WHERE " + `uuid = "${uuid}"`,
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
