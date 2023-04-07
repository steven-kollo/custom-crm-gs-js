function createOrderModalHtml(order_id, data) {
  return `
  <div style="text-align: left;" class="modal fade" id="details-modal-${order_id}" tabindex="-1" role="dialog" aria-labelledby="details-modal-${order_id}Label" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="details-modal-${order_id}Label">${ORDER_DETAILS_MODAL.order_details}</h5>
        </div>
        <div id="create-details-modal-${order_id}-body" style="height: 450px;" class="modal-body">
        <div style="overflow-y: scroll; height:400px;">
          <section>
            <table cellpadding="0" cellspacing="0" border="0">
              <tbody>
                <tr>
                  <td style="width:40%">${ORDER_DETAILS_MODAL.order_status}</td>
                  <td style="width:60%">${rewriteStatus(data.order_status.toString(), data.order_uuid, true)}</td>
                </tr>
              </tbody>
            </table>
            <table style="margin-top: 10px;" cellpadding="0" cellspacing="0" border="0">
              <tbody>
                <tr>
                  <td style="width:40%">${ORDER_DETAILS_MODAL.payment_status}</td>
                  <td style="width:60%">${rewritePaymentStatus(
                    data.order_is_paid.toString(), 
                    data.order_uuid, 
                    data.client_first_name + " " + data.client_last_name, 
                    Number(data.order_price) + Number(data.order_shipping_price), 
                  )}</td>                  
                </tr>
              </tbody>
            </table>
            <table style="margin-top: 10px;" cellpadding="0" cellspacing="0" border="0">
              <tbody>
                <tr>
                  <td style="width:40%">${ORDER_DETAILS_MODAL.order_page}</td>
                  <td style="width:60%"><a href="${data.order_corner_shop_link}" target="_blank"><button type="button" class="btn btn-primary btn-sm">
                    ${ORDER_DETAILS_MODAL.go_to_order_page}
                  </button></a></td>                  
                </tr>
              </tbody>
            </table>
            <table style="margin-top: 10px;" cellpadding="0" cellspacing="0" border="0">
              <tbody>
                <tr>
                  <td style="width:40%">${ORDER_DETAILS_MODAL.delete_order_field}</td>
                  <td style="width:60%">${deleteOrderButton(data.order_uuid)}</td>                  
                </tr>
              </tbody>
            </table>
            <p id="order-deleted-alert-${data.order_uuid}" style="display: none;">${ORDER_DETAILS_MODAL.order_deleted_alert}</p>
          </section>
          <hr>
          ${createEditOrderButton(data)}
          <hr>
          <section>
            <table cellpadding="0" cellspacing="0" border="0">
              <tbody>
                <tr>
                  <td style="width:40%">${ORDER_DETAILS_MODAL.manager_comments}</td>
                  <td style="width:60%">
                    ${parseManagerCommentToHTML(data.order_manager_comment, data.order_uuid)}
                  </td>                  
                </tr>
              </tbody>
            </table>
            <br>
            <div class="input-group mb-3 input-group-sm">
              <button class="btn btn-outline-primary btn-sm" type="button" id="comment-button-addon-${data.order_uuid}" onclick="addComment('${data.order_uuid}')">
                ${ORDER_DETAILS_MODAL.add_comment}
              </button>
              <input type="text" class="form-control" placeholder="" aria-describedby="comment-button-addon" id="comment-input-addon-${data.order_uuid}">
            </div>
          </section>         
          <hr>
          <section>
            <table cellpadding="0" cellspacing="0" border="0">
              <tbody>
                <tr>
                  <td style="width:35%">${ORDER_DETAILS_MODAL.client_name}</td>
                  <td style="width:65%">${data.client_first_name} ${data.client_last_name}</td>                  
                </tr>
                <tr>
                  <td style="width:35%">${ORDER_DETAILS_MODAL.client_phone}</td>
                  <td style="width:65%">${data.client_phone}</td>                  
                </tr>
                <tr>
                  <td style="width:35%">${ORDER_DETAILS_MODAL.product_name}</td>
                  <td style="width:65%">${data.order_product}</td>                  
                </tr>
                <tr>
                  <td style="width:35%">${ORDER_DETAILS_MODAL.product_price}</td>
                  <td style="width:65%">${data.order_price}</td>                  
                </tr>
                <tr>
                  <td style="width:35%">${ORDER_DETAILS_MODAL.product_shipping_price}</td>
                  <td style="width:65%">${data.order_shipping_price}</td>                  
                </tr>
              </tbody>
            </table>
          </section>      
          <hr>
          <section>
            <div class="content">
              <table cellpadding="0" cellspacing="0" border="0">
                <tbody>
                  <tr>
                    <td style="width:35%">${ORDER_DETAILS_MODAL.date_delivery}</td>
                    <td style="width:65%">${stringFromDate(data.order_delivery_date).reverced_date}</td>                  
                  </tr>
                  <tr>
                    <td style="width:35%">${ORDER_DETAILS_MODAL.time_delivery}</td>
                    <td style="width:65%">${data.order_delivery_time_range}</td>                  
                  </tr>
                  <tr>
                    <td style="width:35%">${ORDER_DETAILS_MODAL.address_delivery}</td>
                    <td style="width:65%">${data.order_delivery_address}</td>                  
                  </tr>
                  <tr>
                    <td style="width:35%">${ORDER_DETAILS_MODAL.comuna}</td>
                    <td style="width:65%">${data.order_delivery_comuna}</td>                  
                  </tr>
                  <tr>
                    <td style="width:35%">${ORDER_DETAILS_MODAL.recipient_name}</td>
                    <td style="width:65%">${data.order_recipient_name}</td>                  
                  </tr>
                  <tr>
                    <td style="width:35%">${ORDER_DETAILS_MODAL.recipient_phone}</td>
                    <td style="width:65%">${data.order_recipient_phone}</td>                  
                  </tr>
                </tbody>
            </table>
          </section>     
          <hr>
          <div>
            <p>${ORDER_DETAILS_MODAL.postcard_content}</p>
            <a>${data.order_recipient_postcard_text}</a>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
  `
}

