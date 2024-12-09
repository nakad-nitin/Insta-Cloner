/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import addExifMetadataToImage from "./InstaScraper/addExifData";
import downloadFilesAsZip from "./InstaScraper/downloadAsZip";
import moment from "moment";

export let filesToDownload: File[] = [];
let filesToDownObj: Record<string, File> = {};

let constantPayload: ConstantPayload = {} as any;
let variablePayload: VariablePayload = {} as any;

let lastFileTime = "";

export function formatDate(date: Date) {
  return moment(date).format("YYYY:MM:DD HH:mm:ss");
}

async function download(
  img: string,
  meta: Record<"description" | "date", string>,
  mainIndex: number,
  fileIndex: number
) {
  const url = new URL(img);

  const fileName = url.pathname.split("/").pop();
  const fullFile = mainIndex + "-" + fileIndex + "-" + fileName;
  const blob = await addExifMetadataToImage(img, fullFile, meta);
  filesToDownObj[img] = blob;
}

async function handleSignal() {
  Object.values(filesToDownObj).forEach((v) => {
    filesToDownload.push(v);
  });

  if (filesToDownload.length === 0) return;

  const textFile = new File([constantPayload.postContent], "post.txt", { type: "text/plain" });
  filesToDownload.push(textFile);
  console.log("to down: ", { filesToDownload, len: filesToDownload.length });

  await downloadFilesAsZip(filesToDownload, constantPayload.userName + "_" + lastFileTime);
  filesToDownload = [];
  filesToDownObj = {};
  return;
}

async function handleConstant(message: ConstantMessage) {
  const { time } = message.payload as ConstantPayload;
  constantPayload = message.payload;
  lastFileTime = moment(time).format("YYYY-MM-DD-HH-mm-ss");

  console.log("Received constant data from tab:", message.payload);
  return;
}

async function handleVariable(message: VariableMessage) {
  const { mainImg, alt, MainIndex, index } = message.payload as VariablePayload;
  variablePayload = message.payload;
  console.log(variablePayload);

  // Convert string to a Uint8Array (UTF-8 encoded)
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(alt);

  // Convert the Uint8Array to a binary string
  const binaryDesc = String.fromCharCode(...uint8Array);

  console.log("Received variable data from tab:", message.payload);

  download(mainImg, { description: binaryDesc, date: formatDate(new Date(constantPayload.time)) }, MainIndex, index);
  return;
}

export default function main() {
  console.log("Listener is running...");

  chrome.runtime.onMessage.addListener(async (message: Message, _sender, _sendResponse) => {
    console.log("Received message in listener from tab:", message);

    if (message.type === "FROM_TAB") {
      switch (message.payloadType) {
        case "signal":
          await handleSignal();
          break;
        case "constant":
          await handleConstant(message);
          break;
        case "variable":
          await handleVariable(message);
          break;
        default:
          break;
      }
    }
  });

  return;
}
