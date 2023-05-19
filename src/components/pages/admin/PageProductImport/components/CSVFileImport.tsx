import React from "react";
import axios, { AxiosError } from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    if (!file) return;

    console.log("UploadFile to: ", url);

    const token = localStorage.getItem("authorization_token") || "";
    const encodedToken = btoa(token);

    const headers = token ? { Authorization: `Basic ${encodedToken}` } : {};

    try {
      const response = await axios({
        method: "GET",
        url,
        headers,
        params: {
          name: encodeURIComponent(file.name),
        },
      });

      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", response.data.uploadUrl);

      const result = await fetch(response.data.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/csv",
        },
        body: file,
      });

      console.log("Result: ", result);

      setFile(undefined);
    } catch (err) {
      if (err instanceof AxiosError) {
        const { code, message } = err;
        window.alert(`${code}: ${message}`);
      } else {
        throw err;
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