function deleteOrderButton(uuid) {
  return `
    <button id="delete-order-collapse-${uuid}" class="btn btn-danger btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-delete-order-${uuid}" aria-expanded="false" aria-controls="collapse-delete-order-${uuid}">
      ${ORDER_DETAILS_MODAL.delete_order_button}
    </button>
    <div style="margin-top: 5px;" class="collapse" id="collapse-delete-order-${uuid}">
      <div style="font-size: 12px;" class="card card-body">
        <p>${ORDER_DETAILS_MODAL.delete_order_warning_message}</p>
        <button id="confirm-delete-order-${uuid}" class="btn btn-danger btn-sm" data-bs-toggle="collapse" data-bs-target="#collapse-delete-order-${uuid}" aria-expanded="false" aria-controls="collapse-delete-order-${uuid}" onclick="deleteOrderByUuid('${uuid}')">
          ${ORDER_DETAILS_MODAL.delete_order_button}
        </button>
      </div>
    </div>
  `
}
function createEditOrderButton(data) {
  return `
  <div class="d-grid gap-2">
    <button id="edit-order-${data.order_uuid}" class="btn btn-primary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-edit-order-${data.order_uuid}" aria-expanded="false" aria-controls="edit-order-${data.order_uuid}">
      ${ORDER_DETAILS_MODAL.edit_order_button}
    </button>
    <div style="margin-top: 5px;" class="collapse" id="collapse-edit-order-${data.order_uuid}">
      <div style="font-size: 12px; background-color: #f7f7f7;" class="card card-body">
        ${editOrderFields(data)}
      </div>
    </div>
  </div>
  `
}

