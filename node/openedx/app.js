const lmsConfig = require("../config").openedx.lms;
const discoveryConfig = require("../config").openedx.discovery;
const axiosUtil = require("../config/axiosUtil");
let csrftoken = null
let lmsHeaders = null
let lmsCookies = null

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

async function lmsGetCsrftoken() {
  const reponse = await axiosUtil.lmsGetCsrftoken({}, {})
  const reponseCookieMap = buildCookieMap(reponse.headers['set-cookie'])
  csrftoken = reponseCookieMap.csrftoken
  console.log("[ lmsMe reponse data ]", reponse.status);
}

async function lmsUserLogin() {
  const data = {
    email: lmsConfig.email,
    password: lmsConfig.password,
  }
  const headers = {
    'X-CSRFToken': csrftoken,
    'Cookie': `csrftoken=${csrftoken};`,
  } 
  const reponse = await axiosUtil.lmsUserLogin(data, headers)
  const reponseCookieMap = buildCookieMap(reponse.headers['set-cookie'])
  lmsCookies = `csrftoken=${reponseCookieMap["csrftoken"]}; sessionid=${reponseCookieMap["sessionid"]};`;
  lmsHeaders = { ...headersTemplate, Cookie: lmsCookies, 'X-CSRFToken': reponseCookieMap['csrftoken'] }
  // console.log("[ lmsLogin lmsCookie ]", lmsCookie);
  console.log("[ lmsLogin reponse data ]", reponse.data);
}


async function lmsGetUserInfo() {
  const reponse = await axiosUtil.lmsGetUserInfo({}, lmsHeaders)
  console.log("[ lmsMe reponse data ]", reponse.data);
}


async function lmsGetCourse() {
  console.log(lmsHeaders)
  const reponse = await axiosUtil.lmsGetCourse({
    page_size: 20,
    page_index: 0
  }, lmsHeaders)
  console.log("[ lmsCourseDiscovery reponse data ]", reponse.data);
}


async function main() {
  try {
    await lmsGetCsrftoken();
    await lmsUserLogin();
    await lmsGetUserInfo();
    await lmsGetCourse();
  } catch (err) {
    console.error('[main error]:', err.message)
  }
}

main();
