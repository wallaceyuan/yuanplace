/**
 * Created by yuan on 2017/4/16.
 */
import React, {Component} from "react";
import notification from 'antd/lib/notification'
import Modal from 'antd/lib/modal';
import './index.scss'
//公共方法类
export default {
  /**
   * 提示框BOX
   * @param type 图标类型 success /warning /error
   * @param content 提示内容
   */
  showNotificationBox(type, content, time){
    let type2 = !!type ? type : 'info';
    let duration = (time == 0 || !!time) ? time : 3;

    notification[type2]({
      message: '提示',
      description: content,
      duration: duration
    });
  },

  urlString(valueData){
    let urlStringArr = [], urlString = '';
    for (var key in valueData) {
      urlStringArr.push(key + '=' + valueData[key]);
    }
    urlString = urlStringArr.join('&');
    return urlString
  },
  /**
   * 返回URL参数对象
   * @returns {Object}
   */
  getUrlPath() {
    var url = window.location.href;
    var theRequest = {};
    if (url.indexOf("?") != -1) {
      var str = url.substr(url.lastIndexOf("?") + 1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = (strs[i].substr(strs[i].indexOf('=') + 1));
      }
    }
    return theRequest;
  },

  billCommonInfoShow(data) {
    if(data.tel == null) {
      data.tel = "";
    }
    if(data.refundReason == null) {
      data.refundReason = "";
    }
    if(data.remark == null) {
      data.remark = "";
    }

    data['addressDetail'] = data.provinceName + data.cityName + data.districtName + data.address;
    data.promotionTotalAmount = data.promotionTotalAmount ? data.promotionTotalAmount : 0;
    data.payableAmount = data.payableAmount ? data.payableAmount : 0;
    data.exceptedChangeAmount = data.exceptedChangeAmount ? data.exceptedChangeAmount : 0;
    data.depositTotalAmount = data.depositTotalAmount ? data.depositTotalAmount : 0;
    data.serivceAmount = data.serivceAmount ? data.serivceAmount : 0;

    // 已退金额
    if (data.refoundOrders && data.refoundOrders.length !== 0) { // 退单
      data.refundedTolAmount = data.refundTotalAmount;
    } else if (data.priceDefferenceOrders && data.priceDefferenceOrders.length !== 0) { // 退差
      data.refundedTolAmount = data.differenceTotalAmount;
    } else {
      data.refundedTolAmount = 0;
    }

    // 实售金额
    data['payAmount'] = Number((data.orderItemTotalAmount * 100) - (data.promotionTotalAmount * 100)) / 100;

    // 已付款金额
    let paymentLinesTotal = 0;
    data.paymentLines.map((paymentLineInfoVo) => {
      if (paymentLineInfoVo.paymentStatus === 'SUCCESS')
        paymentLinesTotal += paymentLineInfoVo.paymentLineAmount;
    })

    data['paymentLinesTotal'] = paymentLinesTotal;

    // 尾款金额 ——应付减去已付
    data['dispayableAmount'] = Number((data.payableAmount * 100) - (paymentLinesTotal * 100)) / 100;


    // 发票信息
    let isApply = false;
    if(data.orderAdditionVo.getInvoice == true) {
      isApply = '是';
      data['invoiceType'] = '纸质发票';
      if(data.orderAdditionVo.invoiceType == 1) { // 1:公司 2:个人
        data['invoiceHead'] = '单位';
      }else{
        data['invoiceHead'] = '个人';
      };
      data['invoiceCont'] = data.orderAdditionVo.invoiceHead;
    }else{
      isApply = '否';
      data['invoiceType'] = '-';
      data['invoiceHead'] = ' ';
      data['invoiceCont'] = ' ';
    }
    data['getInvoice'] = isApply;

    //退货类型
    let returnGoodsType = ' ';
    if(data.channel == 2 && data.orderType == 'REFUND_SALE') {
      if(data.orderAdditionVo.returnGoodsType == 1) {
        returnGoodsType = '15分钟快速退货';
      }else if(data.orderAdditionVo.returnGoodsType == 2) {
        returnGoodsType = '30天无理由退货';
      }else if(data.orderAdditionVo.returnGoodsType==3) {
        returnGoodsType = '其他';
      }
    }

    data['returnGoodsType'] = returnGoodsType;

    //渠道
    switch (data.channel) {
      case 1:
        data.channelName = '线上'
        break;
      case 2:
        data.channelName = '线下'
        break;
    }

    return data;
  },

  disabledStartDate(current) {
    // can not select days before today and today
    return current && current.valueOf() < Date.now() - 1*24*60*60*1000;
  },

  disabledEndDate(current){
    // can not select days after today and today
    return current && current.valueOf() > Date.now();
  },


  preventEnterForm(event){
    if(event.keyCode == 13){
      event.preventDefault()
      return false;
    }
  },

  showSuccess(title,content,okText,onOk) {
    Modal.success({
      width: 270,
      title: title,
      content: content,
      okText: okText, // 按钮显示的文字
      onOk:onOk,
      onCancel:function () {

      }
    });
  },
  showError(title, content, okText, onOk) {
    Modal.error({
      width:270,
      title: title,
      content: content,
      okText: okText,
      onOk:onOk,
      onCancel:function () {

      }
    });
  },
  showWarning(title,content,okText,onOk){
    Modal.warning({
      width:270,
      title: title,
      content: content,
      okText: okText,
      onOk:onOk,
      onCancel:function () {

      }
    });
  },
  showConfirm(title,content,okText,onOk){
    Modal.confirm({
      title: title,
      content: content,
      okText: okText,
      onOk: onOk,
      cancelText: '取消',
      onCancel:function () {

      }
    })
  }

}