function editOrderFields(data) {
  return `
    <form style="max-width: 100%;" id="manual-order-form">
      <div class="row justify-content-between">
        <div class="form-group col-sm-6" style="margin-bottom: 5px;">
          <label for="input-manual-client-name">${CREATE_MANUAL_ORDER_FIELDS.client_name}</label>
          <input class="form-control form-control-sm" id="input-manual-client-name-${data.order_uuid}" value="${data.client_first_name}">
        </div>
        <div class="form-group col-sm-6" style="margin-bottom: 5px;">
          <label for="input-manual-client-last-name">${CREATE_MANUAL_ORDER_FIELDS.client_last_name}</label>
          <input class="form-control form-control-sm" id="input-manual-client-last-name-${data.order_uuid}" value="${data.client_last_name}"> 
        </div>
      </div>
      <div class="row justify-content-between">
        <div class="form-group col-sm-6" style="margin-bottom: 5px;">
          <label for="input-manual-client-phone">${CREATE_MANUAL_ORDER_FIELDS.client_phone}</label>
          <input class="form-control form-control-sm" id="input-manual-client-phone-${data.order_uuid}" value="${data.client_phone}">
        </div>
        <div class="form-group col-sm-6" style="margin-bottom: 5px;">
          <label for="input-manual-client-email">${CREATE_MANUAL_ORDER_FIELDS.client_email}</label>
          <input class="form-control form-control-sm" id="input-manual-client-email-${data.order_uuid}" value="${data.client_email}">
        </div>
      </div>
      <hr>
      <div class="form-group" style="margin-bottom: 5px;">
        <label for="input-manual-product">${CREATE_MANUAL_ORDER_FIELDS.product}</label>
        <input class="form-control form-control-sm" id="input-manual-product-${data.order_uuid}" value="${data.order_product}">
      </div>
      <div class="row justify-content-between">
        <div class="form-group col-sm-6" style="margin-bottom: 5px;">
          <label for="input-manual-price">${CREATE_MANUAL_ORDER_FIELDS.order_price}</label>
          <input class="form-control form-control-sm" id="input-manual-price-${data.order_uuid}" value="${data.order_price}">
        </div>
        <div class="form-group col-sm-6" style="margin-bottom: 5px;">
          <label for="input-manual-price-delivery">${CREATE_MANUAL_ORDER_FIELDS.order_delivery_price}</label>
          <input class="form-control form-control-sm" id="input-manual-price-delivery-${data.order_uuid}" value="${data.order_shipping_price}">
        </div>
      </div>
      <hr>
      <div class="form-group" style="margin-bottom: 5px;">
        <label for="input-manual-address-delivery">${CREATE_MANUAL_ORDER_FIELDS.address}</label>
        <input class="form-control form-control-sm" id="input-manual-address-delivery-${data.order_uuid}" value="${data.order_delivery_address}">
      </div>
      <div class="row justify-content-between">
        <div class="form-group col-sm-4" style="margin-bottom: 5px;">
          <label for="input-manual-date-delivery">${CREATE_MANUAL_ORDER_FIELDS.date_delivery}</label>
          <input id="input-manual-date-delivery-${data.order_uuid}" class="form-control form-control-sm" type="date" value="${stringFromDate(data.order_delivery_date).date}"/>
          <span id="deliveryDateSelected"></span>
        </div>
        <div class="form-group col-sm-4" style="margin-bottom: 5px;">
          <label for="input-manual-time-delivery">${CREATE_MANUAL_ORDER_FIELDS.time_delivery}</label>
          <input class="form-control form-control-sm" id="input-manual-time-delivery-${data.order_uuid}" value="${data.order_delivery_time_range}">
        </div>
        <div class="form-group col-sm-4" style="margin-bottom: 5px;">
          <label for="input-manual-comuna-delivery">${CREATE_MANUAL_ORDER_FIELDS.comuna}</label>
          <input class="form-control form-control-sm" id="input-manual-comuna-delivery-${data.order_uuid}" value="${data.order_delivery_comuna}">
        </div>
      </div>
      <div class="row justify-content-between">
        <div class="form-group col-sm-6" style="margin-bottom: 5px;">
          <label for="input-manual-recipient-name">${CREATE_MANUAL_ORDER_FIELDS.recipient_name}</label>
          <input class="form-control form-control-sm" id="input-manual-recipient-name-${data.order_uuid}" value="${data.order_recipient_name}">
        </div>
        <div class="form-group col-sm-6" style="margin-bottom: 5px;">
          <label for="input-manual-recipient-phone">${CREATE_MANUAL_ORDER_FIELDS.recipient_phone}</label>
          <input class="form-control form-control-sm" id="input-manual-recipient-phone-${data.order_uuid}" value="${data.order_recipient_phone}">
        </div>
      </div>
      <hr>
      <div class="form-group" style="margin-bottom: 5px;">
        <label for="input-manual-postcard">${CREATE_MANUAL_ORDER_FIELDS.postcard_text}</label>
        <input class="form-control form-control-sm" id="input-manual-postcard-${data.order_uuid}" value="${data.order_recipient_postcard_text}">
      </div>
    </form>

    <div id="order-loading" style="display: none;">
      <div id="loading-animation" style="margin-top: 30px; margin-bottom: 30px;">
        <div class="d-flex justify-content-center m-3">
          <div style="width: 50px; height: 50px;" class="spinner-border text-primary" role="status" >
            <span class="sr-only"></span>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <button id="update-order-${data.order_uuid}" class="btn btn-primary btn-sm" type="button" onclick="updateOrder('${data.order_uuid}')">
      <span class="sr-only">${ORDER_DETAILS_MODAL.edit_order_button}</span>
    </button>
    <a id="order-update-success-alert-${data.order_uuid}" style="display: none; color: green;">${CREATE_MANUAL_ORDER_FIELDS.order_update_success}</a>
  `
}
