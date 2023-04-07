function createHeaderButtons(if_mobile) {
  return HtmlService.createHtmlOutput(
    createHeaderButtonsHtml(if_mobile)
  ).getContent()
}

function createHeaderButtonsHtml(if_mobile) {
  return `
    <div class="input-group">
      <div class="input-group-prepend">
        <button class="btn btn-outline-secondary" type="button" onclick="getOrdersBySearchId()"><span class="bi bi-search"></span></button>
      </div>
      <input type="text" class="form-control" placeholder="${UI_STATUSES.search_by_id}" aria-label="" aria-describedby="basic-addon1" id="input-search-id">
    </div>

    <div id="print-selected-orders-button-container" style="display: inline-block; margin-left: 10px;">
    <input type="button" value="${if_mobile == true ? "PDF" : UI_STATUSES.print_selected_orders_button}" class="btn btn-primary" id='print-selected-orders-button-modal' data-toggle="modal" data-target="#print-selected-orders-modal"/>
  </div>  
  <div class="modal fade" id="print-selected-orders-modal" tabindex="-1" role="dialog" aria-labelledby="print-selected-orders-modalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${UI_STATUSES.print_selected_orders_button}</h5>
        </div>
        <div id="create-order-modal-body" style="height: 200px;" class="modal-body">
          <div style="margin-bottom: 10px;">
            <button id="print-selected-orders-button" class="btn btn-primary" type="button" onclick="getSelectedUuids('list')">
              <span class="sr-only">${UI_STATUSES.print_selected_orders_list_button}</span>
            </button> 
          </div>
          <div style="margin-bottom: 10px;">
            <button id="print-selected-orders-postcards-button" class="btn btn-primary" type="button" onclick="getSelectedUuids('postcards')">
              <span class="sr-only">${UI_STATUSES.print_selected_orders_postcards_button}</span>
            </button> 
          </div>
          <div>
            <button id="print-selected-orders-details-button" class="btn btn-primary" type="button" onclick="getSelectedUuids('details')">
              <span class="sr-only">${UI_STATUSES.print_selected_orders_details_button}</span>
            </button> 
          </div>
        </div>
      </div>
    </div>
  </div>

    <div id="create-order-button-container" style="display: inline-block; margin-left: 10px;">
      <input type="button" value="${CREATE_CUSTOM_ORDER_FIELDS.create_order}" class="btn btn-primary" id='button' data-toggle="modal" data-target="#order-modal"/>
    </div>    
    <div class="modal fade" id="order-modal" tabindex="-1" role="dialog" aria-labelledby="order-modalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="order-modalLabel">${CREATE_CUSTOM_ORDER_FIELDS.order_creation}</h5>
          </div>
          <div id="create-order-modal-body" style="height: 500px;" class="modal-body">
            ${createOrderCollapse()}
          </div>
        </div>
      </div>
    </div>
  `
}

function createOrderCollapse() {
  return `
  <div id="accordion">
    <div class="card">
      <div class="card-header" id="headingOne">
        <h5 class="mb-0">
          <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            ${CREATE_CUSTOM_ORDER_FIELDS.create_order_shopify}
          </button>
        </h5>
      </div>

      <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
        <div class="card-body" style="background-color: #f7f7f7;">
          <form id="product-form">
            <div class="form-group" style="margin-bottom: 5px;">
              <label for="inputProduct">${CREATE_CUSTOM_ORDER_FIELDS.product_name}</label>
              <input class="form-control form-control-sm" id="inputProduct" aria-describedby="productHelp">
            </div>
            <div class="form-group">
              <label for="inputPrice">${CREATE_CUSTOM_ORDER_FIELDS.product_price}</label>
              <input class="form-control form-control-sm" id="inputPrice" placeholder="35000">
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

          <div id="on-load" style="display: none;">
            <p>${CREATE_CUSTOM_ORDER_FIELDS.order_created_message}</p>
          </div>
          <hr>
          <button id="create-order-button" class="btn btn-primary btn-sm" type="button" onclick="createOrderButton()">
            <span class="sr-only">${CREATE_CUSTOM_ORDER_FIELDS.create_order}</span>
          </button>
          <button id="copy-link-button" class="btn btn-primary btn-sm" type="button" style="display: none;" onclick="copyCreatedOrderLinkButton()">
            <span class="sr-only">${CREATE_CUSTOM_ORDER_FIELDS.copy_link}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header" id="headingTwo">
        <h5 class="mb-0">
          <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
            ${CREATE_CUSTOM_ORDER_FIELDS.create_order_manually}
          </button>
        </h5>
      </div>
      <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
        <div class="card-body" style="background-color: #f7f7f7;">
          <div style="overflow-y: scroll; height:300px; overflow-x: hidden !important;">
            ${manualOrderFields()}
          </div> 
        </div>
      </div>
    </div>
  </div>
  `
}

