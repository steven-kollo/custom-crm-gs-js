function createSelectedOrdersDetailsPDF(checked_uuid_array) {
  if (checked_uuid_array.length > 32) { checked_uuid_array = checked_uuid_array.slice(0, 32) }
  let WHERE_STATEMENT = ` WHERE uuid IN (`
  checked_uuid_array.forEach(uuid => {
    WHERE_STATEMENT+= ` '${uuid}',`
  })
  
  WHERE_STATEMENT = WHERE_STATEMENT.slice(0, WHERE_STATEMENT.length - 1) + `)`
  console.log(WHERE_STATEMENT)
  let orders = runQuery(WHERE_STATEMENT, false)
  console.log(orders)
  SpreadsheetApp.openByUrl(SINGLE_ORDER_TEMPLATE_SHEET_URL).getSheetByName("Main").getRange(1,1,400,8).setValue("")
  for(let i = 0; i < orders.length; i++) {
    pasteOrderDataToTemplate(orders[i], (i % 4) *2, Math.floor(i / 4))
  }
  reload_page(SINGLE_ORDER_TEMPLATE_SHEET_URL)
  return {
    checked_uuid_array: checked_uuid_array,
    gdrive_link: fetchPdfLink(`orders`, 25 + (Math.floor(orders.length / 4) * 25))
  }
}

function pasteOrderDataToTemplate(order, i, s) {
  const list_shift = 25
  const template_sheet = SpreadsheetApp.openByUrl(SINGLE_ORDER_TEMPLATE_SHEET_URL).getSheetByName("Main")
  template_sheet.getRange(1 + (s * list_shift),1+i).setValue(order.order_search_id)
  template_sheet.getRange(1 + (s * list_shift),2+i).setValue(order.order_service)
  template_sheet.getRange(2 + (s * list_shift),2+i).setValue(order.order_service_id)

  template_sheet.getRange(3 + (s * list_shift),2+i).setValue(order.order_product)
  template_sheet.getRange(4 + (s * list_shift),2+i).setValue(Number(order.order_price))
  template_sheet.getRange(5 + (s * list_shift),2+i).setValue(Number(order.order_shipping_price))
  template_sheet.getRange(6 + (s * list_shift),2+i).setValue(Number(order.order_shipping_price) + Number(order.order_price))

  template_sheet.getRange(3 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.product_name)
  template_sheet.getRange(4 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.order_price)
  template_sheet.getRange(5 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.shipping_price)
  template_sheet.getRange(6 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.total_price)
  template_sheet.getRange(7 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.order_data)

  template_sheet.getRange(8 + (s * list_shift),2+i).setValue(`${order.client_first_name} ${order.client_last_name}`)
  template_sheet.getRange(9 + (s * list_shift),2+i).setValue(order.client_phone)
  template_sheet.getRange(10 + (s * list_shift),2+i).setValue(order.order_delivery_date)
  template_sheet.getRange(11 + (s * list_shift),2+i).setValue(order.order_delivery_time_range)
  template_sheet.getRange(12 + (s * list_shift),2+i).setValue(order.order_delivery_address)
  template_sheet.getRange(13 + (s * list_shift),2+i).setValue(order.order_delivery_comuna)
  template_sheet.getRange(14 + (s * list_shift),2+i).setValue(order.order_recipient_name)
  template_sheet.getRange(15 + (s * list_shift),2+i).setValue(order.order_recipient_phone)
  template_sheet.getRange(8 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.client_name)
  template_sheet.getRange(9 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.client_phone)
  template_sheet.getRange(10 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.date_delivery)
  template_sheet.getRange(11 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.time_delivery)
  template_sheet.getRange(12 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.address)
  template_sheet.getRange(13 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.comuna)
  template_sheet.getRange(14 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.recipient_name)
  template_sheet.getRange(15 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.recipient_phone)

  template_sheet.getRange(16 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.postcard_text)
  template_sheet.getRange(17 + (s * list_shift),1+i).setValue(order.order_recipient_postcard_text)

  template_sheet.getRange(18 + (s * list_shift),1+i).setValue(order.order_search_id)
  template_sheet.getRange(18 + (s * list_shift),2+i).setValue(order.order_service)
  template_sheet.getRange(19 + (s * list_shift),2+i).setValue(order.order_service_id)

  template_sheet.getRange(20 + (s * list_shift),2+i).setValue(order.order_delivery_date)
  template_sheet.getRange(21 + (s * list_shift),2+i).setValue(order.order_delivery_time_range)
  template_sheet.getRange(22 + (s * list_shift),2+i).setValue(order.order_delivery_address)
  template_sheet.getRange(23 + (s * list_shift),2+i).setValue(order.order_delivery_comuna)
  template_sheet.getRange(24 + (s * list_shift),2+i).setValue(order.order_recipient_name)
  template_sheet.getRange(25 + (s * list_shift),2+i).setValue(order.order_recipient_phone)
  template_sheet.getRange(20 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.date_delivery)
  template_sheet.getRange(21 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.time_delivery)
  template_sheet.getRange(22 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.address)
  template_sheet.getRange(23 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.comuna)
  template_sheet.getRange(24 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.recipient_name)
  template_sheet.getRange(25 + (s * list_shift),1+i).setValue(DETAILS_PDF_FIELDS.recipient_phone)
}

function fetchPdfLink(pdf_name, last_row) {
  const folder = DriveApp.getFolderById(GDRIVE_PDF_FOLDER_ID)
  const sheet_id = SpreadsheetApp.openByUrl(SINGLE_ORDER_TEMPLATE_SHEET_URL).getSheetByName("Main").getSheetId()
  const fr = 0, fc = 0, lc = 8, lr = last_row
  const url = "https://docs.google.com/spreadsheets/d/" + SINGLE_ORDER_TEMPLATE_SHEET_ID + "/export" +
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
  const blob = UrlFetchApp.fetch(url, params).getBlob().setName(pdf_name + '.pdf')

  const file = folder.createFile(blob)
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
  return file.getUrl()
}
