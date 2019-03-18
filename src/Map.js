import React, {Component} from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';

import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow,
    DirectionsRenderer,
    OverlayView
} from 'react-google-maps';

class MapContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLatitude: null,
            currentLongitude: null,
            currentMarker: null,
            showDirection: false,
            errorLocation: false,
            showErrorMsg: false,
            travelMode: props.travelMode
        };
    }

    componentDidMount() {
        this.getMyLocation();
    }

    errorLocationWindowClose = () => {
        this.setState({
            showErrorMsg: false
        })
    }
    toggle = () => {
        this.setState({
            currentMarker: null,
        })
    }
    createMarkers() {
        return this.props.markers.map((data, index) => {
            return (
            <>
            <MarkerStyle>
            <Marker className='marker' key={index} position={{lat: data.latitude, lng: data.longitude}} title={data.title}
                           onClick={this.handleMarkerClick(data)} icon={data.iconMarker}>
                {
                    this.state.currentMarker === data &&
                    <InfoWindow
                        onCloseClick={this.toggle}
                        position={new window.google.maps.LatLng(data.latitude, data.longitude)}
                    >
                        <Message data={data} myLocation={this.getMyLocation} createDirection={this.createDirection}/>
                    </InfoWindow>
                }
            </Marker>
            </MarkerStyle>
            </>)
        });
    }

    handleMarkerClick = (data) => {
        return () => {
            this.setState({
                currentMarker: data
            })
        }
    }
    getMyLocation = async () => {
        let permissions = await window.navigator.permissions.query({name: 'geolocation'});
        if (permissions.state === 'prompt' || permissions.state === 'granted') {
            window.navigator.geolocation.getCurrentPosition(async (showPosition) => {
                this.setState({
                    currentLatitude: showPosition.coords.latitude,
                    currentLongitude: showPosition.coords.longitude,
                    errorLocation: false
                });
            });
        } else if (permissions.state === 'denied') {
            this.setState({
                errorLocation: true
            })
        }
    }
    createDirection = () => {
        if (this.state.errorLocation) {
            this.setState({
                showErrorMsg: true
            })
        } else if (!this.state.errorLocation && this.state.currentLatitude && this.state.currentLongitude) {
            const DirectionsService = new window.google.maps.DirectionsService();

            DirectionsService.route({
                origin: new window.google.maps.LatLng(this.state.currentLatitude, this.state.currentLongitude),
                destination: new window.google.maps.LatLng(this.state.currentMarker.latitude, this.state.currentMarker.longitude),
                travelMode: window.google.maps.TravelMode[this.state.travelMode],
            }, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    this.setState({
                        directions: result,
                    });
                } else {
                    //console.error(`error fetching directions ${result}`);
                }
            });
        }
    }

    render() {
        return (
            <GoogleMap
                defaultCenter={{lat: 32.109333, lng: 34.855499}}
                defaultZoom={13}
                zoom={12}
            >
                {this.createMarkers()}
                {!this.state.errorLocation &&
                <ShowMyMarkerLocation lat={this.state.currentLatitude} lon={this.state.currentLongitude}/>}

                {
                this.createDirection &&
                this.state.directions &&
                <DirectionsRenderer directions={this.state.directions}/>
                }

                {
                    this.state.showErrorMsg &&
                    <OverlayView
                        position={{lat: this.state.currentMarker.latitude, lng: this.state.currentMarker.longitude}}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        getPixelPositionOffset={window.getPixelPositionOffset}
                    >
                        <ErrorLocationMsg>
                            <span>Please enable your geolocation</span>
                            <Button size="small" variant="contained" color="primary" className='btnOk' onClick={this.errorLocationWindowClose}>OK</Button>
                        </ErrorLocationMsg>
                    </OverlayView>
                }
            </GoogleMap>
        );
    }
}


const ShowMyMarkerLocation = (props) => {
    return (
        <>
            {
                props.lat && props.lon &&
                <Marker
                    position={{lat: props.lat, lng: props.lon}} title={'My Location'}
                    icon={'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'}
                >
                    <InfoWindow
                        position={new window.google.maps.LatLng(props.lat, props.lon)}
                    >
                        <div>My Location</div>
                    </InfoWindow>
                </Marker>
            }
        </>
    )
}

function Message(props) {
    return (
        <MessageStyle>
            {props.data.icon && <img className='image' src={props.data.icon} alt='logo'></img>}
            {props.data.title && <div className='title'>{props.data.title}</div>}
            {props.data.text && <div className='text'>{props.data.text}</div>}
            {props.data.address && <div className='address'>{props.data.address}</div>}
            {props.data.link && <div><a className='link' href={props.data.link}>קישור</a></div>}

            
            {/* <Button variant="contained" color="secondary" className='navigation'
                    onClick={() => window.open(`https://www.waze.com/ul?ll=${props.data.latitude}%2${props.data.longitude}&navigate=yes&zoom=16`, "_blank")}><span>Open in Waze</span></Button> */}
            <Button variant="contained" color="primary" className='navigation' onClick={props.createDirection}><span>נווט אותי
                לכאן</span></Button>
           
        </MessageStyle>
    );
}

function Map(props) {
    return (
        <GoogleMapExample
            language={props.language}
            travelMode={props.travelMode}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${props.googleApiKey}&language=${props.language}`}
            loadingElement={<div className={'loadingElement'} style={{height: `100%`}}/>}
            containerElement={<WrapperStyle height={props.height} width={props.width} className={'containerElement'}/>}
            mapElement={<MapStyle className={'mapElement'} language={props.language}/>}
            markers={props.markers}
        />
    )
}

const GoogleMapExample = withScriptjs(withGoogleMap(MapContent));


const MarkerStyle = styled.div`
    size: 100px;
    width: 100px;
    img{
        width: 1px;
    }
    .marker{
        width: 1px;
    }
`

const ErrorLocationMsg = styled.div`
direction:${props => props.language === 'he' ? 'rtl' : ''};
width: 200px;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
background: yellow;
padding: 6px;

.btnOk{
    margin: 3px 0;
    line-height: 0.75;
}
.btnOk:hover{
    background: green;
}
span{
    font-size: 14px;
}
`;

const MessageStyle = styled.div`
display: flex;
flex-direction: column;
text-align: center;

    .image {
        height: 50px
    }
    .title {
        padding: 2px 0;
    }
    .text{
        padding: 2px 0;
    }
    .address{
        padding: 2px 0;
    }
    .link{
        padding: 2px 0;
    }
    .navigation{
        display: flex;
        margin-top: 10px;
        line-height: 0.75;
    }
    .navigation:hover{
        background: green;
    }
    .navigation span{
        font-size: 15px;
    }
`;

const MapStyle = styled.div`
    direction:${props => props.language === 'he' ? 'rtl' : ''};
    position: absolute;
    height:  100%;
    width: 100%;
`;

const WrapperStyle = styled.div`
    position: relative;
    height: ${props => props.height ? props.height + 'px' : '100vh'};
    width: ${props => props.width ? props.width + 'px' : '100vw'};
`;


export default Map;
