import React from "react";
import { useRef, useState} from "react";
import LetterSquare from "./driver/LetterSquare";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import LinearProgressWithLabel from "./components/LinearProgressWithLabel";

function App() {
  const defaultFields = {
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
    9: "",
    10: "",
    11: "",
  };

  const [fields, setFields] = useState<{ [key: number]: string }>(
    defaultFields
  );
  const [solving, setSolving] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const [visualize, setVisualize] = useState(false);
  const [progress, setProgress] = React.useState(0);
  const [isSuccess, setIsSuccess] = React.useState(true);
  const inputRefs = useRef<Array<HTMLDivElement | null>>([]);
  const delay = 5;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-z]/gi, "");
    const name = e.target.name;
    setFields({ ...fields, [name]: value.toUpperCase() });
    const nextInput = inputRefs.current[parseInt(name) + 1];
    if (nextInput != null && value !== "") {
      nextInput.querySelector("input")?.focus();
    }
  };

  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (e.key === "Backspace" && target.value === "") {
      const prevInput = inputRefs.current[parseInt(target.name) - 1];
      prevInput?.querySelector("input")?.focus();
    }
  };

  const resetFields = () => {
    setFields(defaultFields);
    setSolving(false);
    setWords([]);
    setProgress(0);
    setIsSuccess(true);
  };

  const isFilled = (fields: Record<number, string>) => {
    return !Object.values(fields).includes("");
  };

  const groupLetters = (arr: string[]) => {
    const res: string[] = [];
    let string = "";
    let i = 0;

    while (i < arr.length) {
      for (let j = 0; j < 3; j++) {
        string += arr[i];
        i++;
      }
      res.push(string);
      string = "";
    }

    return res;
  };

  const showProgress = async (progressArr: string[][]) => {
    setProgress(0);

    if (progressArr.at(-1)![0] === "fail") {
      setIsSuccess(false);
    } else {
      setIsSuccess(true);
    }

    if (visualize) {
      for (const state of progressArr.slice(0, -1)) {
        setWords(state);
        setProgress((prevState) => prevState + (1 / progressArr.length) * 100);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } else {
      setWords(progressArr.at(-2)!);
    }

    setSolving(false);
  };

  const handleClick = () => {
    if (isFilled(fields)) {
      setSolving(true);
      const input = groupLetters(Object.values(fields));
      console.log(`input: ${input}`);
      try {
        const progress = new LetterSquare(input).solve();
        console.log(progress.at(-1));
        showProgress(progress);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCBChange = () => {
    setVisualize((prevState) => !prevState);
  };

  return (
    <>
      {/* TODO: Only allow user to type alphabets */}
      <Stack direction="row" spacing={2}>
        {Object.entries(fields).map(([key, value], index) => {
          return (
            <TextField
              sx={{ width: "5em" }}
              key={key}
              inputProps={{
                inputMode: "text",
                pattern: "[a-zA-Z]+",
                maxLength: 1,
              }}
              name={key}
              ref={(el) => (inputRefs.current[index] = el)}
              value={value}
              onChange={handleChange}
              onKeyDown={handleBackspace}
              disabled={solving}
            />
          );
        })}
      </Stack>
      <LoadingButton loading={solving} variant="outlined" onClick={handleClick}>
        Solve
      </LoadingButton>
      <Button color="error" variant="outlined" onClick={resetFields}>
        Reset
      </Button>
      <FormControlLabel
        control={<Checkbox checked={visualize} onChange={handleCBChange} />}
        label="Visualize"
      />
      <LinearProgressWithLabel value={progress} />
      {words?.map((word, index) => (
        <p key={index}>{word}</p>
      ))}
      {!solving && !isSuccess && (
        <h1>No solution found using up to {LetterSquare.MOST_WORDS} words</h1>
      )}
    </>
  );
}

export default App;