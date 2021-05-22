const lmsConfig = require("../config").openedx.lms;
const discoveryConfig = require("../config").openedx.discovery;
const axiosUtil = require("../config/axiosUtil");
const headersTemplate = {'Content-Type':'application/x-www-form-urlencoded;', 'X-CSRFToken': '0pantN81PK3emjfrHcV3Fd80H152xWpjZ0kSb35fG8f2R03m2h2eqWmZoKGYSfFM', 'Cookie': 'csrftoken=0pantN81PK3emjfrHcV3Fd80H152xWpjZ0kSb35fG8f2R03m2h2eqWmZoKGYSfFM;'}
let lmsHeaders = null
let lmsCookies = null;
// const FormData = require('form-data');

function buildCookieMap (cookies) {
  const cookieMap = {}
  cookies.map(x => {
    x.split("; ").map(y => {
      const items = y.split("=")
      if (items.length >= 2) {
        cookieMap[items[0]] = items[1]
      }
    })
  })
  return cookieMap
}

async function lmsLogin() {
  const data = {
    email: lmsConfig.email,
    password: lmsConfig.password,
  }
  const reponse = await axiosUtil.lmsLogin(data, headersTemplate)
  const reponseCookieMap = buildCookieMap(reponse.headers['set-cookie'])
  // lmsCookies = `edxloggedin=${reponseCookieMap["edxloggedin"]}; edx-jwt-cookie-signature=${reponseCookieMap["edx-jwt-cookie-signature"]}; csrftoken=${reponseCookieMap["csrftoken"]}; sessionid=${reponseCookieMap["sessionid"]};`;
  lmsCookies = `csrftoken=${reponseCookieMap["csrftoken"]}; sessionid=${reponseCookieMap["sessionid"]};`;
  lmsHeaders = { ...headersTemplate, Cookie: lmsCookies, 'X-CSRFToken': reponseCookieMap['csrftoken'] }
  // console.log("[ lmsLogin lmsCookie ]", lmsCookie);
  console.log("[ lmsLogin reponse data ]", reponse.data);
}


async function lmsMe() {
  const reponse = await axiosUtil.lmsMe({}, lmsHeaders)
  console.log("[ lmsMe reponse data ]", reponse.data);
}


async function lmsCourseDiscovery() {
  console.log(lmsHeaders)
  const reponse = await axiosUtil.lmsCourseDiscovery({
    page_size: 20,
    page_index: 0
  }, lmsHeaders)
  console.log("[ lmsCourseDiscovery reponse data ]", reponse.data);
}


async function main() {
  try {
    await lmsLogin();
    await lmsMe();
    await lmsCourseDiscovery();
  } catch (err) {
    console.error('[main error]:', err.message)
  }
}

main();
