"use strict";
import 'whatwg-fetch';
import CommonFun from '../../util/util';// 公共方法

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

export default class Http {
  static get(url, params = {}) {
    const con = {};
    window.location.search.substring(1).split('&').forEach(function (name) {
      con[name.split('=')[0]] = decodeURIComponent(name.split('=')[1])
    });
    const param = [];
    Object.keys(params).forEach((key) => {
      param.push(`${key}=${params[key]}`);
    });


    const headObj = {}
    if (sessionStorage.getItem('shopId') && sessionStorage.getItem('shopId') !== 'null') {
      headObj.shopId = JSON.parse(sessionStorage.getItem('shopId'))[0].id
      headObj.shopStatus = JSON.parse(sessionStorage.getItem('shopId'))[0].isDel;
    }

    const options = {
      method: 'get',
      credentials: 'same-origin',
      headers: headObj
    };

    return new Promise((resolve, reject) => {
      fetch(`${url}?${param.join('&')}`, options)
        .then(checkStatus)
        .then(parseJSON)
        .then((data) => {
          resolve(data);
          if (!!data && !!data.code) {
            if (data.code == "-401") {
              CommonFun.showNotificationBox('warning', '登录超时');
            } else if (data.code != 200) {
              CommonFun.showNotificationBox('warning', (!!data.message ? (data.message) : '服务正忙，请稍后再试！'));
            }
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  static post(url, options = {}) {
    const con = {};
    window.location.search.substring(1).split('&').forEach(function (name) {
      con[name.split('=')[0]] = decodeURIComponent(name.split('=')[1]);
    });

    let shopId = ''
    let shopStatus = ''

    if (sessionStorage.getItem('shopId') && sessionStorage.getItem('shopId') !== 'null') {
      shopId = JSON.parse(sessionStorage.getItem('shopId'))[0].id;
      shopStatus = JSON.parse(sessionStorage.getItem('shopId'))[0].isDel;
    }

    const _options = {
      method: 'POST',
      headers: {
        'Content-Type': options.type?options.type:'application/json',
        'shopId': shopId,
        'shopStatus': shopStatus
      },
      credentials: 'same-origin',
    };

    if(options.type){
      _options.body = options.data;
      delete _options.data;
    }else if (options.data) {
      _options.body = JSON.stringify(options.data);
      delete _options.data;
    }

    //console.log("options.type",options.type,'_options',_options)

    return new Promise((resovle, reject) => {
      fetch(url, _options)
        .then(checkStatus)
        .then(parseJSON)
        .then((data) => {
          resovle(data);
          if (!!data && !!data.code) {
            if (data.code == "-401") {
              CommonFun.showNotificationBox('warning', '登录超时');
            } else if (data.code != 200) {
              CommonFun.showNotificationBox('warning', (!!data.message ? (data.message) : '服务正忙，请稍后再试！'));
            }
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
