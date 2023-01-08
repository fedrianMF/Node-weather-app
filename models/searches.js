import fs from 'fs';

import * as dotenv from 'dotenv'
import axios from 'axios';
dotenv.config()


class Searches {
    history = [];
    dbPath = './db/database.json';

    constructor() {
        this.readDB()
    }
    get historyCapitalize() {
        return this.history.map(place => {
            let words = place.split(' ');
            words = words.map(word => word[0].toUpperCase() + word.substring(1))
            return words.join(' ');
        });
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'en'
        }
    }

    get paramsWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'en'
        }
    }

    async city(place = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramsMapbox
            });

            const answer = await instance.get();
            return answer.data.features.map(place => ({
                id: place.id,
                name: place.place_name,
                lng: place.center[0],
                lat: place.center[1],
            }));
        } catch (error) {
            throw error;
        }

    }

    async localClimate(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon }
            });

            const answer = await instance.get();
            const { weather, main } = answer.data;
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            throw error;
        }
    }

    addHistory(place = '') {
        if (this.history.includes(place.toLowerCase())) {
            return;
        }
        this.history = this.history.splice(0, 5);
        this.history.unshift(place.toLowerCase());
        this.saveDB();
    }

    saveDB() {
        const payload = {
            history: this.history
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    readDB() {
        if (!fs.existsSync(this.dbPath)) return;
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse(info)
        this.history = data.history
    }
}

export { Searches };