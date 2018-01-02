import React,{Component} from 'react';

import {AdminLayout} from '../../components/layout';

export default class Admin extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AdminLayout>
                <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
                    ...
                    <br />
                    Really
                    <br />...<br />...<br />...<br />
                    long
                    <br />...<br />...<br />...<br />...<br />...<br />...
                    <br />...<br />...<br />...<br />...<br />...<br />...
                    <br />...<br />...<br />...<br />...<br />...<br />...
                    <br />...<br />...<br />...<br />...<br />...<br />...
                    <br />...<br />...<br />...<br />...<br />...<br />...
                    <br />...<br />...<br />...<br />...<br />...<br />...
                    <br />...<br />...<br />...<br />...<br />...<br />
                    content
                </div>
            </AdminLayout>
        );
    }
}