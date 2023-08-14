import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { loadFeature, defineFeature } from "jest-cucumber";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Details from "../../Details";
const navigation = useNavigation<NativeStackNavigationProp<any>>();
jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: jest.fn().mockReturnValue({
      navigate: jest.fn(),
    }),
  };
});
jest.mock("axios");
const feature = loadFeature("Apps/features/details.feature");

defineFeature(feature, (test) => {
  test("User views word details with phonetics and meanings", ({
    given,
    when,
    then,
  }) => {
    const mockRoute = { params: { word: { word: "example" } } };
    jest.spyOn(axios, "get").mockResolvedValueOnce({
      data: [
        {
          word: "example",
          phonetics: [
            {
              text: "/ɪɡˈzæmpəl/",
              audio: "example-audio.mp3",
            },
          ],
          meanings: [
            {
              partOfSpeech: "noun",
              definitions: [
                {
                  definition: "a representative form or pattern",
                  example: "I followed your example",
                  synonyms: ["model", "pattern", "prototype"],
                },
              ],
            },
          ],
        },
      ],
    });
    const screen = render(<Details route={mockRoute} />);

    given("The user is on the Details page", () => {
      expect(screen).toBeDefined();
    });

    then("The user views the details for a word", async () => {
      await waitFor(() => {
        expect(screen.getByText("example")).toBeDefined();
        expect(screen.getByText("/ɪɡˈzæmpəl/")).toBeDefined();
        expect(screen.getByText("noun")).toBeDefined();
        expect(
          screen.getByText("a representative form or pattern")
        ).toBeDefined();
        expect(
          screen.getByText("Example: I followed your example")
        ).toBeDefined();
        expect(
          screen.getByText("Synonyms: model, pattern, prototype")
        ).toBeDefined();
      });
    });
  });
});
