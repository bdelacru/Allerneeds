import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity,AsyncStorage,Image,ScrollView,FlatList} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Constants } from 'expo';
import { BarCodeScanner, Permissions } from 'expo';
import EdamamApi from './Chomp_API';
import { CheckBox, Button } from 'react-native-elements';

class HomeScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titletext}>  Home Screen </Text>
                <TouchableOpacity
                    style={styles.fav}
                    onPress={() => this.props.navigation.navigate('Favorites')}
                >
                    <Text style={styles.favtext}>  Favorites </Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => this.props.navigation.navigate('Scanner')}
                    style={styles.scanner}>
                    <Text style={styles.scannertext}>  Scanner </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('History')}
                    style={styles.history}>
                    <Text style={styles.historytext}>  History </Text>
                   </TouchableOpacity >
                       <TouchableOpacity  onPress={() => this.props.navigation.navigate('Settings')}
                    style={styles.settings}>
                    <Text style={styles.settingstext}>  Allergens </Text>
                    </TouchableOpacity >
            </View>
        );
    }
}

class ResultsPage extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        upcValue: null,
        allergens: [],
        allergenStr: "",
        error: null,
        status1: "",
        status2: "",
        img: null,
        name: null,
        params: this.props.navigation.state.params.info,
        allerParams: this.props.navigation.state.params.allergenOptions,
        
    };
   }
    componentDidMount() { //will end up being componentWillMount (?)

     var upc = this.state.params
     this.setState({upcValue: upc });
     EdamamApi.fetchData(upc).then( (allergenList) => { 
      this.setState( {
        allergens: allergenList.labels,
        img: allergenList.img, 
        name: allergenList.name
      });
   });
}
  
    displayData= async() => {
    try{
        let data1 = await AsyncStorage.getItem("myCheckBox");
        let parsed = JSON.parse(data1).toString().toUpperCase().split(","); // what is allergic to, string
        let temp = this.state.allergens.toString().split("en:").join(" ").toUpperCase(); //what is in food, array
        console.log(temp)
        for (index = 0; index < parsed.length; index++){
            if (temp.includes(parsed[index])){
                this.setState({
                    status1: "Allergen Match Found",
                    status2: "WARNING: DO NOT CONSUME"
                });
        };
        }
    }
    catch(error){
        alert(error);
    }
}

  //componenetDidMount(){
    //  this.getResults(this.props.params);
      //console.log(this.props.params)
  //}

    render() { 

      return (
        <View style = { styles.container }> 
          <Text style={ styles.favtext }> { this.state.status1 } </Text>
          <Text style={ styles.favtext }> { this.state.status2 } </Text>
          <Text>UPC Code: { this.state.upcValue }</Text>
          <Text style = { styles.favtext}>{ this.state.name } </Text>
          <Text>Allergens Found: { this.state.allergens.toString().split("en:").join(' ') }</Text>
          <Button title="Generate Allergy Results" onPress ={() => this.displayData()}/>
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
      
       setTimeout(() => this.props.navigation.navigate('Result', { info: this.state.barcodeData}),20);
    };
}

 

class HisScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.historytitle}>History </Text>
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
    this.state={
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
        this.setState({allerArr:tmp});
           
    } else {
      newArr = checked.filter(a => a !== item);
   
    index = tmp.indexOf(item);
    if (index>-1){
        tmp.splice(index, 1);
        this.setState({ allerArr: tmp })
    }
   
    }
    this.setState({ checked: newArr })
    
};

saveData= async (val) => {
 try{
   const arrayString = JSON.stringify(val)
    AsyncStorage.setItem("myCheckBox", arrayString);
    //console.log("Item saved!");
 

 }catch(error){
  alert(error);
 }

};


render() {
  let { checked } = this.state;

  return (
  <View>
      <FlatList
      data={this.state.data}
      extraData={this.state}
      renderItem={({ item }) =>
        <CheckBox        
          title={item.name}
          onPress={() => this.checkItem(item.name)}
          checked={this.state.checked.includes(item.name)}/>
      }
  
    />
  <Button
    title="Save" onPress ={() => this.saveData(this.state.allerArr)}
    
    
    />
      <Button
    title="View" onPress ={() => this.displayData()}
    
    
    />
    <Text> allerArr is {JSON.stringify(this.state.allerArr)} </Text>

</View>

  );
}
 }
class FavScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style = {styles.favText}> Favorites </Text>
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
    Favorites: FavScreen ,
    Settings:SettingsScreen ,
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
    container: {
    flex: 1,
    backgroundColor: 'lightblue',
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
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 30,
        position: 'absolute',
        top: 30,
        left: 65,
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
    favtext:
    {
        //verticalalign: 'texttop',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 30,
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
        //verticalalign: 'texttop',
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
        backgroundColor: "#ff3333",
        alignItems: 'center',
        padding: 15,
        position: 'absolute',
        top: 250,
        left: 80,
    },
    history:
    {
        backgroundColor: "#99ff99",
        alignItems: 'center',
        padding: 15,
        position: 'absolute',
        bottom: 150,
        left: 80,
    },
    settings:
    {
        backgroundColor: "#a6a6a6",
        alignItems: 'center',
        padding: 15,
        position: 'absolute',
        bottom: 40,
        left: 80,
    },
    home:
    {
        backgroundColor: "white",
        alignItems: 'center',
        padding: 15,
        position: 'absolute',
        bottom: 40,
        left: 155,
    }
});