import { inquirerMenu, listPlaces, pause, readInput } from "./helpers/inquirer.js"
import { Searches } from "./models/searches.js";
import colors from 'colors';


const main = async () => {
    const searches = new Searches();
    let opt;

    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                const place = await readInput('City: ');
                const places = await searches.city(place);
                const id = await listPlaces(places);

                if (id === '0') continue;

                const placeSelected = places.find(place => place.id === id);
                searches.addHistory(placeSelected.name);
                const weather = await searches.localClimate(placeSelected.lat, placeSelected.lng);

                console.clear();
                console.log(colors.green('\nCity information\n'));
                console.log('City:', placeSelected.name);
                console.log('Lat:', placeSelected.lat);
                console.log('Lng:', placeSelected.lng);
                console.log('Temperature:', weather.temp);
                console.log('Minimum:', weather.max);
                console.log('Maximum:', weather.min);
                console.log('The weather:', colors.green(weather.desc));
                break;

            case 2:
                searches.historyCapitalize.forEach((place, i) => {
                    console.log(`${colors.green(i + 1)}. ${place}`)
                })
                break;

            default:
                break;
        }
        if (opt !== 0) await pause();
    } while (opt !== 0);
}


main();