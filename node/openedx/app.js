const lmsConfig = require("../config").openedx.lms;
const discoveryConfig = require("../config").openedx.discovery;
const axiosUtil = require("../config/axiosUtil");
const headersTemplate = {'Content-Type':'application/x-www-form-urlencoded;', 'X-CSRFToken': '0pantN81PK3emjfrHcV3Fd80H152xWpjZ0kSb35fG8f2R03m2h2eqWmZoKGYSfFM', 'Cookie': 'csrftoken=Tckv0FonmmunqABJldvntRsfESkvVjNlSNu0IVlBdKGbVhpEGiCyeAGelBVrgC3O;'}
// const FormData = require('form-data');

async function lmsLogin() {
  const data = {
    email: lmsConfig.email,
    password: lmsConfig.password,
  }
  const lmsLoginResult = await axiosUtil.lmsLogin(data, headersTemplate)
  // console.log("[ lmsLogin ]", lmsLoginResult);
}

async function main() {
  try {
    await lmsLogin();
  } catch (err) {
    console.error('[main error]:', err)
  }
}

main();
