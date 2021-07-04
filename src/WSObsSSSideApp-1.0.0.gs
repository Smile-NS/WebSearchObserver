function doPost(e) {
  const params = JSON.parse(e.postData.getDataAsString());

  const res = { sucsess: true };

  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify(res));
  return output;
}

function doGet(e){

  const channel = e.parameter.channel;
  const res = channel ==
    "reject_access" ? { time: getTime() } :
    "password_auth" ? { success: isCorrectPassword(e.parameter.password) } : null;

  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify(res));
  return output;
}

const id = '********************************************';
const ss = SpreadsheetApp.openById(id);

function init() {
  let manager = ss.getSheetByName("シート1");
  manager.setName("Manager");

  manager.getRange(1, 1).setValue("password=");
  manager.getRange(1, 2).setValue(generatePassword());

  manager.getRange(2, 1).setValue("temp_password=");
  manager.getRange(2, 2).setValue(generatePassword());

  manager.getRange(3, 1).setValue("run_sheet=");
  manager.getRange(3, 2).setValue(addScheduleSheet(1).getName());
}

function getTime() {
  let manager = ss.getSheetByName("Manager");
  let target = ss.getSheetByName(manager.getRange(3, 2).getValue());

  let array = [];
  for (let i = 4;i <= 1000;i++) {
    let startTime = target.getRange(i, 1).getValue();
    let endTime = target.getRange(i, 2).getValue();

    if (startTime == '' || endTime == '') continue;

    let container = [ startTime, endTime ];
    array.push(container);
  }

  return array;
}

function addScheduleSheet(id) {
  let sheet = ss.insertSheet("Schedule Style" + id);

  sheet.getRange(1, 1).setValue("id=");
  let idZone = sheet.getRange(1, 2);
  idZone.setValue(id);
  idZone.setHorizontalAlignment("left");

  let schedule = sheet.getRange(2, 1);
  schedule.setValue("Schedule");
  schedule.setHorizontalAlignment("center");
  sheet.getRange(2, 1, 1, 2).merge();

  let startTime = sheet.getRange(3, 1);
  startTime.setValue("start time");
  startTime.setHorizontalAlignment("center");

  let endTime = sheet.getRange(3, 2);
  endTime.setValue("end time");
  endTime.setHorizontalAlignment("center");

  sheet.getRange(3, 1, 1000, 2).setBorder(true, true, true, true, true, true);
  return sheet;
}

function getLastestSheetId() {
  let sheets = ss.getSheets();

  let lastId = 0;
  sheets.forEach(e => {
    if (e.getRange(1, 1).getValue() == "id=") {
      let id = parseInt(e.getRange(1, 2).getValue());
      lastId = id > lastId ? id : lastId;
    }
  });

  return lastId;
}

function generatePassword() {
  const characters = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
  ];

  let password = "";
  do {
    let random = parseInt(Math.random() * characters.length);
    password += characters[random];
  } while (password.length != 10)

  return password;
}

function getPassword() {
  let manager = ss.getSheetByName("Manager");
  return manager.getRange(1, 2).getValue();
}

function getTempPassword() {
    let manager = ss.getSheetByName("Manager");
  return manager.getRange(2, 2).getValue();
}

function isCorrectPassword(password) {
  return password == getPassword() || password == getTempPassword();
}