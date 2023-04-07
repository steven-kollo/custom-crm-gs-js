function createSelectedOrdersPostcardsPDF(checked_uuid_array) {
  const WHERE_STATEMENT = ` WHERE uuid IN (${checked_uuid_array.map(uuid => `"${uuid}"`)})`
  const postcards_text = runQuery(WHERE_STATEMENT, true).map(x => x.order_recipient_postcard_text)
  return pastePostcardTextToTemplate(postcards_text)
}

function pastePostcardTextToTemplate(text_arr) {
  text_arr = text_arr.filter(function (el) {
    return el != "";
  })
  if (text_arr == []) return
  for (let j = text_arr.length - 1; j < 32; j++) {
    text_arr.push(" ")
  }
  // for each of 4 sheets
  for(let s = 0; s < 4; s++) {
    // for each of 8 inputs on each sheet
    for (let i = 0; i < 8; i++) {
      const font_size = calculateFontSize(text_arr[i + (8 * s)].length)
      console.log(font_size)
      const slide = SlidesApp.openByUrl(POSTCARD_TEMPLATE_SHEET_URL).getSlides()[s]
      const textRange = slide.getShapes()[i].getText().setText(text_arr[i + (8 * s)])
      try {
        textRange.getTextStyle().setFontSize(font_size)
      } catch { console.log("no text") }
    }
  }
  
  return {
    checked_uuid_array: text_arr,
    gdrive_link: createPostcardPdf()
  }
}

function createPostcardPdf() {
  const folder = DriveApp.getFolderById(GDRIVE_PDF_FOLDER_ID)
  const blob = DriveApp.getFileById(POSTCARD_TEMPLATE_ID).getBlob().setName('postcard.pdf')
  const file = folder.createFile(blob)
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
  return file.getUrl()
}

function calculateFontSize(length) {
  console.log(length)
  if (length > 500) {
    console.log("500")
    return 9
  } else if (length > 400) {
    console.log("400")
    return 10
  } else if (length > 300) {
    console.log("300")
    return 11
  } else if (length > 250) {
    console.log("250")
    return 11
  } else if (length > 200) {
    console.log("200")
    return 12
  } else if (length > 150) {
    console.log("150")
    return 13
  } else if (length > 100) {
    console.log("100")
    return 14
  } else if (length > 75) {
    console.log("75")
    return 15
  } else {
    console.log("less")
    return 16
  }
}
