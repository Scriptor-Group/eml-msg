import React, { useRef, useCallback } from "react";
import Head from "next/head";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Link from "../components/Link";
import { styled } from "@mui/material";
import { useDropzone } from "react-dropzone";
import EmlParser from "eml-parser";

const Root = styled("div")(({ theme }) => {
  return {
    margin: 0,
    padding: 20,
    background: `linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)`,
    height: "100vh",
    color: "white",
  };
});

const Dropzone = styled("div")(({ theme }) => {
  return {
    border: "2px dashed white",
    borderRadius: "22px",
    textAlign: "center",
    height: "calc(100vh - 40px)",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
});

function Home() {
  const ref = useRef();
  const [html, setHtml] = React.useState("");
  const onDrop = useCallback((acceptedFiles) => {
    for (const file of acceptedFiles) {
      if (file.name.endsWith(".eml")) {
        fetch("/api/convert", {
          method: "POST",
          body: acceptedFiles[0],
        })
          .then((res) => res.text())
          .then((data) => {
            setHtml(data);
          });
      } else if (file.name.endsWith(".msg")) {
        var fileReader = new FileReader();
        fileReader.onload = function (evt) {
          var buffer = evt.target.result;
          // @ts-ignore
          var msgReader = new MSGReader(buffer);
          var fileData = msgReader.getFileData();
          if (!fileData.error) {
            setHtml(
              `<div>Subject: ${fileData.subject?.replace(
                "\n",
                "<br />"
              )}</div><div>${fileData.bodyHTML?.replace(
                /(\r\n|\n|\r)/gm,
                "<br />"
              )}</div><div>BODY: ${fileData.body?.replace(
                /(\r\n|\n|\r)/gm,
                "<br />"
              )}</div>`
            );
          }
        };
        fileReader.readAsArrayBuffer(file);
      }
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <React.Fragment>
      <Head>
        <title>EML – Converter (By Scriptor-artis)</title>
      </Head>
      <Root>
        <div>
          {!html && (
            <Dropzone {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Déposez votre .eml / .msg</p>
              ) : (
                <p>Glissez votre .eml / .msg</p>
              )}
            </Dropzone>
          )}
          {!!html && (
            <div style={{ overflow: "auto", height: "calc(100vh - 40px)" }}>
              <Button variant="contained" onClick={() => setHtml("")}>
                Retour
              </Button>
              <div style={{ marginTop: "8px" }} />
              <div dangerouslySetInnerHTML={{ __html: html }}></div>
            </div>
          )}
        </div>
      </Root>
    </React.Fragment>
  );
}

export default Home;
