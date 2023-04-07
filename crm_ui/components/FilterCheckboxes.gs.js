function createFilterCheckboxes(if_mobile) {
  return HtmlService.createHtmlOutput(
    createFilterCheckboxesHtml(if_mobile)
  ).getContent()
}

function createFilterCheckboxesHtml(if_mobile) {

  return if_mobile == false ? `
  <div class="form-check form-check-inline" style="margin-left: 10px;">
    <input class="form-check-input" type="checkbox" value="" id="actual-orders-сheck" onchange="runFilteredQuery()">
    <label class="form-check-label" for="actual-orders-сheck">
      ${FILTERS_FIELDS.only_ongoing_orders}
    </label>
  </div>
  <div class="form-check form-check-inline">
    <input class="form-check-input" type="checkbox" value="" id="need-payment-confirm-сheck" onchange="runFilteredQuery()">
    <label class="form-check-label" for="need-payment-confirm-сheck">
      ${FILTERS_FIELDS.payment_verification_required}
    </label>
  </div>
  <div class="form-check form-check-inline">
    <input class="form-check-input" type="checkbox" value="" id="show-all-orders-сheck" onchange="runFilteredQuery()">
    <label class="form-check-label" for="show-all-orders-сheck">
      ${FILTERS_FIELDS.show_all_orders}
    </label>
  </div>
  ` : `
  <div class="form-check form-check-inline" style="margin-left: 10px;">
    <input class="form-check-input" type="checkbox" value="" id="actual-orders-сheck" onchange="runFilteredQuery()">
    <label class="form-check-label" for="actual-orders-сheck">
      ${FILTERS_FIELDS.only_ongoing_orders}
    </label>
  </div>
  <div class="form-check form-check-inline" style="margin-left: 10px;">
    <input class="form-check-input" type="checkbox" value="" id="need-payment-confirm-сheck" onchange="runFilteredQuery()">
    <label class="form-check-label" for="need-payment-confirm-сheck">
      ${FILTERS_FIELDS.payment_verification_required}
    </label>
  </div>
  <div class="form-check form-check-inline" style="margin-left: 10px;">
    <input class="form-check-input" type="checkbox" value="" id="show-all-orders-сheck" onchange="runFilteredQuery()">
    <label class="form-check-label" for="show-all-orders-сheck">
      ${FILTERS_FIELDS.show_all_orders}
    </label>
  </div>
  `
}