function manualOrderFields() {
  return `
    <form style="max-width: 100%;" id="manual-order-form">
      <div class="row justify-content-between">
        <div class="form-group col-sm-6" style="margin-bottom: 5px;">
          <label for="input-manual-client-name">${CREATE_MANUAL_ORDER_FIELDS.client_name}</label>
          <input class="form-control form-control-sm" id="input-manual-client-name">
        </div>
        <div class="form-group col-sm-6" style="margin-bottom: 5px;">
          <label for="input-manual-client-last-name">${CREATE_MANUAL_ORDER_FIELDS.client_last_name}</label>
          <input class="form-control form-control-sm" id="input-manual-client-last-name"> 
        </div>
      </div>
      <div class="row justify-content-between">
        <div class="form-group col-sm-6" style="margin-bottom: 5px;">
          <label for="input-manual-client-phone">${CREATE_MANUAL_ORDER_FIELDS.client_phone}</label>
          <input class="form-control form-control-sm" id="input-manual-client-phone" placeholder="56911223344">
        </div>
        <div class="form-group col-sm-6" style="margin-bottom: 5px;">
          <label for="input-manual-client-email">${CREATE_MANUAL_ORDER_FIELDS.client_email}</label>
          <input class="form-control form-control-sm" id="input-manual-client-email" placeholder="client@gmail.com">
        </div>
      </div>
      <hr>
      <div class="form-group" style="margin-bottom: 5px;">
        <label for="input-manual-product">${CREATE_MANUAL_ORDER_FIELDS.product}</label>
        <input class="form-control form-control-sm" id="input-manual-product">
      </div>
      <div class="row justify-content-between">
        <div class="form-group col-sm-6" style="margin-bottom: 5px;">
          <label for="input-manual-price">${CREATE_MANUAL_ORDER_FIELDS.order_price}</label>
          <input class="form-control form-control-sm" id="input-manual-price" placeholder="35000">
        </div>
        <div class="form-group col-sm-6" style="margin-bottom: 5px;">
          <label for="input-manual-price-delivery">${CREATE_MANUAL_ORDER_FIELDS.order_delivery_price}</label>
          <input class="form-control form-control-sm" id="input-manual-price-delivery" placeholder="5000">
        </div>
      </div>
      <hr>
      <div class="form-group" style="margin-bottom: 5px;">
        <label for="input-manual-address-delivery">${CREATE_MANUAL_ORDER_FIELDS.address}</label>
        <input class="form-control form-control-sm" id="input-manual-address-delivery">
      </div>
      <div class="row justify-content-between">
        <div class="form-group col-sm-4" style="margin-bottom: 5px;">
          <label for="input-manual-date-delivery">${CREATE_MANUAL_ORDER_FIELDS.date_delivery}</label>
          <input id="input-manual-date-delivery" class="form-control form-control-sm" type="date"/>
          <span id="deliveryDateSelected"></span>
        </div>
        <div class="form-group col-sm-4" style="margin-bottom: 5px;">
          <label for="input-manual-time-delivery">${CREATE_MANUAL_ORDER_FIELDS.time_delivery}</label>
          <input class="form-control form-control-sm" id="input-manual-time-delivery" placeholder="17:00">
        </div>
        <div class="form-group col-sm-4" style="margin-bottom: 5px;">
          <label for="input-manual-comuna-delivery">${CREATE_MANUAL_ORDER_FIELDS.comuna}</label>
          <input class="form-control form-control-sm" id="input-manual-comuna-delivery">
        </div>
      </div>
      <div class="row justify-content-between">
        <div class="form-group col-sm-6" style="margin-bottom: 5px;">
          <label for="input-manual-recipient-name">${CREATE_MANUAL_ORDER_FIELDS.recipient_name}</label>
          <input class="form-control form-control-sm" id="input-manual-recipient-name">
        </div>
        <div class="form-group col-sm-6" style="margin-bottom: 5px;">
          <label for="input-manual-recipient-phone">${CREATE_MANUAL_ORDER_FIELDS.recipient_phone}</label>
          <input class="form-control form-control-sm" id="input-manual-recipient-phone" placeholder="56911223344">
        </div>
      </div>
      <hr>
      <div class="form-group" style="margin-bottom: 5px;">
        <label for="input-manual-comment">${CREATE_MANUAL_ORDER_FIELDS.comment}</label>
        <input class="form-control form-control-sm" id="input-manual-comment">
      </div>
      <div class="form-group" style="margin-bottom: 5px;">
        <label for="input-manual-postcard">${CREATE_MANUAL_ORDER_FIELDS.postcard_text}</label>
        <input class="form-control form-control-sm" id="input-manual-postcard">
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
    <button id="create-manual-order-button" class="btn btn-primary btn-sm" type="button" onclick="createManualOrderButton()">
      <span class="sr-only">${CREATE_CUSTOM_ORDER_FIELDS.create_order}</span>
    </button>
    <a id="manual-order-success-alert" style="display: none; color: green;">${CREATE_MANUAL_ORDER_FIELDS.order_success}</a>
  `
}
