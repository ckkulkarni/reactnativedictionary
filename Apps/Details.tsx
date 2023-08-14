import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";

import axios from "axios";
const Details = ({ route }: any) => {
  const [wordDetails, setWordDetails] = useState<any>(null);
  console.log(route);
  const word = route.params.word;
  const [sound, setSound] = useState<any>(null);
  useEffect(() => {
    const getWordDetails = async () => {
      try {
        const result = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );
        setWordDetails(result.data[0]);
      } catch (error) {
        Alert.alert("No details found.");
      }
    };

    getWordDetails();
  }, [word]);
  const playAudio = async (audioUrl: string) => {
    //console.log(audioUrl)
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: audioUrl,
    });
    setSound(newSound);
    await newSound.playAsync();
  };

  return (
    <View style={styles.container}>
      {wordDetails && (
        <ScrollView>
          <Text style={styles.wordHeading}>{wordDetails.word}</Text>
          {wordDetails.phonetics.map((phonetic: any, index: number) => (
            <View key={index} style={styles.phonetics}>
              <Text style={styles.phoneticText}>{phonetic.text}</Text>
              {phonetic.audio && (
                <TouchableOpacity
                  onPress={() => playAudio(phonetic.audio)}
                  style={styles.playButton}
                >
                  <Text style={styles.playButtonText}>Play Audio</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          {wordDetails.meanings.map((meaning: any, index: number) => (
            <View key={index} style={styles.meanings}>
              <Text style={styles.partOfSpeech}>{meaning.partOfSpeech}</Text>
              {meaning.definitions.map((definition: any, index: number) => (
                <View key={index} style={styles.defineWExample}>
                  <Text style={styles.definitionParagraph}>
                    {definition.definition}
                  </Text>
                  {definition.example && (
                    <Text style={styles.example}>
                      <Text style={styles.emText}>
                        Example: {definition.example}
                      </Text>
                    </Text>
                  )}
                  {definition.synonyms.length > 0 && (
                    <Text style={styles.synonyms}>
                      <Text style={styles.emText}>
                        Synonyms: {definition.synonyms.join(", ")}
                      </Text>
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  wordHeading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  phonetics: {
    marginBottom: 10,
  },
  phoneticText: {
    fontSize: 18,
  },
  meanings: {
    marginTop: 10,
  },
  partOfSpeech: {
    fontSize: 20,
    fontWeight: "bold",
  },
  defineWExample: {
    marginTop: 5,
  },
  definitionParagraph: {
    fontSize: 16,
  },
  example: {
    fontStyle: "italic",
  },
  synonyms: {
    fontStyle: "italic",
    color: "#555",
  },
  emText: {
    fontStyle: "italic",
    fontWeight: "bold",
  },
  playButton: {
    backgroundColor: "#3498db",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  playButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Details;
