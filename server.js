const express = require("express");
const path = require("path");
const cache = require("express-cache-ctrl");
const app = express();
const PORT = 3000;
const publicDir = path.join(__dirname, "public");
app.use("/static", express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
    res.set("Cache-Control", "no-store");
    res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/no-cache.html", cache.disable(), (req, res) => {
    res.sendFile(path.join(publicDir, "no-cache.html"));
});

app.get("/fixed-date.html", (req, res) => {
    const expirationDate = new Date("2026-12-31T23:59:59Z");
    const remainingSeconds = Math.max(
        0,
        Math.floor((expirationDate.getTime() - Date.now()) / 1000)
    );
    if (remainingSeconds === 0) {
        res.set("Cache-Control", "no-store");
    } else {
        res.set(
            "Cache-Control",
            `public, max-age=${remainingSeconds}, must-revalidate`
        );
        res.set("Expires", expirationDate.toUTCString());
    }
    res.sendFile(path.join(publicDir, "fixed-date.html"));
});

app.get("/month-cache.html", cache.public("30d"), (req, res) => {
    res.sendFile(path.join(publicDir, "month-cache.html"));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
