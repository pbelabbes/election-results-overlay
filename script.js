const url =
  "https://www.resultats-elections.interieur.gouv.fr/presidentielle-2022/FE.html";

let timer;
function fetchPage() {
  fetch(url)
    .then((response) => {
      return response.arrayBuffer();
    })
    .then((buffer) => {
      console.log("update");
      const decoder = new TextDecoder("iso-8859-15");
      const data = decoder.decode(buffer);
      processFetchedData(data);
      clearInterval(timer);
      timer = setInterval(fetchPage, 5000);
    });
}
fetchPage();

function processFetchedData(resultPage) {
  const doc = new DOMParser().parseFromString(resultPage, "text/html");
  const classResult = "tableau-resultats-listes-ER";

  const table = doc.querySelector(`.${classResult}`);

  const results = parseTable(table);
  displayResults(results);
}

function parseTable(tableDOM) {
  const rowsDOM = tableDOM.querySelector("tbody").children;
  const rows = collectionToArray(rowsDOM);
  const results = rows.map((row) => {
    const [name, voices, registered, cast] = collectionToArray(
      row.children
    ).map((cell) => {
      const content = cell.innerHTML;
      return parseNumber(content) || content;
    });

    return {
      name,
      voices,
      registered,
      cast,
    };
  });

  return results;
}

function parseNumber(content) {
  return parseFloat(content.replaceAll(" ", "").replaceAll(",", "."));
}

function collectionToArray(collection) {
  return [].slice.call(collection);
}

function displayResults(results) {
  const ul = document.createElement("ul");
  document.getElementById("resultats").innerHTML = "";
  document.getElementById("resultats").appendChild(ul);

  results.forEach((result) => {
    const li = document.createElement("li");
    li.innerHTML = `${result.name} : ${result.cast}%`;

    ul.appendChild(li);
  });
}
