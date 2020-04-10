import express from "express";
import subdomain from "express-subdomain";
import path from "path";
import { readdirSync } from "fs";

const port = process.env.PORT || 8080;

const getDirectories = (source: string): string[] =>
    readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

const useSubdomain = (app: express.Express, root: string, sub: string) => {
    if (sub === "www") {
        app.use(express.static(path.join(root, sub)));
    }
    app.use(subdomain(sub, express.static(path.join(root, sub))));
    console.log("    " + sub);
};


const app = express();

const root = path.join(__dirname, "host");
console.log("Found sub domains");
getDirectories(root).map(sub => useSubdomain(app, root, sub));

app.use((_req, res) => {
    res
        .status(404)
        .send("Not found");
});

app.listen(port, () => console.log(`App listening on port ${port}`));
