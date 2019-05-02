// JavaScript source code
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

class HomeScreen extends React.Component {
    static navigationptions = {
        title: 'Welcome',
    };

    render() {
        return (
            <View>
                <Text>Allerneeds</Text>
                <Button
                    onPress={() => this.props.navigation.navigate('Scanner')}
                    style={{ borderWidth: 1, borderColor: 'red' }}
                    title="Scanner" />
                <Button
                    onPress={() => this.props.navigation.navigate('History')}
                    style={{ borderWidth: 1, borderColor: 'red' }}
                    title="History" />
                <Button
                    onPress={() => this.props.navigation.navigate('Favorites')}
                    style={{ borderWidth: 1, borderColor: 'red' }}
                    title="Favorites" />
                <Button
                    onPress={() => this.props.navigation.navigate('Settings')}
                    style={{ borderWidth: 1, borderColor: 'red' }}
                    title="Settings" />
            </View>
        );
    }
}