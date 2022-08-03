const fs = require("fs");
const filePath = "./package.json";
const packageJson = JSON.parse(fs.readFileSync(filePath).toString());
const nextBuildId = require("next-build-id")

const publicDirectory = './public';
const metaFileName = "./public/meta.json";

const start = async function () {
    console.log("--------------------------------------------");
    console.log("🏗️ Creating meta.json file with build hash");
    console.log("--------------------------------------------");

    const hash = await nextBuildId({dir: __dirname});

    console.log(`Build hash (last commit hash): ${hash}`);

    console.log(`\tWriting last build hash to package.json`);
    packageJson.buildHash = hash;
    fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2));

    console.log(`\tWriting last build hash to ${metaFileName}`);

    if (!fs.existsSync(publicDirectory)) {
        fs.mkdirSync(publicDirectory);
    }

    return fs.writeFile(metaFileName, JSON.stringify({buildHash: hash}), "utf8", err => {});
};

start().then(r => {
    console.log("Done\n")
});

