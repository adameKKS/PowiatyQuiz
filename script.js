function checkPopulation()
{
    const api2=`https://pl.wikipedia.org/w/api.php?action=parse&page=Lista_powiat%C3%B3w_w_Polsce&format=json&origin=*`;
    fetch(api2)
        .then(res=>res.json())
        .then(data => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(data.parse.text["*"],"text/html");
            let trElems = doc.getElementsByTagName("tr");
            console.log(trElems);
            const j = Math.floor(Math.random() * 380) + 1;
            console.log(j);

            document.getElementById("powiat").innerHTML=trElems[j].cells[0].innerText;
            document.getElementById("miasto_powiatowe").innerHTML=trElems[j].cells[1].innerText;
            document.getElementById("rejestracja").innerHTML=trElems[j].cells[2].innerText;
            document.getElementById("wojewodztwo").innerHTML=trElems[j].cells[3].innerText;
            
            var cityAsked = trElems[j].cells[1].innerText;
            if(cityAsked=="miasto na prawach powiatu\n")
            {
                cityAsked=trElems[j].cells[0].innerText;
                console.log("witam");
            }

            return fetch(`https://pl.wikipedia.org//w/api.php?action=query&format=json&titles=${cityAsked}&origin=*&prop=revisions&rvprop=content`);
        })
            .then(res => res.json())
            .then(data => {
                let nextDir;
                console.log("tutaj jestem ");
                for(let i in data.query.pages)
                {
                    nextDir=data.query.pages[i];
                    break;
                }
                let JSONdir;
                JSONdir=nextDir.revisions[0]["*"];
            
                const regex = /\|liczba ludności\s+=\s+([\d\s,&nbsp;]+)/;
                const match = JSONdir.match(regex);
                const population = match ? parseInt(match[1].replace(/\s|,|&nbsp;/g, "")) : null;
                console.log(population);
                document.getElementById("response").innerHTML=population;

                
                return fetch('powiaty-medium.geojson')
        })
                .then(res => res.json())
                .then(data => {
                    // 
                    var map = L.map('map').setView([51.919, 19.1451], 5);
                    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            maxZoom: 19,
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            }).addTo(map);
                    L.geoJSON(data).addTo(map);
                    //
                    
        })
        .catch(error => console.log(error));
}