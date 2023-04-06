const MANYCHAT_MANAGERS_SUBSCRIBED_IDS = ["******", "******", "******"]
const MANYCHAT_FLOW_ID = "******"
const MANYCHAT_KEY = "******"
const SHOP_ID = "******"
const TOKEN = "******"
const QUERY_BASE = "INSERT INTO `******.main.orders` "
const PROJECT_ID = "******"

const GDRIVE_PDF_FOLDER_ID = "******"
const SINGLE_ORDER_TEMPLATE_SHEET_ID = "******"
const SINGLE_ORDER_TEMPLATE_SHEET_URL = "******"
const LIST_TEMPLATE_SHEET_ID = "******"
const LIST_TEMPLATE_SHEET_URL = "******"
const POSTCARD_TEMPLATE_SHEET_URL = "******"
const POSTCARD_TEMPLATE_ID = "******"

let STATUS_CLASS_MAP = new Map()
  STATUS_CLASS_MAP.set('new', 'btn btn-danger btn-sm')
  STATUS_CLASS_MAP.set('delivered', 'btn btn-success btn-sm')
  STATUS_CLASS_MAP.set('cancelled', 'btn btn-secondary btn-sm')
  STATUS_CLASS_MAP.set('processing', 'btn btn-primary btn-sm')
  STATUS_CLASS_MAP.set('viewed', 'btn btn-warning btn-sm')

const SPANISH_MONTHS = new Map()
SPANISH_MONTHS.set('enero', { spanish: 'enero', english: 'January', number: 0})
SPANISH_MONTHS.set('febrero', { spanish: 'febrero', english: 'February', number: 1})
SPANISH_MONTHS.set('marzo', { spanish: 'marzo', english: 'March', number: 2})
SPANISH_MONTHS.set('abril', { spanish: 'abril', english: 'April', number: 3})
SPANISH_MONTHS.set('mayo', { spanish: 'mayo', english: 'May', number: 4})
SPANISH_MONTHS.set('junio', { spanish: 'junio', english: 'June', number: 5})
SPANISH_MONTHS.set('julio', { spanish: 'julio', english: 'July', number: 6})
SPANISH_MONTHS.set('agosto', { spanish: 'agosto', english: 'August', number: 7})
SPANISH_MONTHS.set('septiembre', { spanish: 'septiembre', english: 'September', number: 8})
SPANISH_MONTHS.set('octubre', { spanish: 'octubre', english: 'October', number: 9})
SPANISH_MONTHS.set('noviembre', { spanish: 'noviembre', english: 'November', number: 10})
SPANISH_MONTHS.set('diciembre', { spanish: 'diciembre', english: 'December', number: 11})
