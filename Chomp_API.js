import React, { Component } from 'react';

import { StyleSheet, Text, View, Button } from 'react-native';

//import { createStackNavigator, createAppContainer } from 'react-navigation';



// Set API call URL.

function upcUrl(upc) {

    return 'https://world.openfoodfacts.org/api/v0/product/' + upc + '.json';

}



function fetchData(upc) {



    return fetch(upcUrl(upc))

        .then(response => response.json())

        .then(responseJSON => {

            console.log(responseJSON.product.allergens_tags)

            //console.log(responseJSON.product.selected_images.front.display.fr)

            console.log(responseJSON.product.product_name)

            return {

                labels: responseJSON.product.allergens_tags,

                // img: responseJSON.product.selected_images.front.display.fr,

                name: responseJSON.product.product_name,

            };



        })



        .catch((error) => {

            console.error(error);

        });

}



export default { fetchData: fetchData };
