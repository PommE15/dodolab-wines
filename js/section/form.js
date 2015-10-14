/* section 1. import */
import importFormHTML from "html/importForm.html!text";
import { importJsonFromS3, importCSV } from "js/component/importForm";

export default function() {
    // add form
    var importForm, importBtn, importKey, key;
    importForm = document.querySelector("#importForm");
    importForm.innerHTML = importFormHTML;
    
    // import data 
    importForm.addEventListener("click", function(e) {
        var text, textID,
            btnID = e.target.id;
        
        if (btnID!=="inputKey"&&btnID!=="inputCSV") { return; }
        
        textID = "#" + btnID + "Text";
        text = importForm.querySelector(textID).value;
        
        switch (btnID) {
            case "inputKey": importJsonFromS3(text); break;
            case "inputCSV": importCSV(text); break;
        }
       
        // section control 
        document.querySelector("section").style.height = "auto";
        document.querySelector(".sec-table > div").classList.remove("d-n");
        document.querySelector(".sec-chart > div").classList.add("d-n");
        document.querySelector(".sec-panel > div").classList.add("d-n");
        document.querySelector(".sec-code > div").classList.add("d-n");
    }, false);
}
