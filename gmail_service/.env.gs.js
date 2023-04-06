// THIS IS A SEPARATE FILE
// It's on business's main GDrive with access to Gmail where Delivery Services notifications are. 
// Data is sent using webhook to the main Gmail Service on new delivery order received 

const MAIN_WEBHOOK_READER_URL = 'https://script.google.com/macros/s/******/exec'
const LAST_MESSAGE_ID_SHEET_URL = "https://docs.google.com/spreadsheets/d/******/edit#gid=0"
const SHOP_ID = "******";
const TOKEN = "shpat_******"
const QUERY_BASE = "INSERT INTO `******.main.orders` "
const PROJECT_ID = "******"

const SPANISH_MONTHS = new Map()
SPANISH_MONTHS.set('enero', { spanish: 'enero', english: 'January', number: 1})
SPANISH_MONTHS.set('febrero', { spanish: 'febrero', english: 'February', number: 2})
SPANISH_MONTHS.set('marzo', { spanish: 'marzo', english: 'March', number: 3})
SPANISH_MONTHS.set('abril', { spanish: 'abril', english: 'April', number: 4})
SPANISH_MONTHS.set('mayo', { spanish: 'mayo', english: 'May', number: 5})
SPANISH_MONTHS.set('junio', { spanish: 'junio', english: 'June', number: 6})
SPANISH_MONTHS.set('julio', { spanish: 'julio', english: 'July', number: 7})
SPANISH_MONTHS.set('agosto', { spanish: 'agosto', english: 'August', number: 8})
SPANISH_MONTHS.set('septiembre', { spanish: 'septiembre', english: 'September', number: 9})
SPANISH_MONTHS.set('octubre', { spanish: 'octubre', english: 'October', number: 10})
SPANISH_MONTHS.set('noviembre', { spanish: 'noviembre', english: 'November', number: 11})
SPANISH_MONTHS.set('diciembre', { spanish: 'diciembre', english: 'December', number: 12})

