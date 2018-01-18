const semver = require('semver');
const { join } = require('path');
const { writeFileSync } = require('fs');
const pkg = require('../package.json');

const increment = process.argv[2];
pkg.version = semver.inc(pkg.version, increment);
writeFileSync(join(__dirname, '..', 'package.json'), JSON.stringify(pkg, null, 2));
