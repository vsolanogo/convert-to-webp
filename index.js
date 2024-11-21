const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

// Define the source folder and the destination folder
const sourceFolder = "./src";
const destinationFolder = "./dist";

// Ensure the destination folder exists
fs.ensureDirSync(destinationFolder);

// Supported image formats
const supportedFormats = [".png", ".jpg", ".jpeg"];

// Function to process files recursively
function processFolder(currentFolder, outputFolder) {
  fs.readdir(currentFolder, (err, files) => {
    if (err) {
      console.error("Error reading folder:", currentFolder, err);
      return;
    }

    files.forEach((file) => {
      const inputPath = path.join(currentFolder, file);
      const outputPath = path.join(outputFolder, file);

      fs.stat(inputPath, (err, stats) => {
        if (err) {
          console.error("Error checking file:", inputPath, err);
          return;
        }

        if (stats.isDirectory()) {
          // If it's a directory, process it recursively
          processFolder(inputPath, outputPath);
        } else if (
          stats.isFile() &&
          supportedFormats.includes(path.extname(file).toLowerCase())
        ) {
          // If it's a supported image file, convert it
          const outputFileName =
            path.basename(file, path.extname(file)) + ".webp";
          const finalOutputPath = path.join(
            path.dirname(outputPath),
            outputFileName
          );

          // Ensure the output directory exists
          fs.ensureDirSync(path.dirname(finalOutputPath));

          sharp(inputPath)
            .toFormat("webp", { quality: 80 })
            .toFile(finalOutputPath)
            .then(() => {
              console.log(`Converted: ${inputPath} -> ${finalOutputPath}`);
            })
            .catch((err) => {
              console.error(`Error converting ${inputPath}:`, err);
            });
        }
      });
    });
  });
}

// Start processing from the root source folder
processFolder(sourceFolder, destinationFolder);
