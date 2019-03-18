import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({
    button: {
        display: 'block',
        marginTop: theme.spacing.unit * 2,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    remove: {
        marginTop: -8,
        marginLeft: 6
    }
});


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

class Menu extends Component {

    render() {

        const {classes, handleChange, handleChangeMarker} = this.props;
        const {
            language,
            travelMode,
            height,
            width,
            markers,
            markersJson
        } = this.props.data;
        return (
            <form autoComplete="off">
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="language-select">Language</InputLabel>
                    <Select
                        value={language}
                        onChange={handleChange('language')}
                        inputProps={{
                            name: 'en',
                            id: 'language-select',
                        }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={'en'}>English</MenuItem>
                        <MenuItem value={'he'}>Hebrew</MenuItem>
                        <MenuItem value={'ru'}>Russian</MenuItem>
                    </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="travel-select">Travel Modes</InputLabel>
                    <Select
                        value={travelMode}
                        onChange={handleChange('travelMode')}
                        inputProps={{
                            name: 'DRIVING',
                            id: 'travel-select'
                        }}>
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={'DRIVING'}>DRIVING</MenuItem>
                        <MenuItem value={'WALKING'}>WALKING</MenuItem>
                        <MenuItem value={'BICYCLING'}>BICYCLING</MenuItem>
                        <MenuItem value={'TRANSIT'}>TRANSIT</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl && classes.remove } >
                    <TextField
                        id="map-height"
                        label="Height"
                        className={classes.textField}
                        value={height}
                        onChange={handleChange('height')}
                        margin="normal"
                        inputProps={{
                            name: 'height',
                            id: 'map-height'
                        }}
                    />
                </FormControl>
                <FormControl className={classes.formControl && classes.remove}>
                    <TextField
                        id="map-width"
                        label="Weight"
                        className={classes.textField}
                        value={width}
                        onChange={handleChange('width')}
                        margin="normal"
                        inputProps={{
                            name: 'width',
                            id: 'map-width'
                        }}
                    />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="select-multiple-checkbox">Markers</InputLabel>
                    <Select
                        multiple
                        value={markers}
                        onChange={handleChangeMarker}
                        input={<Input id="select-multiple-checkbox"/>}
                        renderValue={selected => selected.map(s => s.title).join(', ')}
                        MenuProps={MenuProps}
                    >
                        {markersJson.map((name, index) => (
                            <MenuItem key={index} value={name}>
                                <Checkbox checked={markers.indexOf(name) > -1}/>
                                <ListItemText primary={name.title}/>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </form>
        );
    }
}

Menu.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Menu);