import fs from "fs/promises";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, "models", "users.js");

export const writeDataToFile = async (data) => {
  try {
    const dataDir = path.dirname(dataFilePath);
    await fs.mkdir(dataDir, { recursive: true });

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8");
    console.log("Data successfully written to file");
  } catch (error) {
    console.error("Error writing data to file:", error);
    throw new Error("Failed to write data to file");
  }
};
