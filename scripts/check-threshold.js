const fs = require('fs');

const report = JSON.parse(
    fs.readFileSync(
        'test-results/results.json',
        'utf8'
    )
);

let passed = 0;
let failed = 0;

function countTests(suite) {

    if (suite.specs) {

        suite.specs.forEach(spec => {

            spec.tests.forEach(test => {

                const status = test.results[0]?.status;

                if (status === "passed")
                    passed++;

                else
                    failed++;

            });

        });

    }

    if (suite.suites) {

        suite.suites.forEach(countTests);

    }

}

report.suites.forEach(countTests);

const total = passed + failed;

const percentage = (passed / total) * 100;

console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Percentage: ${percentage}`);

if (percentage < 90) {

    console.error("Threshold Failed");

    process.exit(1);

}

console.log("Threshold Passed");