function sendNewOrdersToMain(orders) {
  const options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(orders)
  }
  UrlFetchApp.fetch(MAIN_WEBHOOK_READER_URL, options)
}

function readGmails() {
  const threads = GmailApp.getInboxThreads(0,100)
  const previous_thread_id = SpreadsheetApp.openByUrl(LAST_MESSAGE_ID_SHEET_URL).getSheetByName("LastMessageID").getRange(1,1).getValue()
  const first_thread_id = threads[0].getId()
  if (checkLaunchConditions(first_thread_id, previous_thread_id) == false) { return }
  console.log('Got new messages')
 
  let orders = []
  let message_num = 1
  while(threads[message_num].getId() != previous_thread_id) {
    message_num++
    if(threads[message_num] == undefined) { break }
  }

  for(let i = 0; i < 100; i++) {
    let subject = threads[i].getFirstMessageSubject()
    
    if (subject.indexOf("Mi Tienda (Rappi)") != -1) {
      const rappi_orders = createOrderRappi(threads[i].getMessages())
      rappi_orders.forEach(order => orders.push(order))
    }
    if (subject.indexOf("******") != -1) {
      orders.push(createOrderCornerShop(threads[i].getMessages()[0]))
    }
  }
  
  SpreadsheetApp.openByUrl(LAST_MESSAGE_ID_SHEET_URL).getSheetByName("LastMessageID").getRange(1,1).setValue(first_thread_id)
  SpreadsheetApp.openByUrl(LAST_MESSAGE_ID_SHEET_URL).getSheetByName("LastMessageID").getRange(2,1).setValue(JSON.stringify(orders))
  sendNewOrdersToMain(JSON.stringify({orders: orders}))
}

function readOrdersTableRappi(body) {
  let product_slice = body.slice(
    body.indexOf("Subtotal"), 
    body.indexOf("</table>", body.indexOf("Subtotal"))
  )
  const readEachTd = (product_slice, arr) => {
    try {
      const item = product_slice.slice(
        product_slice.indexOf("<td>") + 4, 
        product_slice.indexOf("</td>", product_slice.indexOf("<td>"))
      )
      product_slice = product_slice.substring(
        product_slice.indexOf(item) + item.length,
        product_slice.indexOf("Total:") + 6
      )
      if (item != "") {
        arr.push(item)
        readEachTd(product_slice, arr)
      }
    } catch (e) { console.log(e) }
  }
  let arr =[]
  readEachTd(product_slice, arr)
  let products = []
  console.log(arr)
  for(let i = 0; i<arr.length; i++) {
    if(i == 0 || i % 4 == 0) {
      products.push({
        item: arr[i].replaceAll("&#x2F;", ''),
        sku: "",
        quantity: 0,
        price: 0
      })
      console.log(products)
    }
    console.log(i)
    if(i == 1 || i % 4 == 1) {
      products[products.length-1].sku = arr[i]
    }
    if(i == 2 || i % 4 == 2) {
      products[products.length-1].quantity = Number(arr[i].replace(/\D/g,''))
    }
    if(i == 3 || i % 4 == 3) {
      products[products.length-1].price = Number(arr[i])
    }
  }
  return products
}

function createOrderRappi(messages) {
  let threads = []
  messages.forEach(message => {
    if (message.getPlainBody().includes("created")) {
      const body = message.getBody()
      const order_id = body.slice(
        body.indexOf("<strong>ID") + 11, 
        body.indexOf("</strong>", body.indexOf("<strong>ID"))
      )
      const order_total_price = body.slice(
        body.indexOf("<b>Total:") + 10, 
        body.indexOf("</b>", body.indexOf("<strong>ID"))
      )
      const order_created_datetime = stringFromDate(message.getDate()).datetime
      const order_delivery_date = stringFromDate(message.getDate()).date
      const orders = readOrdersTableRappi(body)
      threads.push({
        order_service: "Rappi",
        order_id: order_id,
        order_total_price: order_total_price,
        order_created_datetime: order_created_datetime,
        order_delivery_date: order_delivery_date,
        orders: orders
      })
    }
  })
  return threads
}

function createOrderCornerShop(message) {
  const message_plain_body = message.getPlainBody()
  const message_body = message.getBody()
  const date = message.getDate()

  return{
    order_service: "Corner-Shop",
    order_id: readOrderId(message_body),
    order_total_price: 0,
    order_created_datetime: stringFromDate(date).datetime,
    order_delivery_date: readDate(message_plain_body).date,
    order_delivery_time_range: readDate(message_plain_body).time_range,
    order_corner_shop_link: readButtonLink(message_body)
  }
}

function checkLaunchConditions(first_thread_id, previous_thread_id) {
  let hours_now = new Date().getHours()
  if (first_thread_id == previous_thread_id || hours_now < 6 || hours_now > 23) { return false }
  return true
}

function stringFromDate(date) {
  // 2020-12-25
  // 2020-12-25 03:22:01
  
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

function readButtonLink(message_body) {
  const string_start_index = message_body.indexOf("<a href=")
  const href_slice = message_body.slice(string_start_index + 9)
  return href_slice.substring(0, href_slice.indexOf('" '))
}

function readOrderId(message_body) {
  const string_start_index = message_body.indexOf("CL-")
  return message_body.substring(string_start_index, message_body.indexOf("]", string_start_index))
}

function readDate(message_body) {
  const string_start_index = message_body.indexOf("llegada el") + 11
  const string = message_body.substring(message_body.indexOf(" ", string_start_index) + 1, message_body.indexOf(".", string_start_index))
 
  const year = new Date().getFullYear()
  let month 
  SPANISH_MONTHS.forEach(month_obj => {
    if(string.indexOf(month_obj.spanish) != -1) {
      month = month_obj.number < 10 ? '0'+(month_obj.number) : month_obj.number
    }
  })
  let day = string.substring(0, string.indexOf(" "))
  const time_range = string.substring(string.length - 5)
  return {
    date: `${year}-${month}-${day}`,
    time_range: time_range
  }
}
