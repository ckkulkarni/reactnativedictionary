import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import Base from "./Apps/Base";
import Details from "./Apps/Details";
function App(): JSX.Element {
  const stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen name="Home" component={Base} />
        <stack.Screen name="Details" component={Details} />
      </stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
