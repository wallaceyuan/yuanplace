import CommonModel from './CommonModel';

export default class Sample1Model {
  /**
   * 转换数据
   * @param data
   * @returns {{}}
   * @private
   */
  _convert(data) {
    if (data) {
      data._convert = true;
      data.dataMap.text += ' Sample1Model';
      return data.dataMap;
    }
  }

  sample(param) {
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
        CommonModel.get('/api/index', param).then((data)=>{
          return this._convert(data);
        }).then((data)=>{
            resolve(data);
        }).catch(reject);
      }, 200)
    });
  }

}
