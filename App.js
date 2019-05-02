import React from 'react';

import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, Image, ScrollView, FlatList } from 'react-native';

import { createStackNavigator, createAppContainer } from 'react-navigation';

import { Constants } from 'expo';

import { BarCodeScanner, Permissions } from 'expo';

import EdamamApi from './Chomp_API';

import { CheckBox, Button } from 'react-native-elements';



class HomeScreen extends React.Component {

    render() {

        return (

            <View style={styles.container}>

                <Image style={{ width: 400, height: 240, position: 'absolute', top: 0, left: 10 }}

                    source={require('./allerneeds.jpg')} />

                <Text style={{ fontSize: 20, position: 'absolute', top: 225, left: 55 }}>  Touch Button to Scan Good! </Text>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('Scanner')}

                    style={styles.scanner}>

                    <Text style={styles.scannertext}>  Scanner </Text>

                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('History')}

                    style={styles.history}>

                    <Text style={styles.historytext}>  Terms and Agreements </Text>

                </TouchableOpacity >

                <Text style={{ fontSize: 20, position: 'absolute', top: 350, left: 55 }}>  Touch Button to Set Allergens! </Text>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings')}

                    style={styles.settings}>

                    <Text style={styles.settingstext}>  Allergens </Text>

                </TouchableOpacity >

            </View>

        );

    }

}



class ResultsPage extends React.Component {

    constructor(props) {

        super(props);

        this.state = {

            upcValue: null,

            allergens: [],

            allergenStr: "",

            error: null,

            status1: "",

            status2: "",

            found: false,

            img: null,

            name: null,

            params: this.props.navigation.state.params.info,

            allerParams: this.props.navigation.state.params.allergenOptions,



        };

    }

    componentDidMount() { //will end up being componentWillMount (?)



        var upc = this.state.params

        this.setState({ upcValue: upc });

        EdamamApi.fetchData(upc).then((allergenList) => {

            this.setState({

                allergens: allergenList.labels,

                img: allergenList.img,

                name: allergenList.name

            });

        });

    }



    displayData = async () => {

        try {

            let data1 = await AsyncStorage.getItem("myCheckBox");

            let parsed = JSON.parse(data1).toString().toUpperCase().split(","); // what is allergic to, string

            let temp = this.state.allergens.toString().split("en:").join(" ").toUpperCase(); //what is in food, array

            console.log(temp)

            for (index = 0; index < parsed.length; index++) {

                if (temp.includes(parsed[index])) {

                    this.setState({

                        status1: "Match Found",

                        status2: "WARNING: DO NOT CONSUME",

                        found: true,

                    });

                };

            }

            if (this.state.found === false) {

                this.setState({

                    status1: "Safe to Consume",

                    status2: "Enjoy!"

                });

            }

        }

        catch (error) {

            alert(error);

        }

    }



    //componenetDidMount(){

    //  this.getResults(this.props.params);

    //console.log(this.props.params)

    //}



    render() {



        return (

            <View style={{

                flex: 1,

                flexDirection: 'column',

                justifyContent: 'center',
            }}

            >

                <View style={{ flex: 0.8, borderColor: 'lightgrey', borderWidth: 5, margin: 10, alignItems: 'center', paddingTop: 20 }}>

                    <Text style={[this.state.found === true ? styles.allergenWarning : styles.allergenSafe]}> {this.state.status1} </Text>

                    <Text style={[this.state.found === true ? styles.allergenWarning2 : styles.allergenSafe2]}> {this.state.status2} </Text>

                </View>

                <View style={{ flex: 0.8, borderColor: 'lightgrey', borderWidth: 5, margin: 10, paddingTop: 10, paddingLeft: 10 }}>

                    <Text style={styles.prodtext}>Product Found: </Text>

                    <Text style={styles.favtext}>{this.state.name} </Text>

                    <Text>UPC Code: {this.state.upcValue}</Text>

                </View>

                <View style={{ flex: 0.8, backgroundColor: 'lightgrey', margin: 10, paddingTop: 10, paddingLeft: 10 }}>

                    <Text style={styles.prodtext}>Allergens Found: {this.state.allergens.toString().split("en:").join(' ')}</Text>

                </View>

                <View style={{ flex: 0.8, margin: 20 }}>

                    <Button title="Generate Allergy Results" onPress={() => this.displayData()} />

                </View>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}



                    style={styles.home}



                >

                    <Text> Home </Text>

                </TouchableOpacity>

            </View>

        )

    };

}



