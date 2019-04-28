// install the following to use checkbox
//npm install --save react-native-elements
       // https://react-native-training.github.io/react-native-elements/docs/getting_started.html
import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity,AsyncStorage,Image,ScrollView,FlatList} from 'react-native';
//import CheckBoxItem from './CheckBoxItem'
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
        error: null,
        userAllergens: 'en:nuts',
        img: null,
        name: null,
        params: this.props.navigation.state.params.info,
    };
    //console.log(this.props.navigation.state.params.info)
   }
    componentDidMount() { //will end up being componentWillMount (?)
     //let upc = this.state.params
     //let upc = '0038000359217' 
     var upc = this.state.params
     //console.log(this.state.params)
     this.setState({upcValue: upc });
     EdamamApi.fetchData(upc).then( (allergenList) => { 
      this.setState( {
        allergens: allergenList.labels,
      img: allergenList.img, 
        name: allergenList.name
      });
   });
  };

  //componenetDidMount(){
    //  this.getResults(this.props.params);
      //console.log(this.props.params)
  //}

   
    render() {
      return (
        <View style = { styles.container }> 
          <Text>UPC Code: { this.state.upcValue }</Text>
          <Text style = { styles.favtext}>{ this.state.name } </Text>
          <Image 
            source = {{ uri: 'https://static.openfoodfacts.org/images/products/003/800/035/9217/front_fr.11.400.jpg' }} 
            style = {{ height: 300, width: 500 }} />
          <Text>Allergens Found: SOYBEANS, MILK, WHEAT </Text>
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
       this.props.navigation.navigate('Result', { info: this.state.barcodeData})
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
    "name": 'Allergy1',
   },
   {
    "name": 'Allergy2',
   },
   {
    "name": 'Allergy3',
   },
   {
    "name": 'Allergy4',
   },
   {
    "name": 'Allergy5',
   },
   {
    "name": 'Allergy6',
   },
   {
    "name": 'Allergy7',
   },
   {
    "name": 'Allergy8',
   },
   {
    "name": 'Allergy9',
   },

   ],
   checked: [],
   
      
    }
  }
  componentDidMount() {
  let { data, checked } = this.state;
  let intialCheck = data.map(x => false);
  this.setState({ checked: intialCheck })
}
handleChange = (index) => {
  let checked = [...this.state.checked];
  checked[index] = !checked[index];
  this.setState({ checked });
  console.log(checked);
  AsyncStorage.setItem("myCheckBox", JSON.stringify(checked));
}

saveData(){

}
displayData = async () => {
  try{
    let data1 = await AsyncStorage.getItem("myCheckBox");
    let parsed = JSON.parse(data1);
    alert(parsed.name);
  }
  catch(error){
    alert(error);
  }
}
checkItem = (item) => {
    const { checked } = this.state;
    let newArr = [];

    if (!checked.includes(item)) {
        newArr = [...checked, item];
    } else {
      newArr = checked.filter(a => a !== item);
    }
    this.setState({ checked: newArr }, () => console.log('updated state', newArr))
};
combined(){
  handleChange(index)
  checkItem(item.name)
}
render() {
  let { data, checked } = this.state;
  return (
  <View>
    <FlatList
      data={data}
      extraData={this.state}
      renderItem={({ item, index }) =>
        <CheckBox
          
          title={item.name}
          onPress={() => this.handleChange(index) }
            onChange={() => this.checkItem(item.userid)}
          checked={checked[index]} />
      }
  
    />
  <Button
    title="Save"
    
    />
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