function stringFromDate(date) {
  // 2020-12-25
  // 2020-12-25 03:22:01

  let year = date.getFullYear()
  let month = date.getMonth() + 1 < 10 ? '0'+(date.getMonth() + 1) : date.getMonth() + 1
  let day = date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()
  let seconds = date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds()
  let minutes = date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()
  let hours = date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()

  return {
    date: `${year}-${month}-${day}`,
    datetime: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
    reverced_date: `${day}-${month}-${year}`
  }
}

function getScriptURL() {
  return ScriptApp.getService().getUrl();
}

function reload_page(URL) {
  // Bug in SpreadsheetApp requires to do this, otherwise previous view will be converted to pdf
  SpreadsheetApp.openByUrl(URL).getSheetByName("Main").getRange(1,1).setValue(
    SpreadsheetApp.openByUrl(URL).getSheetByName("Main").getRange(1,1).getValue()
  )
}
