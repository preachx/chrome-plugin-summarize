var summarizeButton = document.querySelector('#summarize-button');
let activeTabUrl;
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  activeTabUrl = tabs[0].url;
});
summarizeButton.addEventListener('click', getSummary);
let loading = false,
  loaded = false;

function getSummary() {
  if (loading || loaded) return;
  loading = true;
  // const bkg = chrome.extension.getBackgroundPage();
  const url = `http://api.meaningcloud.com/summarization-1.0?key=cb1b2e1d0b9326b161dca86de3d15e87&sentences=10&url=${activeTabUrl}`;
  fetch(url, {
    method: 'POST',
  })
    .then((response) => response.json())
    .then((data) => {
      const summary = data.summary;
      appendTitle();
      summary.split('[...]').map((line) => {
        createLine(line);
      });
      loaded = true;
      loading = false;
    })
    .catch((err) => {
      loading = false;
      message(err);
    });
  // const summary =
  //   'Key changes and features of Manifest V3. Manifest V3 (MV3) is a major step forward in steering towards our vision for the extensions platform. MV3 focuses on the three pillars of that vision: privacy, security, and performance, while preserving and improving our foundation of capability and webbiness. This article summarizes the features and major changes introduced by MV3. For help migrating Manifest V2 extensions to MV3, or to better understand the architectural impact of these changes, see also the MV3 migration guide. Manifest V3 is available beginning with Chrome 88, and the Chrome Web Store begins accepting MV3 extensions in January 2021. New features and changes will continue to be added to MV3, just as they have been in earlier manifest versions. There are a number of new features and functional changes for extensions using MV3: Each of these changes is summarized in the sections below. [...] The blocking version of the webRequest API is restricted to force-installed extensions in MV3. [...] There are a number of other changes introduced in MV3: The following features will be added to MV3 soon: Look for announcements of these and other MV3 features as they become available.';
}

function appendTitle() {
  const header = document.createElement('h1');
  header.innerHTML = 'Summary';
  var section = document.querySelector('#summary-section');
  section.appendChild(header);
}

function createLine(line) {
  var new_div = document.createElement('div');
  new_div.className = 'summary-line';
  new_div.innerHTML = line;
  var section = document.querySelector('#summary-section');
  section.appendChild(new_div);
}

function message(msg) {
  var message = document.querySelector('.message');
  message.innerText = msg;
}
