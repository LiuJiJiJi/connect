const lmsConfig = require("../config").openedx.lms;
const discoveryConfig = require("../config").openedx.discovery;
const axiosUtil = require("../config/axiosUtil");
const headersTemplate = {'Content-Type':'application/x-www-form-urlencoded;', 'X-CSRFToken': '0pantN81PK3emjfrHcV3Fd80H152xWpjZ0kSb35fG8f2R03m2h2eqWmZoKGYSfFM', 'Cookie': 'csrftoken=Tckv0FonmmunqABJldvntRsfESkvVjNlSNu0IVlBdKGbVhpEGiCyeAGelBVrgC3O;'}
let lmsCookie = null;
// const FormData = require('form-data');

async function lmsLogin() {
  const data = {
    email: lmsConfig.email,
    password: lmsConfig.password,
  }
  // console.log("[ requset body ]", data);
  // console.log("[ requset header ]", headersTemplate);
  const reponse = await axiosUtil.lmsLogin(data, headersTemplate)
  const reponseCookies = reponse.headers['set-cookie']
  reponseCookies.map(x => {
    

  })
  const reponseCookieMap = Object.fromEntries(
    reponseCookies.map(x => {
      const items = x.split("=")
      return [items[0], items[1]]
    })
  )
  // console.log("[ lmsLogin reponse headers ]", reponse.headers);
  // console.log("[ lmsLogin reponse headers.set-cookie ]", reponseCookies);
  // console.log("[ lmsLogin reponse headers.reponseCookieMap ]", reponseCookieMap);
  lmsCookie = `edxloggedin=${reponseCookieMap["edxloggedin"]}; edx-jwt-cookie-signature=${reponseCookieMap["edx-jwt-cookie-signature"]}; csrftoken=${reponseCookieMap["csrftoken"]}; sessionid=${reponseCookieMap["sessionid"]};`;
  // console.log("[ lmsLogin lmsCookie ]", lmsCookie);
  console.log("[ lmsLogin reponse data ]", reponse.data);
}


async function lmsMe() {
  const headers = { ...headersTemplate, Cookie: lmsCookie }
  const reponse = await axiosUtil.lmsMe({}, headers)
  console.log("[ lmsMe reponse data ]", reponse.data);
}


async function main() {
  try {
    await lmsLogin();
    await lmsMe();
  } catch (err) {
    console.error('[main error]:', err)
  }
}

main();
