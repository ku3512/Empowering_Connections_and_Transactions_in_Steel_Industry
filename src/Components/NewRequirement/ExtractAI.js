import React, { useState } from "react";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import CircularProgress from "@mui/material/CircularProgress";

const useStyles = makeStyles({
  container: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1px",
    margin: "94px",
    "@media (min-width: 600px)": {
      gridTemplateColumns: "1fr 1fr",
    },
  },
  leftContainer: {
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    maxWidth: "600px",
  },
  rightContainer: {
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    maxWidth: "700px",
    width: "150%",
    "@media (min-width: 600px)": {
      width: "auto",
    },
  },
  label: {
    marginBottom: "8px",
  },
  select: {
    padding: "8px",
    marginBottom: "16px",
    width: "100%",
    "@media (min-width: 600px)": {
      width: "140%",
    },
  },
  input: {
    padding: "8px",
    marginBottom: "16px",
    width: "100%",
    "@media (min-width: 600px)": {
      width: "140%",
    },
  },
  button: {
    padding: "8px",
    marginBottom: "16px",
    width: "100%",
    backgroundColor: "green",
    color: "white",
    borderRadius: "7px",
    
  },
  textarea: {
    padding: "8px",
    width: "140%",
    height: "300px",
    resize: "none",
    whiteSpace: "pre-wrap",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "300px",
  },
});

const DataExtractorAI = () => {
  const classes = useStyles();
  const [itemType, setItemType] = useState("");
  const [description, setDescription] = useState("");
  const [extractedInfo, setExtractedInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleItemTypeChange = (e) => {
    const selectedItemType = e.target.value;
    setItemType(selectedItemType);

    let updatedPrompt = "";
    switch (selectedItemType) {
      case "Sheet/Plate":
        updatedPrompt = `Parse the given phrase for Sheet/Plate and extract the following values as key-value pairs in JSON format: Grade, Type-NB/OD, Type-ERW/SEAMLESS, Diameter, Size, Thickness, Length, Finish, Make, Quantity. The diameter will be included in JSON if it's round sheets and Size if the sheets are square. Take the default quantity value as "1 No" if not extracted from the phrase. The value of thickness needs to be calculated if OD and ID are provided in the phrase. Take the default length value as "6 MTR" if no length value is found in the phrase. Take the default value of the key "Type" as "ERW" if no type value is found in the phrase. If any values are missing in the phrase, include their keys with no values. Ignore the presence of words like "SS" or "steel" at the beginning, end, or in between the phrase. Need JSON in the response.`;
        break;
      case "Pipe":
        updatedPrompt = `Parse the given phrase for Pipe and extract the following values as key-value pairs in JSON format: Grade, Type-NB/OD, Type-ERW/SEAMLESS, Diameter, Size, Thickness, Length, Finish, Make, Quantity. The diameter will be included in JSON if it's round pipes and Size if the pipes are square. Take the default quantity value as "1 No" if not extracted from the phrase. The value of thickness needs to be calculated if OD and ID are provided in the phrase. Take the default length value as "6 MTR" if no length value is found in the phrase. Take the default value of the key "Type" as "ERW" if no type value is found in the phrase. If any values are missing in the phrase, include their keys with no values. Ignore the presence of words like "SS" or "steel" at the beginning, end, or in between the phrase. Need JSON in the response.`;
        break;
      case "Flat/Angle":
        updatedPrompt = `Parse the given phrase for Flat/Angle and extract the following values as key-value pairs in JSON format: Grade, Type, Size, Thickness, Length, Finish, Make, Quantity. Take the default quantity value as "1 No" if not extracted from the phrase. Take the default length value as "6 MTR" if no length value is found in the phrase. If any values are missing in the phrase, include their keys with no values. Ignore the presence of words like "SS" or "steel" at the beginning, end, or in between the phrase. Need JSON in the response.`;
        break;
      case "Rod":
        updatedPrompt = `Parse the given phrase for Rod and extract the following values as key-value pairs in JSON format: Grade, Diameter, Length, Finish, Make, Quantity. Take the default quantity value as "1 No" if not extracted from the phrase. If any values are missing in the phrase, include their keys with no values. Ignore the presence of words like "SS" or "steel" at the beginning, end, or in between the phrase. Need JSON in the response.`;
        break;
      case "Wire":
        updatedPrompt = `Parse the given phrase for Wire and extract the following values as key-value pairs in JSON format: Grade, Diameter, Length, Finish, Make, Quantity. Take the default quantity value as "1 No" if not extracted from the phrase. If any values are missing in the phrase, include their keys with no values. Ignore the presence of words like "SS" or "steel" at the beginning, end, or in between the phrase. Need JSON in the response.`;
        break;
      default:
        break;
    }

    setPrompt(updatedPrompt);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const fetchOpenAI = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://api.openai.com/v1/engines/text-davinci-003/completions",
        {
          prompt,
          max_tokens: 2000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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", // Replace with your OpenAI API key
          },
        }
      );

      const extracted = response.data.choices[0].text;
      const extractedObject = JSON.parse(extracted);
      setExtractedInfo(JSON.stringify(extractedObject, null, 2));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExtractClick = () => {
    fetchOpenAI();
  };

  return (
    <div className={classes.container}>
      <div className={classes.leftContainer}>
        <label htmlFor="itemType" className={classes.label}>
          Item Type:
        </label>
        <select
          id="itemType"
          value={itemType}
          onChange={handleItemTypeChange}
          className={classes.select}
        >
          <option value="">Select an item type</option>
          <option value="Sheet/Plate">Sheet/Plate</option>
          <option value="Pipe">Pipe</option>
          <option value="Flat/Angle">Flat/Angle</option>
          <option value="Rod">Rod</option>
          <option value="Wire">Wire</option>
        </select>

        <label htmlFor="description" className={classes.label}>
          Description:
        </label>
        <input
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          className={classes.input}
        />

        <button onClick={handleExtractClick} className={classes.button}>
          Extract Information
        </button>

        {loading ? (
          <div className={classes.loader}>
            <CircularProgress />
          </div>
        ) : (
          <textarea readOnly value={extractedInfo} className={classes.textarea} />
        )}
      </div>

      <div className={classes.rightContainer}>
        <label htmlFor="prompt" className={classes.label}>
          Prompt:
        </label>
        <textarea
          id="prompt"
          style={{ width: "500px", height: "360px" }}
          value={prompt}
          onChange={handlePromptChange}
          className={classes.textarea}
          disabled
        />
      </div>
    </div>
  );
};

export default DataExtractorAI;