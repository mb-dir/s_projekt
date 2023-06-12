const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Funkcja do zliczania plików o podanych rozszerzeniach
function countFilesByExtensions(extensions, directory, startDate, endDate) {
  let files = [];

  function collectFiles(dir) {
    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        collectFiles(itemPath);
      } else {
        const fileExtension = path.extname(itemPath).toLowerCase();
        const fileCreationDate = stats.birthtime;

        if (
          extensions.includes(fileExtension) &&
          (!startDate || fileCreationDate >= startDate) &&
          (!endDate || fileCreationDate <= endDate)
        ) {
          files.push(itemPath);
        }
      }
    });
  }

  collectFiles(directory);

  return files.length;
}

// Funkcja do generowania raportu w postaci pliku tekstowego
function generateReportAsTxt(reportData) {
  let report = "File Extension\tCount\n";

  for (const extension in reportData) {
    report += `${extension}\t${reportData[extension]}\n`;
  }

  const timestamp = generateTimestamp();
  const reportPath = path.join("raports", `raport${timestamp}.txt`);
  fs.writeFileSync(reportPath, report);
}

// Funkcja do generowania raportu w postaci pliku HTML
function generateReportAsHTML(reportData) {
  let report = `
    <html>
      <head>
        <title>File Extension Report</title>
      </head>
      <body>
        <h1>File Extension Report</h1>
        <table>
          <tr>
            <th>File Extension</th>
            <th>Count</th>
          </tr>
  `;

  for (const extension in reportData) {
    report += `
      <tr>
        <td>${extension}</td>
        <td>${reportData[extension]}</td>
      </tr>
    `;
  }

  report += `
        </table>
      </body>
    </html>
  `;

  const timestamp = generateTimestamp();
  const reportPath = path.join("raports", `raport${timestamp}.html`);
  fs.writeFileSync(reportPath, report);
}

// Funkcja do generowania aktualnego znacznika czasu w formacie <data><godzina>
function generateTimestamp() {
  const date = new Date();
  const formattedDate = formatDate(date);
  const formattedTime = formatTime(date);
  return `${formattedDate}${formattedTime}`;
}

// Funkcja do formatowania daty w formacie RRRRMMDD
function formatDate(date) {
  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  return `${year}${month}${day}`;
}

// Funkcja do formatowania czasu w formacie GGMMSS
function formatTime(date) {
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());
  return `${hours}${minutes}${seconds}`;
}

// Funkcja pomocnicza do dodawania zera na początku liczby jednocyfrowej
function padZero(number) {
  return number.toString().padStart(2, "0");
}

// Funkcja która generuje folder w której będą przechowywane raporty
function createRaportsFolder() {
  const folderName = "raports";

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
    console.log(`Utworzono folder ${folderName}.`);
  }
}

// Główna funkcja programu
function generateReport(extensions, directory, startDate, endDate, format) {
  createRaportsFolder();

  const reportData = {};

  extensions.forEach(extension => {
    reportData[extension] = countFilesByExtensions(
      extension,
      directory,
      startDate,
      endDate
    );
  });

  if (format === "txt") {
    generateReportAsTxt(reportData);
  } else if (format === "html") {
    generateReportAsHTML(reportData);
  } else {
    console.log("Nieobsługiwany format raportu.");
  }
}

// Przykładowe użycie
const extensions = [ "*.txt", "*.jpg", "*.png", "*.docx", "*.pdf" ];
const directory = "C:/Users/mb/Desktop/dis/sieci/projekt/test";
const startDate = new Date("2023-01-01");
const endDate = new Date();
const format = "txt";

generateReport(extensions, directory, startDate, endDate, format);
