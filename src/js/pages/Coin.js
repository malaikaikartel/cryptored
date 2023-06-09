import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { HISTORY } from "../utils/constants";
import api from "../utils/api";

import CoinBalance from "../components/CoinBalance";
import CoinTransactions from "../components/CoinTransactions";
import CoinCharts from "../components/CoinCharts";
import CoinSend from "../components/CoinSend";
import CoinReceive from "../components/CoinReceive";
import actions from "../actions/utils";

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    viewSpace: {
        height: 48,
        width: "100%",
        [theme.breakpoints.up("md")]: {
            height: 64
        }
    }
});

class Coin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pathname: props.pathname,
            classes: props.classes,
            _logged_account: null,
            _we_know_if_logged: false,
            _fees: 1,
            _selected_locales_code: null,
            _selected_currency: null,
            _coin_data: null,
            _history: HISTORY,
            _coin_id: props.pathname.split("/")[2] || "",
            _view_name: props.pathname.split("/")[3] || "balance",
            _view_names: [
                "balance",
                "transactions",
                "charts",
                "send",
                "receive"
            ]
        };
    };

    componentDidMount() {

        this._update_settings();
        this._is_logged();
    }

    componentWillReceiveProps(new_props) {

        const { pathname, _coin_id } = this.state;
        const new_pathname = new_props.pathname;

        if(pathname !== new_pathname) {

            const _new_coin_id = new_props.pathname.split("/")[2] || "";
            const _new_view_name = new_props.pathname.split("/")[3] || "balance";
            this.setState({pathname: new_pathname, _coin_id: _new_coin_id, _view_name: _new_view_name}, () => {
                if(_coin_id !== _new_coin_id) {

                    this._get_coin_data();
                }
                this._is_logged();
            });
        }

    }

    _process_is_logged_result = (error, result) => {

        const _logged_account = error ? null: result;
        this.setState({_logged_account, _we_know_if_logged: true});
    };

    _is_logged = () => {

        api.is_logged(this._process_is_logged_result);
    };

    _process_settings_query_result = (error, settings) => {

        // Set new settings from query result
        const _fees = typeof settings.fees !== "undefined" ? settings.fees: 1;
        const _selected_locales_code =  typeof settings.locales !== "undefined" ? settings.locales: "en-US";
        const _selected_currency = typeof settings.currency !== "undefined" ? settings.currency: "USD";


        this.setState({ _fees, _selected_locales_code, _selected_currency }, function(){
            this._get_coin_data();
        });
    };

    _update_settings() {

        // Call the api to get results of current settings and send it to a callback function
        api.get_settings(this._process_settings_query_result);
    }

    _get_coin_data() {

        const { _coin_id } = this.state;

        api.get_coin_data(_coin_id, this._set_coin_data);
    }

    _set_coin_data = (error, data) => {

        this.setState({_coin_data: data});
    };

    render() {

        const { classes } = this.state;
        const { _coin_id, _view_name, pathname } = this.state;
        const { _fees, _selected_locales_code, _selected_currency, _coin_data, _logged_account, _we_know_if_logged } = this.state;

        const views = {
            balance: <CoinBalance
                coin_data={_coin_data}
                selected_locales_code={_selected_locales_code}
                selected_currency={_selected_currency}
                logged_account={_logged_account}
                we_know_if_logged={_we_know_if_logged}
                coin_id={_coin_id} />,
            transactions: <CoinTransactions
                coin_data={_coin_data}
                coin_id={_coin_id}
                logged_account={_logged_account}
                we_know_if_logged={_we_know_if_logged}
                selected_locales_code={_selected_locales_code}
                selected_currency={_selected_currency}/>,
            charts: <CoinCharts
                coin_data={_coin_data}
                logged_account={_logged_account}
                selected_locales_code={_selected_locales_code}
                selected_currency={_selected_currency}
                coin_id={_coin_id} />,
            send: <CoinSend
                coin_data={_coin_data}
                logged_account={_logged_account}
                we_know_if_logged={_we_know_if_logged}
                fees={_fees}
                selected_locales_code={_selected_locales_code}
                selected_currency={_selected_currency}
                pathname={pathname}
                coin_id={_coin_id} />,
            receive: <CoinReceive
                coin_id={_coin_id}
                logged_account={_logged_account}
                we_know_if_logged={_we_know_if_logged}
                coin_data={_coin_data}/>
        };

        const view = _selected_currency !== null && _selected_locales_code !== null ? views[_view_name]: null;

        return (
            <div className={classes.root}>
                <div className={classes.viewSpace}></div>
                {view}
            </div>
        );
    }
}

export default withStyles(styles)(Coin);
