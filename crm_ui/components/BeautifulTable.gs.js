function createBeautifulTable(WHERE_STATEMENT, if_desc, if_mobile) {
  return HtmlService.createHtmlOutput(
    createBeautifulTableHtml(WHERE_STATEMENT, if_desc, if_mobile)
  ).getContent()
}

function createBeautifulTableHtml(WHERE_STATEMENT, if_desc, if_mobile) {
  let data = runQuery(WHERE_STATEMENT, if_desc, if_mobile)
  var html = 
  `  
  <section>
    <div class="tbl-header">
      <table cellpadding="0" cellspacing="0" border="0">
        <thead>
          <tr class="main-table-tr">
            ${createTableHeaders(if_mobile)}
          </tr>
        </thead>
      </table>
    </div>
    <div class="tbl-content">
      <table cellpadding="0" cellspacing="0" border="0">
        <tbody>
          ${create_BeautifulTableRows(data, if_mobile)}
        </tbody>
    </table>
  </section>
  <script>
    $(window).on("load resize ", function() {
      lee scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
      $('.tbl-header').css({'padding-right':scrollWidth});
    }).resize();
  </script>
  `
  return html
}

function createTableHeaders(if_mobile) {
  if(if_mobile == true) {
    return `
      <th class="main-table-th" style="width:17%">${createSearchIdCheckBox('all', "+")}</th>
      <th class="main-table-th" style="width:23%">${COLUMN_NAMES.order_delivery_datetime}</th>
      <th class="main-table-th" style="width:33%">${COLUMN_NAMES.product}</th>
      <th class="main-table-th" style="width:17%">${COLUMN_NAMES.order_status}</th>
      <th class="main-table-th" style="width:10%"></th>
    `
  }
  return `
    <th class="main-table-th" style="width:10%">${createSearchIdCheckBox('all', "")}</th>
    <th class="main-table-th" style="width:8%">${COLUMN_NAMES.order_delivery_datetime}</th>
    <th class="main-table-th" style="width:8%">${COLUMN_NAMES.client_name}</th>
    <th class="main-table-th" style="width:12%">${COLUMN_NAMES.product}</th>
    <th class="main-table-th" style="width:12%">${COLUMN_NAMES.postcard_content}</th>
    <th class="main-table-th" style="width:10%">${COLUMN_NAMES.order_delivery_address}</th>
    <th class="main-table-th" style="width:8%">${COLUMN_NAMES.product_price}</th>
    <th class="main-table-th" style="width:8%">${COLUMN_NAMES.product_shipping_price}</th>
    <th class="main-table-th" style="width:12%">${COLUMN_NAMES.manager_comment}</th>
    <th class="main-table-th" style="width:7%">${COLUMN_NAMES.order_status}</th>
    <th class="main-table-th" style="width:5%">${COLUMN_NAMES.order_details}</th>
  `
}

function create_BeautifulTableRows(data, if_mobile) {
  let html = ''
  if (data == null || data == undefined) {
    return html
  }
  data.forEach(row => {
    html = html + create_SingleBeautifulRow(row, if_mobile)
  })
  return html
}

function create_SingleBeautifulRow(row, if_mobile) {
  console.log(row)
  const client_name = row.client_first_name == "" ? "-" : `${row.client_first_name} ${row.client_last_name}`
  const product = row.order_product == "" ? "-" : row.order_product
  const order_price = row.order_price == 0 ? "-" : row.order_price
  const order_shipping_price = row.order_shipping_price == 0 ? "-" : row.order_shipping_price

  if(if_mobile == true) {
    return`
      <tr class="main-table-tr">
        <td class="main-table-td" style="width:17%">${createSearchIdCheckBox(row.order_uuid, row.order_search_id)}</td>
        <td class="main-table-td" style="width:23%"><div>${stringFromDate(row.order_delivery_date).reverced_date}<hr style="margin: 2px;">${row.order_delivery_time_range}</div></td>
        <td class="main-table-td" style="width:33%">${product}</td>
        <td class="main-table-td" style="width:17%">${rewriteStatus(row.order_status, row.order_uuid, false)}</td>
        <td class="table-td-order-details" style="width:10%; text-align: center;">
          ${create_OrderDetailsButton(row.order_uuid, row)}
        </td>
      </tr>
    `
  }

  return `
    <tr class="main-table-tr">
      <td class="main-table-td" style="width:10%">${createSearchIdCheckBox(row.order_uuid, row.order_search_id)}</td>
      <td class="main-table-td" style="width:8%"><div>${stringFromDate(row.order_delivery_date).reverced_date}<hr style="margin: 2px;">${row.order_delivery_time_range}</div></td>
      <td class="main-table-td" style="width:8%">${client_name}</td>
      <td class="main-table-td" style="width:12%">${product}</td>
      <td class="main-table-td" style="width:12%">${create_PostcardText(row.order_recipient_postcard_text)}</td>
      <td class="main-table-td" style="width:10%">${row.order_delivery_address} ${row.order_delivery_comuna}</td>
      <td class="main-table-td" style="width:8%">${order_price}</td>
      <td class="main-table-td" style="width:8%">${order_shipping_price}</td>
      <td class="main-table-td" style="width:12%">${parseManagerCommentToHTML(row.order_manager_comment, row.order_uuid)}</td>
      <td class="main-table-td" style="width:7%">${rewriteStatus(row.order_status, row.order_uuid, false)}</td>
      <td class="table-td-order-details" style="width:5%; text-align: center;">
        ${create_OrderDetailsButton(row.order_uuid, row)}
      </td>
    </tr>
  `
}

