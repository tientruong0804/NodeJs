const mongoose = require('mongoose');

exports.ManUser = mongoose.model('ManUser', {
    createdAt: { type: Date, expires: 30 * 24 * 3600, default: Date.now },
    name: { type: String, index: true },
    pwd: String
});

exports.User = mongoose.model('User', {
	date: { type: Date, index: true, expires: 2 * 30 * 24 * 3600, default: Date.now },
	ip: String,
	city: String,
	country: String,
    install: Number,
    pkgname: String,
    did: String
});


exports.LogInstall = mongoose.model('LogInstall', {
    date: { type: Date, index: true, expires: 2 * 30 * 24 * 3600, default: Date.now },
    ip: String,
    city: String,
    country: String,

    filename: String,
    filenameraw: String,
    bytesSend: String,
    status: String,
    agent: String,
    ref: String,
    param: String
});

exports.UserPostInfo = mongoose.model('UserPostInfo', {
    date: { type: Date, index: true, expires: 2 * 30 * 24 * 3600, default: Date.now },
    ip: String,
    city: String,
    country: String,
    type: Number,
    agent: String,
    status: Number,
    arrPkg: Array,
    did: String,

    aid: String,
    pkgname: String,
    version: String,
    wifimac: String,
    simcarrier: String,
    devicename: String,
    battery_percent: String,
    battery_tech: String,
    screen: String,
    cpu: String,
    osversion: String,
    language: String,
    network: String
});



exports.UserPostAppTrack = mongoose.model('UserPostAppTrack', {
    date: { type: Date, index: true, expires: 2 * 30 * 24 * 3600, default: Date.now },
    ip: String,
    city: String,
    country: String,
    type: Number,
    pkgname: String,
    agent: String,
    aid: String,
    did: String
});
