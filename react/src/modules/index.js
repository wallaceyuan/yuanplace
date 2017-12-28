import React,{Component} from 'react';
import {render} from 'react-dom';
import {Route} from 'react-router';
import {HashRouter} from 'react-router-dom';
import {Layout1} from '../components/layout';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import Test from './test'
import Admin from './admin'


class Main extends React.Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <Route path="/" component={Layout1} />
                    <Route path="/test" component={Test} />
                    <Route path="/admin" component={Admin} />
                </div>
            </HashRouter>
        );
    }
}
render(
    <Main />,
    document.getElementById('application')
);