function create_PostcardText(text) {
  const short_text = `${text.slice(0,40)}`
  if (short_text == text) {
    return text
  }
  return `
    <a data-toggle="tooltip" data-placement="right" title="${text}">
      ${short_text}...
    </a>
  `
}

function create_OrderDetailsButton(order_id, data) {
  let dot = data.order_is_paid.toString() == 'true' ? '' : `<span class="dot" id="dot-${order_id}"></span>`
  let style = ""
  let tag = "S"
  let onClick = ""
  if (data.order_status == "new") {
    onClick = `onclick="onChangeStatusModal('${order_id}', 'viewed', 'new')"`
  }
  let data_toggle = `data-toggle="modal" data-target="#details-modal-${order_id}"`
  let modal_html = createOrderModalHtml(order_id, data)
  switch (data.order_service.toLowerCase()) {
    case "corner-shop":
      tag = "C"
      style = "background-color: #00a388;"
      break
    case "rappi":
      tag = "R"
      style = "background-color: #de862a;"
      break
    case "manual":
      tag = "M"
      style = "background-color: #cc66a0;"
      break

  }
  return `
    <a>
      <button type="button" class="details-btn" id="details-${order_id}" ${onClick} ${data_toggle} style="${style}">
        <span>${tag}</span>
      </button>${dot}
    </a>
    ${modal_html}
  `
}

function rewritePaymentStatus(status, uuid, client_name, total_paid){
  if(status == "true") {
    return `<button class="btn btn-success btn-sm" disabled>${PAYMENT_STATUS_FIELDS.status_paid}</button>`
  }
  return `
    <button id="payment-status-${uuid}" class="btn btn-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-payment-status-${uuid}" aria-expanded="false" aria-controls="collapse-payment-status-${uuid}">
      ${PAYMENT_STATUS_FIELDS.status_needs_confirmation}
    </button>

    <div style="margin-top: 5px;" class="collapse" id="collapse-payment-status-${uuid}">
      <div style="font-size: 12px;" class="card card-body">
        ${PAYMENT_STATUS_FIELDS.payment_confirmation_from} <b>${client_name}</b> ${PAYMENT_STATUS_FIELDS.for_total_amount_of} <b>${total_paid}</b> ${PAYMENT_STATUS_FIELDS.including_delivery}.<br><b>${PAYMENT_STATUS_FIELDS.this_action_cant_be_canceled}
      </b><br>

        <button id="confirm-payment-status-${uuid}" class="btn btn-success btn-sm" data-bs-toggle="collapse" data-bs-target="#collapse-payment-status-${uuid}" aria-expanded="false" aria-controls="collapse-payment-status-${uuid}" onclick="confirmPaymentStatus('${uuid}')">
          ${PAYMENT_STATUS_FIELDS.confirm_payment}
        </button>
      </div>
    </div>
  `
}

function rewriteStatus(status, uuid, is_details_menu){
  let class_name
  switch (status) {
    case 'new':
      class_name = "btn btn-danger btn-sm"
      break
    case 'delivered':
      class_name = "btn btn-success btn-sm"
      break
    
    case 'cancelled':
      class_name = "btn btn-secondary btn-sm"
      break

    case 'processing':
      class_name = "btn btn-primary btn-sm"
      break

    case 'viewed':
      class_name = "btn btn-warning btn-sm"
      break
    
    default:
      class_name = "btn btn-secondary btn-sm"
      break
  }
  if (is_details_menu != true) {
    return `<button type="button" id="status-${uuid}" class="${class_name}">${STATUS_MAP_ICON.get(status)}</button>`
  } 
  return `
    <button id="order-status-${uuid}" class="${class_name}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-order-status-${uuid}" aria-expanded="false" aria-controls="collapse-order-status-${uuid}">
      ${STATUS_MAP.get(status)}
    </button>
    <div style="margin-top: 5px;" class="collapse" id="collapse-order-status-${uuid}">
      <div style="font-size: 12px;" class="card card-body">
        ${createOtherStatusButtons(status, uuid)}
      </div>
    </div>
  `
}

function createOtherStatusButtons(current_status, uuid) {
  let statuses = ['viewed', 'processing', 'delivered', 'cancelled'] 
  let html = ""
  statuses.forEach(status => {
    if(current_status != status) {
      let br = html == "" ? "" : "<br>"
      html += `${br}<button type="button" id="confirm-status-${status}-${uuid}" class="${STATUS_CLASS_MAP.get(status)}" data-bs-toggle="collapse" data-bs-target="#collapse-order-status-${uuid}" aria-expanded="false" aria-controls="collapse-order-status-${uuid}" onclick="onChangeStatusModal('${uuid}', '${status}', '${current_status}')">${STATUS_MAP.get(status)}</button>`
    }
  })
  return html
}


function parseManagerCommentToHTML(comment_json, uuid) {
  if (comment_json == "") return `<div class="manager-comments-${uuid}"></div>`
  let comment_object = JSON.parse(comment_json).comments
  let html = ""
  comment_object.forEach(comment => {
    let br = html == "" ? "" : "<br>"
    html += `${br}<a>${comment}</a>`
  })
  return `<div class="manager-comments-${uuid}">${html}</div>`
}

function createSearchIdCheckBox(uuid, search_id) {
  let onchange = uuid == "all" ? `onchange="checkboxSelectAll()"` : ""
  return `
    <div class="form-check">
      <input class="form-check-input search-check" type="checkbox" value="" id="search-check-${uuid}" ${onchange}>
      <label class="form-check-label" for="search-check-${uuid}">
        ${search_id}
      </label>
    </div>  
  `
}
