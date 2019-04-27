import React, { Component} from 'react'
import { View, Text } from 'react-native'
import { CheckBox } from 'react-native-elements'

class CheckBoxItem extends Component<Props> {
  state = {
    check: false,
  }

  onValueChange = () => {
    // toggle the state of the checkbox
    this.setState(previous => {
      return  { check: !previous.check }
    }, () => this.props.onUpdate()); 
    // once the state has been updated call the onUpdate function
    // which will update the selectedBoxes array in the parent componetn
  } 

  render() {
    return (
      <View>
        <CheckBox 
          title={this.props.label}
          checked={this.state.check} 
          onPress={this.onValueChange} 
        />
      </View>
    );
  }
}

export default CheckBoxItem;