class ScanScreen extends React.Component {

    constructor(props) {

        super(props);

        this.state = {

            hasCameraPermission: null,

            barcodeData: "",

        };

    }



    async componentDidMount() {

        const { status } = await Permissions.askAsync(Permissions.CAMERA);

        this.setState({ hasCameraPermission: status === 'granted' });

    }



    render() {

        const { navigation } = this.props;

        const { hasCameraPermission } = this.state;



        if (this.state.hasCameraPermission === null) {

            return <Text>Requesting for camera permission</Text>;

        }

        if (hasCameraPermission === false) {

            return <Text>No access to camera</Text>;

        }



        return (



            <View style={styles.container}>



                <BarCodeScanner

                    onBarCodeScanned={this.handleBarCodeScanned}

                    style={StyleSheet.absoluteFill}

                />



                <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}



                    style={styles.home}



                >

                    <Text> Home </Text>

                </TouchableOpacity>



            </View>



        );



    }

    handleBarCodeScanned = ({ data }) => {

        this.setState({ barcodeData: data });

        setTimeout(() => this.props.navigation.navigate('Result', { info: this.state.barcodeData }))

    };

}







class HisScreen extends React.Component {

    render() {

        return (

            <View style={styles.container}>

                <Text style={{ fontSize: 20, position: 'absolute', top: 225, left: 10 }}>Note AllerNeeds is not responsible for any allergic reactions or payments related to allergic reactions. The app is used for the purpose of helping users take cautionary steps in safe shopping for food products with allergens they have. </Text>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}



                    style={styles.home}



                >

                    <Text>Home</Text>

                </TouchableOpacity>


            </View>

        );

    }

}



class SettingsScreen extends React.Component {



    constructor() {

        super();

        this.state = {

            data: [

                {

                    "name": 'Milk',

                },

                {

                    "name": 'Eggs',

                },

                {

                    "name": 'Soybeans',

                },

                {

                    "name": 'Peanuts',

                },

                {

                    "name": 'Tree nuts',

                },

                {

                    "name": 'Gluten',

                },

                {

                    "name": 'Wheat',

                },







            ],

            checked: [],

            allerArr: [],

            storedValue: '',



        }



    }

    componentDidMount() {

        let intialCheck = this.state.data.map(x => false);

        this.setState({ checked: intialCheck })



    }



    checkItem = (item) => {

        const { checked } = this.state;

        const { allerArr } = this.state;



        let newArr = [];

        let tmp = this.state.allerArr;

        let index;



        if (!checked.includes(item)) {

            newArr = [...checked, item];



            tmp.push(item);

            this.setState({ allerArr: tmp });



        } else {

            newArr = checked.filter(a => a !== item);



            index = tmp.indexOf(item);

            if (index > -1) {

                tmp.splice(index, 1);

                this.setState({ allerArr: tmp })

            }



        }

        this.setState({ checked: newArr })

        //console.log('update allergens list: ',allerArr)

    };



    saveData = async (val) => {

        try {

            const arrayString = JSON.stringify(val)

            AsyncStorage.setItem("myCheckBox", arrayString);

            //console.log("Item saved!");





        } catch (error) {

            alert(error);

        }



    };

    displayData = async () => {

        try {

            let data1 = await AsyncStorage.getItem("myCheckBox");

            let parsed = JSON.parse(data1);

            alert(parsed);

        }

        catch (error) {

            alert(error);

        }

    }





    render() {

        let { checked } = this.state;



        return (

            <View>

                <FlatList

                    style={styles.allergenlist}

                    data={this.state.data}

                    extraData={this.state}

                    renderItem={({ item }) =>

                        <CheckBox

                            title={item.name}

                            onPress={() => this.checkItem(item.name)}

                            checked={this.state.checked.includes(item.name)} />

                    }



                />

                <Button

                    title="Save" onPress={() => this.saveData(this.state.allerArr)} style={styles.allergenButton} />



            </View>



        );

    }

}

