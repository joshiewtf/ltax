#!/usr/bin/env node

const fs = require("fs");


const axios = require("axios");



// lmao.tax API cli

const ipInfo = async (ip, apiKey, options) => {
    if (apiKey == "") {
        console.log("Please set your API key with ltax apikey set [key]");
        return;
    }
    const axiosoptions = {
      headers: {
        "User-Agent": "lmao-tax:https://lmao.tax",
        "x-api-key": apiKey,
      },
    };
    try {
        // if there are options, add them to the request
        if (options) {
            if (options != "isp" || options != "asn" || options != "location" || options != "time") {
                console.log("Invalid option. Please use avatar, username, flags, discriminator, or tag");
                return;
            }
            const response = await axios.get(`https://lmao.tax/ip/${ip}/${options}`, axiosoptions);
            const data = response.data.data;
            if (options == "isp") {
                console.log(`IP: ${ip}, ISP: ${data}`);
            } else if (options == "asn") {
                console.log(`IP: ${ip}, ASN: ${data}`);
            } else if (options == "location") {
                console.log(`IP: ${ip}, \n  Country & Code: ${data.country_name}, ${data.country_code}, \n  Region & Code: ${data.region_name}, ${data.region_code}, \n  City: ${data.city}, \n  Postal Code: ${data.postal_code}, \n  Latitude & Longitude: ${data.latitude}, ${data.longitude} \n Metro Code: ${data.metro_code} `);
            } else if (options == "time") {
                console.log(`IP: ${ip}, Timezone: ${data.timezone} Date&Time: ${data.datetime}`);
            }
            else {
                console.log("Invalid option. Please use isp, asn, location, or time");
            }
            
        }
        else {
            const response = await axios.get(`https://lmao.tax/ip/${ip}`, axiosoptions);
            const data = response.data.data;
            //console.log(data);

            console.log(`IP: ${ip}, \n ISP: ${data.isp}, \n ASN: ${data.asn}, \n Country & Code: ${data.country_name}, ${data.country_code}, \n  Region & Code: ${data.region_name}, ${data.region_code}, \n  City: ${data.city}, \n  Postal Code: ${data.postal_code}, \n  Latitude & Longitude: ${data.latitude}, ${data.longitude} \n Metro Code: ${data.metro_code}`)
        }
    }
    catch (err) {
        if (err.response.status == 500) {
            console.error("Error occured, please try again.");
        }
        else {
            console.log(err);

        }
        //console.log(err);
    }
};

const discordInfo = async (id, apiKey, options) => {
    if (apiKey == "") {
        console.log("Please set your API key with ltax apikey set [key]");
        return;
    }

    if (options != "avatar" || options != "username" || options != "flags" || options != "discriminator" || options != "tag") {
        console.log("Invalid option. Please use avatar, username, flags, discriminator, or tag");
        return;
    }
    const axiosoptions = {
      headers: {
        "User-Agent": "lmao-tax:https://lmao.tax",
        "x-api-key": apiKey,
      },
    };
    try {
        // if there are options, add them to the request
        if (options) {
            const response = await axios.get(`https://lmao.tax/discord/user/${id}/${options}`, axiosoptions);
            const data = response.data.data;
            if (options == "avatar") {
                console.log(`ID: ${id}, Avatar: ${data}`);
            } else if (options == "username") {
                console.log(`ID: ${id}, Username: ${data}`);
            } else if (options == "flags") {
                console.log(`ID: ${id}, Public Flags: ${data}`);
            } else if (options == "discriminator") {
                console.log(`ID: ${id}, Discriminator: ${data}`);
            } else if (options == "tag") {
                console.log(`ID: ${id}, Tag: ${data}`);
            }
            else {
                console.log("Invalid option. Please use avatar, username, flags, discriminator, or tag");
            }
        }
        else {
            const response = await axios.get(`https://lmao.tax/discord/user/${id}`, axiosoptions);
            const data = response.data.data;
            console.log(data);

            console.log(`ID: ${id}, \n Username: ${data.username}, \n Discriminator: ${data.discriminator}, \n Avatar: ${data.avatarURL}, \n Flags: ${data.flags}, \n Tag: ${data.tag}`)
        }
    }
    catch (err) {
        console.log(err);
    }
}



const args = process.argv
const command = args[2];
const arg1 = args[3];
const arg2 = args[4];



// write the api key to a file which will be ~/.ltax/settings.json
// make the dir first, unless it already exists
var homedir = process.platform === "win32" ? process.env.HOMEPATH : process.env.HOME;

if (!fs.existsSync(`${homedir}/.ltax`)) {
    fs.mkdirSync(`${homedir}/.ltax`);
}

// check if settings.json exists

if (!fs.existsSync(`${homedir}/.ltax/settings.json`)) {
    fs.writeFileSync(`${homedir}/.ltax/settings.json`, ``);
}

var key = JSON.parse(fs.readFileSync(`${homedir}/.ltax/settings.json`, "utf8")).key;


if (command == "ip") {
    ipInfo(arg1, key, arg2);
} else if (command == "discord") {
    discordInfo(arg1, key, arg2);
} else if (command == "apikey") {
    if (arg1 == "set") {
        fs.writeFileSync(`${homedir}/.ltax/settings.json`, `{"key": "${arg2}"}`);
    }
} else if (command == "options") {
    console.log(` IP Options: isp, asn, location, time \n Discord Options: avatar, username, flags, discriminator, tag \n API Key Options: set`);

}
else {
    console.log("ltax: [ip|discord|apikey|options] [ip|discord id|set] [options|apikey]");
}

