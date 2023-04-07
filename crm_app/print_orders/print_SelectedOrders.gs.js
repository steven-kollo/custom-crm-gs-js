const PRINT_ORDER_LIST_SEPARATOR_ROWS = [80,162,244,326]

function createSelectedOrdersPDF(checked_uuid_array) {
  const WHERE_STATEMENT = ` WHERE uuid IN (${checked_uuid_array.map(uuid => `"${uuid}"`)})`
  const orders = runQuery(WHERE_STATEMENT, false)
  const last_row = pasteOrdersDataToTemplate(orders)
  reload_page(LIST_TEMPLATE_SHEET_URL)
  return fetchPdfLinkList(checked_uuid_array, last_row)
}

function pasteOrdersDataToTemplate(orders) {
  const template_sheet = SpreadsheetApp.openByUrl(LIST_TEMPLATE_SHEET_URL).getSheetByName("Main")
  template_sheet.getRange(2,1,660,8).setValue("")
  let last_row = 0
  for (let i = 0; i < orders.length; i++) {
    last_row = last_row + 2
    if(PRINT_ORDER_LIST_SEPARATOR_ROWS.indexOf(last_row) != -1) {last_row = last_row + 2}
    pasteSingleOrderDataToTemplate(orders[i], last_row, template_sheet)
  }
  return last_row + 1
}

function pasteSingleOrderDataToTemplate(order, row, template_sheet) {
  template_sheet.getRange(row, 1).setValue(order.order_search_id)
  template_sheet.getRange(row, 2).setValue(stringFromDate(order.order_delivery_date).reverced_date)
  template_sheet.getRange(row + 1, 2).setValue(order.order_delivery_time_range)
  template_sheet.getRange(row, 3).setValue(`${order.client_first_name} ${order.client_last_name}`)
  template_sheet.getRange(row, 4).setValue(order.order_service)
  template_sheet.getRange(row, 5).setValue(Number(order.order_price))
  template_sheet.getRange(row + 1, 5).setValue(Number(order.order_shipping_price))
  template_sheet.getRange(row, 6).setValue(`${order.order_delivery_address} (${order.order_delivery_comuna})`)
  template_sheet.getRange(row, 7).setValue(order.order_product)
  template_sheet.getRange(row, 8).setValue(processComment(order.order_manager_comment).string)
}

function fetchPdfLinkList(checked_uuid_array, last_row) {
  const folder = DriveApp.getFolderById(GDRIVE_PDF_FOLDER_ID)
  const sheet_id = SpreadsheetApp.openByUrl(LIST_TEMPLATE_SHEET_URL).getSheetByName("Main").getSheetId()
  const fr = 0, fc = 0, lc = 8, lr = last_row
  const url = "https://docs.google.com/spreadsheets/d/" + LIST_TEMPLATE_SHEET_ID + "/export" +
    "?format=pdf&" +
    "size=7&" +
    "fzr=true&" +
    "portrait=false&" +
    "fitw=true&" +
    "gridlines=false&" +
    "printtitle=false&" +
    "top_margin=0&" +
    "bottom_margin=0&" +
    "left_margin=0&" +
    "right_margin=0&" +
    "sheetnames=false&" +
    "pagenum=UNDEFINED&" +
    "attachment=true&" +
    "gid=" + sheet_id + '&' +
    "r1=" + fr + "&c1=" + fc + "&r2=" + lr + "&c2=" + lc

  const params = { method: "GET", headers: { "authorization": "Bearer " + ScriptApp.getOAuthToken() } }
  const blob = UrlFetchApp.fetch(url, params).getBlob().setName('orders.pdf')

  const file = folder.createFile(blob)
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
  return {
    checked_uuid_array: checked_uuid_array,
    gdrive_link: file.getUrl()
  }
}

function processComment(comment) {
  console.log(comment)
  if(comment.length == 0 || comment == "") { 
    return { string: "", array: [] } 
  }
  let result = ''
  let array = []
  JSON.parse(comment).comments.forEach(row => {
    result == "" ? result = row : result += `\n${row}`
    array.push(row)
  })
  console.log(result)
  return {
    string: result,
    array: array
  }
}
