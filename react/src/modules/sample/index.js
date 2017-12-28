import React, {Component} from 'react';
import img1 from '../../imgs/favicon.png';
import Modules1 from './modules1';
import Modules2 from './modules2';

import CommonModules from '../../components/commonModules';
import SampleModel from '../../model/Sample1Model';

import Affix from 'antd/lib/affix';
import "./style.scss"
var _ = require('lodash');

export default class Sample extends Component {
  constructor(props) {
    super(props);
    let t = this;
    t.sampleModel = new SampleModel();
    t.state = {
      textTest: '1112',
    }
  }

  componentDidMount() {

    var users = [
      { 'user': 'barney',  'active': false },
      { 'user': 'fred',    'active': false },
      { 'user': 'pebbles', 'active': true }
    ];

    _.findIndex(users, function(chr) {
      return chr.user == 'barney';
    });
// → 0

// using the `_.matches` callback shorthand
    _.findIndex(users, { 'user': 'fred', 'active': false });
// → 1

// using the `_.matchesProperty` callback shorthand
    _.findIndex(users, 'active', false);
// → 0

// using the `_.property` callback shorthand
    _.findIndex(users, 'active');



    const t = this;
    t.sampleModel.sample().then((dataMap) => {

      let data = dataMap;
      t.setState({
        textTest: data.text
      })
    }).catch((e)=> {
      console.log(e)
    });
  }

  render() {
    return (
      <div className="Sample">
        <div>{this.state.textTest}</div>
        <CommonModules></CommonModules>
        <img className="sample-img" src={img1}/>
        <Affix>
          例子
        </Affix>
        <Modules1></Modules1>
        <Modules2></Modules2>
      </div>
    )
  }
}
