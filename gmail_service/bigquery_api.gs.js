function checkExistingOrders() {
  const query = 'SELECT * FROM `******.main.orders` WHERE order_service_id != "" ORDER BY timestamp DESC'
  const projectId = PROJECT_ID;
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
  const existing_orders_id_array = data.map(x => x[headers.indexOf("order_service_id")])
  const order_local_ids = data.map(x => x[headers.indexOf("order_local_id")])
  return { 
    existing_orders_id_array: existing_orders_id_array,
    last_order_local_id: Number(order_local_ids[order_local_ids.length - 1])
  }
}

