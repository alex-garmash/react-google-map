import React, {Component} from 'react';
import Map from './Map';
import Menu from './Menu';
import dataJson from './data';

class App extends Component {
    state = {
        language: 'he',
        travelMode: 'DRIVING',
        languageOpen: false,
        travelModeOpen: false,
        height: 600,
        width: 800,
        markers: [],
        markersJson: dataJson
    };


    handleChangeMarker = event => {
        this.setState({markers: event.target.value});
    };

    handleChangeMultiple = event => {
        const {options} = event.target;
        const value = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        this.setState({
            marker: value,
        });
    };

    handleChange = key => event => {
        this.setState({
            [key]: event.target.value,
        });
    }

    render() {
        return (
            <>
                {/* <Menu data={this.state}
                      handleChange={this.handleChange}
                      handleChangeSize={this.handleChangeSize}
                      handleChangeMultiple={this.handleChangeMultiple}
                      handleChangeMarker={this.handleChangeMarker}
                >

                </Menu> */}
                <Map
                    markers={this.state.markersJson}
                    googleApiKey={'AIzaSyDjhdwrruWxSovp9wvayv5zrMZNmNpl5W0'}
                    travelMode={this.state.travelMode}
                    // height={this.state.height}
                    // width={this.state.width}
                    language={this.state.language}
                />
            </>
        )
    }
}

export default App;