class FavScreen extends React.Component {

    render() {

        return (

            <View style={styles.container}>

                <Text style={styles.favText}> Favorites </Text>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}



                    style={styles.home}



                >

                    <Text>Home</Text>

                </TouchableOpacity>

            </View>

        );

    }

}



const MainNavigator = createStackNavigator({

    Home: HomeScreen,

    Scanner: ScanScreen,

    Result: ResultsPage,

    History: HisScreen,

    Favorites: FavScreen,

    Settings: SettingsScreen,

}

);



const AppContainer = createAppContainer(MainNavigator);



export default class App extends React.Component {

    constructor(props) {

        super(props);

    }



    render() {

        return <AppContainer />;

    }

}





const styles = StyleSheet.create({

    allergenWarning: {

        fontSize: 50,

        color: 'red',

        flexWrap: 'wrap',

    },

    allergenSafe: {

        fontSize: 40,

        color: 'green',

        flexWrap: 'wrap',

    },

    allergenWarning2: {

        fontSize: 22,

        color: 'red',

        flexWrap: 'wrap',

    },

    allergenSafe2: {

        fontSize: 22,

        color: 'green',

        flexWrap: 'wrap',

    },

    container: {

        flex: 1,

        backgroundColor: 'white',

        alignItems: 'center',

        justifyContent: 'center',

    },

    test: {

        flex: 1,

        justifyContent: 'center',

        paddingTop: Constants.statusBarHeight,

        backgroundColor: '#ecf0f1',

        padding: 8,

    },

    titletext: {

        alignItems: 'center',

        justifyContent: 'center',

        fontSize: 30,

        position: 'absolute',

        top: 30,

        left: -5,

    },

    favtitle:

    {

        textAlign: 'center',

        fontSize: 30,

        position: 'absolute',

    },

    historytitle:

    {

        alignItems: 'center',

        justifyContent: 'center',

        fontSize: 30,

        position: 'absolute',

        top: 30,

        left: 105,

    },

    settingtitle:

    {

        alignItems: 'center',

        justifyContent: 'center',

        fontSize: 30,

        position: 'absolute',

        top: 30,

        left: 90,

    },

    prodtext: {

        fontSize: 15

    },

    favtext:

    {

        //vrticalalign: 'texttop',

        fontSize: 20,

        flexWrap: 'wrap',

    },

    scannertext:

    {

        //verticalalign: 'texttop',

        alignItems: 'center',

        justifyContent: 'center',

        fontSize: 30,

    },

    historytext:

    {

        //verticalalign: 'texttop',

        alignItems: 'center',

        justifyContent: 'center',

        fontSize: 30,

    },

    settingstext:

    {

        //verticlalign: 'texttop',

        alignItems: 'center',

        justifyContent: 'center',

        fontSize: 30,

    },

    fav:

    {

        backgroundColor: "#ffff66",

        alignItems: 'center',

        padding: 15,

        position: 'absolute',

        top: 140,

        left: 80,

    },

    scanner:

    {

        backgroundColor: "#DCDCDC",

        alignItems: 'center',

        padding: 15,

        position: 'absolute',

        top: 260,

        left: 112,

        borderColor: "black",

        borderRadius: 25,

    },

    history:

    {

        backgroundColor: "#DCDCDC",

        alignItems: 'center',

        padding: 15,

        position: 'absolute',

        bottom: 40,

        left: 15,

        borderColor: "black",

        borderRadius: 25,

    },

    settings:

    {

        backgroundColor: "#DCDCDC",

        alignItems: 'center',

        padding: 15,

        position: 'absolute',

        bottom: 150,

        left: 105,

        borderColor: "#000000",

        borderRadius: 25,

    },

    home:

    {

        backgroundColor: "#DCDCDC",

        alignItems: 'center',

        padding: 15,

        position: 'absolute',

        bottom: 30,

        left: 155,

        borderRadius: 25,

    },

    resultbutton:

    {

        backgroundColor: "#DCDCDC",

        alignItems: 'center',

        padding: 15,

        position: 'absolute',

        borderRadius: 25,

    },

    allergenlist: {

        margin: 10,

    },

});