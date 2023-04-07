function loadConsts() {
  return {
    ui_statuses: UI_STATUSES,
    column_names: COLUMN_NAMES,
    payment_status_fields: PAYMENT_STATUS_FIELDS,
    create_custom_order_fields: CREATE_CUSTOM_ORDER_FIELDS,
    filters_fields: FILTERS_FIELDS,
    order_details_modal: ORDER_DETAILS_MODAL,
    create_manual_order_fields: CREATE_MANUAL_ORDER_FIELDS,
    if_mobile: ''
  }
}

const DETAILS_PDF_FIELDS = {
  product_name: "Product name",
  order_price: "Product price",
  shipping_price: "Delivery cost",
  total_price: "Total price",
  order_data: "Order data",
  client_name: "Client name",
  client_phone: "Client phone",
  date_delivery: "Date delivery",
  time_delivery: "Time delivery",
  address: "Delivery address",
  comuna: "Comuna",
  recipient_name: "Recipient name",
  recipient_phone: "Recipient phone",
  postcard_text: "Postcard"
}

const CREATE_MANUAL_ORDER_FIELDS = {
  client_name: "Client name",
  client_last_name: "Client lastname",
  client_phone: "Client phone",
  client_email: "Client email",
  product: "Product",
  order_price: "Price",
  order_delivery_price: "Delivery cost",
  address: "Delivery address",
  date_delivery: "Date delivery",
  time_delivery: "Time delivery",
  comuna: "Comuna",
  recipient_name: "Recipient name",
  recipient_phone: "Recipient phone",
  comment: "Manager comment",
  postcard_text: "Postcard",
  order_success: "Order created! Reload the page please.",
  order_update_success: "Order updated! Refresh the page please.",
}

const UI_STATUSES = {
  payment_status_is_paid: "Paid",
  link_copied: "Link copied",
  print_selected_orders_button: "Print selected",
  print_selected_orders_list_button: "📄 Print selected orders list",
  print_selected_orders_postcards_button: "💌 Print selected orders postcards",
  print_selected_orders_details_button: "🧾 Print selected orders details",
  open_document_list: "📄 Open document",
  open_document_postcards: "💌 Open document",
  open_document_details: "🧾 Open document",
  search_by_id: "Search by ID..."
}

const COLUMN_NAMES = {
  order_date_create: "Order created date",
  order_delivery_datetime: "Order delivery datetime",
  client_name: "Client name",
  product: "Product",
  postcard_content: "Postcard content",
  order_delivery_address: "Address",
  product_price: "Product price",
  product_shipping_price: "Delivery cost",
  manager_comment: "Manager comment",
  order_status: "Order status",
  order_details: "Order details"
}

const PAYMENT_STATUS_FIELDS = {
  status_paid: "Paid",
  status_needs_confirmation: "Confirmation needed",
  confirm_payment: "Confirm payment",
  this_action_cant_be_canceled: "This action can't be canceled!",
  payment_confirmation_from: "Payment confirmation from",
  for_total_amount_of: "for total amount of",
  including_delivery: "including delivery"
}

const CREATE_CUSTOM_ORDER_FIELDS = {
  create_order_manually: "Create order manually",
  create_order_shopify: "Create order Shopify",
  create_order: "Create order",
  order_creation: "Order creation",
  product_name: "НProduct name",
  product_price: "Price",
  order_created_message: "Order created, copy this link and send it to the client",
  copy_link: "Copy link"
}

const FILTERS_FIELDS = {
  starting_from_date: "Starting from:",
  ending_with_date: "Till:",
  service: "Service",
  any: "Any",
  corner_shop: "Corner-Shop",
  shopify: "Shopify",
  rappi: "Rappi",
  status: "Status",
  status_new: "New",
  status_viewed: "Viewed",
  status_processing: "Processing",
  status_delivered: "Delivered",
  status_cancelled: "Cancelled",
  only_ongoing_orders: "Only ongoing orders",
  payment_verification_required: "Payment verification required",
  show_all_orders: "All orders"
}

ORDER_DETAILS_MODAL = {
  order_details: "Order details",
  order_status: "Order status",
  payment_status: "Payment status",
  order_page: "Order page",
  go_to_order_page: "Open order page",
  manager_comments: "Comments",
  add_comment: "Add comment",
  client_name: "Client name",
  client_email: "Client Email",
  client_phone: "Client Phone",
  product_name: "Product",
  product_price: "Price",
  product_shipping_price: "Delivery cost",
  date_delivery: "Date delivery",
  time_delivery: "Time delivery",
  order_delivery_address: "Address",
  comuna: "Comuna",
  recipient_name: "Recipient name",
  recipient_phone: "Recipient phone",
  postcard_content: "Postcard",
  print_postcard: "Print postcard",
  create_pdf: "Create PDF",
  copy_link: "Copy link",
  link_copied: "Link copied",
  edit_order_button: "Edit order",
  delete_order_button: "Delete order",
  delete_order_field: "Delete order",
  delete_order_warning_message: "This action cannot be undone, the order will be permanently deleted.",
  order_deleted_alert: "The order has been deleted. Please refresh the page."
}

const STATUS_MAP_ICON = new Map()
STATUS_MAP_ICON.set('new', '<span class="bi bi-plus-square"></span>')
STATUS_MAP_ICON.set('delivered', '<span class="bi bi-check-square"></span>')
STATUS_MAP_ICON.set('cancelled', '<span class="bi bi-x-square"></span>')
STATUS_MAP_ICON.set('processing', '<span class="bi bi-box-seam"></span>')
STATUS_MAP_ICON.set('viewed', '<span class="bi bi-eye"></span>')

const STATUS_MAP = new Map()
STATUS_MAP.set('new', 'New')
STATUS_MAP.set('delivered', 'Delivered')
STATUS_MAP.set('cancelled', 'Cancelled')
STATUS_MAP.set('processing', 'Processing')
STATUS_MAP.set('viewed', 'Viewed')
