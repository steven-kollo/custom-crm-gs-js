function create_Filters(if_mobile) {
  return HtmlService.createHtmlOutput(
    create_FiltersHtml(if_mobile)
  ).getContent()
}

function create_FiltersHtml(if_mobile) {
  return if_mobile == false ? `
  <div class="date-picker-container" style="width: 800px;">
    <div class="row justify-content-between">
      <div class="col-sm-3">
        <label for="startDate">${FILTERS_FIELDS.starting_from_date}</label>
        <input id="filter-dateStart" class="form-control" type="date" onchange="runFilteredQuery()"/>
        <span id="startDateSelected"></span>
      </div>
      <div class="col-sm-3">
        <label for="endDate">${FILTERS_FIELDS.ending_with_date}</label>
        <input id="filter-dateEnd" class="form-control" type="date" onchange="runFilteredQuery()"/>
        <span id="endDateSelected"></span>
      </div>
      <div class="dropdown-service col-sm-3">
        <label for="dropdownMenuLink-service">${FILTERS_FIELDS.service}</label>
        <select id="filter-service" class="form-select" aria-labelledby="dropdownMenuLink-service" onchange="runFilteredQuery()">
          <option value="any" selected>${FILTERS_FIELDS.any}</option>
          <option value="Corner-Shop">${FILTERS_FIELDS.corner_shop}</option>
          <option value="Shopify">${FILTERS_FIELDS.shopify}</option>
          <option value="Rappi">${FILTERS_FIELDS.rappi}</option>
        </select>
      </div>  
      <div class="dropdown-order-status col-sm-3">
        <label for="dropdownMenuLink-order-status">${FILTERS_FIELDS.status}</label>
        <select id="filter-order-status" class="form-select" aria-labelledby="dropdownMenuLink-order-status" onchange="runFilteredQuery()">
          <option value="any" selected>${FILTERS_FIELDS.any}</option>
          <option value="new">${FILTERS_FIELDS.status_new}</option>
          <option value="viewed">${FILTERS_FIELDS.status_viewed}</option>
          <option value="processing">${FILTERS_FIELDS.status_processing}</option>
          <option value="delivered">${FILTERS_FIELDS.status_delivered}</option>
          <option value="cancelled">${FILTERS_FIELDS.status_cancelled}</option>
        </select>
      </div>
    </div>
  </div>
  ` : `
  <div class="date-picker-container">
    <div class="row justify-content-between">
      <div class="col-sm-3" style="width: 50%;">
        <label for="startDate">${FILTERS_FIELDS.starting_from_date}</label>
        <input id="filter-dateStart" class="form-control" type="date" onchange="runFilteredQuery()"/>
        <span id="startDateSelected"></span>
      </div>
      <div class="col-sm-3" style="width: 50%;">
        <label for="endDate">${FILTERS_FIELDS.ending_with_date}</label>
        <input id="filter-dateEnd" class="form-control" type="date" onchange="runFilteredQuery()"/>
        <span id="endDateSelected"></span>
      </div>
      <div class="col-sm-3" style="width: 50%;">
        <label for="dropdownMenuLink-service">${FILTERS_FIELDS.service}</label>
        <select id="filter-service" class="form-select" aria-labelledby="dropdownMenuLink-service" onchange="runFilteredQuery()">
          <option value="any" selected>${FILTERS_FIELDS.any}</option>
          <option value="Corner-Shop">${FILTERS_FIELDS.corner_shop}</option>
          <option value="Shopify">${FILTERS_FIELDS.shopify}</option>
          <option value="Rappi">${FILTERS_FIELDS.rappi}</option>
        </select>
      </div>  
      <div class="col-sm-3" style="width: 50%;">
        <label for="dropdownMenuLink-order-status">${FILTERS_FIELDS.status}</label>
        <select id="filter-order-status" class="form-select" aria-labelledby="dropdownMenuLink-order-status" onchange="runFilteredQuery()">
          <option value="any" selected>${FILTERS_FIELDS.any}</option>
          <option value="new">${FILTERS_FIELDS.status_new}</option>
          <option value="viewed">${FILTERS_FIELDS.status_viewed}</option>
          <option value="processing">${FILTERS_FIELDS.status_processing}</option>
          <option value="delivered">${FILTERS_FIELDS.status_delivered}</option>
          <option value="cancelled">${FILTERS_FIELDS.status_cancelled}</option>
        </select>
      </div>
    </div>
  </div>
  `
}
