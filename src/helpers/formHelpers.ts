import uniq from "lodash/uniq";
import { EnumerationDoc, FIELD_TYPE } from "../types";
import { regExps } from "./commonHelpers";
import { patterns } from "./projectHelpers";

export const registerOptions = {
  enumerationForm: {
    name: (existingEnumerations: EnumerationDoc[]) => ({
      required: "Enumeration name is required.",
      maxLength: {
        value: 40,
        message: "Enumeration name is too long.",
      },
      validate: (data: string) => {
        const isDup = existingEnumerations.some((item) => item.name === data);
        return isDup ? "Enumeration name is duplicated." : true;
      },
      pattern: patterns.wordsWithNoSpace,
    }),
    itemInput: (fieldType: FIELD_TYPE, items: string[]) => ({
      maxLength: {
        value: 100,
        message: "Values are too long.",
      },
      validate: {
        pattern: (value: any) => {
          if (fieldType === FIELD_TYPE.STRING) {
            return (
              regExps.enumValue.string.test(value) || "Not allowed character is included."
            );
          } else if (fieldType === FIELD_TYPE.INTEGER) {
            return regExps.enumValue.integer.test(value) || "Only integers are allowed.";
          } else if (fieldType === FIELD_TYPE.NUMBER) {
            return !isNaN(Number(value)) || "Only numbers are allowed.";
          }
        },
        exclusive: (value: string) => {
          return !items.includes(value) || "The same item exists already.";
        },
      },
    }),
    items: (fieldType: FIELD_TYPE) => ({
      required: "Values are required.",
      maxLength: {
        value: 500,
        message: "Values are too long.",
      },
      validate: {
        pattern: (value: any) => {
          if (fieldType === FIELD_TYPE.STRING) {
            return (
              regExps.enumValues.string.test(value) ||
              "Try a mix of letters, numbers or special characters, separate values with comma."
            );
          } else if (fieldType === FIELD_TYPE.INTEGER) {
            return (
              regExps.enumValues.integer.test(value) ||
              "Only numbers are allowed, separate values with comma."
            );
          } else {
            return true;
          }
        },
        exclusive: (value: string) => {
          const splitValues = value.split(",");
          let isExclusive = uniq(splitValues).length === splitValues.length;
          return !isExclusive ? "Each values must not be the same." : true;
        },
      },
    }),
    description: {
      maxLength: {
        value: 80,
        message: "Description is too long.",
      },
    },
  },
};
