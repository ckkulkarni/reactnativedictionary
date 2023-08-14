import Base from "../../Base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { loadFeature, defineFeature } from "jest-cucumber";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
const navigation = useNavigation<NativeStackNavigationProp<any>>();
jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: jest.fn().mockReturnValue({
      navigate: jest.fn(),
    }),
  };
});

const feature = loadFeature("Apps/features/base.feature");
defineFeature(feature, (test) => {
  test("The component renders and a random word is fetched", ({
    given,
    when,
    then,
    and,
  }) => {
    const screen = render(<Base />);
    given("The user is on the Home page", () => {
      expect(screen).toBeDefined();
    });
    when("The user inputs a word and submits it", async () => {
      const input = screen.getByTestId("word-input");
      const submitButton = screen.getByTestId("submit-button");

      fireEvent.changeText(input, "example");
      fireEvent.press(submitButton);

      const mockAxios = jest.spyOn(axios, "get");
      mockAxios.mockResolvedValueOnce({
        data: [
          {
            meanings: [
              {
                definitions: [
                  { definition: "a thing characteristic of its kind" },
                ],
              },
            ],
          },
        ],
      });

      // await waitFor(() => {
      //   expect(
      //     screen.getByText("a thing characteristic of its kind")
      //   ).toBeDefined();
      // });
    });
    then("the definition of the word is fetched and displayed", async () => {
      await waitFor(() => {
        expect(
          screen.getByText("a thing characteristic of its kind")
        ).toBeDefined();
      });
    });
    and(
      "clicking on the definition takes the user to the Details page for that word",
      async () => {
        const definitionBlock = screen.getByTestId("definition-block");
        fireEvent.press(definitionBlock);
        expect(navigation.navigate).toBeCalled();
      }
    );
  });
});
