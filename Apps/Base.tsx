import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Button,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function Base() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [word, setWord] = useState("");
  const [temp, setTemp] = useState<string>("");
  const [definitions, setDefinitions] = useState<any>([]);
  const mounted = useRef(false);

  useEffect(() => {
    const getWord = async () => {
      const result = await axios.get(
        "https://random-word-api.herokuapp.com/word"
      );
      setWord(result.data[0]);
    };

    if (!mounted.current) {
      getWord();
      mounted.current = true;
    }
  }, []);

  const getDefinition = async (wordToFetch: string) => {
    try {
      const result = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${wordToFetch}`
      );
      const meanings = result.data[0].meanings;
      const definitionsArray = meanings.map(
        (meaning: any) => meaning.definitions[0]?.definition || null
      );
      setDefinitions(
        definitionsArray.filter((definition: string) => definition !== null)
      );
    } catch (error) {
      Alert.alert("No definition found.");
      setDefinitions(["Enter a valid word."]);
    }
  };

  useEffect(() => {
    if (word !== "") {
      getDefinition(word);
    }
  }, [word]);

  const handleSubmit = () => {
    setWord(temp);
  };
  const handleNavigation = () => {
    navigation.navigate("Details", { word: word });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.definitionContainer}
        onPress={handleNavigation}
        testID="definition-block"
      >
        <Text style={styles.definitionTitle}>Word: {word}</Text>
        <ScrollView style={styles.definitionScrollView}>
          {definitions.map((definition: string, index: number) => (
            <Text key={index} style={styles.definitionText}>
              {definition}
            </Text>
          ))}
        </ScrollView>
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setTemp(text)}
          placeholder="Example: example"
          testID="word-input"
        />
        <Button title="Submit" onPress={handleSubmit} testID="submit-button" />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  definitionContainer: {
    backgroundColor: "#E48586",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  definitionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  definitionScrollView: {
    maxHeight: 200,
  },
  definitionText: {
    fontSize: 16,
    marginBottom: 8,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    width: "80%",
    marginVertical: 10,
    color: "black",
  },
});
