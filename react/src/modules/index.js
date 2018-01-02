import React,{Component} from 'react';
import {render} from 'react-dom';
import {Route} from 'react-router';
import {HashRouter, BrowserRouter} from 'react-router-dom';
import {AdminLayout} from '../components/layout';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import Test from './test'
import Admin from './admin';

class Main extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route path="/" />
                    <Route path="/test" component={Test} />
                    <Route path="/admin" component={Admin} />
                </div>
            </BrowserRouter>
        );
    }
}
render(
    <Main />,
    document.getElementById('application')
);
