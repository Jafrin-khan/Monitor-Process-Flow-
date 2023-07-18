let newURL = "";

function handleComboBox(selectedValue) {
  const endpoint = getDomainName(selectedValue);
  if (endpoint) {
    newURL = endpoint;
    console.log(newURL);
    return newURL;
  }
  return newURL;
}

function createComboBox() {
  const div = document.createElement("div");
  div.textContent = "System";

  const comboBox = document.createElement("ComboBox");
  comboBox.style.backgroundColor = "ButtonFace";

  const comboBoxItem1 = document.createElement("ComboBoxItem");
  comboBoxItem1.textContent = "System 1";
  comboBoxItem1.addEventListener("click", () => handleComboBox("System 1"));
  comboBox.appendChild(comboBoxItem1);

  const comboBoxItem2 = document.createElement("ComboBoxItem");
  comboBoxItem2.textContent = "System 2";
  comboBoxItem2.addEventListener("click", () => handleComboBox("System 2"));
  comboBox.appendChild(comboBoxItem2);

  const comboBoxItem3 = document.createElement("ComboBoxItem");
  comboBoxItem3.textContent = "System 3";
  comboBoxItem3.addEventListener("click", () => handleComboBox("System 3"));
  comboBox.appendChild(comboBoxItem3);

  div.appendChild(comboBox);

  return div;
}

module.exports = {
  createComboBox,
  newURL,
};
