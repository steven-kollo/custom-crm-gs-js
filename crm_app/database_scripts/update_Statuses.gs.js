function update_OrderStatus(uuid, status, previous_status) {
  const query = 
  "UPDATE `******.main.orders` SET order_status = "+`"${status}"`+" WHERE uuid = "+`"${uuid}"`
  let html_update = {
    previous_status: previous_status,
    previous_status_class: STATUS_CLASS_MAP.get(previous_status),
    previous_status_text: STATUS_MAP.get(previous_status),
    new_status: status,
    new_status_class: STATUS_CLASS_MAP.get(status),
    new_status_text: STATUS_MAP.get(status)
  }
  runUpdateQuery(query)

  const html_element = `<button type="button" class="${STATUS_CLASS_MAP.get(status)}">${STATUS_MAP.get(status)}</button>`
  return {
    uuid: uuid, 
    html_update: html_update,
    html_element: html_element
  }
}

function update_PaymentStatus(uuid) {
  const query = 
  "UPDATE `******.main.orders` SET order_is_paid = true WHERE uuid = "+`"${uuid}"`
  
  runUpdateQuery(query)
  return {
    uuid: uuid, query: query[0]
  }
}
