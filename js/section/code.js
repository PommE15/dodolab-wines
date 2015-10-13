import filesaver from "js/lib/filesaver-min";
import embedCodeHTML from "html/embedCode.html!text";

export default function(el) {
    // load html
    var embedCode;
    embedCode = document.querySelector("#embedCode");
    embedCode.innerHTML = embedCodeHTML;
    
    // svg download btn
    var svgBtn;
    svgBtn = embedCode.querySelector("#svgBtn");
    svgBtn.addEventListener("click", e => {
        
        // generate svg content for download
        // TODO: svgContent, svg with x,y,viewbox
        var svg = el.querySelector("#editChart svg");

        var XMLS = new XMLSerializer(),
            code = XMLS.serializeToString(svg); 
        //document.querySelector(".js-code").textContent = code;
        
        //try {} catch (e) {}; 
        // TODO: add fallback
        var blob = new Blob([code], {type: "image/svg+xml"});
        saveAs(blob, "chart.svg");
    });
}
