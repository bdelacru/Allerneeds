// JavaScript source code
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

class HistoryScreen extends React.Component {
    render() {
        return (
            <View>
                <Button onPress={() => this.props.navigation.navigate('Home')}
                    style={{ borderWidth: 1, borderColor: 'red' }}
                    title="Home" />
            </View>
        );
    }
}