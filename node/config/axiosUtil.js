const axios = require("axios").default;
const config = require("./index");
const baseURL = config.openedx.lms.url
// const baseURL = config.openedx.discovery.url
/**
 * Create axios instance
 */
console.log('------------------>', baseURL)
const axiosInstance = axios.create({
    headers:{
        'Content-Type': 'application/json',
    },
    timeout: 30000,
    baseURL, 
})

/**
 * Package CRUD request
 * @param {*} methed : get post put delete
 * @param {*} url : /xx/xx
 * @param {*} data : {}
 * @param {*} headers : {token: "At"}
 * @returns 
 */
function call(methed, url, data = {}, headers = {'Content-Type':'application/json'}) {
    return new Promise((resolve, reject) => {
        axiosInstance({
            method: methed || 'post',
            url:url,
            params: methed === 'get' || methed === 'delete'  ? data :'',
            data: methed !== 'get' && methed !== 'delete'?  data :'',
            headers: headers,
        })
        .then(response => {
            /**
             * If the server defines the biz code, you can check it on here.
             *    check response.data.code:
             *      if (response.data.code !== 0){
             *          reject(new Error('[Reauest biz error]', url, response.data.code, response.data.message))
             *      }
             *      if (response.status !== 200){
             *         reject(new Error('[Reauest fail]', url, response.status, response.statusText))
             *      }
             */
            resolve(response);
        })
        .catch(err => {
            if (err.response && err.response.data){
                console.error('[Reauest error]', err.response.status, url, err.response.data);
            }
            reject(err);
        })
    })
}

async function callForm(methed, url, data = {}, headers = {'Content-Type':'application/json'}) {
    return new Promise((resolve, reject) => {
        axiosInstance({
                method: methed || 'post',
                url:url,
                params: methed === 'get' || methed === 'delete'  ? data :'',
                data: methed !== 'get' && methed !== 'delete'?  data :'',
                headers: headers,
                transformRequest: [
                    function (data) {
                        let ret = ''
                        for (let it in data) {
                            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                        }
                        ret = ret.substring(0, ret.lastIndexOf('&'));
                        return ret
                    }
                ],
            })
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                if (err.response && err.response.data){
                    console.error('[Reauest error]', err.response.status, url, err.response.data);
                }
                reject(err);
            })
    })
}

function deleteFiled(data, filed) {
    delete data.filed;
    return data;
}



module.exports = {
    // ------------------------------user-------------------------------------
    lmsLogin: (data, headers) => callForm('post', '/user_api/v1/account/login_session/', data, headers),
    lmsMe: (data, headers) => call('get', '/api/user/v1/me', data, headers),

};
